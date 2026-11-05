import { useState } from "react";
import { AlertCircle, ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import {
  contact,
  errors as errorCopy,
  formFields,
  site,
} from "../data/content";
import { cn } from "../utils/cn";
import { submitContactMessage } from "../utils/api";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-[#989CA2] focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:bg-[#f9fafb] disabled:cursor-not-allowed";

function validate(values) {
  const next = {};

  if (!values.name.trim()) next.name = errorCopy.name;
  if (!values.email.trim()) {
    next.email = errorCopy.emailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    next.email = errorCopy.emailInvalid;
  }
  if (!values.subject.trim()) next.subject = errorCopy.subject;

  return next;
}

export default function Contact() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setServerError("");
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setSubmitted(false);
      const firstField = ["name", "email", "subject"].find((field) => nextErrors[field]);
      document.getElementById(`contact-${firstField}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      // Do not clear the form when an API error occurs
      setServerError(err.message || "Failed to submit message. Please try again.");
      if (err.errors) {
        setErrors((prev) => ({ ...prev, ...err.errors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setServerError("");
    setSubmitted(false);
  };

  const mailSubject = values.subject.trim() || "Portfolio enquiry";
  const mailBody = `${values.name.trim()}\n${values.email.trim()}\n\n${values.message.trim()}`;
  const mailtoHref = `${site.emailHref}?subject=${encodeURIComponent(
    mailSubject
  )}&body=${encodeURIComponent(mailBody)}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 bg-paper py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal x={-50} y={0}>
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-muted">
              {contact.eyebrow}
            </p>
            <h2
              id="contact-title"
              className="mt-4 font-serif text-[clamp(2.75rem,5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink"
            >
              {contact.title}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.75] text-secondary">
              {contact.description}
            </p>
            <a
              href={site.phoneHref}
              className="mt-8 inline-flex items-center gap-2 border-b border-accent pb-1 font-serif text-2xl font-medium tracking-[-0.02em] text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              {site.phone}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal x={50} y={0} delay={0.1}>
            <Card className="p-5 sm:p-8">
              {submitted ? (
                <div
                  className="flex min-h-[460px] flex-col justify-center"
                  role="status"
                  aria-live="polite"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tag text-accent-strong">
                    <Check size={22} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-serif text-3xl font-medium tracking-[-0.025em] text-ink">
                    Message sent successfully!
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-secondary">
                    Thank you for reaching out. Your message has been saved in the database and I will get back to you shortly.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" onClick={resetForm}>
                      Send another message
                    </Button>
                    <Button href={mailtoHref} variant="outline" className="group">
                      Also open email draft
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                  <p className="mt-5 text-xs leading-relaxed text-muted">
                    Direct inquiries can also be sent to {site.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {serverError ? (
                    <div
                      role="alert"
                      className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                    >
                      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
                      <p>{serverError}</p>
                    </div>
                  ) : null}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="text-sm font-medium text-secondary"
                      >
                        {formFields.name.label}
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        disabled={isSubmitting}
                        autoComplete={formFields.name.autoComplete}
                        placeholder={formFields.name.placeholder}
                        value={values.name}
                        onChange={updateField}
                        aria-required="true"
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        className={cn(fieldClass, errors.name && "border-accent")}
                      />
                      {errors.name ? (
                        <p id="contact-name-error" className="mt-2 text-xs text-accent-strong">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="text-sm font-medium text-secondary"
                      >
                        {formFields.email.label}
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        disabled={isSubmitting}
                        autoComplete={formFields.email.autoComplete}
                        placeholder={formFields.email.placeholder}
                        value={values.email}
                        onChange={updateField}
                        aria-required="true"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        className={cn(fieldClass, errors.email && "border-accent")}
                      />
                      {errors.email ? (
                        <p id="contact-email-error" className="mt-2 text-xs text-accent-strong">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="contact-subject"
                      className="text-sm font-medium text-secondary"
                    >
                      {formFields.subject.label}
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      disabled={isSubmitting}
                      autoComplete={formFields.subject.autoComplete}
                      placeholder={formFields.subject.placeholder}
                      value={values.subject}
                      onChange={updateField}
                      aria-required="true"
                      aria-invalid={errors.subject ? "true" : "false"}
                      aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                      className={cn(fieldClass, errors.subject && "border-accent")}
                    />
                    {errors.subject ? (
                      <p id="contact-subject-error" className="mt-2 text-xs text-accent-strong">
                        {errors.subject}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="contact-message"
                      className="text-sm font-medium text-secondary"
                    >
                      {formFields.message.label}{" "}
                      <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      disabled={isSubmitting}
                      placeholder={formFields.message.placeholder}
                      value={values.message}
                      onChange={updateField}
                      className={cn(fieldClass, "h-auto min-h-[148px] resize-y py-3")}
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-muted">
                      {contact.helper}
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          {contact.submitLabel}
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
