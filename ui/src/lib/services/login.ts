import { Claims } from "../auth/types";
import { env } from "../shared/env";

export type SigninRequest = {
    username: string;
    password: string;
}

export type SigninResponse = {
    accessToken: string;
    claims: Claims;
}

export type ResetPasswordRequest = {
    currentPassword: string;
    newPassword: string;
}

export type ResetPasswordResponse = {
    message: string;
}

export type ForgotPasswordRequest = {
    email: string;
}

export type ForgotPasswordResponse = {
    message: string;
}

export type ResetPasswordWithTokenRequest = {
    token: string;
    newPassword: string;
}

export type ResetPasswordWithTokenResponse = {
    message: string;
}

export type SignupRequest = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    appBaseUrl: string;
}

export type SignupResponse = {
    message: string;
}

export const signin = async (
    payloadRequest: SigninRequest
): Promise<SigninResponse> => {
    const payload: SigninRequest = {
        username: payloadRequest.username?.trim().toLowerCase(),
        password: payloadRequest.password,
    };

    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        const message =
            data?.error?.message || data?.message || "Unknown error occurred";

        throw {
            status: res.status,
            message,
            raw: data,
        };
    }

    return data;
};

export const forgotPassword = async (
    payloadRequest: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
    const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRequest),
    });

    const data = await res.json();

    if (!res.ok) {
        const message =
            data?.error || data?.error?.message || data?.message || "Unknown error occurred";

        throw {
            status: res.status,
            message,
            raw: data,
        };
    }

    return data;
};

export const resetPassword = async (
    payloadRequest: ResetPasswordRequest,
    accessToken: string
): Promise<ResetPasswordResponse> => {
    const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(payloadRequest),
    });

    const data = await res.json();

    if (!res.ok) {
        const message =
            data?.error || data?.error?.message || data?.message || "Unknown error occurred";

        throw {
            status: res.status,
            message,
            raw: data,
        };
    }

    return data;
};

export const resetPasswordWithToken = async (
    payloadRequest: ResetPasswordWithTokenRequest
): Promise<ResetPasswordWithTokenResponse> => {
    const res = await fetch("/api/reset-password-with-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRequest),
    });

    const data = await res.json();

    if (!res.ok) {
        const message =
            data?.error || data?.error?.message || data?.message || "Unknown error occurred";

        throw {
            status: res.status,
            message,
            raw: data,
        };
    }

    return data;
};

export const signup = async (
    payloadRequest: SignupRequest
): Promise<SignupResponse> => {
    const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRequest),
    });

    const data = await res.json();

    if (!res.ok) {
        const message =
            data?.error || data?.error?.message || data?.message || "Unknown error occurred";

        throw {
            status: res.status,
            message,
            raw: data,
        };
    }

    return data;
};