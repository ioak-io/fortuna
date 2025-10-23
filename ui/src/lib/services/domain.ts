import { env } from "../shared/env";
import type { HttpFetch } from "../shared/http";

const API_PREFIX = "resources";

export type SearchPayload = {
    filters: Record<string, unknown>, pagination?: {
        page?: number;
        limit?: number;
    }, sort?: unknown
}

export type SearchResponse<TEntity> = {
    data: TEntity[];
    page: number;
    limit: number;
    totalPages: number;
    total: number;
}

const buildEndpoint = (space: string, domain: string, id?: string) => {
    const base = `${env.NEXT_PUBLIC_API_URL}/${API_PREFIX}/${space}/${domain}`;
    return id ? `${base}/${id}` : base;
};

export function createDomainService<TEntity>(
    httpFetch: HttpFetch,
    space: string,
    domain: string
) {
    return {
        async getMeta(): Promise<Record<string, unknown>> {
            const endpoint = buildEndpoint(space, domain);
            const res = await httpFetch(endpoint, { method: "GET" });
            return res.json();
        },

        async search(
            payload: SearchPayload
        ): Promise<SearchResponse<TEntity>> {
            const endpoint = `${buildEndpoint(space, domain)}/search`;
            const res = await httpFetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return res.json();
        },

        async getById(id: string): Promise<TEntity | null> {
            const endpoint = buildEndpoint(space, domain, id);
            const res = await httpFetch(endpoint, { method: "GET" });
            return res.json();
        },

        async create(payload: Partial<TEntity>): Promise<TEntity> {
            const endpoint = buildEndpoint(space, domain);
            const res = await httpFetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return res.json();
        },

        async update(id: string, payload: Partial<TEntity>): Promise<TEntity> {
            const endpoint = buildEndpoint(space, domain, id);
            const res = await httpFetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return res.json();
        },

        async patch(id: string, payload: Partial<TEntity>): Promise<TEntity> {
            const endpoint = buildEndpoint(space, domain, id);
            const res = await httpFetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return res.json();
        },

        async delete(id: string): Promise<{ success: boolean }> {
            const endpoint = buildEndpoint(space, domain, id);
            try {
                await httpFetch(endpoint, { method: "DELETE" });
                return { success: true };
            } catch {
                return { success: false };
            }
        },
    };
}
