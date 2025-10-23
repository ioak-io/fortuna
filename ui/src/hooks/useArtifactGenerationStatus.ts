import { env } from "@/lib/shared/env";
import { useHttp } from "@/lib/shared/http";
import { useTeamStore } from "@/stores/useTeamStore";
import { useEffect, useState, useCallback } from "react";

interface ArtifactPipelineLog {
    id: number;
    team_id: string;
    unit_id: string;
    stage: string;
    status: string;
    started_at: string;
    finished_at: string;
    last_updated_at: string;
    error_message: string;
}

export const useArtifactGenerationStatus = (unitId: string) => {
    const { fetch } = useHttp();
    const { currentTeam } = useTeamStore();
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchStatus = useCallback(async () => {
        if (!currentTeam?.id || !unitId) {
            return;
        }
        try {
            const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/data/artifact_pipeline_log?team_id=eq.${currentTeam.id}&unit_id=eq.${unitId}&order=last_updated_at.desc&limit=1`);
            const data: ArtifactPipelineLog[] = await response.json();

            if (data.length > 0) {
                const latestLog = data[0];
                if (latestLog.status === "in_progress") {
                    setIsGenerating(true);
                } else {
                    setIsGenerating(false);
                }
            } else {
                setIsGenerating(false);
            }
        } catch (error) {
            console.error("Failed to fetch artifact generation status:", error);
            setIsGenerating(false);
        }
    }, [currentTeam?.id, unitId, fetch]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    useEffect(() => {
        if (isGenerating) {
            const intervalId = setInterval(fetchStatus, 10000);
            return () => clearInterval(intervalId);
        }
    }, [isGenerating, fetchStatus]);

    return { isGenerating, refetch: fetchStatus };
};