import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth/AuthContext";
import { useTeamStore } from "@/stores/useTeamStore";
import { useEffect } from "react";
import { TeamService } from "../../../lib/services/team";

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, getAccessToken, httpFetch } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { setTeams } = useTeamStore();

    useEffect(() => {
        (async () => {
            const token = await getAccessToken();
            if (!token) {
                router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
            }
        })();
    }, [pathname, router]); // Removed getAccessToken from dependencies to prevent infinite loop

    useEffect(() => {
        if (!isAuthenticated) return;

        (async () => {
            try {
                const teamService = TeamService(httpFetch);
                const teams = await teamService.get();
                setTeams(teams);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            }
        })();
    }, [isAuthenticated]);


    // if (!isAuthenticated) {
    //     return <GenericSkeleton />
    // }

    return <>{children}</>;
}