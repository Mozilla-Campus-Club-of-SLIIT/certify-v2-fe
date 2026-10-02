import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Template {
  id: number;
  template_name: string;
  template_for?: string;
  event_name?: string;
}

interface FormData {
  template_id: string;
  recipient_name: string;
  recipient_email: string;
  issue_reason: string;
  event_name: string;
  event_date: string;
  event_location: string;
  issuer_name: string;
  course_name: string;
  notes: string;
}

const EMPTY_FORM: FormData = {
  template_id: "",
  recipient_name: "",
  recipient_email: "",
  issue_reason: "",
  event_name: "",
  event_date: "",
  event_location: "",
  issuer_name: "",
  course_name: "",
  notes: "",
};

function Field({
  label,
  required,
  children,
}: Readonly<{ label: string; required?: boolean; children: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-[0.375rem]">
      <label className="form-label">
        {label}
        {required && (
          <span className="text-moz-orange ml-[0.2rem]">*</span>
        )}
      </label>
      {children}
    </div>
  );
}

{/* Page */ }

export default function IssueCertificatePage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [issuedId, setIssuedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setTemplatesLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_PUBLIC_BACKEND_API}/admin/templates`,
        );
        if (!res.ok) throw new Error("Could not load templates");
        const data = await res.json() as Template[] | { data: Template[] };
        const list = Array.isArray(data) ? data : (data as { data: Template[] }).data ?? [];
        setTemplates(list);
      } catch {
        setTemplatesError("Could not load templates - enter template ID manually.");
      } finally {
        setTemplatesLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.template_id || !form.recipient_name || !form.recipient_email) return;

    try {
      setSubmitting(true);
      setSubmitError("");
      setIssuedId(null);

      const payload: Record<string, unknown> = {
        template_id: Number(form.template_id),
        recipient_name: form.recipient_name.trim(),
        recipient_email: form.recipient_email.trim(),
      };

      (
        [
          "issue_reason",
          "event_name",
          "event_date",
          "event_location",
          "issuer_name",
          "course_name",
          "notes",
        ] as const
      ).forEach((key) => {
        if (form[key].trim()) payload[key] = form[key].trim();
      });

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_API}/admin/add/certificate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(err.message ?? `Server error ${res.status}`);
      }

      const result = await res.json();
      const certId =
        result.certificate.certificate_id ?? result.data?.certificate_id ?? null;


      if (!certId) throw new Error("No certificate ID returned by the server.");

      setIssuedId(certId);
      setForm(EMPTY_FORM);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  /*  Success screen  */
  if (issuedId) {
    return (
      <div
        className="flex items-center justify-center bg-[#f7f7fa] px-6 py-8 min-h-[calc(100vh-140px)]"
      >
        <div
          className="bg-white border border-moz-gray-light rounded-[1.25rem] p-10 max-w-[30rem] w-full text-center shadow-[0_4px_6px_rgba(0,0,0,0.04),0_12px_40px_rgba(89,42,203,0.06)]"
        >
          {/* Checkmark */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl bg-[rgba(255,113,57,0.1)]"
          >
            ✓
          </div>

          <h2 className="m-0 mb-2 text-xl font-bold text-moz-black">
            Certificate Issued!
          </h2>
          <p className="text-moz-gray-mid text-sm mb-6">
            The certificate has been created successfully.
          </p>

          {/* ID chip */}
          <div className="bg-[#f7f7fa] border border-moz-gray-light rounded-lg py-3 px-4 mb-6">
            <p className="m-0 text-[0.72rem] text-moz-gray-mid font-semibold uppercase tracking-[0.06em]">
              Certificate ID
            </p>
            <p className="mt-1 font-mono text-base font-bold text-moz-black break-all">
              {issuedId}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-col">
            <Link
              id="view-certificate-link"
              to={`/certificates/${encodeURIComponent(issuedId)}`}
              className="block py-3 rounded-xl text-white font-bold no-underline text-[0.9rem] bg-gradient-to-br from-[var(--color-moz-orange)] to-[var(--color-moz-orange-mid)] shadow-[0_4px_14px_rgba(255,113,57,0.3)]"
            >
              View Certificate →
            </Link>
            <button
              id="issue-another-button"
              onClick={() => setIssuedId(null)}
              className="py-3 rounded-xl border-[1.5px] border-moz-gray-light bg-transparent text-moz-gray-mid font-semibold cursor-pointer text-[0.9rem] font-sans"
            >
              Issue Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDisabled = submitting || !form.template_id || !form.recipient_name || !form.recipient_email;

  return (
    <div
      className="scrollbar-hidden overflow-y-auto bg-[#f7f7fa] px-6 py-8 h-[calc(100vh-140px)]"
    >
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-7">
          <h1
            className="m-0 font-extrabold text-moz-black tracking-[-0.02em] text-[clamp(1.3rem,3vw,1.75rem)]"
          >
            Issue Certificate
          </h1>
          <p className="mt-[0.375rem] text-sm text-moz-gray-mid">
            Fill in the details below to issue a new certificate to a recipient.
          </p>
        </div>

        <form
          id="issue-certificate-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
          {/* Section: Template */}
          <section className="bg-white border border-moz-gray-light rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="m-0 mb-4 text-sm font-bold text-moz-black uppercase tracking-[0.06em]">Template</h2>

            <Field label="Template" required>
              {templatesLoading ? (
                <div className="input-base text-moz-gray-mid flex items-center">
                  Loading templates…
                </div>
              ) : templates.length > 0 ? (
                <select
                  id="template-select"
                  required
                  value={form.template_id}
                  onChange={set("template_id")}
                  className="input-base appearance-none cursor-pointer"
                >
                  <option value="">Select a template…</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.template_name}
                      {t.template_for ? ` — ${t.template_for}` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  {templatesError && (
                    <p className="m-0 mb-2 text-[0.78rem] text-[#c0392b]">
                      ⚠ {templatesError}
                    </p>
                  )}
                  <input
                    id="template-id-input"
                    type="number"
                    min="1"
                    required
                    placeholder="Enter template ID"
                    value={form.template_id}
                    onChange={set("template_id")}
                    className="input-base"
                  />
                </>
              )}
            </Field>
          </section>

          {/* Section: Recipient */}
          <section className="bg-white border border-moz-gray-light rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="m-0 mb-4 text-sm font-bold text-moz-black uppercase tracking-[0.06em]">Recipient</h2>
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
              <Field label="Full Name" required>
                <input
                  id="recipient-name-input"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.recipient_name}
                  onChange={set("recipient_name")}
                  className="input-base"
                />
              </Field>
              <Field label="Email" required>
                <input
                  id="recipient-email-input"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={form.recipient_email}
                  onChange={set("recipient_email")}
                  className="input-base"
                />
              </Field>
            </div>
          </section>

          {/* Section: Event Details */}
          <section className="bg-white border border-moz-gray-light rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="m-0 mb-1 text-sm font-bold text-moz-black uppercase tracking-[0.06em]">Event Details</h2>
            <p className="mb-4 text-[0.78rem] text-moz-gray-mid">
              All fields in this section are optional.
            </p>
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
              <Field label="Issue Reason">
                <input
                  id="issue-reason-input"
                  type="text"
                  placeholder="e.g. participation"
                  value={form.issue_reason}
                  onChange={set("issue_reason")}
                  className="input-base"
                />
              </Field>
              <Field label="Event Name">
                <input
                  id="event-name-input"
                  type="text"
                  placeholder="e.g. AI Workshop 2026"
                  value={form.event_name}
                  onChange={set("event_name")}
                  className="input-base"
                />
              </Field>
              <Field label="Event Date">
                <input
                  id="event-date-input"
                  type="date"
                  value={form.event_date}
                  onChange={set("event_date")}
                  className="input-base"
                />
              </Field>
              <Field label="Event Location">
                <input
                  id="event-location-input"
                  type="text"
                  placeholder="e.g. Colombo"
                  value={form.event_location}
                  onChange={set("event_location")}
                  className="input-base"
                />
              </Field>
              <Field label="Issuer Name">
                <input
                  id="issuer-name-input"
                  type="text"
                  placeholder="e.g. SLIIT Mozilla Club"
                  value={form.issuer_name}
                  onChange={set("issuer_name")}
                  className="input-base"
                />
              </Field>
              <Field label="Course Name">
                <input
                  id="course-name-input"
                  type="text"
                  placeholder="e.g. Prompt Engineering"
                  value={form.course_name}
                  onChange={set("course_name")}
                  className="input-base"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Notes">
                <textarea
                  id="notes-input"
                  placeholder="Any additional notes…"
                  rows={3}
                  value={form.notes}
                  onChange={set("notes")}
                  className="input-base textarea-input min-h-[5rem]"
                />
              </Field>
            </div>
          </section>

          {/* Submit error */}
          {submitError && (
            <div className="form-banner form-banner-error">
              <span>⚠</span>
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pb-8">
            <button
              id="submit-certificate-button"
              type="submit"
              disabled={isDisabled}
              className={`py-3 px-8 rounded-xl border-none text-[0.95rem] font-bold font-sans transition-all duration-200 ${isDisabled
                ? "bg-moz-gray-light text-moz-gray cursor-not-allowed"
                : "text-white cursor-pointer bg-gradient-to-br from-[var(--color-moz-orange)] to-[var(--color-moz-orange-mid)] shadow-[0_4px_14px_rgba(255,113,57,0.35)]"
                }`}
            >
              {submitting ? "Issuing…" : "Issue Certificate →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
