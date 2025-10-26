import { env } from "../shared/env";
import type { HttpFetch } from "../shared/http";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category";

export function CategoryService(httpFetch: HttpFetch, teamId?: string) {
  const baseUrl = `${env.NEXT_PUBLIC_API_URL}/data/category`;

  const getHeaders = (contentType?: string, preferReturn?: boolean) => {
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (preferReturn) headers["Prefer"] = "return=representation";
    if (teamId) headers["x-team"] = teamId;
    return headers;
  };

  return {
    async list(): Promise<Category[]> {
      const res = await httpFetch(baseUrl, {
        method: "GET",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch categories");
      }
      return res.json();
    },

    async create(payload: CreateCategoryPayload): Promise<Category> {
      const res = await httpFetch(baseUrl, {
        method: "POST",
        headers: getHeaders("application/json", true),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create category");
      }
      const result = await res.json();
      return Array.isArray(result) ? result[0] : result;
    },

    async update(id: number, payload: UpdateCategoryPayload): Promise<Category> {
      const res = await httpFetch(`${baseUrl}?id=eq.${id}`,
        {
          method: "PATCH",
          headers: getHeaders("application/json", true),
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update category");
      }
      const result = await res.json();
      return Array.isArray(result) ? result[0] : result;
    },

    async remove(id: number): Promise<void> {
      const res = await httpFetch(`${baseUrl}?id=eq.${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete category");
      }
    },
  };
}


