import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Rate limit reached. Please wait a moment before sending another message." }
});

router.post("/chat", chatLimiter, async (req, res) => {
  const body = req.body as Record<string, unknown> | undefined;
  if (!body || typeof body.query !== "string" || !body.query.trim()) {
    return res.status(400).json({
      error: "Query string is required"
    });
  }

  const query = body.query.trim().slice(0, 2000);
  const q = query.toLowerCase();

  // Basic intelligent fallback logic for API callers
  let reply = `I am **SIN**, SinTech's intelligent technical advisor. I can assist with our services, our team, project scopes, or troubleshooting software and code challenges.`;
  let suggestions = ["What services do you offer?", "How do I start a project?", "Help me debug an error", "Meet the SinTech team"];

  if (q.includes("founder") || q.includes("who started") || q.includes("team")) {
    reply = `### SinTech Team & Leadership\nSinTech was founded by:\n* **Mostafic Yellahy Nahid** — Founder & Lead Architect\n* **Iftikher Rahman Ifti** — Co-Founder & Management Head\n* **Samir Hossain Sobuj** — Co-Founder & Marketing Head\n\nSupported by 15+ specialists across Engineering, Design, QA, and Data Research based in Dhaka, Bangladesh.`;
    suggestions = ["View full team", "Book a consultation", "Explore services"];
  } else if (q.includes("service") || q.includes("build") || q.includes("software") || q.includes("web") || q.includes("mobile")) {
    reply = `### SinTech Services\n* **Software Development:** Custom enterprise applications, microservices, and backend APIs.\n* **Website Development:** Next.js, React, Tailwind CSS, performance & SEO.\n* **Mobile App Development:** Cross-platform iOS & Android with Flutter and React Native.\n* **QA & Testing:** Automated testing, manual checks, performance testing.\n* **Research & Data Analysis:** Power BI, Python pipelines, ML modeling.\n* **UI/UX & Design:** Figma prototypes, user journeys, design systems.`;
    suggestions = ["Fixed-scope pricing", "Dedicated team model", "Contact Us"];
  } else if (q.includes("cors")) {
    reply = `### CORS Resolution\nCORS occurs when the browser blocks cross-origin requests without server permission. Ensure your server responds to preflight OPTIONS requests with \`Access-Control-Allow-Origin: <origin>\` and \`Access-Control-Allow-Credentials: true\`.`;
    suggestions = ["Authentication advice", "Software Services", "Contact engineering"];
  }

  return res.json({
    reply,
    suggestions,
    status: "ok"
  });
});

export default router;
