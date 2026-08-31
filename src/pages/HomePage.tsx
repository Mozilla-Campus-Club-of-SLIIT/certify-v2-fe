"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [certificateId, setCertificateId] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (certificateId.trim()) {
      navigate(`/preview/${certificateId.trim()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-moz-white to-white px-4 py-16 sm:py-24">
      <h1 className="text-center font-poppins text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="text-moz-orange">Your Achievements.</span>
        <br />
        <span className="text-moz-black">Officially Certified.</span>
      </h1>

      <p className="mt-4 text-center text-base font-medium text-moz-gray sm:mt-6 sm:text-lg">
        Get your certificates in one place.
      </p>

      <div className="mt-8 w-full max-w-md sm:mt-10">
        <input
          id="certificate-id-input"
          type="text"
          placeholder="Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-moz-gray-light bg-white px-5 py-3.5 text-sm text-moz-black placeholder-gray-400 shadow-sm outline-none transition-all focus:border-moz-orange focus:ring-2 focus:ring-moz-orange/30 sm:text-base"
        />
      </div>

      <div className="relative mt-5 inline-block sm:mt-6">
        <button
          id="verify-certificate-btn"
          type="button"
          onClick={handleVerify}
          className="relative z-10 cursor-pointer rounded-md bg-moz-orange px-10 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-moz-orange-dark hover:shadow-lg active:scale-95 sm:px-12 sm:py-4 sm:text-base"
        >
          Verify Your Certificate
        </button>
      </div>
    </section>
  );
}
