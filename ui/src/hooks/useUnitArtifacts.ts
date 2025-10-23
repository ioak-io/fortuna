"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useHttp } from "@/lib/shared/http";
import { ArtifactService } from "@/lib/services/artifacts";
import { 
  ComputedArtifact, 
  ArtifactStatusSummary, 
  UseUnitArtifactsReturn, 
  ArtifactType, 
  ArtifactStatus 
} from "@/types/artifacts";
import { useTeamStore } from "@/stores/useTeamStore";

export function useUnitArtifacts(unitId: string): UseUnitArtifactsReturn {
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();
  const [artifacts, setArtifacts] = useState<ComputedArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const artifactService = useMemo(
    () => ArtifactService(httpFetch, currentTeam?.id || undefined),
    [httpFetch, currentTeam?.id]
  );

  const fetchArtifacts = useCallback(async () => {
    if (!unitId || !currentTeam?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await artifactService.getArtifactsByUnit(unitId);
      setArtifacts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch artifacts";
      setError(errorMessage);
      console.error("Error fetching artifacts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [unitId, artifactService, currentTeam?.id]);

  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);

  // Create status summary for easy access
  const statusSummary: ArtifactStatusSummary = useMemo(() => {
    const summary: ArtifactStatusSummary = {};
    
    artifacts.forEach(artifact => {
      summary[artifact.artifact_type] = {
        status: artifact.status,
        lastComputed: artifact.last_computed_at,
        errorMessage: artifact.error_message,
        isProcessing: artifact.status === "pending" || artifact.status === "in_progress"
      };
    });
    
    return summary;
  }, [artifacts]);

  // Helper functions
  const getArtifactStatus = useCallback((artifactType: ArtifactType): ArtifactStatus | null => {
    return statusSummary[artifactType]?.status || null;
  }, [statusSummary]);

  const isArtifactProcessing = useCallback((artifactType: ArtifactType): boolean => {
    return statusSummary[artifactType]?.isProcessing || false;
  }, [statusSummary]);

  const hasArtifactError = useCallback((artifactType: ArtifactType): boolean => {
    return statusSummary[artifactType]?.status === "failed";
  }, [statusSummary]);

  const generateArtifact = useCallback(async (artifactType: ArtifactType): Promise<void> => {
    if (!unitId || !currentTeam?.id) {
      throw new Error('Unit ID and Team ID are required');
    }
    
    try {
      await artifactService.generateArtifact(unitId, artifactType);
      // Refetch artifacts to get updated status
      await fetchArtifacts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate artifact";
      setError(errorMessage);
      throw err;
    }
  }, [unitId, artifactService, currentTeam?.id, fetchArtifacts]);

  return {
    artifacts,
    statusSummary,
    isLoading,
    error,
    refetch: fetchArtifacts,
    getArtifactStatus,
    isArtifactProcessing,
    hasArtifactError,
    generateArtifact,
  };
}
