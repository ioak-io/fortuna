"use client"

import * as React from "react"
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

import { LogoIcon, LogoText } from "@/components/icons/BrandLogo"

export function BrandLogo() {
    const { state } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center gap-2 px-2 py-2">
                    <LogoIcon className="size-6" />
                    {state === "expanded" && <LogoText className="h-6" />}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
