import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateContactSubmission } from "@workspace/api-client-react";
import type { ContactRequest } from "@workspace/api-client-react";
import { CreateContactSubmissionBody } from "@workspace/api-zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { PageIntro } from "../components/PageIntro";
import { PageMeta } from "../components/PageMeta";
import { services } from "../data/services";
import { site } from "../data/site";
import { track } from "../lib/analytics";

const contactFormSchema = CreateContactSubmissionBody.extend({
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(40).optional(),
  budget: z.string().trim().max(80).nullable().optional(),
  timeline: z.string().trim().max(80).nullable().optional(),
  message: z.string().trim().min(1, "Add a short description of your project.").max(5000),
  consent: z.boolean().refine((value) => value, "Consent is required to submit this inquiry."),
});

type ContactFormValues = z.input<typeof contactFormSchema>;

// The resolver's bundled declarations pick up workspace-hoisted Zod 4 types,
// while the shared API schema intentionally remains on Zod 3.
const resolveContactForm = zodResolver as unknown as (
  schema: typeof contactFormSchema,
) => Resolver<ContactFormValues>;
const contactFormResolver = resolveContactForm(contactFormSchema);

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const candidate = error as {
    status?: unknown;
    response?: { status?: unknown };
  };
  if (typeof candidate.status === "number") return candidate.status;
  return typeof candidate.response?.status === "number"
    ? candidate.response.status
    : undefined;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-1 text-sm text-red-300">
      {message}
    </p>
  ) : null;
}

export function ContactPage() {
  const mutation = useCreateContactSubmission();
  const [step, setStep] = useState<1 | 2>(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const form = useForm<ContactFormValues>({
    resolver: contactFormResolver,
    defaultValues: {
      service: "",
      budget: "",
      timeline: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
      website: "",
    },
    mode: "onSubmit",
  });
  const errors = form.formState.errors;

  const continueToDetails = async () => {
    const valid = await form.trigger("service");
    if (!valid) {
      form.setFocus("service");
      return;
    }
    track("contact_step_complete", { step: "1" });
    setErrorMessage("");
    setStep(2);
  };

  const submit = form.handleSubmit((values) => {
    const data: ContactRequest = {
      name: values.name.trim(),
      email: values.email.trim(),
      service: values.service.trim(),
      message: values.message.trim(),
      consent: values.consent,
      phone: values.phone?.trim() || undefined,
      budget: values.budget?.trim() || null,
      timeline: values.timeline?.trim() || null,
      website: values.website ?? "",
    };
    track("contact_step_complete", { step: "2" });
    setErrorMessage("");

    mutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          if (response.accepted) {
            setSuccessMessage(
              response.message || "Your project inquiry has been saved.",
            );
            track("contact_submit_success");
          } else {
            setErrorMessage(
              response.message ||
                "We could not submit this brief. Please email SinTech directly.",
            );
          }
        },
        onError: (error) => {
          setErrorMessage(
            getErrorStatus(error) === 429
              ? "There have been several recent submission attempts. Please wait and try again, or email SinTech directly."
              : "We could not submit your brief right now. Please try again or email SinTech directly.",
          );
        },
      },
    );
  });

  return (
    <>
      <PageMeta
        title="Contact"
        description="Send SinTech a project brief with your service, budget, timeline, and contact details."
      />
      <PageIntro
        eyebrow="Contact"
        title="Tell us what you’re working on"
        copy="A few details help frame a useful conversation. Budget and timing are optional, and you can describe them in your own words."
      />
      <section className="container-wide grid gap-8 pb-24 lg:grid-cols-[.72fr_1.28fr]">
        <aside className="surface h-fit p-7">
          <p className="eyebrow">Project brief</p>
          <h2 className="mt-3 text-2xl font-bold">A short, useful starting point</h2>
          <p className="mt-4 text-muted">
            Choose the closest service area, then share how to reach you and a
            little context about the work.
          </p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-7 inline-block break-all text-lg font-semibold text-[#8cb5ff] underline underline-offset-4"
          >
            {site.contactEmail}
          </a>
        </aside>

        <div className="surface p-6 md:p-9">
          <ol aria-label="Contact form progress" className="mb-8">
            <li className="flex items-center justify-between text-sm font-semibold">
              <span aria-current={step === 1 ? "step" : undefined}>
                1. Project
              </span>
              <span aria-current={step === 2 ? "step" : undefined}>
                2. Your details
              </span>
            </li>
            <li className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-[#4f8ef7] transition-[width]"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </li>
          </ol>

          {successMessage ? (
            <div
              role="status"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-6"
            >
              <Check aria-hidden="true" className="text-emerald-300" />
              <h2 className="mt-3 text-2xl font-bold">Inquiry received</h2>
              <p className="mt-2 text-muted">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              {step === 1 ? (
                <fieldset className="grid gap-5">
                  <legend className="mb-5 text-2xl font-bold">
                    About the project
                  </legend>
                  <div>
                    <label className="form-label" htmlFor="service">
                      Service area <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="service"
                      className="form-control"
                      aria-invalid={Boolean(errors.service)}
                      aria-describedby={
                        errors.service ? "service-error" : undefined
                      }
                      {...form.register("service")}
                    >
                      <option value="">Choose a service</option>
                      {services.map((service) => (
                        <option key={service.slug} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                    <FieldError
                      id="service-error"
                      message={errors.service?.message}
                    />
                  </div>

                  <div>
                    <label className="form-label" htmlFor="budget">
                      Budget range{" "}
                      <span className="text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      id="budget"
                      className="form-control"
                      maxLength={80}
                      autoComplete="off"
                      placeholder="Optional"
                      aria-invalid={Boolean(errors.budget)}
                      aria-describedby={
                        errors.budget ? "budget-error" : undefined
                      }
                      {...form.register("budget")}
                    />
                    <FieldError
                      id="budget-error"
                      message={errors.budget?.message}
                    />
                  </div>

                  <div>
                    <label className="form-label" htmlFor="timeline">
                      Timeline{" "}
                      <span className="text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      id="timeline"
                      className="form-control"
                      maxLength={80}
                      autoComplete="off"
                      placeholder="Optional"
                      aria-invalid={Boolean(errors.timeline)}
                      aria-describedby={
                        errors.timeline ? "timeline-error" : undefined
                      }
                      {...form.register("timeline")}
                    />
                    <FieldError
                      id="timeline-error"
                      message={errors.timeline?.message}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={continueToDetails}
                    className="button-primary mt-2 w-full sm:w-fit"
                  >
                    Continue <ArrowRight aria-hidden="true" size={17} />
                  </button>
                </fieldset>
              ) : (
                <fieldset className="grid gap-5">
                  <legend className="mb-5 text-2xl font-bold">
                    Your details
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="form-label" htmlFor="name">
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        className="form-control"
                        autoComplete="name"
                        maxLength={120}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        {...form.register("name")}
                      />
                      <FieldError
                        id="name-error"
                        message={errors.name?.message}
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="email">
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        className="form-control"
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        {...form.register("email")}
                      />
                      <FieldError
                        id="email-error"
                        message={errors.email?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="phone">
                      Phone{" "}
                      <span className="text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      className="form-control"
                      type="tel"
                      autoComplete="tel"
                      maxLength={40}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      {...form.register("phone")}
                    />
                    <FieldError
                      id="phone-error"
                      message={errors.phone?.message}
                    />
                  </div>

                  <div>
                    <label className="form-label" htmlFor="message">
                      Project details <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      className="form-control min-h-36"
                      maxLength={5000}
                      placeholder="What are you looking to build or improve?"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      {...form.register("message")}
                    />
                    <FieldError
                      id="message-error"
                      message={errors.message?.message}
                    />
                  </div>

                  <div
                    className="absolute -left-[10000px] h-px w-px overflow-hidden"
                    aria-hidden="true"
                  >
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      tabIndex={-1}
                      autoComplete="off"
                      {...form.register("website")}
                    />
                  </div>

                  <div>
                    <label className="flex items-start gap-3" htmlFor="consent">
                      <input
                        id="consent"
                        type="checkbox"
                        className="mt-1 h-5 w-5 accent-[#1e4ab8]"
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={
                          errors.consent ? "consent-error" : undefined
                        }
                        {...form.register("consent")}
                      />
                      <span>
                        I agree that SinTech may use these details to review and
                        respond to this project inquiry.{" "}
                        <span aria-hidden="true">*</span>
                      </span>
                    </label>
                    <FieldError
                      id="consent-error"
                      message={errors.consent?.message}
                    />
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-[#ffd2d2]"
                    >
                      {errorMessage}{" "}
                      <a
                        className="font-bold underline"
                        href={`mailto:${site.contactEmail}`}
                      >
                        {site.contactEmail}
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setErrorMessage("");
                      }}
                      className="button-quiet"
                    >
                      <ArrowLeft aria-hidden="true" size={17} />
                      Back to project details
                    </button>
                    <button
                      className="button-primary"
                      type="submit"
                      disabled={mutation.isPending || form.formState.isSubmitting}
                    >
                      {mutation.isPending || form.formState.isSubmitting
                        ? "Sending brief…"
                        : "Send project brief"}
                      <ArrowRight aria-hidden="true" size={17} />
                    </button>
                  </div>
                </fieldset>
              )}
            </form>
          )}
        </div>
      </section>
    </>
  );
}
