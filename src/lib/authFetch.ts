/**
 * authFetch – a thin wrapper around fetch() that attaches the
 * `Authorization: Bearer <token>` header using the JWT obtained from
 * accounts.sliitmozilla.org at sign-in (localStorage key: "certify_token").
 *
 * If the backend rejects the token (401), the token is dropped so the UI
 * falls back to the signed-out state instead of retrying a dead session.
 * See ./auth.ts for storage and the SSO calls.
 *
 * Usage:
 *   import authFetch from "@/lib/authFetch";
 *   const res = await authFetch("/admin/add/badge", { method: "POST", body: ... });
 */

import { clearToken, getToken } from "./auth";

export default async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = getToken();

    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Don't override Content-Type when sending FormData (browser sets it with boundary)
    if (!(options.body instanceof FormData)) {
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 && token) {
        clearToken(); // AuthProvider picks this up and clears the session
    }

    return res;
}
