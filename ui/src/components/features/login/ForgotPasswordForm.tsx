"use client";

import React from "react";
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
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/schemas/login";
import { forgotPassword } from "@/lib/services/login";
import { useState } from "react";

type Props = {
  onBackToLogin: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

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

const ForgotPasswordForm = ({ onBackToLogin, onSubmit }: Props) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordSchemaType) => {
    try {
      await forgotPassword({
        email: values.email,
      });

      setIsSuccess(true);
      form.reset();
    } catch (error: unknown) {
      if (isApiError(error)) {
        form.setError("root", { message: error.message || "Failed to send reset email" });
      } else {
        form.setError("root", { message: "Unexpected error occurred" });
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Check Your Email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
          </p>
        </div>
        <div className="flex justify-center">
          <Button onClick={onBackToLogin} variant="outline">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-4">
        <FormMessage className="text-center">
          {form.formState.errors.root?.message}
        </FormMessage>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  className="h-10"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  {...field}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button className="h-10" type="button" variant="outline" onClick={onBackToLogin}>
            Back to Login
          </Button>
          <Button className="h-10" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;