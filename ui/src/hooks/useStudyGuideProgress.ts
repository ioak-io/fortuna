import { useState, useEffect, useCallback } from 'react';
import { StudyGuideProgressService, UserStudyGuideProgress } from '@/lib/services/studyGuideProgress';
import { useHttp } from '@/lib/shared/http';
import { useTeamStore } from '@/stores/useTeamStore';

export function useStudyGuideProgress(unitId: string) {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const [studyGuideProgress, setStudyGuideProgress] = useState<UserStudyGuideProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!unitId || !currentTeam?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const studyGuideProgressService = StudyGuideProgressService(httpFetch, currentTeam.id);
      const progress = await studyGuideProgressService.getUserStudyGuideProgress(unitId);
      setStudyGuideProgress(progress);
    } catch (err) {
      console.error('Error fetching study guide progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch study guide progress');
    } finally {
      setIsLoading(false);
    }
  }, [unitId, currentTeam?.id, httpFetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getProgressByStudyGuideId = useCallback(
    (studyGuideId: number): UserStudyGuideProgress | undefined => {
      return studyGuideProgress.find(p => p.studyguide_id === studyGuideId);
    },
    [studyGuideProgress]
  );

  const isStudyGuideViewed = useCallback(
    (studyGuideId: number): boolean => {
      const progress = getProgressByStudyGuideId(studyGuideId);
      return progress ? progress.views > 0 : false;
    },
    [getProgressByStudyGuideId]
  );

  const getStudyGuideStatus = useCallback(
    (studyGuideId: number): 'unseen' | 'in_progress' | 'mastered' | 'struggling' => {
      const progress = getProgressByStudyGuideId(studyGuideId);
      if (!progress || progress.views === 0) return 'unseen';
      if (progress.streak >= 3) return 'mastered';
      if (progress.fail_streak >= 3) return 'struggling';
      return 'in_progress';
    },
    [getProgressByStudyGuideId]
  );

  const getNextUnviewedStudyGuideIndex = useCallback(
    (studyGuideIds: number[]): number => {
      const firstUnviewedIndex = studyGuideIds.findIndex(id => !isStudyGuideViewed(id));
      return firstUnviewedIndex !== -1 ? firstUnviewedIndex : 0;
    },
    [isStudyGuideViewed]
  );

  const getLastViewedStudyGuideIndex = useCallback(
    (studyGuideIds: number[]): number => {
      const lastViewedIndex = [...studyGuideIds].reverse().findIndex(id => isStudyGuideViewed(id));
      if (lastViewedIndex === -1) return 0;
      return studyGuideIds.length - 1 - lastViewedIndex;
    },
    [isStudyGuideViewed]
  );

  return {
    studyGuideProgress,
    isLoading,
    error,
    refetch,
    getProgressByStudyGuideId,
    isStudyGuideViewed,
    getStudyGuideStatus, // ✅ replaces old `isStudyGuideCompleted`
    getNextUnviewedStudyGuideIndex,
    getLastViewedStudyGuideIndex,
  };
}
