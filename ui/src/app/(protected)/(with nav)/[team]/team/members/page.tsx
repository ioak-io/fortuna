"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TeamMembers } from "@/components/features/team"
import { TeamMember, PermissionLevel } from "@/types/team"
import { TeamService } from "@/lib/services/team"
import { useHttp } from "@/lib/shared/http"

export default function TeamMembersPage() {
  const { team } = useParams() as { team: string }
  const { fetch } = useHttp()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const teamService = TeamService(fetch)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const membersData = await teamService.getMembers(team)
        setMembers(membersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team members')
        console.error('Error loading team members:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (team) {
      loadMembers()
    }
  }, [team, fetch])

  const handlePermissionChange = async (userId: string, permission: PermissionLevel) => {
    try {
      await teamService.updateMemberPermission(team, userId, [permission])
      
      setMembers(prev => prev.map(member => 
        member.user_id === userId 
          ? { ...member, permission_name: permission }
          : member
      ))
    } catch (err) {
      console.error('Error updating member permission:', err)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      const member = members.find(m => m.user_id === userId)
      if (!member) return

      await teamService.removeMember(team, userId, [member.permission_name as PermissionLevel])
      
      // Update local state
      setMembers(prev => prev.filter(member => member.user_id !== userId))
    } catch (err) {
      console.error('Error removing member:', err)
      // You might want to show a toast notification here
    }
  }

  const handleFetchUsers = async () => {
    try {
      return await teamService.fetchUsers()
    } catch (err) {
      console.error('Error fetching users:', err)
      throw err
    }
  }

  const handleAddMember = async (data: { userId: string; permission: PermissionLevel }) => {
    try {
      await teamService.addMember(team, data.userId, data.permission)
      
      // Fetch the updated members list to get the complete member data
      const updatedMembers = await teamService.getMembers(team)
      setMembers(updatedMembers)
    } catch (err) {
      console.error('Error adding member:', err)
      throw err
    }
  }

  const handleInviteUser = async (data: { email: string; permission: PermissionLevel }) => {
    try {
      await teamService.inviteUser(team, data.email, data.permission)
      
      // Note: Invited users won't appear in the members list until they accept the invitation
      // You might want to show a success message here
    } catch (err) {
      console.error('Error inviting user:', err)
      throw err
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
      <TeamMembers
        teamId={team}
        members={members}
        onPermissionChange={handlePermissionChange}
        onRemoveMember={handleRemoveMember}
        onAddMember={handleAddMember}
        onInviteUser={handleInviteUser}
        onFetchUsers={handleFetchUsers}
        isLoading={isLoading}
      />
  )
}
