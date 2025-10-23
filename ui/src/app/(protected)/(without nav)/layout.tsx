"use client"

import { AuthProvider } from "@/lib/auth/AuthContext";
import { AuthGate } from "./AuthGate";
import React, { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider
            match={{
                include: [
                    "/tenant/**",
                    "/api/**",
                    "/fortuna/**",
                    "/data/**",
                    "/api/proxy/**", // example: internal API routes
                ],
                exclude: ["/api/login", "/api/refresh"],
            }}
            loginPath="/login"
        >
            <AuthGate>
                {children}
            </AuthGate>
        </AuthProvider>
    )
}
