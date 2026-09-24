import { createContext } from "react";
import type { AuthUser } from "./auth";

export interface AuthState {
    /** Verified user for the stored token, or null when signed out. */
    user: AuthUser | null;
    /** True while the stored token is being verified against `/users/me`. */
    loading: boolean;
    /** True when the user holds the `certify-admin` role the backend requires. */
    isAdmin: boolean;
    /** Signs in and verifies the role; throws an AuthError on failure. */
    signIn: (email: string, password: string) => Promise<AuthUser>;
    signOut: () => void;
    /** Opens the sign-in modal from anywhere in the tree. */
    promptSignIn: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);
