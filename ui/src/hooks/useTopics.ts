"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useHttp } from "@/lib/shared/http";
import { env } from "@/lib/shared/env";
import { useTeamStore } from "@/stores/useTeamStore";

export interface Topic {
  id: number;
  team_id: string;
  unit_id: number;
  name: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type UseTopicsResult = {
  topics: Topic[];
  unitIds: number[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type UseTopicsParams = {
  chapterId?: number;
  unitIds?: number[];
};

/**
 * Generalized hook to fetch topics for either a chapter or specific units
 * @param params - Either { chapterId } or { unitIds }
 */
export function useTopics(params: UseTopicsParams): UseTopicsResult {
  const { chapterId, unitIds: unitIdsParam } = params;
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const [unitIds, setUnitIds] = useState<number[]>(unitIdsParam ?? []);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (currentTeam?.id) h["x-team"] = currentTeam.id;
    return h;
  }, [currentTeam?.id]);

  const refetch = useCallback(async () => {
    if (!currentTeam?.id) return;
    if (!chapterId && (!unitIdsParam || unitIdsParam.length === 0)) {
      setTopics([]);
      setUnitIds([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1) Determine units: use unitIdsParam if present, else fetch from chapter
      let ids: number[] = Array.isArray(unitIdsParam) ? unitIdsParam.filter(Boolean) : [];
      
      if (!ids.length && chapterId) {
        const cuRes = await httpFetch(
          `${env.NEXT_PUBLIC_API_URL}/data/chapter_unit?chapter_id=eq.${chapterId}`,
          { headers }
        );
        if (!cuRes.ok) {
          const text = await cuRes.text();
          throw new Error(`chapter_unit failed: ${cuRes.status} ${text}`);
        }
        const cuJson: Array<{ unit_id: number }> = await cuRes.json();
        ids = cuJson.map(u => Number(u.unit_id)).filter(Boolean);
      }
      
      setUnitIds(ids);

      if (ids.length === 0) {
        setTopics([]);
        setIsLoading(false);
        return;
      }

      // 2) Fetch topics for these units
      const inClause = encodeURIComponent(`(${ids.join(",")})`);
      const topicsRes = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/topic?unit_id=in.${inClause}`,
        { headers }
      );
      if (!topicsRes.ok) {
        const text = await topicsRes.text();
        throw new Error(`topic failed: ${topicsRes.status} ${text}`);
      }
      const topicsJson: Topic[] = await topicsRes.json();
      setTopics(topicsJson);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to fetch topics");
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, unitIdsParam, currentTeam?.id, headers, httpFetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { topics, unitIds, isLoading, error, refetch };
}

