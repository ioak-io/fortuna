import { ChunkData } from "../types";
import { SummarizationService } from "./SummarizationService";
import { ChunkService } from "./ChunkService";

export class QuizService {
    constructor(private db: any) { }

    /**
     * Generate quiz questions for a given set of chunks
     */
    async generate(
        chunks: ChunkData[],
        authHeaders: Record<string, string>
    ): Promise<
        {
            question: string;
            options: string[];
            answer: string;
            chunkId: number;
            fileId: number;
            unitId: number;
        }[]
    > {
        const results: any[] = [];

        for (const chunk of chunks) {
            const prompt = `
                Generate 3 multiple-choice quiz questions as **valid JSON array**.
                Each object should follow this schema:
                {
                "question": "string",
                "options": ["string option 1", "string option 2", "string option 3", "string option 4"],
                "answer": "must exactly match one of the options"
                }

                Requirements:
                - Each question must have 4 descriptive options.
                - Options must be full text answers (not just letters like A, B, C, D).
                - The "answer" field must exactly equal one of the provided options.
                - Keep questions concise and clear, relevant only to the provided content.

                Content:
                ${chunk.summary}
                `;

            const raw = await SummarizationService.generate(prompt, authHeaders);

            let quizList: { question: string; options: string[]; answer: string }[] = [];
            try {
                quizList = JSON.parse(raw);
                if (!Array.isArray(quizList)) throw new Error("Not an array");
            } catch (err) {
                console.warn("⚠️ Quiz parse failed, fallback:", raw);
                quizList = [
                    {
                        question: raw.split("\n")[0] || "Fallback question?",
                        options: ["A", "B", "C", "D"],
                        answer: "A",
                    },
                ];
            }

            for (const quiz of quizList) {
                results.push({
                    question: quiz.question,
                    options: quiz.options,
                    answer: quiz.answer,
                    chunkId: chunk.id,
                    fileId: chunk.file_id,
                    unitId: chunk.unit_id,
                });
            }
        }

        return results;
    }

    /**
     * Entry point for quiz generation per unit
     */
    async requestQuizGeneration(
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
            [teamId, unitId, "quiz"]
        );

        this.processQuizInBackground(realm, tenant, teamId, unitId, authHeaders).catch((err) => {
            console.error("❌ Quiz background job failed:", err);
        });
    }

    private async processQuizInBackground(
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
                [teamId, unitId, "quiz"]
            );

            const chunkService = new ChunkService(this.db);
            const chunks = await chunkService.getChunksByUnit(realm, tenant, teamId, unitId);

            if (!chunks.length) throw new Error("No chunks found for unit");

            const quiz = await this.generate(chunks, authHeaders);

            // Persist
            for (const q of quiz) {
                await this.db.query(
                    `INSERT INTO ${realm}_${tenant}.quiz
             (team_id, unit_id, file_id, chunk_id, question, options, answer)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (team_id, unit_id, chunk_id, question)
           DO UPDATE SET options=$6, answer=$7, updated_at=NOW()`,
                    [teamId, q.unitId, q.fileId, q.chunkId, q.question, JSON.stringify(q.options), q.answer]
                );
            }

            await this.db.query(
                `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='completed', last_computed_at=NOW(), finished_at=NOW()
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
                [teamId, unitId, "quiz"]
            );

            console.log("✅ Quiz generated for unit", unitId);
        } catch (err: any) {
            console.error("❌ Quiz background error:", err);

            await this.db.query(
                `UPDATE ${realm}_${tenant}.artifact_generation_log
         SET status='failed', finished_at=NOW(), error_message=$4
         WHERE team_id=$1 AND unit_id=$2 AND file_id IS NULL AND artifact_type=$3`,
                [teamId, unitId, "quiz", err.message || "Unknown error"]
            );
        }
    }
}
