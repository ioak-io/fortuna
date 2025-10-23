import { Team } from "@/types/team";
import { create } from "zustand";

type TeamState = {
    teams: Team[];
    currentTeam?: Team;
    currentTeamSlug?: string;
    setTeams: (teams: Team[]) => void;
    setCurrentTeam: (teamSlug?: string) => void;
    addTeam: (team: Team) => void;
};

export const useTeamStore = create<TeamState>((set, get) => ({
    teams: [],
    currentTeam: undefined,

    setTeams: (teams) => {
        const normalizedTeams = teams.map(t => ({ ...t, slug: String(t.slug) }));
        let currentTeam = get().currentTeam;
        const currentTeamSlug = get().currentTeamSlug;

        if (currentTeamSlug) {
            currentTeam = normalizedTeams.find(t => t.slug === currentTeamSlug);
        }

        set({ teams: normalizedTeams, currentTeam });
    },

    setCurrentTeam: (teamSlug) => {
        const team = get().teams.find(t => t.slug === teamSlug);
        set({ currentTeam: team, currentTeamSlug: teamSlug });
    },

    addTeam: (team) => {
        const normalizedTeam = { ...team, slug: String(team.slug) };
        set((state) => ({ 
            teams: [...state.teams, normalizedTeam] 
        }));
    },
}));
