"use client"

import { AppSidebar } from "@/components/ui-library/components/app-sidebar";
import { Separator } from "@/components/ui-library/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/auth/AuthContext";
import React from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider
            match={{
                include: [
                    "/api/**",
                    "/api/proxy/**", // example: internal API routes
                ],
                exclude: ["/api/login", "/api/refresh"],
            }}
        >
            <SidebarProvider>
                <AppSidebar className="border-none" />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear m-4 bg-card rounded-lg">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                    </header>
                    <div className="m-4 mt-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    )
}
