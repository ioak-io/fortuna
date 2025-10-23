import { useAuth } from "@/lib/auth/AuthContext";

export type HttpFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export function useHttp() {
    const { httpFetch } = useAuth();

    return {
        fetch: httpFetch,
    };
}
