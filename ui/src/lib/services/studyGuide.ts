import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export type StudyGuideBlock =
  | { type: "paragraph"; content: string }
  | { type: "subheading"; content: string }
  | { type: "list"; items: string[] }
  | { type: "image"; keywords: string[]; src?: string; attribution?: string };

export interface StudyGuideRecord {
  id: number;
  team_id: string;
  unit_id: number;
  title: string | null;
  // content is now a structured array of blocks instead of a flat string
  content: StudyGuideBlock[] | null;
  created_at: string;  // ISO timestamp
  updated_at: string;  // ISO timestamp
}


export function StudyGuideService(httpFetch: HttpFetch, teamId?: string) {
  const getHeaders = () => {
    const headers: Record<string, string> = {};
    if (teamId) {
      headers['x-team'] = teamId;
    }
    return headers;
  };

  const ensureTeamId = () => {
    if (!teamId) {
      throw new Error('Team ID is required but not available. Please wait for team data to load.');
    }
  };

  return {
    async generateStudyGuide(unitId: string): Promise<void> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/studyguide`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate study guide: ${res.status} ${errorText}`);
      }
    },

    async getStudyGuide(unitId: string): Promise<StudyGuideRecord[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/studyguide?unit_id=eq.${unitId}&order=created_at.asc`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No study guides found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch study guides: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      return data || [];
    },

    async getStudyGuideByTopics(topicIds: number[]): Promise<StudyGuideRecord[]> {
      ensureTeamId();
      const topicIdsParam = `{${topicIds.join(',')}}`;
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/rpc/get_study_guides?p_topic_ids=${encodeURIComponent(topicIdsParam)}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return []; // No study guides found
        }
        const errorText = await res.text();
        throw new Error(`Failed to fetch study guides for topics: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      return data || [];
    },
  };
}
