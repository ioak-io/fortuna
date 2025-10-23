import { OcrService } from "./OcrService";
import { chunkText } from "../utils/chunkText";
import { EmbeddingService } from "./EmbeddingService";
import { SummarizationService } from "./SummarizationService";
import { StudyGuideService } from "./StudyGuideService";
import { ChunkData, CreateFileRequest, FileResponse, StudyGuide } from "../types";

export class FileService {
  constructor(private db: any) { }

  async createFile(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    fileData: CreateFileRequest
  ): Promise<FileResponse> {
    const query = `
      INSERT INTO ${realm}_${tenant}.files (
        team_id, unit_id, original_filename, storage_key, mime_type, 
        size_bytes, checksum, metadata, uploaded_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;

    const values = [
      teamId,
      unitId,
      fileData.original_filename,
      fileData.storage_key,
      fileData.mime_type,
      fileData.size_bytes || 0,
      fileData.checksum,
      JSON.stringify(fileData.metadata || {}),
      fileData.uploaded_by,
    ];

    const result = await this.db.query(query, values);
    return this.mapToFileResponse(result.rows[0]);
  }

  async getFilesByUnit(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number
  ): Promise<FileResponse[]> {
    const query = `
      SELECT * FROM ${realm}_${tenant}.files
      WHERE team_id = $1 AND unit_id = $2
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [teamId, unitId]);
    return result.rows.map((row: any) => this.mapToFileResponse(row));
  }

  async getFileById(
    realm: string,
    tenant: string,
    teamId: string,
    fileId: number
  ): Promise<FileResponse | null> {
    const query = `
      SELECT * FROM ${realm}_${tenant}.files
      WHERE team_id = $1 AND id = $2;
    `;
    const result = await this.db.query(query, [teamId, fileId]);
    return result.rows.length > 0 ? this.mapToFileResponse(result.rows[0]) : null;
  }

  async deleteFile(
    realm: string,
    tenant: string,
    teamId: string,
    fileId: number
  ): Promise<boolean> {
    const query = `
      DELETE FROM ${realm}_${tenant}.files
      WHERE team_id = $1 AND id = $2;
    `;
    const result = await this.db.query(query, [teamId, fileId]);
    return result.rowCount > 0;
  }

  async createFileWithBackgroundProcessing(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    fileData: CreateFileRequest,
    fileBuffer: Buffer,
    chunkSize: number = 1000,
    chunkOverlap: number = 250,
    authHeaders?: { authorization?: string; "x-tenant"?: string },
    mimeType?: string
  ): Promise<FileResponse> {
    // 1. Insert the file record
    const fileResponse = await this.createFile(
      realm,
      tenant,
      teamId,
      unitId,
      fileData
    );

    // 2. Insert into artifact_generation_log table with status "pending"
    await this.db.query(
      `
      INSERT INTO ${realm}_${tenant}.artifact_generation_log
        (team_id, unit_id, file_id, artifact_type, status)
      VALUES ($1,$2,$3,$4,'pending')
      ON CONFLICT (team_id, unit_id, file_id, artifact_type)
      DO UPDATE SET status='pending', started_at=NULL, finished_at=NULL, error_message=NULL
      `,
      [teamId, unitId, fileResponse.id, "file_chunks"]
    );

    // 3. Kick off background job (fire-and-forget)
    this.processFileInBackground(
      realm,
      tenant,
      teamId,
      unitId,
      fileResponse.id,
      fileBuffer,
      chunkSize,
      chunkOverlap,
      authHeaders,
      mimeType
    ).catch(err =>
      console.error("❌ Background processing failed for file:", err)
    );

    return fileResponse;
  }

  /**
   * Actual background job for OCR → Chunk → Embedding → Summary → DB insert
   */
  private async processFileInBackground(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    fileId: number,
    fileBuffer: Buffer,
    chunkSize: number,
    chunkOverlap: number,
    authHeaders?: { authorization?: string; "x-tenant"?: string },
    mimeType?: string
  ): Promise<void> {
    try {
      await this.db.query(
        `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='in_progress', started_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id=$3 AND artifact_type=$4`,
        [teamId, unitId, fileId, "file_chunks"]
      );

      // OCR
      const extractedText = await OcrService.extractText(
        fileBuffer,
        mimeType,
        authHeaders
      );

      // Chunk
      const chunks = chunkText(extractedText, chunkSize, chunkOverlap);

      // Process chunks
      for (let i = 0; i < chunks.length; i++) {
        const text = chunks[i];
        const [embedding, summary] = await Promise.all([
          EmbeddingService.getEmbedding(text, authHeaders || {}),
          SummarizationService.summarize(text, authHeaders || {}),
        ]);

        const query = `
          INSERT INTO ${realm}_${tenant}.chunks (
            team_id, unit_id, file_id, chunk_index, text, 
            token_count, summary, metadata, embedding
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        `;

        const values = [
          teamId,
          unitId,
          fileId,
          i,
          text,
          Math.ceil(text.length / 4),
          summary,
          JSON.stringify({ chunk_size: text.length, total_chunks: chunks.length }),
          JSON.stringify(embedding)
        ];

        await this.db.query(query, values);
      }

      // Optional: you may kick off downstream jobs here (quiz, flashcard, etc.)
      // await StudyGuideService.generate(chunks, authHeaders || {});
      await this.db.query(
        `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='completed', started_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id=$3 AND artifact_type=$4`,
        [teamId, unitId, fileId, "file_chunks"]
      );

      console.log("✅ Background processing completed successfully");
    } catch (err: any) {
      console.error("❌ Background processing error:", err);

      await this.db.query(
        `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='failed', started_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id=$3 AND artifact_type=$4`,
        [teamId, unitId, fileId, "file_chunks"]
      );
    }
  }

  private mapToFileResponse(row: any): FileResponse {
    return {
      id: row.id,
      team_id: row.team_id,
      unit_id: row.unit_id,
      original_filename: row.original_filename,
      storage_key: row.storage_key,
      mime_type: row.mime_type,
      size_bytes: row.size_bytes,
      checksum: row.checksum,
      metadata: row.metadata,
      uploaded_at: row.uploaded_at,
      uploaded_by: row.uploaded_by,
      created_at: row.created_at,
    };
  }
}
