import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import authFetch from "../../lib/authFetch";

function Field({
  label,
  required,
  children,
}: Readonly<{ label: string; required?: boolean; children: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-['Poppins',system-ui,sans-serif] font-medium text-[12px] tracking-[0.02em] text-[#1E1E1E]">
        {label}
        {required && <span className="text-[#E53935]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputTailwind =
  "w-full h-[34px] bg-[#F5F5F5] rounded-[6px] border-none px-3 font-['Poppins',system-ui,sans-serif] text-[12px] outline-none text-[#1E1E1E] placeholder:text-[#A6A6A6] focus:ring-2 focus:ring-[#F47624] transition-all";

export default function BadgeTemplateUploadPage() {
  const [file, setFile] = useState<File | null>(null);
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

    if (!file || !templateName.trim() || !issuerName.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("template", file);
    formData.append("template_name", templateName.trim());
    formData.append("issuer_name", issuerName.trim());
    if (templateFor) formData.append("template_for", templateFor);
    if (eventName) formData.append("event_name", eventName);
    if (notes) formData.append("notes", notes);

    try {
      setSubmitting(true);
      const response = await authFetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_API}/admin/add/badge-template`,
        { method: "POST", body: formData },
      );

      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as {
          detail?: string;
        };
        setError(
          typeof err.detail === "string"
            ? err.detail
            : "Failed to upload badge template.",
        );
        return;
      }

      setSuccess(true);
      resetForm();
    } catch {
      setError("Something went wrong while uploading the badge template.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] px-4.5 py-9">
        <div className="bg-white border border-[#E8E8E8] rounded-[16px] p-7.5 max-w-[22.5rem] w-full text-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <div className="w-10.5 h-10.5 rounded-full flex items-center justify-center mx-auto mb-3.75 text-2xl bg-[rgba(244,118,36,0.1)] text-[#F47624]">
            ✓
          </div>
          <h2 className="m-0 mb-1.5 text-xl font-bold font-['Poppins',system-ui,sans-serif] text-black">
            Template Uploaded!
          </h2>
          <p className="text-[#6D6D6D] font-['Poppins',system-ui,sans-serif] text-sm mb-4.5">
            The badge template has been saved successfully.
          </p>
          <div className="flex gap-2.25 flex-col">
            <button
              onClick={() => setSuccess(false)}
              className="py-2.25 rounded-lg border-[1.5px] border-[#F47624] bg-transparent text-[#F47624] font-semibold cursor-pointer text-[13px] font-['Poppins',system-ui,sans-serif]"
            >
              Upload Another Template
            </button>
            <Link
              to="/admin/badges/new"
              className="block py-2.25 rounded-lg border-none bg-transparent text-[#0F172A] font-semibold text-[13px] font-['Poppins',system-ui,sans-serif] no-underline hover:opacity-75"
            >
              Issue a Badge →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDisabled =
    submitting || !file || !templateName.trim() || !issuerName.trim();

  return (
    <div className="flex-1 bg-[#FAFAFA] px-3 py-7.5 sm:py-[42px] flex flex-col items-center">
      <h1 className="m-0 mb-6 sm:mb-[38px] font-['Poppins',system-ui,sans-serif] font-semibold text-[24px] sm:text-[38px] leading-[1.2] text-black text-center">
        New Badge Template
      </h1>

      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-[15px] w-full max-w-[526px] px-4.5 py-6 sm:px-[38px] sm:pt-[30px] sm:pb-[15px] mb-6">
        <h2 className="m-0 mb-4.5 font-['Poppins',system-ui,sans-serif] font-semibold text-[18px] text-[#0F172A]">
          Template Details
        </h2>

        <form
          id="upload-badge-template-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-3.75"
        >
          <Field label="Template File" required>
            <label
              htmlFor="badge-template-file-input"
              className="cursor-pointer bg-[#F5F5F5] rounded-[6px] w-full h-[75px] flex flex-col items-center justify-center gap-1.5 px-3 transition-colors hover:bg-[#EDEDED]"
            >
              <Upload className="text-[#1E1E1E] opacity-70 shrink-0" size={17} />
              <p className="m-0 text-[12px] font-medium font-['Poppins',system-ui,sans-serif] text-center tracking-[0.02em] text-[#1E1E1E] opacity-40 overflow-hidden text-ellipsis whitespace-nowrap w-full">
                {file ? file.name : "Click to choose a PNG or JPG image"}
              </p>
              <input
                id="badge-template-file-input"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </Field>

          <Field label="Template Name" required>
            <input
              id="template-name-input"
              type="text"
              required
              placeholder="Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className={inputTailwind}
            />
          </Field>

          <Field label="Template For">
            <input
              id="template-for-input"
              type="text"
              value={templateFor}
              onChange={(e) => setTemplateFor(e.target.value)}
              className={inputTailwind}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7.5 gap-y-3.75">
            <Field label="Event Name">
              <input
                id="event-name-input"
                type="text"
                placeholder="Event"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className={inputTailwind}
              />
            </Field>

            <Field label="Issuer Name" required>
              <input
                id="issuer-name-input"
                type="text"
                required
                value={issuerName}
                onChange={(e) => setIssuerName(e.target.value)}
                className={inputTailwind}
              />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              id="notes-input"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputTailwind} h-auto py-2.25 resize-y min-h-[72px]`}
            />
          </Field>

          {error && (
            <div className="bg-[#fdf0ef] border border-[#f5c6c2] text-[#c0392b] px-3 py-2.25 rounded-lg text-sm flex gap-1.5 items-center">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4.5 sm:gap-[46px] mt-1.5">
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="font-['Poppins',system-ui,sans-serif] font-semibold text-[14px] sm:text-[15px] text-[#0F172A] bg-transparent border-none cursor-pointer transition-opacity hover:opacity-70 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="submit-badge-template-button"
              type="submit"
              disabled={isDisabled}
              className={`w-full sm:w-auto font-['Poppins',system-ui,sans-serif] font-normal text-[14px] sm:text-[15px] px-6 py-1.5 sm:py-[8px] rounded-[4px] border-none transition-all duration-200 ${isDisabled
                ? "bg-[#D9D9D9] text-[#8C8C8C] cursor-not-allowed"
                : "bg-[#F47624] text-white cursor-pointer hover:bg-[#E36614] active:scale-[0.98] shadow-[0_2px_10px_rgba(244,118,36,0.3)]"
                }`}
            >
              {submitting ? "Uploading…" : "Upload Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
