"use client"

import { useState, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import { TeamMember, PermissionLevel } from "@/types/team"
import { Input } from "@/components/ui-library/ui/input"
import { TeamMemberItem } from "./TeamMemberItem"
import { AddMemberDialog } from "./AddMemberDialog"
import { TeamMembersSkeleton } from "@/components/ui/skeleton/TeamMembersSkeleton"
import { cn } from "@/components/ui-library/utils"
import { Card, CardContent } from "@/components/ui-library/ui/card"

interface TeamMembersProps {
  teamId: string
  members: TeamMember[]
  onPermissionChange: (userId: string, permission: PermissionLevel) => Promise<void>
  onRemoveMember: (userId: string) => Promise<void>
  onAddMember: (data: { userId: string; permission: PermissionLevel }) => Promise<void>
  onInviteUser: (data: { email: string; permission: PermissionLevel }) => Promise<void>
  onFetchUsers: () => Promise<{ id: string; email: string; first_name: string; last_name: string }[]>
  isLoading?: boolean
}

export function TeamMembers({
  teamId,
  members,
  onPermissionChange,
  onRemoveMember,
  onAddMember,
  onInviteUser,
  onFetchUsers,
  isLoading = false
}: TeamMembersProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return members
    }

    const query = searchQuery.toLowerCase()
    return members.filter(member =>
      member.first_name.toLowerCase().includes(query) ||
      member.last_name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(query)
    )
  }, [members, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Team members</h1>
          <p className="text-muted-foreground">
            Simplify user roles for secure, seamless access control
          </p>
        </div>
        <AddMemberDialog
          onAddMember={onAddMember}
          onInviteUser={onInviteUser}
          onFetchUsers={onFetchUsers}
          existingMemberIds={members.map(member => member.user_id)}
          isLoading={isLoading}
        />
      </div>
      <Card className="rounded-2xl">
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 mt-4">
            {isLoading ? (
              <TeamMembersSkeleton count={3} />
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchQuery ? (
                    <>
                      <p className="text-lg font-medium">No members found</p>
                      <p className="text-sm">Try adjusting your search terms</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium">No team members yet</p>
                      <p className="text-sm">Add members to get started</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <TeamMemberItem
                    key={member.user_id}
                    member={member}
                    onPermissionChange={onPermissionChange}
                    onRemove={onRemoveMember}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
