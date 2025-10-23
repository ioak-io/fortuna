import { useState, useEffect } from 'react';
import { useHttp } from '@/lib/shared/http';
import { QuizService, QuizQuestion } from '@/lib/services/quiz';
import { useTeamStore } from '@/stores/useTeamStore';

export function useQuiz(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quizService = QuizService(httpFetch, currentTeam?.id || undefined);

  const fetchQuiz = async () => {
    if (!currentTeam?.id) {
      setError('Team ID not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const quizData = await quizService.getQuiz(unitId);
      setQuiz(quizData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quiz';
      setError(errorMessage);
      console.error('Error fetching quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentTeam?.id && unitId) {
      fetchQuiz();
    }
  }, [currentTeam?.id, unitId]);

  return {
    quiz,
    isLoading,
    error,
    refetch: fetchQuiz,
  };
}
