import { APP_REALM } from "@/constants";
import { env } from "@/lib/shared/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email } = await req.json();

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/user/${APP_REALM}/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            appBaseUrl: env.NEXT_PUBLIC_APP_BASE_URL
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ message: "Password reset email sent successfully" });
}
