"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { decodeJwt, isExpired } from "./jwt";
import type { AuthState, Claims } from "./types";
import { MatchConfig, shouldAttachAuth } from "./match";

export type AuthContextValue = {
    accessToken: string | null;
    claims: Claims | null;
    isAuthenticated: boolean;
    getAccessToken: () => Promise<string | null>;
    httpFetch: typeof fetch;
    signIn: (accessToken: string, claims?: Claims) => void;
    signOut: (options?: { redirect?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export type AuthProviderProps = {
    children: React.ReactNode;
    match?: MatchConfig;
    loginPath?: string;
};

export function AuthProvider({ children, match = { include: ["/api/**", "/api/proxy/**"] }, loginPath = "/login" }: AuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [state, setState] = useState<AuthState>({ accessToken: null, claims: null });
    const refreshingRef = useRef<Promise<string | null> | null>(null);

    // Hydrate on mount: try to obtain an access token using refresh cookie silently
    useEffect(() => {
        const boot = async () => {
            if (!state.accessToken) {
                const fresh = await refreshAccessToken();
                if (!fresh && pathname && !pathname.startsWith(loginPath)) {
                    router.replace(loginPath);
                }
            }
        };
        void boot();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signIn = useCallback((accessToken: string, claims?: Claims) => {
        const parsed = claims ?? decodeJwt<Claims>(accessToken) ?? null;
        setState({ accessToken, claims: parsed });
    }, []);

    const signOut = useCallback(
        async (options?: { redirect?: string }) => {
            setState({ accessToken: null, claims: null });

            try {
                await fetch("/api/logout", { method: "POST" });
            } catch (e) {
                console.warn("Failed to hit logout endpoint", e);
            }

            const current = pathname || "/";
            const to = options?.redirect ?? `${loginPath}?next=${encodeURIComponent(current)}`;
            router.replace(to);
        },
        [loginPath, pathname, router]
    );


    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        if (refreshingRef.current) return refreshingRef.current;
        const p = (async () => {
            try {
                const res = await fetch("/api/refresh", { method: "POST" });
                if (!res.ok) throw new Error("refresh failed");
                const data = await res.json();
                const parsed = decodeJwt<Claims>(data.accessToken) ?? null;
                setState({ accessToken: data.accessToken, claims: parsed });
                return data.accessToken as string;
            } catch {
                setState({ accessToken: null, claims: null });
                return null;
            } finally {
                refreshingRef.current = null;
            }
        })();
        refreshingRef.current = p;
        return p;
    }, []);

    const getAccessToken = useCallback(async () => {
        const token = state.accessToken;
        const exp = state.claims?.exp;
        if (!token || isExpired(exp)) {
            return await refreshAccessToken();
        }
        return token;
    }, [state.accessToken, state.claims?.exp, refreshAccessToken]);

    const httpFetch: typeof fetch = useCallback(
        async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === "string" ? input.toString() : (input as URL).toString();
            const shouldAuth = shouldAttachAuth(url, match);

            const doFetch = async (withAuth: boolean): Promise<Response> => {
                const headers = new Headers(init?.headers || {});
                let finalInit = init;
                if (withAuth) {
                    const token = await getAccessToken();
                    if (!token) {
                        // Redirect when we expected to attach auth but failed to get a token
                        if (!pathname.startsWith(loginPath)) router.replace(loginPath);
                        throw new Error("Unauthenticated");
                    }
                    headers.set("Authorization", `Bearer ${token}`);
                    headers.set("x-tenant", "ipsum");
                    finalInit = { ...init, headers };
                }
                return fetch(input, finalInit);
            };

            let res = await doFetch(shouldAuth);

            // try a single refresh & retry
            if (shouldAuth && res.status === 401) {
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    if (!pathname.startsWith(loginPath)) router.replace(loginPath);
                    return res;
                }
                const headers = new Headers(init?.headers || {});
                headers.set("Authorization", `${newToken}`);
                res = await fetch(input, { ...init, headers });
            }

            return res;
        },
        [getAccessToken, match, pathname, loginPath, refreshAccessToken, router]
    );

    const value = useMemo<AuthContextValue>(() => ({
        accessToken: state.accessToken,
        claims: state.claims,
        isAuthenticated: !!state.accessToken,
        getAccessToken,
        httpFetch,
        signIn,
        signOut,
    }), [state.accessToken, state.claims, getAccessToken, httpFetch, signIn, signOut]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
