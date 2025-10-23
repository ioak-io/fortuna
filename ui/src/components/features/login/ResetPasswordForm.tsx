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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui-library/ui/dialog";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/schemas/login";
import { resetPassword } from "@/lib/services/login";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const ResetPasswordForm = ({ open, onOpenChange }: Props) => {
  const { accessToken } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    if (!accessToken) {
      form.setError("root", { message: "You must be logged in to change your password" });
      return;
    }

    try {
      await resetPassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        accessToken
      );

      setIsSuccess(true);
      form.reset();
    } catch (error: unknown) {
      if (isApiError(error)) {
        // Check if the error message contains the specific API error
        if (error.message === "Current password is incorrect") {
          form.setError("root", { message: "Current password is incorrect" });
        } else if (error.status === 400) {
          form.setError("root", { message: "Invalid password format" });
        } else {
          form.setError("root", { message: error.message || "Failed to change password" });
        }
      } else {
        form.setError("root", { message: "Unexpected error occurred" });
      }
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    form.reset();
    onOpenChange(false);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Password Changed Successfully</DialogTitle>
            <DialogDescription>
              Your password has been changed successfully. You can now use your new password to sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormMessage className="text-center">
              {form.formState.errors.root?.message}
            </FormMessage>
            
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordForm;
