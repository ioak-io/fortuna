import { useState, useEffect, useCallback } from 'react';
import { FlashcardProgressService, UserFlashcardProgress } from '@/lib/services/flashcardProgress';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useFlashcardProgress(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const [flashcardProgress, setFlashcardProgress] = useState<UserFlashcardProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!unitId || !currentTeam?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const flashcardProgressService = FlashcardProgressService(httpFetch, currentTeam.id);
      const progress = await flashcardProgressService.getUserFlashcardProgress(unitId);
      setFlashcardProgress(progress);
    } catch (err) {
      console.error('Error fetching flashcard progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch flashcard progress');
    } finally {
      setIsLoading(false);
    }
  }, [unitId, currentTeam?.id, httpFetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getProgressByFlashcardId = useCallback((flashcardId: number): UserFlashcardProgress | undefined => {
    return flashcardProgress.find(p => p.flashcard_id === flashcardId);
  }, [flashcardProgress]);

  const isFlashcardViewed = useCallback((flashcardId: number): boolean => {
    const progress = getProgressByFlashcardId(flashcardId);
    return progress ? progress.views > 0 : false;  // ✅ use views, not attempts
  }, [getProgressByFlashcardId]);


  const isFlashcardMastered = useCallback((flashcardId: number): boolean => {
    const progress = getProgressByFlashcardId(flashcardId);
    return progress ? progress.streak >= 3 : false; // ✅ derive mastery
  }, [getProgressByFlashcardId]);


  const getNextUnviewedFlashcardIndex = useCallback((flashcardIds: number[]): number => {
    // Find the first study guide that hasn't been viewed yet
    const firstUnviewedIndex = flashcardIds.findIndex(flashcardId => !isFlashcardViewed(flashcardId));
    // If all study guides have been viewed, return 0 (start from beginning)
    return firstUnviewedIndex !== -1 ? firstUnviewedIndex : 0;
  }, [isFlashcardViewed]);

  const getLastViewedFlashcardIndex = useCallback((flashcardIds: number[]): number => {
    // Find the last study guide that *was* viewed
    const lastViewedIndex = [...flashcardIds]
      .reverse()
      .findIndex(flashcardId => isFlashcardViewed(flashcardId));

    if (lastViewedIndex === -1) {
      // None viewed yet → start from 0
      return 0;
    }

    // Reverse index → convert back to forward index
    return flashcardIds.length - 1 - lastViewedIndex;
  }, [isFlashcardViewed]);

  const getMasteryByFlashcardId = useCallback((flashcardId: number): string => {
    const progress = getProgressByFlashcardId(flashcardId);
    if (!progress || progress.views === 0) return "unseen";
    if (progress.streak >= 3) return "mastered";
    if (progress.fail_streak >= 3) return "struggling";
    return "in_progress";
  }, [getProgressByFlashcardId]);


  return {
    flashcardProgress,
    isLoading,
    error,
    refetch,
    getProgressByFlashcardId,
    isFlashcardViewed,
    isFlashcardMastered,
    getNextUnviewedFlashcardIndex,
    getLastViewedFlashcardIndex,
    getMasteryByFlashcardId,
  };
}
