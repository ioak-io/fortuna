import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface LearningEventPayload {
    quiz_id: number;
    correct: boolean;
}

export interface ProcessLearningEventRequest {
    p_team_id: string;
    p_unit_id: number;
    p_event_type: string;
    p_payload: Record<string, any>;
}

export function LearningEventService(httpFetch: HttpFetch, teamId?: string) {
    const getHeaders = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (teamId) {
            headers['x-team'] = teamId;
        }
        return headers;
    };

    const ensureTeamId = () => {
        if (!teamId) {
            throw new Error('Team ID is required but not available. Please wait for team data to load.');
        }
    };

    return {
        async processLearningEvent(request: ProcessLearningEventRequest): Promise<void> {
            ensureTeamId();

            const res = await httpFetch(
                `${env.NEXT_PUBLIC_API_URL}/data/rpc/process_learning_event`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(request),
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to process learning event: ${res.status} ${errorText}`);
            }

            // The function returns void, so no response body to parse
        },
    };
}
