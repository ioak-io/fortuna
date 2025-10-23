export function decodeJwt<T>(token: string): T | null {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join("")
        );
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

export function isExpired(exp?: number, skewSeconds = 30): boolean {
    if (!exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= exp - skewSeconds;
}