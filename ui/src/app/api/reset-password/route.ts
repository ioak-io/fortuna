import { APP_REALM } from "@/constants";
import { env } from "@/lib/shared/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { currentPassword, newPassword } = await req.json();

    // Get the authorization header to pass the user's token
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader) {
        return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
    }

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/user/${APP_REALM}/change-password`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": authHeader
        },
        body: JSON.stringify({
            currentPassword,
            newPassword
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ message: "Password changed successfully" });
}
