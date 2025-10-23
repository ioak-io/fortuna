import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface UserUnitProgress {
  user_id: string;
  team_id: string;
  unit_id: number;
  last_accessed_at: string;
  // flashcards
  flashcards_attempted: number;
  flashcards_mastered: number;
  flashcards_in_progress: number;
  flashcards_struggling: number;
  flashcards_due_now: number;
  flashcard_views_total: number;
  flashcard_time_spent_total: number;
  // quizzes
  quiz_questions_attempted: number;
  quiz_questions_mastered: number;
  quiz_questions_in_progress: number;
  quiz_questions_struggling: number;
  quiz_attempts_total: number;
  quiz_questions_due_now: number;
  quiz_accuracy_avg: number;
  // studyguides
  studyguides_attempted: number;
  studyguides_mastered: number;
  studyguides_in_progress: number;
  studyguides_struggling: number;
  studyguide_views_total: number;
  studyguide_time_spent_total: number;
}

export interface UnitTotals {
  unit_id: number;
  total_flashcards: number;
  total_quiz_questions: number;
  total_studyguides: number;
}

export function UnitProgressService(httpFetch: HttpFetch, teamId?: string) {
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
    async getUserUnitProgress(unitId: string): Promise<UserUnitProgress | null> {
      ensureTeamId();

      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/v_user_unit_progress?unit_id=eq.${unitId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return null; // No progress found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch user unit progress: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      // Return the first item if array, or null if empty
      return data && data.length > 0 ? data[0] : null;
    },

    async getUnitTotals(unitId: string): Promise<UnitTotals | null> {
      ensureTeamId();

      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/v_unit_totals?unit_id=eq.${unitId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return null; // No totals found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch unit totals: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      // Return the first item if array, or null if empty
      return data && data.length > 0 ? data[0] : null;
    },
  };
}
