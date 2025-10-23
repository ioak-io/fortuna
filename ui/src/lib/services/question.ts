import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface QuestionQuestion {
  id: number;
  team_id: string;
  unit_id: number;
  file_id?: number;
  chunk_id: number;
  question: string;
  answer: string;
  explanation?: string;
  created_at: string;
  updated_at: string;
}

export interface DueQuestionQuestion {
  question_id: number;
  question: string;
  answer: string;
  explanation?: string;
  mastery_level: string;
  streak: number;
  fail_streak: number;
  next_due_at: string;
}

export interface EvaluateResponseRequest {
  question: string;
  correct_answer: string;
  user_answer: string;
}

export interface EvaluateResponseResponse {
  is_correct: boolean;
  explanation: string;
  confidence: number;
}

export interface QuestionResponse {
  question: QuestionQuestion[];
}

export function QuestionService(httpFetch: HttpFetch, teamId?: string) {
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
    async generateQuestion(unitId: string): Promise<void> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/question`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate question: ${res.status} ${errorText}`);
      }
    },

    async getQuestion(unitId: string): Promise<QuestionQuestion[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/question?unit_id=eq.${unitId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No question found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch question: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async getDueQuestionQuestions(unitId: string, limit: number = 100): Promise<DueQuestionQuestion[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/rpc/get_due_questions?p_unit_id=${unitId}&p_limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No due question questions found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch due question questions: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async getDueQuestionQuestionsByTopics(topicIds: number[], limit: number = 100): Promise<DueQuestionQuestion[]> {
      ensureTeamId();
      const topicIdsParam = `{${topicIds.join(',')}}`;
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/rpc/get_due_questions?p_topic_ids=${encodeURIComponent(topicIdsParam)}&p_limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No due question questions found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch due question questions for topics: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async evaluateUserResponse(request: EvaluateResponseRequest): Promise<EvaluateResponseResponse> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/fortuna/content/question/evaluate`,
        {
          method: "POST",
          headers: {
            ...getHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to evaluate user response: ${res.status} ${errorText}`);
      }

      return res.json();
    },
  };
}
