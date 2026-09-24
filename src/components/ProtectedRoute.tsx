import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { ADMIN_ROLE } from "../lib/auth";
import { useAuth } from "../lib/useAuth";

/**
 * Layout route that gates the admin pages. The backend rejects these calls
 * anyway; this stops the UI from rendering a form that can only 401.
 */
export default function ProtectedRoute() {
    const { user, loading, isAdmin, promptSignIn } = useAuth();

    if (loading) {
        return (
            <Gate
                icon={<Loader2 className="w-7 h-7 animate-spin text-moz-orange" />}
                title="Checking your session…"
                message="One moment while we verify your access."
            />
        );
    }

    if (!user) {
        return (
            <Gate
                icon={<Lock className="w-7 h-7 text-moz-orange" />}
                title="Sign in required"
                message="This page is for Certify admins. Sign in with your SLIIT Mozilla account to continue."
                action={
                    <button
                        onClick={promptSignIn}
                        className="px-5 py-2.5 bg-moz-orange border-none rounded-lg font-bold text-[0.875rem] text-white cursor-pointer shadow-[0_4px_14px_rgba(244,118,36,0.3)] transition-[background,transform] duration-[0.18s] hover:bg-[#d96810] hover:-translate-y-[1px]"
                    >
                        Sign In
                    </button>
                }
            />
        );
    }

    if (!isAdmin) {
        return (
            <Gate
                icon={<ShieldAlert className="w-7 h-7 text-[#c0392b]" />}
                title="You don't have access"
                message={`You're signed in, but this account is missing the "${ADMIN_ROLE}" role. Ask a club admin to grant it.`}
                action={
                    <Link
                        to="/"
                        className="px-5 py-2.5 bg-moz-orange rounded-lg font-bold text-[0.875rem] text-white no-underline shadow-[0_4px_14px_rgba(244,118,36,0.3)] transition-[background,transform] duration-[0.18s] hover:bg-[#d96810] hover:-translate-y-[1px]"
                    >
                        Back to Home
                    </Link>
                }
            />
        );
    }

    return <Outlet />;
}

function Gate({
    icon,
    title,
    message,
    action,
}: Readonly<{
    icon: React.ReactNode;
    title: string;
    message: string;
    action?: React.ReactNode;
}>) {
    return (
        <div className="flex-1 flex items-center justify-center px-4 py-16">
            <div className="flex flex-col items-center text-center max-w-sm gap-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-moz-orange-light">
                    {icon}
                </div>
                <h1 className="text-xl font-extrabold text-moz-black tracking-tight m-0">{title}</h1>
                <p className="text-sm text-moz-gray-mid m-0">{message}</p>
                {action && <div className="mt-2">{action}</div>}
            </div>
        </div>
    );
}
