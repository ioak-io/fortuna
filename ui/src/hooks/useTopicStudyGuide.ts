"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useHttp } from "@/lib/shared/http";
import { StudyGuideService, StudyGuideRecord } from "@/lib/services/studyGuide";
import { useTeamStore } from "@/stores/useTeamStore";

export interface UseTopicStudyGuideReturn {
  studyGuides: StudyGuideRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasStudyGuide: boolean;
}

export function useTopicStudyGuide(topicIds: number[]): UseTopicStudyGuideReturn {
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
    if (topicIds.length === 0 || !currentTeam?.id) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await studyGuideService.getStudyGuideByTopics(topicIds);
      setStudyGuides(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch study guide";
      setError(errorMessage);
      console.error("Error fetching study guide:", err);
    } finally {
      setIsLoading(false);
    }
  }, [topicIds, studyGuideService, currentTeam?.id]);

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

