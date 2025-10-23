"use client";

import { useParams } from "next/navigation";

export function useTypedParams<T extends Record<string, string | undefined>>() {
    const params = useParams() as Partial<T>;

    const flattened = {} as T;
    for (const key in params) {
        const value = params[key];
        flattened[key as keyof T] = Array.isArray(value) ? value[0] : value;
    }

    return flattened;
}
