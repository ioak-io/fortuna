import { useState, useEffect, useCallback } from 'react';
import { QuestionProgressService, UserQuestionProgress } from '@/lib/services/questionProgress';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useQuestionProgress(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const [questionProgress, setQuestionProgress] = useState<UserQuestionProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!unitId || !currentTeam?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const questionProgressService = QuestionProgressService(httpFetch, currentTeam.id);
      const progress = await questionProgressService.getUserQuestionProgress(unitId);
      setQuestionProgress(progress);
    } catch (err) {
      console.error('Error fetching question progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch question progress');
    } finally {
      setIsLoading(false);
    }
  }, [unitId, currentTeam?.id, httpFetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getProgressByQuestionId = useCallback((questionId: number): UserQuestionProgress | undefined => {
    return questionProgress.find(p => p.question_id === questionId);
  }, [questionProgress]);

  const isQuestionAnswered = useCallback((questionId: number): boolean => {
    const progress = getProgressByQuestionId(questionId);
    return progress ? progress.attempts > 0 : false;
  }, [getProgressByQuestionId]);

  const getNextUnansweredQuestionIndex = useCallback((questionIds: number[]): number => {
    // Find the first question that hasn't been answered yet
    const firstUnansweredIndex = questionIds.findIndex(questionId => !isQuestionAnswered(questionId));
    // If all questions have been answered, return 0 (start from beginning)
    return firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0;
  }, [isQuestionAnswered]);

  const getMasteryByQuestionId = useCallback((questionId: number): string | undefined => {
    const progress = questionProgress.find(p => p.question_id === questionId);
    return progress?.status; // "unseen" | "in_progress" | "mastered" | "struggling"
  }, [questionProgress]);
  

  return {
    questionProgress,
    isLoading,
    error,
    refetch,
    getProgressByQuestionId,
    isQuestionAnswered,
    getNextUnansweredQuestionIndex,
    getMasteryByQuestionId,
  };
}
