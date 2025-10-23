import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";
import { ComputedArtifact } from "@/types/artifacts";

export function ArtifactService(httpFetch: HttpFetch, teamId?: string) {
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
    async getArtifactsByUnit(unitId: string): Promise<ComputedArtifact[]> {
      ensureTeamId();
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/data/artifact_generation_log?unit_id=eq.${unitId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch artifacts: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    async generateArtifact(unitId: string, artifactType: string): Promise<void> {
      ensureTeamId();
      
      // Map artifact types to API endpoint names
      const endpointMap: Record<string, string> = {
        'quiz': 'quiz',
        'flashcard': 'flashcard',
        'studyguide': 'studyguide'
      };
      
      const endpoint = endpointMap[artifactType];
      if (!endpoint) {
        throw new Error(`Unsupported artifact type: ${artifactType}`);
      }
      
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/${endpoint}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate ${artifactType}: ${res.status} ${errorText}`);
      }
    },

    async generateAllArtifacts(unitId: string): Promise<void> {
      ensureTeamId();
      
      const res = await httpFetch(
        `${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/generate-artifacts`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate artifacts: ${res.status} ${errorText}`);
      }
    },
  };
}
