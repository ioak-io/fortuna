import { useState, useEffect } from 'react';
import { QuestionService, DueQuestionQuestion } from '@/lib/services/question';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useDueQuestion(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();
  const questionService = QuestionService(httpFetch, currentTeam?.id || undefined);

  const [questions, setQuestions] = useState<DueQuestionQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const questionData = await questionService.getDueQuestionQuestions(unitId);
      setQuestions(questionData);
    } catch (err) {
      console.error('Error fetching due question questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch due question questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (unitId && currentTeam?.id) {
      refetch();
    }
  }, [unitId, currentTeam?.id]);

  return {
    questions,
    isLoading,
    error,
    refetch,
  };
}
