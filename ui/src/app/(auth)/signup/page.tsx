"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/features/login/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your details to create a new account.
          </p>
        </div>
        
        <SignupForm onBackToLogin={handleBackToLogin} isStandalone={true} />
      </div>
    </div>
  );
}
