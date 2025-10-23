"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useHttp } from "@/lib/shared/http";
import { StudyGuideService, StudyGuideRecord } from "@/lib/services/studyGuide";
import { useTeamStore } from "@/stores/useTeamStore";

export interface UseStudyGuideReturn {
  studyGuides: StudyGuideRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasStudyGuide: boolean;
}

export function useStudyGuide(unitId: string): UseStudyGuideReturn {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();
  const [studyGuides, setStudyGuides] = useState<StudyGuideRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studyGuideService = useMemo(
    () => StudyGuideService(httpFetch, currentTeam?.id || undefined),
    [httpFetch, currentTeam?.id]
  );

  const fetchStudyGuide = useCallback(async () => {
    if (!unitId || !currentTeam?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await studyGuideService.getStudyGuide(unitId);
      setStudyGuides(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch study guide";
      setError(errorMessage);
      console.error("Error fetching study guide:", err);
    } finally {
      setIsLoading(false);
    }
  }, [unitId, studyGuideService, currentTeam?.id]);

  useEffect(() => {
    fetchStudyGuide();
  }, [fetchStudyGuide]);

  const hasStudyGuide = useMemo(() => {
    return studyGuides.length > 0;
  }, [studyGuides]);

  return {
    studyGuides,
    isLoading,
    error,
    refetch: fetchStudyGuide,
    hasStudyGuide,
  };
}
