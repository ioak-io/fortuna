import { Request, Response } from 'express';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Request payloads
 */
export interface ManageTeamsRequestBody {
    clientId: string;
    roles: string[];
    groups: GroupPayload[];
}

export interface GroupPayload {
    name: string;
    roles: string[];
}

export interface DeleteTeamsRequestBody {
    clientId: string;
}

export type ManageUserGroupsRequestBody = string[]; // list of group names

export interface ManageTeamsRequest extends Request<{}, ApiResponse<ManageTeamsResponseBody>, ManageTeamsRequestBody> { }
export interface DeleteTeamsRequest extends Request<{}, ApiResponse<DeleteTeamsResponseBody>, DeleteTeamsRequestBody> { }
export interface ManageUserGroupsRequest extends Request<{}, ApiResponse<ManageUserGroupsResponseBody>, ManageUserGroupsRequestBody> { }

/**
 * Response payloads
 */
export interface ManageTeamsResponseBody {
    data: string;
    createdRoles: string[];
    createdGroups: { name: string; roles: string[] }[];
}

export interface DeleteTeamsResponseBody {
    data: string;
    deletedGroups: string[];
    deletedRoles: string[];
}

export interface ManageUserGroupsResponseBody {
    data: string;
}

export interface ManageTeamsResponse extends Response<ApiResponse<ManageTeamsResponseBody>> { }
export interface DeleteTeamsResponse extends Response<ApiResponse<DeleteTeamsResponseBody>> { }
export interface ManageUserGroupsResponse extends Response<ApiResponse<ManageUserGroupsResponseBody>> { }
