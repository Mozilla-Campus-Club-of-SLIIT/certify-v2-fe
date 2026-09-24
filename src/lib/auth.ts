/**
 * auth – token storage and the accounts.sliitmozilla.org SSO calls.
 *
 * The backend never issues tokens of its own: it validates the Bearer token
 * against the accounts API (`GET /users/me`) and requires the `certify-admin`
 * role. So the frontend logs in against that same API and keeps the JWT it
 * returns in localStorage under `certify_token`.
 */

const RAW_ACCOUNTS_API =
    import.meta.env.VITE_PUBLIC_ACCOUNTS_API || "https://accounts.sliitmozilla.org/api";

/** The env var historically pointed at `.../api/login`; accept either form. */
export const ACCOUNTS_API = RAW_ACCOUNTS_API.replace(/\/+$/, "").replace(/\/login$/, "");

export const TOKEN_KEY = "certify_token";

/** Role the backend requires on every `/api/admin/*` route. */
export const ADMIN_ROLE = "certify-admin";

/** Fired whenever the stored token changes, so open components can re-read it. */
export const AUTH_CHANGED_EVENT = "certify-auth-changed";

export interface AuthUser {
    id?: string;
    email?: string;
    name?: string;
    roles: string[];
}

export class AuthError extends Error {
    /** true when the credentials/token were rejected, false for network or server faults. */
    readonly unauthorized: boolean;

    constructor(message: string, unauthorized: boolean) {
        super(message);
        this.name = "AuthError";
        this.unauthorized = unauthorized;
    }
}

export function getToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function setToken(token: string) {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* storage unavailable (private mode) – the session just won't persist */
    }
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearToken() {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {
        /* nothing to clear */
    }
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

/**
 * Reads the `exp` claim without verifying the signature – only the accounts
 * API can do that. This is a cheap client-side guard so we don't send a token
 * we already know is stale; `/users/me` remains the source of truth.
 */
export function isTokenExpired(token: string): boolean {
    try {
        const payload = token.split(".")[1];
        if (!payload) return true;

        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        const exp = JSON.parse(json)?.exp;
        if (typeof exp !== "number") return false; // no expiry claim – let the server decide

        return Date.now() >= exp * 1000;
    } catch {
        return true; // unparseable token is no token
    }
}

function messageFrom(data: unknown, fallback: string): string {
    const body = data as
        | { error?: { message?: unknown }; message?: unknown }
        | undefined;
    const raw = body?.error?.message ?? body?.message;

    if (Array.isArray(raw)) {
        const first = raw[0] as { reason?: string } | string | undefined;
        if (typeof first === "string") return first;
        if (first?.reason) return first.reason;
    }
    if (typeof raw === "string") return raw;

    return fallback;
}

/**
 * Exchanges credentials for a JWT. Does not store it – the caller decides.
 *
 * Note: no `credentials: "include"` here. The accounts API replies with
 * `Access-Control-Allow-Origin: *` and no `Allow-Credentials`, so a credentialed
 * request is blocked by the browser before we ever see the response. The
 * refreshToken cookie it sets is SameSite=Lax and cross-site to us anyway.
 */
export async function login(email: string, password: string): Promise<string> {
    let res: Response;
    try {
        res = await fetch(`${ACCOUNTS_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
        });
    } catch {
        throw new AuthError("Could not reach the auth server. Please try again.", false);
    }

    let data: unknown = null;
    try {
        data = await res.json();
    } catch {
        /* keep data null and fall through to the status checks */
    }

    if (!res.ok) {
        throw new AuthError(
            messageFrom(data, "Invalid email or password."),
            res.status === 400 || res.status === 401,
        );
    }

    const token = (data as { data?: { token?: unknown } })?.data?.token;
    if (typeof token !== "string" || !token) {
        throw new AuthError("Auth server returned no token.", false);
    }

    return token;
}

/** Resolves the current user for a token, or throws an AuthError. */
export async function fetchMe(token: string): Promise<AuthUser> {
    let res: Response;
    try {
        res = await fetch(`${ACCOUNTS_API}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        throw new AuthError("Could not reach the auth server.", false);
    }

    if (res.status === 401 || res.status === 400) {
        throw new AuthError("Your session has expired. Please sign in again.", true);
    }
    if (!res.ok) {
        throw new AuthError("Auth server error.", false);
    }

    const body = (await res.json()) as { data?: Partial<AuthUser> };
    const user = body?.data ?? {};

    return { ...user, roles: Array.isArray(user.roles) ? user.roles : [] };
}

export function isAdmin(user: AuthUser | null): boolean {
    return !!user?.roles.includes(ADMIN_ROLE);
}

export function displayName(user: AuthUser | null): string {
    if (!user) return "";
    return user.name || user.email || "Admin";
}
