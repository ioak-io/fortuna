export interface RealmAccess {
    roles: string[];
}

export interface ResourceAccessEntry {
    roles: string[];
}

export interface ResourceAccess {
    [resource: string]: ResourceAccessEntry;
}

export interface JwtClaims {
    exp: number; // expiration (epoch)
    iat: number; // issued at (epoch)
    jti: string; // unique token id
    iss: string; // issuer
    aud: string | string[]; // audience
    sub: string; // subject (user id)
    typ?: string; // token type (Bearer)
    azp?: string; // authorized party (client id)
    sid?: string; // session id
    acr?: string; // authentication context class
    "allowed-origins"?: string[];
    realm_access?: RealmAccess;
    resource_access?: ResourceAccess;
    scope?: string;
    email_verified?: boolean;
    name?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
}
