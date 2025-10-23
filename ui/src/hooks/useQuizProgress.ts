import { useState, useEffect, useCallback } from 'react';
import { QuizProgressService, UserQuizProgress } from '@/lib/services/quizProgress';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useQuizProgress(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const [quizProgress, setQuizProgress] = useState<UserQuizProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!unitId || !currentTeam?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const quizProgressService = QuizProgressService(httpFetch, currentTeam.id);
      const progress = await quizProgressService.getUserQuizProgress(unitId);
      setQuizProgress(progress);
    } catch (err) {
      console.error('Error fetching quiz progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quiz progress');
    } finally {
      setIsLoading(false);
    }
  }, [unitId, currentTeam?.id, httpFetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getProgressByQuizId = useCallback((quizId: number): UserQuizProgress | undefined => {
    return quizProgress.find(p => p.quiz_id === quizId);
  }, [quizProgress]);

  const isQuizAnswered = useCallback((quizId: number): boolean => {
    const progress = getProgressByQuizId(quizId);
    return progress ? progress.attempts > 0 : false;
  }, [getProgressByQuizId]);

  const getNextUnansweredQuizIndex = useCallback((quizIds: number[]): number => {
    // Find the first quiz question that hasn't been answered yet
    const firstUnansweredIndex = quizIds.findIndex(quizId => !isQuizAnswered(quizId));
    // If all questions have been answered, return 0 (start from beginning)
    return firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0;
  }, [isQuizAnswered]);

  const getMasteryByQuizId = useCallback((quizId: number): string | undefined => {
    const progress = quizProgress.find(p => p.quiz_id === quizId);
    return progress?.status; // "unseen" | "in_progress" | "mastered" | "struggling"
  }, [quizProgress]);
  

  return {
    quizProgress,
    isLoading,
    error,
    refetch,
    getProgressByQuizId,
    isQuizAnswered,
    getNextUnansweredQuizIndex,
    getMasteryByQuizId,
  };
}

