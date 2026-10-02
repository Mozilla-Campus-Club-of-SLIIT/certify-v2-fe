import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";

function TemplateUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fontSize, setFontSize] = useState("");
  const [fontColor, setFontColor] = useState("#161616");
  const [nameXPos, setNameXPos] = useState("");
  const [nameYPos, setNameYPos] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateFor, setTemplateFor] = useState("");
  const [eventName, setEventName] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const resetForm = () => {
    setFile(null);
    setFontSize("");
    setFontColor("#161616");
    setNameXPos("");
    setNameYPos("");
    setTemplateName("");
    setTemplateFor("");
    setEventName("");
    setIssuerName("");
    setNotes("");
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!file || !fontSize || !fontColor || !nameXPos || !nameYPos) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("template", file);
    formData.append("font_size", fontSize);
    formData.append("font_color", fontColor);
    formData.append("name_x_pos", nameXPos);
    formData.append("name_y_pos", nameYPos);
    if (templateName) formData.append("template_name", templateName);
    if (templateFor) formData.append("template_for", templateFor);
    if (eventName) formData.append("event_name", eventName);
    if (issuerName) formData.append("issuer_name", issuerName);
    if (notes) formData.append("notes", notes);

    try {
      setSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_API}/admin/add/template`,
        { method: "POST", body: formData },
      );

      if (!response.ok) {
        setError("Failed to upload template.");
        return;
      }

      setSuccess(true);
      resetForm();
    } catch {
      setError("Something went wrong while uploading the template.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="m-0 font-bold text-moz-black tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
          >
            New Certificate Template
          </h1>
        </div>
        <Link id="back-to-home-link" to="/" className="btn-ghost">
          ← Back
        </Link>
      </div>

      {/* Success banner */}
      {success && (
        <div className="max-w-3xl mx-auto w-full">
          <p className="form-banner form-banner-success">
            <CheckCircle2 size={18} /> Template uploaded successfully.
          </p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="max-w-3xl mx-auto w-full">
          <p className="form-banner form-banner-error">
            <AlertCircle size={18} /> {error}
          </p>
        </div>
      )}

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto w-full bg-white border border-moz-gray-light rounded-2xl p-7 flex flex-col gap-6"
      >
        {/* File upload */}
        <div>
          <label htmlFor="template-file-input" className="form-label">
            Template File{" "}
            <span className="text-moz-orange">*</span>
          </label>
          <label htmlFor="template-file-input" className="dropzone">
            {file ? (
              <FileText size={22} color="var(--color-moz-orange)" />
            ) : (
              <Upload size={22} color="var(--color-moz-gray-mid)" />
            )}
            <div className="min-w-0">
              <p className="m-0 text-[0.85rem] font-semibold text-moz-black overflow-hidden text-ellipsis whitespace-nowrap">
                {file ? file.name : "Click to choose a PDF or image"}
              </p>
              <p className="m-0 text-[0.7rem] text-moz-gray-mid">
                PDF, PNG or JPG
              </p>
            </div>
            <input
              id="template-file-input"
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Required fields grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="font-size-input" className="form-label">
              Font Size <span className="text-moz-orange">*</span>
            </label>
            <input
              id="font-size-input"
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="font-color-input" className="form-label">
              Font Color <span className="text-moz-orange">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="font-color-picker"
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="color-picker"
              />
              <input
                id="font-color-input"
                type="text"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="form-input color-hex"
              />
            </div>
          </div>

          <div>
            <label htmlFor="name-x-pos-input" className="form-label">
              Name X Position <span className="text-moz-orange">*</span>
            </label>
            <input
              id="name-x-pos-input"
              type="number"
              value={nameXPos}
              onChange={(e) => setNameXPos(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="name-y-pos-input" className="form-label">
              Name Y Position <span className="text-moz-orange">*</span>
            </label>
            <input
              id="name-y-pos-input"
              type="number"
              value={nameYPos}
              onChange={(e) => setNameYPos(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Optional metadata */}
        <div>
          <p className="form-section-title">Optional Metadata</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="template-name-input" className="form-label">
                Template Name
              </label>
              <input
                id="template-name-input"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="template-for-input" className="form-label">
                Template For
              </label>
              <input
                id="template-for-input"
                type="text"
                value={templateFor}
                onChange={(e) => setTemplateFor(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="event-name-input" className="form-label">
                Event Name
              </label>
              <input
                id="event-name-input"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="issuer-name-input" className="form-label">
                Issuer Name
              </label>
              <input
                id="issuer-name-input"
                type="text"
                value={issuerName}
                onChange={(e) => setIssuerName(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes-input" className="form-label">
              Notes
            </label>
            <textarea
              id="notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="form-input textarea-input"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          id="submit-template-button"
          type="submit"
          disabled={submitting}
          className={`submit-btn rounded-lg border-none text-[0.9rem] font-bold cursor-pointer font-sans tracking-[0.02em] flex items-center justify-center gap-2 py-[0.7rem] transition-[transform,opacity] duration-150 ${
            submitting
              ? "bg-moz-gray-light text-moz-gray cursor-not-allowed"
              : "text-white"
          }`}
          style={
            !submitting
              ? {
                  background:
                    "linear-gradient(135deg, var(--color-moz-orange) 0%, var(--color-moz-orange-mid) 100%)",
                }
              : undefined
          }
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Uploading…
            </>
          ) : (
            "Upload Template"
          )}
        </button>
      </form>
    </div>
  );
}

export default TemplateUploadPage;
