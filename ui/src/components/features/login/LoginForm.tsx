"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui-library/ui/input";
import { Button } from "@/components/ui-library/ui/button";
import { Checkbox } from "@/components/ui-library/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-library/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@/schemas/login";
import { signin } from "@/lib/services/login";
import { useAuth } from "@/lib/auth/AuthContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  onForgotPassword: () => void;
  onSwitchToCreate: () => void;
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

const LoginForm = ({ onForgotPassword, onSwitchToCreate }: Props) => {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    try {
      const response = await signin({
        username: values.username,
        password: values.password,
      });

      signIn(response.accessToken, response.claims);
      const next = params.get("next");
      router.replace(next || "/team");
    } catch (error: unknown) {
      if (isApiError(error)) {
        if (error.status === 401) {
          form.setError("root", { message: (error as any).raw?.error?.error_description || "Something went wrong." });
        }
      } else {
        form.setError("root", { message: "Unexpected error" });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormMessage className="text-center">
          {form.formState.errors.root?.message}
        </FormMessage>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input className="h-10" type="text" autoComplete="username" {...field} autoFocus />
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
                <Input className="h-10"
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Remember me</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-sm">
            <Button type="button" variant="link" onClick={onForgotPassword}>
              Forgot your password?
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full h-10" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Sign in
        </Button>

        <div className="text-center text-sm">
          <Button type="button" variant="link" onClick={onSwitchToCreate}>
            Create a new account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
