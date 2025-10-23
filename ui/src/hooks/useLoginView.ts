"use client";

import { useState } from "react";

export type LoginView = "login" | "create_account" | "forgot_password";

export function useLoginView(initial: LoginView = "login") {
    const [currentView, setCurrentView] = useState<LoginView>(initial);

    const showLogin = () => setCurrentView("login");
    const showCreateAccount = () => setCurrentView("create_account");
    const showForgotPassword = () => setCurrentView("forgot_password");

    return {
        currentView,
        showLogin,
        showCreateAccount,
        showForgotPassword,
    };
}
