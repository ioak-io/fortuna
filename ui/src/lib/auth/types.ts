export type Claims = Record<string, unknown> & {
    username: string;
    family_name: string;
    given_name: string;
    name: string;
    nickname: string;
    permissions: {
        COMPANY_ADMIN: string[];
    }
    exp?: number;
    iat?: number;
};

export type AuthState = {
    accessToken: string | null;
    claims: Claims | null;
};