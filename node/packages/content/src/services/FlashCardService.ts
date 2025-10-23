import { ChunkData } from "../types";
import { SummarizationService } from "./SummarizationService";
import { ChunkService } from "./ChunkService";

export class FlashcardsService {
    constructor(private db: any) { }

    /**
     * Generate flashcard for a given set of chunks
     */
    async generate(
        chunks: ChunkData[],
        authHeaders: Record<string, string>
    ): Promise<{ front: string; back: string; chunkId: number; fileId: number; unitId: number }[]> {
        const results: any[] = [];

        for (const chunk of chunks) {
            const prompt = `
        Generate 3 concise flashcard as **valid JSON array** of objects.
        Each object should have { "front": "question", "back": "answer" }.
        
        Example:
        [
          { "front": "What is photosynthesis?", "back": "The process plants use to convert light energy into chemical energy." },
          { "front": "Where does photosynthesis occur?", "back": "In the chloroplasts." }
        ]

        Content:
        ${chunk.summary}
      `;

            const raw = await SummarizationService.generate(prompt, authHeaders);

            let cards: { front: string; back: string }[] = [];
            try {
                cards = JSON.parse(raw);
                if (!Array.isArray(cards)) throw new Error("Not an array");
            } catch (err) {
                console.warn("⚠️ Flashcard parse failed, fallback:", raw);
                cards = raw
                    .split(/\n/)
                    .map(l => l.trim())
                    .filter(Boolean)
                    .map(l => ({ front: l, back: "" }));
            }

            for (const card of cards) {
                results.push({
                    front: card.front,
                    back: card.back,
                    chunkId: chunk.id,
                    fileId: chunk.file_id,
                    unitId: chunk.unit_id,
                });
            }
        }

        return results;
    }

    /**
     * Entry point for flashcard generation per unit
     */
    async requestFlashcardGeneration(
        realm: string,
        tenant: string,
        teamId: string,
        unitId: number,
        authHeaders: Record<string, string>
    ): Promise<void> {
        await this.db.query(
            `
      INSERT INTO ${realm}_${tenant}.artifact_generation_log
        (team_id, unit_id, file_id, artifact_type, status)
      VALUES ($1, $2, NULL, $3, 'pending')
      ON CONFLICT (team_id, unit_id, file_id, artifact_type)
      DO UPDATE SET status='pending', started_at=NULL, finished_at=NULL, error_message=NULL
      `,
            [teamId, unitId, "flashcard"]
        );

        this.processFlashcardsInBackground(realm, tenant, teamId, unitId, authHeaders).catch(err => {
            console.error("❌ Flashcards background job failed:", err);
        });
    }

    private async processFlashcardsInBackground(
        realm: string,
        tenant: string,
        teamId: string,
        unitId: number,
        authHeaders: Record<string, string>
    ): Promise<void> {
        try {
            await this.db.query(
                `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='in_progress', started_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
                [teamId, unitId, "flashcard"]
            );

            const chunkService = new ChunkService(this.db);
            const chunks = await chunkService.getChunksByUnit(realm, tenant, teamId, unitId);

            if (!chunks.length) throw new Error("No chunks found for unit");

            const flashcard = await this.generate(chunks, authHeaders);

            // Persist
            for (const card of flashcard) {
                await this.db.query(
                    `INSERT INTO ${realm}_${tenant}.flashcard
             (team_id, unit_id, file_id, chunk_id, front, back)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (team_id, unit_id, chunk_id, front)
           DO UPDATE SET back=$6, updated_at=NOW()`,
                    [teamId, card.unitId, card.fileId, card.chunkId, card.front, card.back]
                );
            }

            await this.db.query(
                `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='completed', last_computed_at=NOW(), finished_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
                [teamId, unitId, "flashcard"]
            );

            console.log("✅ Flashcards generated for unit", unitId);
        } catch (err: any) {
            console.error("❌ Flashcards background error:", err);

            await this.db.query(
                `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='failed', finished_at=NOW(), error_message=$4
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
                [teamId, unitId, "flashcard", err.message || "Unknown error"]
            );
        }
    }
}
