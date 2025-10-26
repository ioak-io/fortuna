export type Category = {
    id: number;
    team_id: string;
    name: string;
    description: string | null;
    icon: string;
    color: string;
    created_by?: string | null;
    created_at: string;
    updated_at: string;
};

export type CreateCategoryPayload = {
    name: string;
    description?: string | null;
    icon: string;
    color: string;
    team_id: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;


