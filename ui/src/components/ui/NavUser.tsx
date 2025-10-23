"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import {
  LogOut,
  Sun,
  Moon,
  Settings,
  Key,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-library/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui-library/ui/dropdown-menu";
import {
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useResolvedTheme } from "../ui-library/hooks/useResolvedTheme";
import ResetPasswordForm from "@/components/features/login/ResetPasswordForm";

export function NavUser() {
  const { claims, signOut } = useAuth();
  const { setTheme } = useTheme();
  const resolvedTheme = useResolvedTheme();
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className="flex justify-end h-10 p-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-muted">JD</AvatarFallback>
            </Avatar>
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          align="end"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 p-2 text-left text-sm">
              <Avatar className="h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{claims?.name}</span>
                <span className="truncate text-xs">{claims?.username}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              {resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsResetPasswordOpen(true)}>
              <Key /> Reset password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { }}>
              <Settings /> Account settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>

        </DropdownMenuContent>
      </DropdownMenu>
      
      <ResetPasswordForm 
        open={isResetPasswordOpen} 
        onOpenChange={setIsResetPasswordOpen} 
      />
    </>
  );
}
