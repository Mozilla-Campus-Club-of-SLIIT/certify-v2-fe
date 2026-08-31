import { Link, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function Header() {
  const location = useLocation();

  return (
    <header
      id="site-header"
      className="bg-white border-b border-moz-gray-light shadow-xs z-50 sticky top-0"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-4">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0"
          aria-label="SLIIT Mozilla Club home"
        >
          <img
            src="https://www.sliitmozilla.org/assets/Mozilla-logo.png"
            alt="Mozilla logo"
            className="h-6 sm:h-8 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-3">
          {location.pathname === "/" ? (
            <>
              <a
                href="https://sliitmozilla.org"
                target="_blank"
                rel="noopener noreferrer"
                id="header-club-link"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-moz-gray-mid border border-moz-gray-light rounded-full transition hover:text-moz-orange hover:border-moz-orange shrink-0"
              >
                <span>sliitmozilla.org</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/login"
                id="header-login-btn"
                className="rounded-md bg-moz-orange px-6 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:bg-moz-orange-dark hover:shadow-lg active:scale-95 shrink-0"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              to="/"
              className="text-moz-orange transition hover:text-moz-orange-dark active:scale-95"
              aria-label="Go to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

