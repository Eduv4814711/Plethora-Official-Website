"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

const GUARD_COUNT_OPTIONS = [
  { value: "1-50", label: "1–50 guards (Starter tier profile)" },
  { value: "51-150", label: "51–150 guards (Growth tier profile)" },
  { value: "151-250", label: "151–250 guards (Core multi-site profile)" },
  { value: "251-500", label: "251–500 guards (Scale / Enterprise profile)" },
  { value: "500+", label: "500+ guards" },
];

export function DemoRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [guardCount, setGuardCount] = useState("51-150");
  const [operationalFocus, setOperationalFocus] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [serverMessage, setServerMessage] = useState("");

  function validateField(field: string, value: string | boolean) {
    const next = { ...fieldErrors };
    if (field === "name") {
      if (typeof value === "string" && value.trim().length < 2) {
        next.name = "Please enter your full name.";
      } else {
        delete next.name;
      }
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === "string" && !emailRegex.test(value.trim())) {
        next.email = "Please enter a valid business email address.";
      } else {
        delete next.email;
      }
    }
    if (field === "company") {
      if (typeof value === "string" && value.trim().length < 2) {
        next.company = "Please enter your security company name.";
      } else {
        delete next.company;
      }
    }
    if (field === "privacyAccepted") {
      if (value !== true) {
        next.privacyAccepted =
          "Please confirm that we may contact you regarding this demo enquiry.";
      } else {
        delete next.privacyAccepted;
      }
    }
    setFieldErrors(next);
  }

  function clearFieldError(field: string) {
    if (fieldErrors[field]) {
      const next = { ...fieldErrors };
      delete next[field];
      setFieldErrors(next);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          guardCount,
          operationalFocus,
          privacyAccepted,
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setServerMessage(
          data.message || "Unable to submit your demo enquiry. Please check your details."
        );
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        return;
      }

      setStatus("success");
      setServerMessage(data.message);
      setFieldErrors({});
    } catch {
      setStatus("error");
      setServerMessage(
        "A network error occurred while submitting your enquiry. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      action="/api/demo"
      method="POST"
      noValidate
      className="space-y-5"
      aria-labelledby="demo-form-heading"
    >
      {/* Honeypot field hidden from screen readers and visual users */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="demo-website-url">Website URL (leave blank)</label>
        <input
          type="text"
          id="demo-website-url"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="demo-name"
          className="block text-sm font-medium text-black mb-1.5"
        >
          Full name <span className="text-[#c04900]">*</span>
        </label>
        <input
          type="text"
          id="demo-name"
          name="name"
          required
          autoComplete="name"
          enterKeyHint="next"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          onBlur={(e) => validateField("name", e.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "demo-name-error" : undefined}
          placeholder="e.g. Thabo Mokoena"
          className={`w-full min-h-[48px] rounded-lg border px-3.5 py-2.5 text-base text-black bg-white placeholder:text-zinc-400 transition-colors ${
            fieldErrors.name
              ? "border-[#f63232]"
              : "border-[#d0ceca] hover:border-zinc-500"
          }`}
        />
        {fieldErrors.name && (
          <p
            id="demo-name-error"
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#c04900]"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#f63232]" aria-hidden="true" />
            <span>{fieldErrors.name}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="demo-email"
            className="block text-sm font-medium text-black mb-1.5"
          >
            Business email <span className="text-[#c04900]">*</span>
          </label>
          <input
            type="email"
            id="demo-email"
            name="email"
            required
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="next"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            onBlur={(e) => validateField("email", e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? "demo-email-error" : undefined
            }
            placeholder="name@securityfirm.co.za"
            className={`w-full min-h-[48px] rounded-lg border px-3.5 py-2.5 text-base text-black bg-white placeholder:text-zinc-400 transition-colors ${
              fieldErrors.email
                ? "border-[#f63232]"
                : "border-[#d0ceca] hover:border-zinc-500"
            }`}
          />
          {fieldErrors.email && (
            <p
              id="demo-email-error"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#c04900]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#f63232]" aria-hidden="true" />
              <span>{fieldErrors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="demo-company"
            className="block text-sm font-medium text-black mb-1.5"
          >
            Company name <span className="text-[#c04900]">*</span>
          </label>
          <input
            type="text"
            id="demo-company"
            name="company"
            required
            autoComplete="organization"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              clearFieldError("company");
            }}
            onBlur={(e) => validateField("company", e.target.value)}
            aria-invalid={Boolean(fieldErrors.company)}
            aria-describedby={
              fieldErrors.company ? "demo-company-error" : undefined
            }
            placeholder="e.g. Sentinel Guarding (Pty) Ltd"
            className={`w-full min-h-[48px] rounded-lg border px-3.5 py-2.5 text-base text-black bg-white placeholder:text-zinc-400 transition-colors ${
              fieldErrors.company
                ? "border-[#f63232]"
                : "border-[#d0ceca] hover:border-zinc-500"
            }`}
          />
          {fieldErrors.company && (
            <p
              id="demo-company-error"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#c04900]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#f63232]" aria-hidden="true" />
              <span>{fieldErrors.company}</span>
            </p>
          )}
        </div>
      </div>

      {/* Radio group for 5 exclusive guard count choices per modern-web-guidance Selection Control Decision Matrix */}
      <fieldset>
        <legend className="block text-sm font-medium text-black mb-2">
          Approximate guard count <span className="text-[#c04900]">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {GUARD_COUNT_OPTIONS.map((opt) => {
            const checked = guardCount === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-xs sm:text-sm transition-colors ${
                  checked
                    ? "border-[#c04900] bg-[#fff3eb] font-medium text-black"
                    : "border-[#e4e4e4] bg-white text-zinc-800 hover:bg-[#f7f6f2]"
                }`}
              >
                <input
                  type="radio"
                  name="guardCount"
                  value={opt.value}
                  checked={checked}
                  onChange={(e) => setGuardCount(e.target.value)}
                  className="h-4 w-4 accent-[#ff6e14]"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="demo-focus"
          className="block text-sm font-medium text-black mb-1.5"
        >
          Operational priorities{" "}
          <span className="text-xs font-normal text-zinc-600">(Optional)</span>
        </label>
        <textarea
          id="demo-focus"
          name="operationalFocus"
          rows={3}
          maxLength={600}
          value={operationalFocus}
          onChange={(e) => setOperationalFocus(e.target.value)}
          placeholder="Tell us which workflows matter most right now (e.g., multi-site rostering, attendance OB verification, NBCPSS leave, or payroll preparation)."
          className="w-full rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2.5 text-base text-black placeholder:text-zinc-400 hover:border-zinc-500"
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-zinc-700">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={privacyAccepted}
            onChange={(e) => {
              setPrivacyAccepted(e.target.checked);
              if (e.target.checked) clearFieldError("privacyAccepted");
            }}
            aria-invalid={Boolean(fieldErrors.privacyAccepted)}
            aria-describedby={
              fieldErrors.privacyAccepted ? "demo-privacy-error" : undefined
            }
            className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#ff6e14]"
          />
          <span>
            I agree that Plethora (Pty) Ltd may process the details above solely to respond to this demo enquiry in accordance with the{" "}
            <Link
              href="/privacy"
              className="font-medium text-black underline decoration-zinc-400 underline-offset-2 hover:text-[#c04900]"
            >
              Privacy Policy
            </Link>
            . Requesting a demo does not subscribe you to marketing emails.
          </span>
        </label>
        {fieldErrors.privacyAccepted && (
          <p
            id="demo-privacy-error"
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#c04900]"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#f63232]" aria-hidden="true" />
            <span>{fieldErrors.privacyAccepted}</span>
          </p>
        )}
      </div>

      <div aria-live="polite" className="min-h-[1.25rem]">
        {status === "success" && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-[#5ad824] bg-[#f4fde8] p-3.5 text-sm text-black"
          >
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-[#3c9a12]"
              aria-hidden="true"
            />
            <span>{serverMessage}</span>
          </div>
        )}
        {status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-[#f63232] bg-[#fff2f2] p-3.5 text-sm text-black"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-[#f63232]"
              aria-hidden="true"
            />
            <span>{serverMessage}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#ff6e14] px-5 py-3 text-base font-medium text-black transition-colors hover:bg-[#fcb488] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Recording demo request…</span>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>Demo request recorded</span>
          </>
        ) : (
          <>
            <span>Request a demo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}

export function EmailSubscriptionForm({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [serverMessage, setServerMessage] = useState("");

  function validateEmailOnBlur(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value.trim())) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          source,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setServerMessage(
          data.message || "Unable to complete subscription. Please check your details."
        );
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        return;
      }

      setStatus("success");
      setServerMessage(data.message);
      setFieldErrors({});
    } catch {
      setStatus("error");
      setServerMessage("A network error occurred. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      action="/api/subscribe"
      method="POST"
      noValidate
      className="space-y-4"
      aria-labelledby="subscribe-form-heading"
    >
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={`sub-honeypot-${source}`}>Leave blank</label>
        <input
          type="text"
          id={`sub-honeypot-${source}`}
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor={`sub-email-${source}`}
          className="block text-sm font-medium text-black mb-1.5"
        >
          Email address <span className="text-[#c04900]">*</span>
        </label>
        <input
          type="email"
          id={`sub-email-${source}`}
          name="email"
          required
          autoComplete="email"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.email;
                return next;
              });
            }
          }}
          onBlur={(e) => validateEmailOnBlur(e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email ? `sub-email-error-${source}` : undefined
          }
          placeholder="you@company.co.za"
          className={`w-full min-h-[48px] rounded-lg border px-3.5 py-2.5 text-base text-black bg-white placeholder:text-zinc-400 transition-colors ${
            fieldErrors.email
              ? "border-[#f63232]"
              : "border-[#d0ceca] hover:border-zinc-500"
          }`}
        />
        {fieldErrors.email && (
          <p
            id={`sub-email-error-${source}`}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#c04900]"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#f63232]" aria-hidden="true" />
            <span>{fieldErrors.email}</span>
          </p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-zinc-700">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked && fieldErrors.consent) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.consent;
                  return next;
                });
              }
            }}
            aria-invalid={Boolean(fieldErrors.consent)}
            aria-describedby={
              fieldErrors.consent ? `sub-consent-error-${source}` : undefined
            }
            className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#ff6e14]"
          />
          <span>
            I consent to receive Plethora product updates, release notes, and private security operations articles by email. View our{" "}
            <Link
              href="/privacy"
              className="font-medium text-black underline decoration-zinc-400 underline-offset-2 hover:text-[#c04900]"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {fieldErrors.consent && (
          <p
            id={`sub-consent-error-${source}`}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#c04900]"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#f63232]" aria-hidden="true" />
            <span>{fieldErrors.consent}</span>
          </p>
        )}
      </div>

      <div aria-live="polite" className="min-h-[1.25rem]">
        {status === "success" && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-[#5ad824] bg-[#f4fde8] p-3 text-xs sm:text-sm text-black"
          >
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-[#3c9a12]"
              aria-hidden="true"
            />
            <span>{serverMessage}</span>
          </div>
        )}
        {status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-[#f63232] bg-[#fff2f2] p-3 text-xs sm:text-sm text-black"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-[#f63232]"
              aria-hidden="true"
            />
            <span>{serverMessage}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Subscribing…</span>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-[#5ad824]" aria-hidden="true" />
            <span>Subscribed to updates</span>
          </>
        ) : (
          <span>Subscribe to product updates</span>
        )}
      </button>
    </form>
  );
}
