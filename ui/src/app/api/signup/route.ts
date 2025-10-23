import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/shared/env";
import { APP_REALM } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, firstName, lastName, password } = body;

    // Validate required fields
    if (!username || !email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Prepare the signup payload
    const signupPayload = {
      username,
      email,
      firstName,
      lastName,
      password,
      appBaseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
    };

    // Make the API call to the backend
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/auth/user/${APP_REALM}/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant": env.NEXT_PUBLIC_TENANT,
        },
        body: JSON.stringify(signupPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Signup failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
