export interface Fragment {
    name: string;
    content?: string;
    summary?: string;
    labels?: unknown;
    id: string;
    reference: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface FragmentVersion {
    fragmentReference: string;
    content: string;
    versionTag?: string;
    userNote?: string;
    id: string;
    reference: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface FragmentLabel {
    name: string;
    id: string;
    reference: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface FragmentInsight {
    fragmentReference: string;
    fragmentVersion: string;
    mode: "expand" | "interpret" | "contrast" | "prompts";
    userInput?: string;
    response?: string;
    id: string;
    reference: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface FragmentInsightVersion {
    fragmentInsightReference: string;
    fragmentVersionReference: string;
    versionTag?: string;
    userInput?: string;
    response?: string;
    id: string;
    reference: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface Unit {
    id: string;
    team_id: string;
    title: string;
    slug: string;
    description?: string;
    metadata?: Record<string, unknown>;
    visibility: 'public' | 'private' | 'draft';
    created_at: string;
    updated_at: string;
}

export interface CreateUnitPayload {
    title: string;
    slug: string;
    description?: string;
    metadata?: Record<string, unknown>;
    visibility: 'public' | 'private' | 'draft';
}

export interface UpdateUnitPayload extends Partial<CreateUnitPayload> {
    id: string;
}

export interface Chapter {
    id: string;
    team_id: string;
    title: string;
    slug: string;
    description?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface CreateChapterPayload {
    title: string;
    slug: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

export interface UpdateChapterPayload extends Partial<CreateChapterPayload> {
    id: string;
}

export interface Course {
    id: string;
    team_id: string;
    title: string;
    slug: string;
    description?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface CreateCoursePayload {
    title: string;
    slug: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
    id: string;
}

export interface CourseChapter {
    id: number;
    team_id: string;
    course_id: number;
    chapter_id: number;
    ordering: number;
    created_at: string;
}

export interface CreateCourseChapterPayload {
    team_id: string;
    course_id: number;
    chapter_id: number;
    ordering?: number;
}

export interface UpdateCourseChapterPayload {
    id: number;
    ordering?: number;
}
