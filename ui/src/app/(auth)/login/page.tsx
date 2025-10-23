"use client";

import React from "react";
import Login from "@/components/features/login/Login";
import { LogoIcon, LogoText } from "@/components/icons/BrandLogo";
import { AuthProvider } from "@/lib/auth/AuthContext";

const LoginPage = () => {
    return (
        <AuthProvider
            match={{
                include: [
                ],
                exclude: ["/api/login",
                    "/api/refresh"],
            }}
            loginPath="/login"
        >
            {/* <div className="flex min-h-screen items-center justify-center flex-col space-y-6">
                <div className="flex items-center justify-center">
                    <LogoIcon className="w-8 h-8" />
                    <LogoText className="h-6" />
                </div> */}
            <Login />
            {/* </div> */}
        </AuthProvider>
    );
};

export default LoginPage;
