import { APP_REALM } from "@/constants";
import { env } from "@/lib/shared/env";
import { NextResponse } from "next/server";
import { JwtClaims } from "@/types/JwtClaimTypes";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/user/${APP_REALM}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: env.NEXT_PUBLIC_AUTH_CLIENT_ID,
            client_secret: env.NEXT_PUBLIC_AUTH_CLIENT_SECRET,
            username, password
        }),
    });

    const rawdata = await res.json();

    if (!res.ok) {
        return NextResponse.json(rawdata, { status: res.status });
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

    response.cookies.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return response;
}
