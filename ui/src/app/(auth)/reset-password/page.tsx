"use client";

import React, { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui-library/ui/input";
import { Button } from "@/components/ui-library/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-library/ui/form";
import { useForm } from "react-hook-form";
import { resetPasswordWithTokenSchema, ResetPasswordWithTokenSchemaType } from "@/schemas/login";
import { resetPasswordWithToken } from "@/lib/services/login";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

type ApiError = {
  status: number;
  message: string;
};

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err
  );
}

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<ResetPasswordWithTokenSchemaType>({
    resolver: zodResolver(resetPasswordWithTokenSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
    setIsLoading(false);
  }, [searchParams]);

  const onSubmit = async (values: ResetPasswordWithTokenSchemaType) => {
    if (!token) {
      form.setError("root", { message: "Invalid or missing reset token" });
      return;
    }

    try {
      await resetPasswordWithToken({
        token,
        newPassword: values.newPassword,
      });

      setIsSuccess(true);
      form.reset();
    } catch (error: unknown) {
      if (isApiError(error)) {
        if (error.status === 400) {
          form.setError("root", { message: "Invalid or expired reset token" });
        } else if (error.status === 422) {
          form.setError("root", { message: "Password does not meet requirements" });
        } else {
          form.setError("root", { message: error.message || "Failed to reset password" });
        }
      } else {
        form.setError("root", { message: "Unexpected error occurred" });
      }
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Invalid Reset Link</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button onClick={handleGoToLogin} className="mt-4">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Password Reset Successful</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Button onClick={handleGoToLogin} className="mt-4">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Reset Your Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormMessage className="text-center">
              {form.formState.errors.root?.message}
            </FormMessage>
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Enter your new password"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleGoToLogin}>
                Back to Login
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
