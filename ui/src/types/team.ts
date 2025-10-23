export interface Team {
    id?: string | null;
    slug: string;
    name: string;
    description: string;
};

export interface TeamMember {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    permission_name: string;
}

export type PermissionLevel = 'user' | 'editor' | 'admin';
