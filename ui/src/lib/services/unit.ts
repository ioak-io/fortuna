import { Unit, CreateUnitPayload, UpdateUnitPayload } from "@/types/domain";
import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export function UnitService(httpFetch: HttpFetch) {
    const baseUrl = `${env.NEXT_PUBLIC_API_URL}/data/unit`;

    return {
        async getAll(): Promise<Unit[]> {
            const res = await httpFetch(baseUrl, { method: "GET" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch units: ${res.status} ${errorText}`);
            }
            
            return res.json();
        },

        async getById(id: string): Promise<Unit> {
            const res = await httpFetch(`${baseUrl}/${id}`, { method: "GET" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch unit: ${res.status} ${errorText}`);
            }
            
            return res.json();
        },

        async getBySlug(slug: string): Promise<Unit> {
            const res = await httpFetch(`${baseUrl}?slug=eq.${slug}`, { method: "GET" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch unit: ${res.status} ${errorText}`);
            }
            
            const result = await res.json();
            if (!Array.isArray(result) || result.length === 0) {
                throw new Error(`Unit with slug "${slug}" not found`);
            }
            
            return result[0];
        },

        async getByIds(ids: number[]): Promise<Unit[]> {
            if (ids.length === 0) return [];
            
            // Create PostgREST query for multiple IDs using 'in' operator
            const idsParam = ids.map(id => `"${id}"`).join(',');
            const res = await httpFetch(`${baseUrl}?id=in.(${idsParam})`, { method: "GET" });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch units: ${res.status} ${errorText}`);
            }
            
            return res.json();
        },

        async create(payload: CreateUnitPayload): Promise<Unit> {
            const res = await httpFetch(baseUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                },
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to create unit: ${res.status} ${errorText}`);
            }
            
            const result = await res.json();
            // PostgREST returns an array with the created object
            return Array.isArray(result) ? result[0] : result;
        },

        async update(id: string, payload: Partial<CreateUnitPayload>): Promise<Unit> {
            const res = await httpFetch(`${baseUrl}?id=eq.${id}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                },
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update unit: ${res.status} ${errorText}`);
            }
            
            const result = await res.json();
            // PostgREST returns an array with the updated object
            return Array.isArray(result) ? result[0] : result;
        },


        async delete(id: string): Promise<{ success: boolean; error?: string }> {
            try {
                const res = await httpFetch(`${baseUrl}?id=eq.${id}`, { method: "DELETE" });
                
                if (!res.ok) {
                    const errorText = await res.text();
                    return { 
                        success: false, 
                        error: `Failed to delete unit: ${res.status} ${errorText}` 
                    };
                }
                
                return { success: true };
            } catch (error) {
                return { 
                    success: false, 
                    error: error instanceof Error ? error.message : "Unknown error occurred" 
                };
            }
        },
    };
}
