import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const [certId, setCertId] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const t = certId.trim();
    if (!t) return;
    navigate(`/certificates/${encodeURIComponent(t)}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] px-3 py-12 sm:py-18 font-['Poppins',system-ui,sans-serif]">
      <h1 className="m-0 text-center font-semibold text-[clamp(30px,5.4vw,84px)] leading-[1.12] tracking-[-0.01em]">
        <span className="block text-[#F06A1D]">Your Achievements.</span>
        <span className="block text-[#0B0B14]">Officially Certified.</span>
      </h1>

      <p className="m-0 mt-6 sm:mt-9 text-center font-light text-[clamp(14px,1.725vw,27px)] text-[#6D6D6D]">
        Get your certificates in one place.
      </p>

      <form
        onSubmit={handleVerify}
        className="w-full flex flex-col items-center mt-9 sm:mt-[75px]"
      >
        <label htmlFor="credential-id-input" className="sr-only">
          Certificate ID
        </label>
        <input
          id="credential-id-input"
          type="text"
          placeholder="Certificate ID"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          className="w-full max-w-[578px] h-[42px] sm:h-[50px] px-6 rounded-[4px] border border-[#C4C4C4] bg-white text-[#1E1E1E] text-[14px] sm:text-[16px] font-light outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#F47624] focus:shadow-[0_0_0_3px_rgba(244,118,36,0.12)] placeholder:text-[#B3B3B3]"
        />

        <button
          id="verify-credential-button"
          type="submit"
          className="mt-7.5 sm:mt-[39px] h-[42px] sm:h-[51px] px-7.5 sm:px-[34px] rounded-[3px] border-none bg-[#F47624] text-white text-[15px] sm:text-[21px] font-medium cursor-pointer transition-colors hover:bg-[#E36614]"
        >
          Verify Your Certificate
        </button>
      </form>

      <Link
        to="/badges/verify"
        className="mt-4.5 text-[12px] text-[#8C8C8C] no-underline transition-colors hover:text-[#F47624]"
      >
        Have a badge ID? Verify a badge
      </Link>
    </div>
  );
}
