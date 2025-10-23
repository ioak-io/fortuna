"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamStore } from "@/stores/useTeamStore";
import { useAuth } from "@/lib/auth/AuthContext";
import { TeamService } from "@/lib/services/team";
import { Team } from "@/types/team";
import { AddTeamDialog } from "@/components/features/team/AddTeamDialog";
import { Button } from "@/components/ui-library/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-library/ui/card";
import { PlusCircle, Users } from "lucide-react";
import { LogoIcon, LogoText } from "@/components/icons/BrandLogo";

export default function TeamSelectionPage() {
    const router = useRouter();
    const { isAuthenticated, httpFetch, claims } = useAuth();
    const { teams, setTeams, addTeam, setCurrentTeam } = useTeamStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchTeams = async () => {
            setIsLoading(true);
            try {
                const teamService = TeamService(httpFetch);
                const userTeams = await teamService.get();
                setTeams(userTeams);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeams();
    }, [isAuthenticated, httpFetch, setTeams]);

    const handleCreateTeam = async (data: {
        name: string;
        slug: string;
        description?: string;
    }): Promise<Team> => {
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
            throw error;
        } finally {
            setIsCreatingTeam(false);
        }
    };

    const handleSelectTeam = (teamSlug: string) => {
        setCurrentTeam(teamSlug);
        router.push(`/${teamSlug}/units`);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col p-6">
            {/* Header */}
            <header className="flex items-center gap-2 mb-10">
                <LogoIcon className="w-7 h-7" />
                <LogoText className="h-5" />
            </header>

            <main className="flex-1 w-full max-w-xl mx-auto text-center">
                <h1 className="text-3xl font-semibold tracking-tight mb-2">
                    Welcome, {claims?.name}
                </h1>
                <p className="text-muted-foreground mb-10">
                    {teams.length > 0
                        ? "Choose a team to continue"
                        : "You don’t belong to any team yet. Create one to get started."}
                </p>

                {teams.length > 0 ? (
                    <div className="space-y-3">
                        {teams.map((team) => (
                            <Card
                                key={team.id}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer border border-border hover:border-primary shadow-none hover:shadow-2xl transition-colors gap-0"
                                onClick={() => handleSelectTeam(team.slug)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        {team.name}
                                    </CardTitle>
                                </CardHeader>
                                {team.description && (
                                    <CardContent className="text-sm text-left text-muted-foreground line-clamp-2">
                                        {team.description}
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed rounded-lg bg-muted/40">
                        <Users className="w-12 h-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-medium mb-1">No teams found</h2>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                            It looks like you’re not part of any team yet. Create one to start collaborating.
                        </p>
                    </div>
                )}

                {/* Create team button */}
                <div className="mt-10">
                    <AddTeamDialog onCreateTeam={handleCreateTeam} isLoading={isCreatingTeam} />
                </div>
            </main>
        </div>
    );

}
