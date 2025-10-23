"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, User, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui-library/ui/button";
import { Input } from "@/components/ui-library/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui-library/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui-library/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-library/ui/select";
import { PermissionLevel } from "@/types/team";
import { cn } from "@/components/ui-library/utils";

// Email validation utility
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

const addMemberSchema = z.object({
    selectedUsers: z.array(z.object({
        type: z.enum(["existing", "new"]),
        id: z.string().optional(),
        email: z.string().optional(),
    })),
    permission: z.enum(["user", "editor", "admin"] as const),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface AddMemberDialogProps {
    onAddMember: (data: { userId: string; permission: PermissionLevel }) => Promise<void>;
    onInviteUser: (data: { email: string; permission: PermissionLevel }) => Promise<void>;
    onFetchUsers: () => Promise<User[]>;
    existingMemberIds: string[];
    isLoading?: boolean;
}

export function AddMemberDialog({
    onAddMember,
    onInviteUser,
    onFetchUsers,
    existingMemberIds,
    isLoading = false
}: AddMemberDialogProps) {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const form = useForm<AddMemberFormData>({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            selectedUsers: [],
            permission: "user",
        },
    });

    // Fetch users when dialog opens
    useEffect(() => {
        if (open) {
            setUsersLoading(true);
            onFetchUsers()
                .then(setUsers)
                .catch(console.error)
                .finally(() => setUsersLoading(false));
        }
    }, [open, onFetchUsers]);

    // Filter users based on search query and exclude existing members
    const filteredUsers = useMemo(() => {
        const filtered = users.filter(user => {
            const isNotExistingMember = !existingMemberIds.includes(user.id);
            const matchesSearch = !searchQuery.trim() ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());

            return isNotExistingMember && matchesSearch;
        });

        const isNewUserEmail = searchQuery.trim() &&
            isValidEmail(searchQuery.trim()) &&
            !users.some(user => user.email.toLowerCase() === searchQuery.trim().toLowerCase());

        return {
            existingUsers: filtered,
            showNewUserOption: isNewUserEmail
        };
    }, [users, searchQuery, existingMemberIds]);

    const selectedUsers = form.watch("selectedUsers") || [];

    const isUserSelected = (userId: string) => {
        return selectedUsers.some(user => user.type === "existing" && user.id === userId);
    };

    const isEmailSelected = (email: string) => {
        return selectedUsers.some(user => user.type === "new" && user.email === email);
    };

    const getButtonText = () => {
        if (isClosing) {
            const currentSelections = form.getValues("selectedUsers") || [];
            if (currentSelections.length === 0) return "Add member";
            if (currentSelections.length === 1) {
                return currentSelections[0].type === "new" ? "Send invitation" : "Add member";
            }
            return `Add ${currentSelections.length} members`;
        }

        if (selectedUsers.length === 0) return "Add member";
        if (selectedUsers.length === 1) {
            return selectedUsers[0].type === "new" ? "Send invitation" : "Add member";
        }
        return `Add ${selectedUsers.length} members`;
    };

    const onSubmit = async (data: AddMemberFormData) => {
        try {
            setIsSubmitting(true);

            // Process all selected users
            for (const selectedUser of data.selectedUsers) {
                if (selectedUser.type === "existing" && selectedUser.id) {
                    // Adding existing user
                    await onAddMember({ userId: selectedUser.id, permission: data.permission });
                } else if (selectedUser.type === "new" && selectedUser.email) {
                    // Inviting new user
                    await onInviteUser({ email: selectedUser.email, permission: data.permission });
                }
            }

            // Only close dialog and reset form on success
            handleOpenChange(false);
        } catch (error) {
            // Error handling is done in the parent component
            console.error("Failed to add/invite members:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setIsClosing(true);
            setTimeout(() => {
                form.reset();
                setSearchQuery("");
                setIsSubmitting(false);
                setIsClosing(false);
            }, 200);
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="size-4" />
                    Add member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add team members</DialogTitle>
                    <DialogDescription>
                        Search and select multiple users to add to your team.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="selectedUsers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="space-y-2">
                                            {usersLoading ? (
                                                <div className="text-sm text-muted-foreground text-center py-4">
                                                    Loading users...
                                                </div>
                                            ) : filteredUsers.existingUsers.length === 0 && !filteredUsers.showNewUserOption ? (
                                                <div className="text-sm text-muted-foreground text-center py-4">
                                                    {searchQuery ? "No users found matching your search" : "No available users to add"}
                                                </div>
                                            ) : (
                                                <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
                                                    {/* New user invitation option */}
                                                    {filteredUsers.showNewUserOption && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const currentSelected = field.value || [];
                                                                const emailToToggle = searchQuery.trim();
                                                                const isCurrentlySelected = isEmailSelected(emailToToggle);

                                                                if (isCurrentlySelected) {
                                                                    // Remove from selection
                                                                    field.onChange(currentSelected.filter(user => !(user.type === "new" && user.email === emailToToggle)));
                                                                } else {
                                                                    // Add to selection
                                                                    field.onChange([...currentSelected, { type: "new" as const, email: emailToToggle }]);
                                                                }
                                                            }}
                                                            className="w-full text-left p-3 hover:bg-accent/50 transition-colors border-l-4 border-l-blue-500"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <Plus className="size-4 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-blue-700">
                                                                        Invite {searchQuery.trim()}
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        This will be a new user who can be invited to the app
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-center size-5">
                                                                    {isEmailSelected(searchQuery.trim()) ? (
                                                                        <div className="size-4 rounded-sm bg-primary flex items-center justify-center">
                                                                            <Check className="size-3 text-primary-foreground" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="size-4 rounded-sm border-2 border-muted-foreground/30" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )}

                                                    {/* Existing users */}
                                                    {filteredUsers.existingUsers.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            type="button"
                                                            onClick={() => {
                                                                const currentSelected = field.value || [];
                                                                const isCurrentlySelected = isUserSelected(user.id);

                                                                if (isCurrentlySelected) {
                                                                    // Remove from selection
                                                                    field.onChange(currentSelected.filter(selectedUser => !(selectedUser.type === "existing" && selectedUser.id === user.id)));
                                                                } else {
                                                                    // Add to selection
                                                                    field.onChange([...currentSelected, { type: "existing" as const, id: user.id }]);
                                                                }
                                                            }}
                                                            className="w-full text-left p-3 hover:bg-accent/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                                                    <User className="size-4 text-muted-foreground" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-medium">
                                                                        {user.first_name} {user.last_name}
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {user.email}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-center size-5">
                                                                    {isUserSelected(user.id) ? (
                                                                        <div className="size-4 rounded-sm bg-primary flex items-center justify-center">
                                                                            <Check className="size-3 text-primary-foreground" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="size-4 rounded-sm border-2 border-muted-foreground/30" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between gap-3 pt-4">
                            <FormField
                                control={form.control}
                                name="permission"
                                render={({ field }) => (
                                    <FormItem className="flex-1 max-w-xs">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select permission level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                    disabled={isLoading || isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || isSubmitting || selectedUsers.length === 0}
                                >
                                    {(isLoading || isSubmitting) && selectedUsers.length > 0 ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {getButtonText()}
                                        </>
                                    ) : getButtonText()}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
