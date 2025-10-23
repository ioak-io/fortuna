"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useHttp } from "@/lib/shared/http";
import { env } from "@/lib/shared/env";
import { useTeamStore } from "@/stores/useTeamStore";
import { TopicTotalsService, type TopicTotals } from "@/lib/services/topicTotals";
import type { Topic } from "./useTopics";

export interface UserTopicProgressView {
  user_id: string;
  team_id: string;
  topic_id: number;
  unit_id: number;
  attempted: number;
  mastered: number;
  in_progress: number;
  struggling: number;
  due_now: number;
  views: number | null;
  time_spent: number | null;
  last_viewed_at: string | null;
}

export type TopicStatus = "mastered" | "in_progress" | "struggling" | "unseen";

export type TopicWithProgress = Topic & {
  progress: UserTopicProgressView | null;
  status: TopicStatus;
  totalArtifacts: number;
};

export type UseTopicProgressResult = {
  topicsWithProgress: TopicWithProgress[];
  counts: { mastered: number; in_progress: number; struggling: number; unseen: number; total: number };
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type UseTopicProgressParams = {
  chapterId?: number;
  unitIds?: number[];
};

/**
 * Generalized hook to fetch topic progress for either a chapter or specific units
 * @param params - Either { chapterId } or { unitIds }
 */
export function useTopicProgress(params: UseTopicProgressParams): UseTopicProgressResult {
  const { chapterId, unitIds: unitIdsParam } = params;
  const { fetch: httpFetch } = useHttp();
  const { currentTeam } = useTeamStore();

  const [topicsWithProgress, setTopicsWithProgress] = useState<TopicWithProgress[]>([]);
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
      setTopicsWithProgress([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1) Determine unit ids: use unitIdsParam if provided; else fetch from chapter
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

      if (ids.length === 0) {
        setTopicsWithProgress([]);
        setIsLoading(false);
        return;
      }

      // 2) Fetch topics and topic progress
      const inClause = encodeURIComponent(`(${ids.join(",")})`);
      const [topicsRes, progressRes] = await Promise.all([
        httpFetch(`${env.NEXT_PUBLIC_API_URL}/data/topic?unit_id=in.${inClause}`, { headers }),
        httpFetch(`${env.NEXT_PUBLIC_API_URL}/data/v_user_topic_progress?unit_id=in.${inClause}`, { headers }),
      ]);

      if (!topicsRes.ok) {
        const text = await topicsRes.text();
        throw new Error(`topic failed: ${topicsRes.status} ${text}`);
      }
      if (!progressRes.ok) {
        const text = await progressRes.text();
        throw new Error(`v_user_topic_progress failed: ${progressRes.status} ${text}`);
      }

      const topics: Topic[] = await topicsRes.json();
      const progressRows: UserTopicProgressView[] = await progressRes.json();

      // 3) Fetch topic totals if we have topics
      let topicTotals: TopicTotals[] = [];
      if (topics.length > 0) {
        const topicIds = topics.map(t => t.id);
        const topicTotalsService = TopicTotalsService(httpFetch);
        try {
          topicTotals = await topicTotalsService.getTopicTotals(topicIds);
        } catch (error) {
          console.warn("Failed to fetch topic totals:", error);
          // Continue without topic totals rather than failing completely
        }
      }

      // Build progress map by topic_id (expect at most one row per topic for current user)
      const progressByTopic: Record<number, UserTopicProgressView> = {};
      for (const row of progressRows) {
        // If there are multiple rows per topic due to joins, merge them conservatively by summing
        const existing = progressByTopic[row.topic_id];
        if (!existing) {
          progressByTopic[row.topic_id] = row;
        } else {
          progressByTopic[row.topic_id] = {
            ...existing,
            attempted: (existing.attempted || 0) + (row.attempted || 0),
            mastered: (existing.mastered || 0) + (row.mastered || 0),
            in_progress: (existing.in_progress || 0) + (row.in_progress || 0),
            struggling: (existing.struggling || 0) + (row.struggling || 0),
            due_now: (existing.due_now || 0) + (row.due_now || 0),
            views: (existing.views || 0) + (row.views || 0),
            time_spent: (existing.time_spent || 0) + (row.time_spent || 0),
            last_viewed_at: existing.last_viewed_at && row.last_viewed_at
              ? (existing.last_viewed_at > row.last_viewed_at ? existing.last_viewed_at : row.last_viewed_at)
              : (existing.last_viewed_at || row.last_viewed_at),
          };
        }
      }

      // Build topic totals map - calculate total artifacts from individual counts
      const totalsByTopic: Record<number, number> = {};
      for (const total of topicTotals) {
        totalsByTopic[total.topic_id] = total.flashcard + total.quiz + total.question;
      }

      // Derive per-topic status based on progress counts
      const withProgress: TopicWithProgress[] = topics.map((t) => {
        const p = progressByTopic[t.id] ?? null;
        const totalArtifacts = totalsByTopic[t.id] ?? 0;
        let status: TopicStatus = "unseen";
        if (p) {
          if ((p.mastered || 0) > 0) status = "mastered";
          else if ((p.struggling || 0) > 0) status = "struggling";
          else if ((p.in_progress || 0) > 0 || (p.attempted || 0) > 0) status = "in_progress";
          else status = "unseen";
        }
        return { ...t, progress: p, status, totalArtifacts };
      });

      setTopicsWithProgress(withProgress);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to fetch topic progress");
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, unitIdsParam, currentTeam?.id, headers, httpFetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const counts = useMemo(() => {
    const c = { mastered: 0, in_progress: 0, struggling: 0, unseen: 0, total: topicsWithProgress.length };
    for (const t of topicsWithProgress) {
      c[t.status] += 1;
    }
    return c;
  }, [topicsWithProgress]);

  return { topicsWithProgress, counts, isLoading, error, refetch };
}

