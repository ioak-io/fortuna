import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface UserStudyGuideProgress {
  id: number;
  team_id: string;
  user_id: string;
  unit_id: number;
  studyguide_id: number;
  views: number;
  streak: number;
  fail_streak: number;
  first_viewed_at: string;
  last_viewed_at: string;
  time_spent: number; // in seconds
}

export function StudyGuideProgressService(httpFetch: HttpFetch, teamId?: string) {
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
    async getUserStudyGuideProgress(unitId: string): Promise<UserStudyGuideProgress[]> {
      ensureTeamId();

      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/user_studyguide_progress?unit_id=eq.${unitId}`,
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
        throw new Error(`Failed to fetch study guide progress: ${res.status} ${errorText}`);
      }

      return res.json();
    },
  };
}
