import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [certificateId, setCertificateId] = useState("");
  const navigate = useNavigate();

  const handleVerifyClick = () => {
    const trimmedId = certificateId.trim();
    if (!trimmedId) return;
    navigate(`/certificates/${encodeURIComponent(trimmedId)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerifyClick();
  };

  return (
    <section
      className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f7f7fa]"
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(89,42,203,0.07) 0%, transparent 65%), #f7f7fa",
      }}
    >
      <div className="w-full max-w-md text-center">
        {/* Heading */}
        <h1
          className="font-extrabold leading-[1.1] tracking-[-0.03em] text-moz-black mb-3"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
        >
          Verify Your{" "}
          <span className="text-moz-orange">Certificate</span>
        </h1>

        {/* Sub-text */}
        <p className="text-sm text-moz-gray-mid mx-auto mb-6 max-w-sm leading-[1.5]">
          Enter the unique certificate ID to instantly verify an official
          credential issued by&nbsp;
          <a
            href="https://sliitmozilla.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-moz-violet font-semibold no-underline"
          >
            SLIIT Mozilla Club
          </a>
          .
        </p>

        {/* Card */}
        <div
          className="bg-white border border-moz-gray-light rounded-2xl p-6"
          style={{
            boxShadow:
              "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(89,42,203,0.06)",
          }}
        >
          <label
            htmlFor="certificate-id-input"
            className="block text-[0.7rem] font-bold text-moz-gray-dark text-left mb-[0.4rem] tracking-[0.05em] uppercase"
          >
            Certificate ID
          </label>

          <input
            id="certificate-id-input"
            type="text"
            placeholder="e.g. A3F8C20B91D4"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-base"
          />

          <button
            id="verify-button"
            onClick={handleVerifyClick}
            className="btn-primary mt-3"
          >
            Verify Certificate →
          </button>
        </div>

        {/* Subtle hint */}
        <p className="mt-4 text-[0.7rem] text-moz-gray-mid">
          Find your certificate ID in the email you received from us.
        </p>
      </div>
    </section>
  );
}

export default HomePage;
