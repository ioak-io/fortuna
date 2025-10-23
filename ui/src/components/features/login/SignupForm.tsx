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
import { signupSchema, SignupSchemaType } from "@/schemas/login";
import { signup } from "@/lib/services/login";
import { useRouter } from "next/navigation";

type Props = {
  onBackToLogin: () => void;
  isStandalone?: boolean;
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

const SignupForm = ({ onBackToLogin, isStandalone = false }: Props) => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: SignupSchemaType) => {
    try {
      await signup({
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        appBaseUrl: window.location.origin,
      });

      setIsSuccess(true);
      form.reset();
    } catch (error: unknown) {
      if (isApiError(error)) {
        if (error.status === 400) {
          form.setError("root", { message: "Invalid input data" });
        } else if (error.status === 409) {
          form.setError("root", { message: "Username or email already exists" });
        } else {
          form.setError("root", { message: error.message || "Failed to create account" });
        }
      } else {
        form.setError("root", { message: "Unexpected error occurred" });
      }
    }
  };

  const handleGoToLogin = () => {
    if (isStandalone) {
      router.push("/login");
    } else {
      onBackToLogin();
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
          <h2 className="text-lg font-semibold text-foreground">Account Created Successfully</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account has been created successfully. You can now sign in with your credentials.
          </p>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleGoToLogin} variant="outline">
            Go to Login
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Enter your first name"
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter your last name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="h-10"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="h-10"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  {...field}
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  className="h-10"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  {...field}
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
            {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
