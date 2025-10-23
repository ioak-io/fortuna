import { env } from "../shared/env";
import type { HttpFetch } from "../shared/http";

export type StatementRecord = {
  id: number;
  team_id: string;
  file_name: string | null;
  upload_date: string | null;
  raw_text: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
};

export function StatementService(httpFetch: HttpFetch, teamId?: string) {
  const baseUrl = `${env.NEXT_PUBLIC_API_URL}/data/statement`;

  const getHeaders = (contentType?: string) => {
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (teamId) headers["x-team"] = teamId;
    return headers;
  };

  const ensureTeamId = () => {
    if (!teamId) {
      throw new Error(
        "Team ID is required but not available. Please wait for team data to load."
      );
    }
  };

  return {
    async list(): Promise<StatementRecord[]> {
      const res = await httpFetch(baseUrl, {
        method: "GET",
        headers: getHeaders(),
      });
      return res.json();
    },

    async createFromFile(file: File): Promise<StatementRecord> {
      ensureTeamId();
      const text = await file.text();
      const payload = {
        file_name: file.name,
        raw_text: text,
      } as Partial<StatementRecord>;

      const res = await httpFetch(baseUrl, {
        method: "POST",
        headers: getHeaders("application/json"),
        body: JSON.stringify(payload),
      });
      return res.json();
    },
  };
}


