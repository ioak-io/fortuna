"use client"

import * as React from "react"
import { ChevronsUpDown, Grid } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui-library/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTeamStore } from "@/stores/useTeamStore"
import { useRouter } from "next/navigation"
import { AddTeamDialog } from "@/components/features/team/AddTeamDialog"
import { useAuth } from "@/lib/auth/AuthContext"
import { TeamService } from "@/lib/services/team"
import { Team } from "@/types/team"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const {teams, currentTeam, addTeam, setCurrentTeam} = useTeamStore();
  const router = useRouter();
  const { httpFetch } = useAuth();
  const [isCreatingTeam, setIsCreatingTeam] = React.useState(false);

  const handleCreateTeam = async (data: { name: string; slug: string; description?: string }): Promise<Team> => {
    try {
      setIsCreatingTeam(true);
      const teamService = TeamService(httpFetch);
      const newTeam = await teamService.create(data);
      addTeam(newTeam);
      setCurrentTeam(newTeam.slug);
      router.push(`/${newTeam.slug}/search`);
      return newTeam;
    } catch (error) {
      console.error("Failed to create team:", error);
      throw error; // Re-throw to let the dialog handle the error state
    } finally {
      setIsCreatingTeam(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <Grid />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentTeam?.name}</span>
                <span className="truncate text-xs">{currentTeam?.description}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => router.push(`/${team.slug}/search`)}
                className="gap-2 p-2"
              >
                {/* <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div> */}
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <AddTeamDialog 
              onCreateTeam={handleCreateTeam}
              isLoading={isCreatingTeam}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
