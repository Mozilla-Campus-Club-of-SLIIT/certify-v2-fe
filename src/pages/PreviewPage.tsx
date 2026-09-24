import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PDFViewer from "../components/PDFViewer";

function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateId = id || "Not provided";
  const [certificateBlob, setCertificateBlob] = useState<Blob>();
  const [certificateImg, setCertificateImg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";

    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_BACKEND_API}/certificate/${encodeURIComponent(certificateId)}/preview`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setError("Certificate not found. Please check the ID and try again.");
          return;
        }

        const rawBlob = await response.blob();
        const blob = new Blob([rawBlob], { type: "application/pdf" });
        objectUrl = URL.createObjectURL(blob);
        setCertificateImg(objectUrl);
        setCertificateBlob(blob);
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return;
        }
        setError(
          `Error fetching certificate: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [certificateId]);

  const handleDownload = () => {
    if (!certificateBlob) return;
    const fileUrl = URL.createObjectURL(certificateBlob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `certificate-${certificateId}.pdf`;
    link.click();
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <section className="flex-1 bg-[#FAFAFA] flex flex-col items-center px-3 pt-7.5 sm:pt-[52px] pb-9 sm:pb-[48px] font-['Poppins',system-ui,sans-serif]">
      <h1 className="m-0 font-semibold text-[24px] sm:text-[45px] leading-[1.2] text-black text-center">
        Certificate Preview
      </h1>

      <div className="w-full max-w-[675px] mt-6 sm:mt-[52px] flex flex-col items-center">
        {loading && (
          <div className="flex items-center gap-2.25 py-12 text-[#6D6D6D] text-[14px]">
            <Loader2 className="w-3.75 h-3.75 animate-spin text-[#F47624]" />
            Loading certificate…
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center gap-4.5 py-7.5 text-center">
            <p className="m-0 py-3 px-4.5 bg-[#FDF0EF] text-[#C0392B] rounded-[4px] border border-[#F5C6C2] text-[12px]">
              {error}
            </p>
            <button
              onClick={() => navigate("/")}
              className="h-[36px] px-6 rounded-[3px] border-none bg-[#F47624] text-white text-[14px] font-medium cursor-pointer transition-colors hover:bg-[#E36614]"
            >
              Try another ID
            </button>
          </div>
        )}

        {certificateImg && !loading && !error && (
          <>
            <div className="w-full h-[min(46.5vw,450px)] min-h-[165px]">
              <PDFViewer url={certificateImg} />
            </div>

            <button
              id="download-certificate-button"
              onClick={handleDownload}
              className="mt-7.5 sm:mt-[63px] w-full max-w-[315px] h-[42px] sm:h-[51px] rounded-[3px] border-none bg-[#F47624] text-white text-[15px] sm:text-[21px] font-medium cursor-pointer transition-colors hover:bg-[#E36614] active:scale-[0.99]"
            >
              Download as PDF
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default PreviewPage;
