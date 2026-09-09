"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const isAdminArea = pathname?.startsWith("/admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <header
      id="site-header"
      className="bg-white border-b border-moz-gray-light shadow-xs z-50 sticky top-0"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 no-underline"
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

        {/* Right side: Admin Dropdown or External Link */}
        {isAdminArea ? (
          <div className="relative" ref={dropdownRef}>
            <button
              id="admin-dropdown-button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center justify-between gap-2 w-[130px] px-3 py-1.5 text-sm font-medium text-[var(--color-moz-orange)] bg-white border border-[var(--color-moz-orange)] rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span>Admin</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-moz-gray-light rounded-xl shadow-lg py-1 z-50">
                <Link
                  id="admin-issue-certificate-link"
                  href="/admin/certificates/new"
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-moz-gray-dark hover:bg-gray-50 hover:text-moz-orange transition-colors no-underline"
                >
                  Issue Certificate
                </Link>
                <Link
                  id="admin-upload-template-link"
                  href="/admin/templates/new"
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-moz-gray-dark hover:bg-gray-50 hover:text-moz-orange transition-colors no-underline"
                >
                  Upload Template
                </Link>
              </div>
            )}
          </div>
        ) : (
          <a
            href="https://sliitmozilla.org"
            target="_blank"
            rel="noopener noreferrer"
            id="header-club-link"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-moz-gray-mid border border-moz-gray-light rounded-full transition hover:text-moz-orange hover:border-moz-orange shrink-0 no-underline"
          >
            <span>sliitmozilla.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </header>
  );
}
