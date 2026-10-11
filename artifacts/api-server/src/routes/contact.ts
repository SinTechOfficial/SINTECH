import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { CreateContactSubmissionBody } from "@workspace/api-zod";
import { contactSubmissionsTable, db } from "@workspace/db";

const router: IRouter = Router();
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Please wait before sending another inquiry." },
});

function isHoneypotFilled(req: { body?: unknown }): boolean {
  if (!req.body || typeof req.body !== "object") return false;
  const website = (req.body as Record<string, unknown>)["website"];
  return typeof website === "string" && website.trim().length > 0;
}

async function notifyContactSubmission(
  submission: {
    name: string;
    email: string;
    phone: string | null;
    service: string;
    budget: string | null;
    timeline: string | null;
    message: string;
  },
  log: { warn: (message: string) => void },
): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["CONTACT_TO_EMAIL"] || "sintech11395@gmail.com";
  const from =
    process.env["RESEND_FROM_EMAIL"] || "SinTech <onboarding@resend.dev>";

  if (!apiKey || !to) {
    log.warn(
      "Contact submission was saved, but email notification is disabled because RESEND_API_KEY or CONTACT_TO_EMAIL is missing.",
    );
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New SinTech project inquiry: ${submission.service}`,
        text: [
          `Name: ${submission.name}`,
          `Email: ${submission.email}`,
          `Phone: ${submission.phone ?? "Not provided"}`,
          `Service: ${submission.service}`,
          `Budget: ${submission.budget ?? "Not provided"}`,
          `Timeline: ${submission.timeline ?? "Not provided"}`,
          "",
          submission.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      log.warn(
        `Contact submission was saved, but Resend returned HTTP ${response.status}; email notification was not delivered.`,
      );
    }
  } catch {
    log.warn(
      "Contact submission was saved, but the email notification request failed.",
    );
  }
}

router.post(
  "/contact",
  contactLimiter,
  (req, res, next) => {
    if (isHoneypotFilled(req)) {
      return res.status(201).json({
        accepted: true,
        message: "Thanks for getting in touch.",
      });
    }
    return next();
  },
  async (req, res) => {
    const parsed = CreateContactSubmissionBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Please check the submitted fields." });
    }

    const payload = CreateContactSubmissionBody.safeParse({
      ...parsed.data,
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      phone: parsed.data.phone?.trim() || undefined,
      service: parsed.data.service.trim(),
      budget: parsed.data.budget?.trim() || null,
      timeline: parsed.data.timeline?.trim() || null,
      message: parsed.data.message.trim(),
    });

    if (!payload.success || !payload.data.consent) {
      return res.status(400).json({ message: "Please check the submitted fields." });
    }

    const submission = {
      name: payload.data.name,
      email: payload.data.email,
      phone: payload.data.phone || null,
      service: payload.data.service,
      budget: payload.data.budget || null,
      timeline: payload.data.timeline || null,
      message: payload.data.message,
      userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
    };

    let savedToDb = true;
    try {
      await db.insert(contactSubmissionsTable).values(submission);
    } catch {
      savedToDb = false;
      req.log.warn(
        { submission: { name: submission.name, email: submission.email, service: submission.service } },
        "Database is unavailable; proceeding with email notification fallback.",
      );
    }

    await notifyContactSubmission(submission, req.log);
    return res.status(201).json({
      accepted: true,
      message: "Thanks, your project inquiry has been received.",
    });
  },
);

export default router;
