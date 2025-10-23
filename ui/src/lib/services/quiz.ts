import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface QuizQuestion {
  id: number;
  team_id: string;
  unit_id: number;
  file_id?: number;
  chunk_id: number;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  created_at: string;
  updated_at: string;
}

export interface DueQuizQuestion {
  quiz_id: number;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  mastery_level: string;
  streak: number;
  fail_streak: number;
  next_due_at: string;
}

export interface QuizResponse {
  quiz: QuizQuestion[];
}

export function QuizService(httpFetch: HttpFetch, teamId?: string) {
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
    async generateQuiz(unitId: string): Promise<void> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/quiz`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate quiz: ${res.status} ${errorText}`);
      }
    },

    async getQuiz(unitId: string): Promise<QuizQuestion[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/quiz?unit_id=eq.${unitId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No quiz found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch quiz: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async getDueQuizQuestions(unitId: string, limit: number = 100): Promise<DueQuizQuestion[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/rpc/get_due_quiz_questions?p_unit_id=${unitId}&p_limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No due quiz questions found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch due quiz questions: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async getDueQuizQuestionsByTopics(topicIds: number[], limit: number = 100): Promise<DueQuizQuestion[]> {
      ensureTeamId();
      const topicIdsParam = `{${topicIds.join(',')}}`;
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/rpc/get_due_quiz_questions?p_topic_ids=${encodeURIComponent(topicIdsParam)}&p_limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No due quiz questions found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch due quiz questions for topics: ${res.status} ${errorText}`);
      }

      return res.json();
    },
  };
}
