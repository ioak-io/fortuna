import { useState, useEffect } from 'react';
import { QuizService, DueQuizQuestion } from '@/lib/services/quiz';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useDueQuiz(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();
  const quizService = QuizService(httpFetch, currentTeam?.id || undefined);

  const [quiz, setQuiz] = useState<DueQuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const questions = await quizService.getDueQuizQuestions(unitId);
      setQuiz(questions);
    } catch (err) {
      console.error('Error fetching due quiz questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch due quiz questions');
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
    quiz,
    isLoading,
    error,
    refetch,
  };
}
