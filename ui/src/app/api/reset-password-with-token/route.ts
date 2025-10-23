import { APP_REALM } from "@/constants";
import { env } from "@/lib/shared/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { token, newPassword } = await req.json();

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/user/${APP_REALM}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token,
            newPassword
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ message: "Password reset successfully" });
}
