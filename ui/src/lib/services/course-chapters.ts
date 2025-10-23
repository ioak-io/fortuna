import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface CourseChapter {
  id: number;
  team_id: string;
  course_id: number;
  chapter_id: number;
  ordering: number;
  created_at: string;
}

export interface CreateCourseChapterPayload {
  team_id: string;
  course_id: number;
  chapter_id: number;
  ordering?: number;
}

export interface UpdateCourseChapterPayload {
  id: number;
  ordering?: number;
}

export function CourseChaptersService(httpFetch: HttpFetch) {
  const baseUrl = `${env.NEXT_PUBLIC_API_URL}/data/course_chapter`;

  return {
    async getByCourseId(courseId: number): Promise<CourseChapter[]> {
      const res = await httpFetch(`${baseUrl}?course_id=eq.${courseId}`, { method: "GET" });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch course chapter: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async create(payload: CreateCourseChapterPayload): Promise<CourseChapter> {
      const res = await httpFetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create course chapter: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async update(id: number, payload: UpdateCourseChapterPayload): Promise<CourseChapter> {
      const res = await httpFetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update course chapter: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },

    async delete(id: number): Promise<{ success: boolean; error?: string }> {
      try {
        const res = await httpFetch(`${baseUrl}/${id}`, { method: "DELETE" });
        
        if (!res.ok) {
          const errorText = await res.text();
          return { success: false, error: `Failed to delete course chapter: ${res.status} ${errorText}` };
        }
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to delete course chapter" 
        };
      }
    },
  };
}
