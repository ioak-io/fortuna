import { ChunkData, StudyGuide, StudyGuideSubtopic } from "../types";
import { greedyClusterEmbeddings } from "../utils/similarity";
import { SummarizationService } from "./SummarizationService";
import { ChunkService } from "./ChunkService";

export class StudyGuideService {
  constructor(private db: any) { }

  /**
   * Generate a study guide from chunks
   */
  async generate(
    chunks: ChunkData[],
    authHeaders: Record<string, string>,
    similarityThreshold = 0.75
  ): Promise<StudyGuide> {
    const validChunks = chunks.filter(c => c.embedding?.length);
    if (!validChunks.length) return { subtopics: [] };

    const embeddings = validChunks.map(c => c.embedding!);
    const clusters = greedyClusterEmbeddings(embeddings, similarityThreshold);

    const subtopics: StudyGuideSubtopic[] = [];
    for (const clusterId in clusters) {
      const clusterChunks = clusters[clusterId].map(idx => validChunks[idx]);
      const summaries = clusterChunks.map(c => c.summary);

      const titlePrompt = `Summarize into a short study guide title:\n- ${summaries.join("\n- ")}`;

      const bulletsPrompt = `
        Create 5 concise study guide bullets as a **valid JSON array of strings**.
        Example output:
        ["point 1", "point 2", "point 3", "point 4", "point 5"]
  
        Generate bullets for:
        - ${summaries.join("\n- ")}
      `;

      const subtopic = await SummarizationService.generate(titlePrompt, authHeaders);

      const bulletsRaw = await SummarizationService.generate(bulletsPrompt, authHeaders);

      let bullets: string[] = [];
      try {
        bullets = JSON.parse(bulletsRaw);
        if (!Array.isArray(bullets)) {
          throw new Error("Bullets not an array");
        }
      } catch (err) {
        console.warn("⚠️ Failed to parse JSON bullets, falling back to raw text:", bulletsRaw);
        // fallback: split into lines if model didn’t follow JSON
        bullets = bulletsRaw
          .split(/\n/)
          .map(b => b.replace(/^-/, "").trim())
          .filter(Boolean);
      }

      subtopics.push({ subtopic, bullets });
    }

    return { subtopics };
  }

  /**
   * Entry point to request a study guide generation for a unit
   * Inserts artifact record and runs background processing
   */
  async requestStudyGuideGeneration(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    authHeaders: Record<string, string>,
    similarityThreshold = 0.75
  ): Promise<void> {
    // 1️⃣ Insert/update artifact row
    await this.db.query(
      `
      INSERT INTO ${realm}_${tenant}.artifact_generation_log
        (team_id, unit_id, file_id, artifact_type, status)
      VALUES ($1, $2, NULL, $3, 'pending')
      ON CONFLICT (team_id, unit_id, file_id, artifact_type)
      DO UPDATE SET status='pending', started_at=NULL, finished_at=NULL, error_message=NULL
      `,
      [teamId, unitId, "studyguide"]
    );

    // 2️⃣ Fire-and-forget background job
    this.processStudyGuideInBackground(
      realm,
      tenant,
      teamId,
      unitId,
      authHeaders,
      similarityThreshold
    ).catch(err => {
      console.error("❌ Study guide background job failed:", err);
    });
  }

  /**
   * Background processor: generates study guide, persists it, and updates artifact status
   */
  private async processStudyGuideInBackground(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    authHeaders: Record<string, string>,
    similarityThreshold: number
  ): Promise<void> {
    try {
      // Mark artifact as in progress
      await this.db.query(
        `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='in_progress', started_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
        [teamId, unitId, "studyguide"]
      );

      const chunkService = new ChunkService(this.db);
      const chunks = await chunkService.getChunksByUnit(realm, tenant, teamId, unitId);

      if (!chunks.length) {
        throw new Error("No chunks found for unit");
      }

      const studyGuide = await this.generate(chunks, authHeaders, similarityThreshold);

      // Persist the study guide
      await this.db.query(
        `INSERT INTO ${realm}_${tenant}.studyguide (team_id, unit_id, content)
         VALUES ($1, $2, $3)
         ON CONFLICT (team_id, unit_id)
         DO UPDATE SET content=$3, updated_at=NOW()`,
        [teamId, unitId, JSON.stringify(studyGuide)]
      );

      // Mark artifact as completed
      await this.db.query(
        `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='completed', last_computed_at=NOW(), finished_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
        [teamId, unitId, "studyguide"]
      );

      console.log("✅ Study guide generated for unit", unitId);
    } catch (err: any) {
      console.error("❌ Study guide background error:", err);

      await this.db.query(
        `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='failed', finished_at=NOW(), error_message=$4
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
        [teamId, unitId, "studyguide", err.message || "Unknown error"]
      );
    }
  }
}
