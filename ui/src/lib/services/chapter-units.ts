import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface ChapterUnit {
  id: number;
  team_id: string;
  chapter_id: number;
  unit_id: number;
  ordering: number;
  created_at: string;
}

export interface CreateChapterUnitPayload {
  team_id: string;
  chapter_id: number;
  unit_id: number;
  ordering?: number;
}

export interface UpdateChapterUnitPayload {
  id: number;
  ordering?: number;
}

export function ChapterUnitsService(httpFetch: HttpFetch) {
  const baseUrl = `${env.NEXT_PUBLIC_API_URL}/data/chapter_unit`;

  return {
    async getByChapterId(chapterId: number): Promise<ChapterUnit[]> {
      const res = await httpFetch(`${baseUrl}?chapter_id=eq.${chapterId}`, { method: "GET" });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch chapter units: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async create(payload: CreateChapterUnitPayload): Promise<ChapterUnit> {
      const res = await httpFetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create chapter unit: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async update(id: number, payload: UpdateChapterUnitPayload): Promise<ChapterUnit> {
      const res = await httpFetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update chapter unit: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async delete(id: number): Promise<{ success: boolean; error?: string }> {
      try {
        const res = await httpFetch(`${baseUrl}/${id}`, { method: "DELETE" });
        
        if (!res.ok) {
          const errorText = await res.text();
          return { success: false, error: `Failed to delete chapter unit: ${res.status} ${errorText}` };
        }
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to delete chapter unit" 
        };
      }
    },
  };
}
