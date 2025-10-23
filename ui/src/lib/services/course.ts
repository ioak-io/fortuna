import { Course, CreateCoursePayload, UpdateCoursePayload } from "@/types/domain";
import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export function CourseService(httpFetch: HttpFetch) {
    const baseUrl = `${env.NEXT_PUBLIC_API_URL}/data/course`;

    return {
        async getAll(): Promise<Course[]> {
            const res = await httpFetch(baseUrl, { method: "GET" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch course: ${res.status} ${errorText}`);
            }
            
            return res.json();
        },

        async getById(id: string): Promise<Course> {
            const res = await httpFetch(`${baseUrl}/${id}`, { method: "GET" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch course: ${res.status} ${errorText}`);
            }
            
            return res.json();
        },

        async getBySlug(slug: string): Promise<Course> {
            const res = await httpFetch(`${baseUrl}?slug=eq.${slug}`, { method: "GET" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch course: ${res.status} ${errorText}`);
            }
            
            const result = await res.json();
            if (!Array.isArray(result) || result.length === 0) {
                throw new Error(`Course with slug "${slug}" not found`);
            }
            
            return result[0];
        },

        async create(payload: CreateCoursePayload): Promise<Course> {
            const res = await httpFetch(baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to create course: ${res.status} ${errorText}`);
            }
            
            return res.json();
        },

        async update(id: string, payload: Partial<CreateCoursePayload>): Promise<Course> {
            const res = await httpFetch(`${baseUrl}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update course: ${res.status} ${errorText}`);
            }
            
            return res.json();
        },

        async delete(id: string): Promise<{ success: boolean; error?: string }> {
            try {
                const res = await httpFetch(`${baseUrl}/${id}`, { method: "DELETE" });
                
                if (!res.ok) {
                    const errorText = await res.text();
                    return { success: false, error: `Failed to delete course: ${res.status} ${errorText}` };
                }
                
                return { success: true };
            } catch (error) {
                return { 
                    success: false, 
                    error: error instanceof Error ? error.message : "Failed to delete course" 
                };
            }
        },
    };
}
