import { Link, useLocation } from "react-router-dom";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { displayName } from "../lib/auth";
import { useAuth } from "../lib/useAuth";

const ADMIN_ROUTES = [
  { label: "Issue Certificate", to: "/admin/certificates/new" },
  { label: "Upload Template", to: "/admin/templates/new" },
  { label: "Issue Badge", to: "/admin/badges/new" },
  { label: "Upload Badge Template", to: "/admin/badges/templates/new" },
];

export default function Header() {
  const { user, loading, isAdmin, signOut, promptSignIn } = useAuth();
  const { pathname } = useLocation();
  const onPreview = pathname.startsWith("/certificates/");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    signOut();
  };

  return (
    <header
      id="site-header"
      className="bg-white z-50 sticky top-0 border-b border-[#F3ECE6] shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-[1760px] mx-auto flex items-center justify-between px-3 sm:px-[45px] h-[54px] sm:h-[90px]">
        <Link
          to="/"
          className="flex items-center shrink-0"
          aria-label="SLIIT Mozilla Club home"
        >
          <img
            src="/logo.png"
            alt="SLIIT Mozilla Campus Club"
            className="h-[23px] sm:h-[35px] w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-9 font-['Poppins',system-ui,sans-serif]">
          {onPreview && (
            <Link
              to="/"
              id="header-home-link"
              aria-label="Home"
              className="flex items-center text-[#F47624] transition-opacity hover:opacity-80"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px] sm:w-[34px] sm:h-[34px]" aria-hidden="true">
                <path d="M10.6 3.6a2 2 0 0 1 2.8 0l7 6.3c.4.4.6.9.6 1.5V19a2 2 0 0 1-2 2h-4v-5a2 2 0 0 0-4 0v5H5a2 2 0 0 1-2-2v-7.6c0-.6.2-1.1.6-1.5z" />
              </svg>
            </Link>
          )}

          {!isAdmin && !onPreview && (
            <a
              href="https://sliitmozilla.org"
              target="_blank"
              rel="noopener noreferrer"
              id="header-club-link"
              className="hidden sm:flex items-center gap-1.5 h-[38px] px-6 text-[15px] font-light text-[#8C8C8C] border border-[#B3B3B3] rounded-full no-underline transition-colors hover:text-[#F47624] hover:border-[#F47624]"
            >
              <span>sliitmozilla.org</span>
              <ExternalLink className="w-[14px] h-[14px]" />
            </a>
          )}

          {isAdmin && (
            <div className="relative" ref={menuRef}>
              <button
                id="admin-menu-btn"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={displayName(user)}
                className="flex items-center justify-between w-[135px] sm:w-[192px] h-[27px] px-3 bg-white border border-[#F47624] rounded-[3px] text-[12px] text-[#F47624] cursor-pointer transition-colors hover:bg-[#FFF8F3]"
              >
                <span>Admin</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${menuOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              {menuOpen && (
                <div
                  id="admin-dropdown"
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] w-full bg-white border border-[#E8E8E8] rounded-[3px] shadow-[0_3px_9px_rgba(0,0,0,0.06)] py-2 px-3 z-50"
                >
                  {ADMIN_ROUTES.map((route) => {
                    const active = pathname === route.to;
                    return (
                      <Link
                        key={route.to}
                        to={route.to}
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className={`block py-[3px] text-[12px] no-underline transition-colors hover:text-[#F47624] ${active ? "text-[#F47624]" : "text-[#8C8C8C]"}`}
                      >
                        {route.label}
                      </Link>
                    );
                  })}
                  <div className="border-t border-[#E0E0E0] my-2" />
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="block p-0 text-[12px] text-[#F47624] bg-transparent border-none w-full text-left cursor-pointer transition-opacity hover:opacity-75"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}

          {!user && !loading && !onPreview && (
            <button
              id="login-btn"
              onClick={promptSignIn}
              className="h-[30px] sm:h-[42px] px-4 sm:px-0 sm:w-[129px] bg-[#F47624] border-none rounded-[3px] font-medium text-[14px] sm:text-[17px] text-white cursor-pointer transition-colors hover:bg-[#E36614] whitespace-nowrap"
            >
              Login
            </button>
          )}

          {user && !isAdmin && !onPreview && (
            <button
              onClick={signOut}
              className="h-[30px] sm:h-[42px] px-4 bg-white border border-[#F47624] rounded-[3px] font-medium text-[12px] sm:text-[14px] text-[#F47624] cursor-pointer transition-colors hover:bg-[#FFF8F3] whitespace-nowrap"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
