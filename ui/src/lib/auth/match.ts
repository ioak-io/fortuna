function globToRegExp(glob: string): RegExp {
    // Escape regex special chars except * and **
    const pattern = glob
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*/g, "__DOUBLE_STAR__")
        .replace(/\*/g, "[^/]*")
        .replace(/__DOUBLE_STAR__/g, ".*");
    return new RegExp(`^${pattern}$`);
}

export type MatchConfig = {
    include: string[]; // e.g. ["/v1/**", "https://api.example.com/**"]
    exclude?: string[];
};

export function shouldAttachAuth(url: string, cfg: MatchConfig): boolean {
    const path = (() => {
        try {
            const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
            return u.pathname;
        } catch {
            return url;
        }
    })();

    const inc = cfg.include.map(globToRegExp);
    const exc = (cfg.exclude || []).map(globToRegExp);

    const matched = inc.some((re) => re.test(path));
    const excluded = exc.some((re) => re.test(path));
    return matched && !excluded;
}