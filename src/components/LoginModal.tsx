import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { AuthError } from "../lib/auth";
import { useAuth } from "../lib/useAuth";

interface LoginModalProps {
    onClose: () => void;
    /** Optional line explaining why sign-in was asked for. */
    reason?: string;
}

export default function LoginModal({ onClose, reason }: Readonly<LoginModalProps>) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            // AuthProvider closes the modal once the user is set.
        } catch (err) {
            setError(
                err instanceof AuthError ? err.message : "Something went wrong. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-[rgba(0,0,0,0.45)] backdrop-blur-[2px]"
            onClick={handleBackdrop}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-heading"
                className="bg-white rounded-2xl w-full max-w-sm p-8 relative animate-[fadeInUp_0.18s_ease] shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-moz-gray-mid hover:text-moz-black transition-colors cursor-pointer bg-transparent border-none"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <img
                        src="https://www.sliitmozilla.org/assets/Mozilla-logo.png"
                        alt="Mozilla logo"
                        className="h-8 w-auto mb-3"
                    />
                    <h2
                        id="login-heading"
                        className="text-xl font-extrabold text-moz-black tracking-tight m-0"
                    >
                        Admin Sign In
                    </h2>
                    <p className="text-xs text-moz-gray-mid mt-1">
                        SLIIT Mozilla Club - Certify Portal
                    </p>
                </div>

                {reason && (
                    <p className="text-xs text-moz-gray-dark bg-moz-orange-light border border-[#f6d5c3] rounded-lg px-3 py-2 mb-4 mt-0">
                        {reason}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="login-email" className="text-xs font-semibold text-moz-gray-dark">
                            Email
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@sliit.edu.lk"
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="login-password" className="text-xs font-semibold text-moz-gray-dark">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="text-xs text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c2] rounded-lg px-3 py-2 m-0"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-[0.9rem] transition-all cursor-pointer bg-gradient-to-br from-[var(--color-moz-orange)] to-[var(--color-moz-orange-mid)] border-none ${loading ? "opacity-60 cursor-not-allowed" : "shadow-[0_4px_14px_rgba(255,113,57,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
                            }`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
