import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
    AUTH_CHANGED_EVENT,
    AuthError,
    clearToken,
    fetchMe,
    getToken,
    isAdmin as hasAdminRole,
    isTokenExpired,
    login,
    setToken,
    TOKEN_KEY,
    type AuthUser,
} from "../lib/auth";
import { AuthContext, type AuthState } from "../lib/authContext";
import LoginModal from "./LoginModal";

export default function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Guards against a stale /users/me response overwriting a newer one.
    const requestId = useRef(0);

    const verify = useCallback(async () => {
        const id = ++requestId.current;
        const token = getToken();

        if (!token || isTokenExpired(token)) {
            if (token) clearToken(); // re-enters here via AUTH_CHANGED_EVENT, harmlessly
            if (id === requestId.current) {
                setUser(null);
                setLoading(false);
            }
            return;
        }

        if (id === requestId.current) setLoading(true);

        try {
            const me = await fetchMe(token);
            if (id === requestId.current) setUser(me);
        } catch (err) {
            if (err instanceof AuthError && err.unauthorized) {
                clearToken();
                if (id === requestId.current) setUser(null);
            }
            // Network/server faults leave the token in place so a refresh can retry.
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        void verify();

        // Same tab: setToken/clearToken. Other tabs: the storage event.
        const onAuthChanged = () => void verify();
        const onStorage = (e: StorageEvent) => {
            if (e.key === TOKEN_KEY || e.key === null) void verify();
        };

        window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
            window.removeEventListener("storage", onStorage);
        };
    }, [verify]);

    const signIn = useCallback(async (email: string, password: string) => {
        const token = await login(email, password);
        const me = await fetchMe(token); // confirm the token works before trusting it

        if (!hasAdminRole(me)) {
            throw new AuthError(
                "This account does not have access to the Certify admin panel.",
                false,
            );
        }

        setToken(token);
        setUser(me);
        setModalOpen(false);
        return me;
    }, []);

    const signOut = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    const value = useMemo<AuthState>(
        () => ({
            user,
            loading,
            isAdmin: hasAdminRole(user),
            signIn,
            signOut,
            promptSignIn: () => setModalOpen(true),
        }),
        [user, loading, signIn, signOut],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
            {modalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
        </AuthContext.Provider>
    );
}
