import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";

function PreviewPage() {
  const { id } = useParams();
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
          setError("Failed to fetch certificate preview");
          return;
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setCertificateImg(objectUrl);
        setCertificateBlob(blob);
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return;
        }
        setError("Error fetching certificate preview");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
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
    <div className="admin-page">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="m-0 font-bold text-moz-black tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
          >
            Certificate Preview
          </h1>
          <p className="mt-1 text-[0.8rem] text-moz-gray-mid font-mono">
            ID: {certificateId}
          </p>
        </div>

        <div className="flex gap-[0.625rem] flex-wrap">
          {/* Back link */}
          <Link
            id="back-to-home-link"
            to="/"
            className="btn-ghost"
          >
            ← Back
          </Link>

          {/* Download button */}
          <button
            id="download-certificate-button"
            onClick={handleDownload}
            disabled={!certificateBlob}
            className={`py-2 px-5 rounded-lg border-none text-[0.85rem] font-bold font-sans transition-all duration-200 ${certificateBlob
                ? "text-white cursor-pointer"
                : "text-moz-gray bg-moz-gray-light cursor-not-allowed"
              }`}
            style={
              certificateBlob
                ? {
                  background:
                    "linear-gradient(135deg, var(--color-moz-orange) 0%, var(--color-moz-orange-mid) 100%)",
                  boxShadow: "0 2px 10px rgba(255,113,57,0.3)",
                }
                : undefined
            }
          >
            ↓ Download PDF
          </button>
        </div>
      </div>

      {/* Status messages */}
      {loading && (
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-center text-moz-gray-mid text-[0.9rem] p-8">
            <span className="inline-block animate-spin">⟳</span>{" "}
            Loading certificate…
          </p>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto w-full">
          <p
            className="text-center text-[0.9rem] p-6 rounded-xl border"
            style={{
              color: "#c0392b",
              background: "#fdf0ef",
              borderColor: "#f5c6c2",
            }}
          >
            ⚠ {error}
          </p>
        </div>
      )}

      {/* PDF viewer */}
      {certificateImg && !loading && !error && (
        <div
          className="flex-1 max-w-7xl mx-auto w-full min-h-0 rounded-2xl overflow-hidden border border-moz-gray-light bg-white p-2"
          style={{
            boxShadow:
              "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(89,42,203,0.06)",
          }}
        >
          <PDFViewer url={certificateImg} />
        </div>
      )}
    </div>
  );
}

export default PreviewPage;
