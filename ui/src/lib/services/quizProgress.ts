import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface UserQuizProgress {
  id: number;
  team_id: string;
  user_id: string;
  unit_id: number;
  quiz_id: number;
  attempts: number;
  correct_count: number;
  last_answered_at: string;
  last_outcome: boolean | null;
  status: 'unseen' | 'in_progress' | 'mastered';
}

export function QuizProgressService(httpFetch: HttpFetch, teamId?: string) {
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
    async getUserQuizProgress(unitId: string): Promise<UserQuizProgress[]> {
      ensureTeamId();
      
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/user_quiz_progress?unit_id=eq.${unitId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No progress found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch quiz progress: ${res.status} ${errorText}`);
      }

      return res.json();
    },
  };
}

