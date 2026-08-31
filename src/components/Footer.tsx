import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="bg-white border-t border-moz-gray-light py-4 px-4 sm:px-6 mt-auto z-50"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-xs text-moz-gray-mid font-medium">
          © {new Date().getFullYear()} SLIIT Mozilla Club · Certify Platform
        </p>

        <nav aria-label="SLIIT Mozilla Club social links">
          <ul className="flex items-center gap-4 p-0 m-0 list-none">
            {[
              {
                id: "footer-github",
                href: "https://github.com/Mozilla-Campus-Club-of-SLIIT",
                label: "GitHub",
                Icon: FaGithub,
              },
              {
                id: "footer-instagram",
                href: "https://www.instagram.com/sliitmozilla",
                label: "Instagram",
                Icon: FaInstagram,
              },
              {
                id: "footer-linkedin",
                href: "https://www.linkedin.com/company/sliitmozilla",
                label: "LinkedIn",
                Icon: FaLinkedin,
              },
            ].map(({ id, href, label, Icon }) => (
              <li key={id}>
                <a
                  id={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`SLIIT Mozilla Club on ${label}`}
                  className="text-moz-gray-mid hover:text-moz-orange transition-colors flex items-center"
                >
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

