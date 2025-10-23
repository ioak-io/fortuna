import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface Flashcard {
  id: number;
  team_id: string;
  unit_id: number;
  file_id?: number;
  chunk_id: number;
  front: string;
  back: string;
  created_at: string;
  updated_at: string;
}

export interface DueFlashcard {
  flashcard_id: number;
  front: string;
  back: string;
  mastery_level: string;
  streak: number;
  fail_streak: number;
  next_due_at: string;
}

export interface FlashcardResponse {
  flashcard: Flashcard[];
}

export function FlashcardsService(httpFetch: HttpFetch, teamId?: string) {
  const getHeaders = () => {
    const headers: Record<string, string> = {};
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
    async generateFlashcards(unitId: string): Promise<void> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/flashcard`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate flashcard: ${res.status} ${errorText}`);
      }
    },

    async getFlashcards(unitId: string): Promise<Flashcard[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/flashcard?unit_id=eq.${unitId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No flashcard found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch flashcard: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async getDueFlashcards(unitId: string, limit: number = 100): Promise<DueFlashcard[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/rpc/get_due_flashcards?p_unit_id=${unitId}&p_limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No due flashcards found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch due flashcards: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async getDueFlashcardsByTopics(topicIds: number[], limit: number = 100): Promise<DueFlashcard[]> {
      ensureTeamId();
      const topicIdsParam = `{${topicIds.join(',')}}`;
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/rpc/get_due_flashcards?p_topic_ids=${encodeURIComponent(topicIdsParam)}&p_limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No due flashcards found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch due flashcards for topics: ${res.status} ${errorText}`);
      }

      return res.json();
    },
  };
}
