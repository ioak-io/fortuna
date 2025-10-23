import { ChunkData, CreateChunkRequest } from "../types";
import { EmbeddingService } from "./EmbeddingService";
import { SummarizationService } from "./SummarizationService";
import { estimateTokenCount } from "../utils/tokenEstimate";

export class ChunkService {
  constructor(private db: any) {}

  async createChunks(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    fileId: number,
    chunks: string[],
    authHeaders: Record<string, string>
  ): Promise<ChunkData[]> {
    if (!chunks.length) return [];

    const createdChunks: ChunkData[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const summary = await SummarizationService.summarize(chunks[i], authHeaders);
      const embedding = await EmbeddingService.getEmbedding(summary, authHeaders);

      const chunkData: CreateChunkRequest = {
        unit_id: unitId,
        file_id: fileId,
        chunk_index: i,
        text: chunks[i],
        token_count: estimateTokenCount(chunks[i]),
        summary,
        embedding,
        metadata: { chunk_size: chunks[i].length, total_chunks: chunks.length }
      };

      const created = await this.createChunk(realm, tenant, teamId, chunkData);
      createdChunks.push(created);
    }

    return createdChunks;
  }

  async createChunk(
    realm: string,
    tenant: string,
    teamId: string,
    chunkData: CreateChunkRequest
  ): Promise<ChunkData> {
    const query = `
      INSERT INTO ${realm}_${tenant}.chunks (
        team_id, unit_id, file_id, chunk_index, text,
        token_count, summary, metadata, embedding
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`;

    const values = [
      teamId,
      chunkData.unit_id,
      chunkData.file_id,
      chunkData.chunk_index,
      chunkData.text,
      chunkData.token_count,
      chunkData.summary,
      JSON.stringify(chunkData.metadata),
      JSON.stringify(chunkData.embedding)
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  /**
   * Get all chunks for a specific unit
   */
  async getChunksByUnit(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number
  ): Promise<ChunkData[]> {
    const query = `
      SELECT * FROM ${realm}_${tenant}.chunks
      WHERE team_id = $1 AND unit_id = $2
      ORDER BY file_id, chunk_index;
    `;
    const result = await this.db.query(query, [teamId, unitId]);
    return result.rows;
  }
}
