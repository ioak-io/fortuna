"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { TeamMember, PermissionLevel } from "@/types/team"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-library/ui/avatar"
import { Button } from "@/components/ui-library/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-library/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui-library/ui/alert-dialog"
import { cn } from "@/components/ui-library/utils"

interface TeamMemberItemProps {
  member: TeamMember
  onPermissionChange: (userId: string, permission: PermissionLevel) => Promise<void>
  onRemove: (userId: string) => Promise<void>
  isLoading?: boolean
}

const permissionOptions = [
  { 
    value: 'user', 
    label: 'User',
    description: 'Can view and edit content'
  },
  { 
    value: 'editor', 
    label: 'Editor',
    description: 'Can manage content and settings'
  },
  { 
    value: 'admin', 
    label: 'Admin',
    description: 'Full access to team management'
  },
] as const

export function TeamMemberItem({ 
  member, 
  onPermissionChange, 
  onRemove, 
  isLoading = false 
}: TeamMemberItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handlePermissionChange = async (value: string) => {
    setIsUpdating(true)
    try {
      await onPermissionChange(member.user_id, value as PermissionLevel)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await onRemove(member.user_id)
    } finally {
      setIsRemoving(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const fullName = `${member.first_name} ${member.last_name}`

  return (
    <div className={cn(
      "flex flex-wrap gap-4 items-center justify-between p-4 rounded-lg bg-card border-1",
      isLoading && "opacity-50 pointer-events-none"
    )}>
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src="" alt={fullName} />
          <AvatarFallback className="text-sm font-medium">
            {getInitials(member.first_name, member.last_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{fullName}</p>
          <p className="text-sm text-muted-foreground">{member.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={member.permission_name}
          onValueChange={handlePermissionChange}
          disabled={isUpdating || isLoading}
        >
          <SelectTrigger className="w-40">
            <SelectValue>
              {permissionOptions.find(option => option.value === member.permission_name)?.label || member.permission_name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {permissionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-left">
                <div className="flex flex-col text-left">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isRemoving || isLoading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove team member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <strong>{fullName}</strong> from this team? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
                disabled={isRemoving}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isRemoving ? "Removing..." : "Remove member"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
