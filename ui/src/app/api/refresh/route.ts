import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/shared/env";
import { APP_REALM } from "@/constants";
import { JwtClaims } from "@/types/JwtClaimTypes";

export async function POST() {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("refresh_token")?.value;

    if (!refresh) {
        return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/user/${APP_REALM}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: env.NEXT_PUBLIC_AUTH_CLIENT_ID,
            client_secret: env.NEXT_PUBLIC_AUTH_CLIENT_SECRET,
            refresh_token: refresh
        }),
    }
    );

    const rawdata = await res.json();

    if (!res.ok) {
        const response = NextResponse.json(
            { message: rawdata?.message || "Refresh failed" },
            { status: 401 }
        );
        response.cookies.set("refresh_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        });
        return response;
    }

    const data = rawdata;

    const accessToken = data.access_token;
    const claimsRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/user/${APP_REALM}/me`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${accessToken}` },
    });

    if (!claimsRes.ok) {
        console.error("Failed to fetch claims:", await claimsRes.text());
        return NextResponse.json({ message: "Failed to fetch user claims" }, { status: claimsRes.status });
    }

    const claims: JwtClaims = await claimsRes.json();

    const response = NextResponse.json({
        accessToken: accessToken,
        claims: claims,
    });

    // Rotate refresh token if provided
    if (data.refresh_token) {
        response.cookies.set("refresh_token", data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // TBD: needs to be aligned with server setting
        });
    }

    return response;
}