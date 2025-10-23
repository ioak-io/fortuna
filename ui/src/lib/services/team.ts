import { Team, TeamMember, PermissionLevel } from "@/types/team";
import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";
import { APP_REALM } from "@/constants";

export function TeamService(
    httpFetch: HttpFetch
) {
    return {
        async get(): Promise<Team[]> {
            const res = await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/teams`, { method: "GET" });
            return res.json();
        },

        async create(payload: Partial<Team>): Promise<Team> {
            const res = await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/teams`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return res.json();
        },

        async getMembers(teamId: string): Promise<TeamMember[]> {
            const res = await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/teams/${teamId}/members`, { 
                method: "GET" 
            });
            return res.json();
        },

        async updateMemberPermission(teamId: string, userId: string, permissionName: PermissionLevel[]): Promise<void> {
            await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/teams/${teamId}/members/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(permissionName),
            });
        },

        async removeMember(teamId: string, userId: string, permissionName: PermissionLevel[]): Promise<void> {
            await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/teams/${teamId}/members/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(permissionName),
            });
        },

        async fetchUsers(): Promise<{ id: string; email: string; first_name: string; last_name: string }[]> {
            const res = await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/users`, { 
                method: "GET" 
            });
            return res.json();
        },

        async addMember(teamId: string, userId: string, permission: PermissionLevel): Promise<void> {
            await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/teams/${teamId}/members/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([permission]),
            });
        },

        async inviteUser(teamId: string, email: string, permission: PermissionLevel): Promise<void> {
            await httpFetch(`${env.NEXT_PUBLIC_API_URL}/tenant/teams/${teamId}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, permission }),
            });
        },
    }
}
