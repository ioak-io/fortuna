"use client"
import { AppSidebar } from "@/components/ui-library/components/app-sidebar";
import { Separator } from "@/components/ui-library/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { AuthGate } from "./AuthGate";
import { useTeamStore } from "@/stores/useTeamStore";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { NavUser } from "@/components/ui/NavUser";
import { CreateMenu } from "@/components/ui/CreateMenu";
import { BreadcrumbSection } from "@/components/ui/BreadcrumbSection";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { setCurrentTeam } = useTeamStore();
    const pathname = usePathname();
    const { team }: { team: string } = useParams();

    useEffect(() => {
        setCurrentTeam(team);
    }, [team, setCurrentTeam]);

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
            <SidebarProvider>
                <AppSidebar className="border-none" />
                <SidebarInset className="my-2 md:my-4">
                    <header className="flex h-16 items-center justify-between gap-2 mx-2 md:ml-8 md:mr-4 bg-card px-4 rounded-xl mb-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <BreadcrumbSection />
                            {/* <LogoIcon /> */}
                        </div>
                        <div className="flex items-center justify-end space-x-4">
                            <CreateMenu />
                            <NavUser />
                        </div>
                    </header>
                    <div className="mx-2 md:ml-8 md:mr-4">
                        <AuthGate>
                            {children}
                        </AuthGate>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    )
}
