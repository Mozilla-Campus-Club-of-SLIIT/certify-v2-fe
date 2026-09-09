"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";

function TemplateUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fontSize, setFontSize] = useState("");
  const [fontColor, setFontColor] = useState("#F47624");
  const [nameXPos, setNameXPos] = useState("");
  const [nameYPos, setNameYPos] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateFor, setTemplateFor] = useState("");
  const [eventName, setEventName] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const processSelectedFile = (selectedFile: File) => {
    const isImage = selectedFile.type.startsWith("image/");
    const isPdf = selectedFile.type === "application/pdf";
    
    if (!isImage && !isPdf) {
      setErrors((prev) => ({ ...prev, file: "Please select a valid PDF or image file." }));
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "File size must be 10MB or less." }));
      return;
    }
    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processSelectedFile(selected);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processSelectedFile(droppedFile);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFontSize("");
    setFontColor("#F47624");
    setNameXPos("");
    setNameYPos("");
    setTemplateName("");
    setTemplateFor("");
    setEventName("");
    setIssuerName("");
    setNotes("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!file) newErrors.file = "Template file is required.";
    if (!fontSize) newErrors.fontSize = "Font size is required.";
    if (!fontColor) newErrors.fontColor = "Font color is required.";
    if (!nameXPos) newErrors.nameXPos = "Name X position is required.";
    if (!nameYPos) newErrors.nameYPos = "Name Y position is required.";
    if (!issuerName) newErrors.issuerName = "Issuer name is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setSuccess(false);

    if (!validate() || !file) {
      return;
    }

    const formData = new FormData();
    formData.append("template", file);
    formData.append("font_size", fontSize);
    formData.append("font_color", fontColor);
    formData.append("name_x_pos", nameXPos);
    formData.append("name_y_pos", nameYPos);
    formData.append("issuer_name", issuerName);

    if (templateName) formData.append("template_name", templateName);
    if (templateFor) formData.append("template_for", templateFor);
    if (eventName) formData.append("event_name", eventName);
    if (notes) formData.append("notes", notes);

    try {
      setSubmitting(true);
      const backendApi = process.env.NEXT_PUBLIC_BACKEND_API || "";
      const response = await fetch(
        `${backendApi}/admin/add/template`,
        { method: "POST", body: formData },
      );

      if (!response.ok) {
        setApiError("Failed to upload template.");
        return;
      }

      setSuccess(true);
      resetForm();
    } catch {
      setApiError("Something went wrong while uploading the template.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f7f7fa] py-6 sm:py-8 px-4 sm:px-6 flex-1 flex flex-col justify-center">
      {/* Header outside form */}
      <div className="max-w-2xl mx-auto w-full mb-6 text-center">
        <h1 className="m-0 font-bold text-moz-black tracking-[-0.02em] text-2xl sm:text-3xl">
          New Certificate Template
        </h1>
      </div>

      {/* Success banner */}
      {success && (
        <div className="max-w-2xl mx-auto w-full mb-4">
          <p className="form-banner form-banner-success">
            <CheckCircle2 size={18} /> Template uploaded successfully.
          </p>
        </div>
      )}

      {/* API Error banner */}
      {apiError && (
        <div className="max-w-2xl mx-auto w-full mb-4">
          <p className="form-banner form-banner-error">
            <AlertCircle size={18} /> {apiError}
          </p>
        </div>
      )}

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto w-full bg-white border border-moz-gray-light rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
      >
        <h2 className="m-0 text-lg font-bold text-moz-black">Template Details</h2>

        {/* File upload */}
        <div>
          <label htmlFor="template-file-input" className="form-label">
            Template File <span className="text-moz-orange">*</span>
          </label>
          <label
            htmlFor="template-file-input"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-[#f4f4f6] border border-transparent cursor-pointer transition-colors hover:bg-[#eaeaea] ${errors.file ? "border-[#c0392b]" : ""
              }`}
          >
            {file ? (
              <FileText size={24} color="var(--color-moz-orange)" />
            ) : (
              <Upload size={22} color="#8e8e93" />
            )}
            <div className="text-center min-w-0">
              <p className="m-0 text-xs sm:text-sm font-semibold text-[#8e8e93] overflow-hidden text-ellipsis whitespace-nowrap">
                {file ? file.name : "Click to choose a PDF or image"}
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
          {errors.file && <p className="mt-1 text-[0.75rem] text-[#c0392b]">{errors.file}</p>}
        </div>

        {/* Required fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Row 1 */}
          <div>
            <label htmlFor="font-size-input" className="form-label">
              Font Size <span className="text-moz-orange">*</span>
            </label>
            <input
              id="font-size-input"
              type="number"
              placeholder="e.g. 24"
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                if (e.target.value) setErrors((prev) => ({ ...prev, fontSize: "" }));
              }}
              className={`form-input ${errors.fontSize ? 'border-[#c0392b]' : ''}`}
            />
            {errors.fontSize && <p className="mt-1 text-[0.75rem] text-[#c0392b]">{errors.fontSize}</p>}
          </div>

          <div>
            <label htmlFor="font-color-input" className="form-label">
              Font Color <span className="text-moz-orange">*</span>
            </label>
            <div className={`flex items-center overflow-hidden rounded-xl border ${errors.fontColor ? 'border-[#c0392b]' : 'border-[#d4d4d4]'} bg-[#f7f7fa] h-[52px]`}>
              <label
                htmlFor="font-color-picker"
                className="relative w-12 h-full shrink-0 cursor-pointer"
                style={{ backgroundColor: fontColor }}
                title="Click to pick color"
              >
                <input
                  id="font-color-picker"
                  type="color"
                  value={fontColor}
                  onChange={(e) => {
                    setFontColor(e.target.value);
                    setErrors((prev) => ({ ...prev, fontColor: "" }));
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </label>
              <input
                id="font-color-input"
                type="text"
                value={fontColor}
                onChange={(e) => {
                  setFontColor(e.target.value);
                  if (e.target.value) setErrors((prev) => ({ ...prev, fontColor: "" }));
                }}
                className="flex-1 bg-transparent px-3 text-sm text-moz-gray-dark outline-none border-none h-full"
              />
            </div>
            {errors.fontColor && <p className="mt-1 text-[0.75rem] text-[#c0392b]">{errors.fontColor}</p>}
          </div>

          {/* Row 2 */}
          <div>
            <label htmlFor="name-x-pos-input" className="form-label">
              Name X Position <span className="text-moz-orange">*</span>
            </label>
            <input
              id="name-x-pos-input"
              type="number"
              value={nameXPos}
              onChange={(e) => {
                setNameXPos(e.target.value);
                if (e.target.value) setErrors((prev) => ({ ...prev, nameXPos: "" }));
              }}
              className={`form-input ${errors.nameXPos ? 'border-[#c0392b]' : ''}`}
            />
            {errors.nameXPos && <p className="mt-1 text-[0.75rem] text-[#c0392b]">{errors.nameXPos}</p>}
          </div>

          <div>
            <label htmlFor="name-y-pos-input" className="form-label">
              Name Y Position <span className="text-moz-orange">*</span>
            </label>
            <input
              id="name-y-pos-input"
              type="number"
              value={nameYPos}
              onChange={(e) => {
                setNameYPos(e.target.value);
                if (e.target.value) setErrors((prev) => ({ ...prev, nameYPos: "" }));
              }}
              className={`form-input ${errors.nameYPos ? 'border-[#c0392b]' : ''}`}
            />
            {errors.nameYPos && <p className="mt-1 text-[0.75rem] text-[#c0392b]">{errors.nameYPos}</p>}
          </div>

          {/* Row 3 */}
          <div>
            <label htmlFor="template-name-input" className="form-label">
              Template Name
            </label>
            <input
              id="template-name-input"
              type="text"
              placeholder="Event"
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

          {/* Row 4 */}
          <div>
            <label htmlFor="event-name-input" className="form-label">
              Event Name
            </label>
            <input
              id="event-name-input"
              type="text"
              placeholder="Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="issuer-name-input" className="form-label">
              Issuer Name <span className="text-moz-orange">*</span>
            </label>
            <input
              id="issuer-name-input"
              type="text"
              value={issuerName}
              onChange={(e) => {
                setIssuerName(e.target.value);
                if (e.target.value) setErrors((prev) => ({ ...prev, issuerName: "" }));
              }}
              className={`form-input ${errors.issuerName ? 'border-[#c0392b]' : ''}`}
            />
            {errors.issuerName && <p className="mt-1 text-[0.75rem] text-[#c0392b]">{errors.issuerName}</p>}
          </div>
        </div>

        {/* Row 5: Notes */}
        <div>
          <label htmlFor="notes-input" className="form-label">
            Notes
          </label>
          <textarea
            id="notes-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="form-input textarea-input min-h-[4.5rem]"
          />
        </div>

        {/* Submit / Cancel */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center sm:justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/certificates/new")}
            className="w-full sm:w-auto font-bold text-moz-black text-sm font-sans bg-transparent border-none py-2.5 px-6 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            id="submit-template-button"
            type="submit"
            disabled={submitting}
            className={`w-full sm:w-auto submit-btn rounded-lg border-none text-sm font-bold cursor-pointer font-sans tracking-[0.02em] flex items-center justify-center gap-2 py-2.5 px-8 transition-[transform,opacity] duration-150 ${submitting
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
        </div>
      </form>
    </div>
  );
}

export default TemplateUploadPage;
