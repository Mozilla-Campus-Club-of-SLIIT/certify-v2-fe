import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function Header() {
  return (
    <header
      id="site-header"
      className="bg-white border-b border-moz-gray-light shadow-xs z-50 sticky top-0"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-4">
        {/* Brand / Logo */}
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
          <span className="hidden sm:inline-block text-[0.7rem] font-semibold text-moz-orange-mid uppercase tracking-wider">
            Certificate Portal
          </span>
        </Link>

        {/* External Link - Hidden on small screens (<640px), visible on sm+ */}
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
      </div>
    </header>
  );
}

