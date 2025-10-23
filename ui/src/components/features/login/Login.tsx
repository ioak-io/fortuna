"use client";

import React, { Suspense } from "react";
import LoginForm from "@/components/features/login/LoginForm";
import SignupForm from "@/components/features/login/SignupForm";
import ForgotPasswordForm from "@/components/features/login/ForgotPasswordForm";
import { useLoginView } from "@/hooks/useLoginView";
import { LogoIcon, LogoText } from "@/components/icons/BrandLogo";

const Login = () => {
  const {
    currentView,
    showLogin,
    showCreateAccount,
    showForgotPassword,
  } = useLoginView("login");

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Forgot password submitted");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen">
        {/* Left side image - hidden on mobile */}
        <div
          className="hidden lg:flex bg-cover bg-center w-[450px] min-w-[450px]"
          style={{ backgroundImage: "url('/images/login.jpg')" }}
        >
          {/* Optional: overlay content (logo, tagline) */}
        </div>

        {/* Right side content */}
        <div className="flex w-full items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* <h1 className="text-2xl font-semibold mb-6">
              {currentView === "login" && "Sign in to your account"}
              {currentView === "create_account" && "Create a new account"}
              {currentView === "forgot_password" && "Forgot your password?"}
            </h1> */}

            <div className="flex items-center justify-center mb-10">
              <LogoIcon className="h-16 w-auto" />
              <LogoText className="h-8 w-auto" />
            </div>


            {currentView === "login" && (
              <LoginForm
                onForgotPassword={showForgotPassword}
                onSwitchToCreate={showCreateAccount}
              />
            )}

            {currentView === "create_account" && (
              <SignupForm onBackToLogin={showLogin} />
            )}

            {currentView === "forgot_password" && (
              <ForgotPasswordForm
                onBackToLogin={showLogin}
                onSubmit={handleForgotPasswordSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Login;
