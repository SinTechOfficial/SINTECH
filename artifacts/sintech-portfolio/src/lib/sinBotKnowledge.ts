import { site } from "../data/site";
import { services } from "../data/services";
import { founders, team } from "../data/team";
import { processSteps } from "../data/process";
import { faqs } from "../data/faq";

export interface SinBotResponse {
  reply: string;
  suggestions?: string[];
  category?: "services" | "team" | "process" | "software-problem" | "pricing" | "contact" | "general";
}

// Technical Knowledge Base for Software Related Problems
const technicalSolutions: Array<{
  keywords: string[];
  topic: string;
  answer: string;
  suggestions: string[];
}> = [
  {
    keywords: ["cors", "cross-origin", "access-control-allow-origin", "preflight"],
    topic: "CORS (Cross-Origin Resource Sharing)",
    answer: `### Diagnosing & Fixing CORS Errors

CORS is a browser security mechanism that blocks cross-origin requests unless the server explicitly allows them.

#### 1. Common Causes
* **Missing server headers:** The server didn't respond with \`Access-Control-Allow-Origin: <origin>\`.
* **Mismatched credentials:** If sending cookies or \`Authorization\` headers, server cannot use wildcard \`*\`; it must echo the specific origin and include \`Access-Control-Allow-Credentials: true\`.
* **Failed Preflight (OPTIONS):** Browsers send an HTTP \`OPTIONS\` request before \`POST\`/\`PUT\` with JSON bodies. If your server rejects \`OPTIONS\` (e.g. 401 or 404), the request fails.

#### 2. Express.js / Node.js Fix:
\`\`\`typescript
import cors from "cors";

const allowedOrigins = new Set(["https://sintech.dev", "http://localhost:5173"]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
\`\`\`

Need SinTech to review your API infrastructure? [Contact our engineering team](/contact).`,
    suggestions: ["API Architecture help", "Authentication issues", "Explore Backend Services"]
  },
  {
    keywords: ["hydration", "hydration failed", "server-rendered", "client-side", "mismatch"],
    topic: "React & Next.js Hydration Errors",
    answer: `### Resolving React / Next.js Hydration Mismatches

Hydration errors happen when the HTML generated on the server (SSR) differs from the first render on the client browser.

#### 1. Why it happens:
* **Browser-only globals:** Using \`window\`, \`localStorage\`, or \`document\` during the initial render pass.
* **Non-deterministic values:** Using \`Date.now()\`, \`Math.random()\`, or local timezone dates.
* **Invalid HTML nesting:** Placing \`<div>\` inside \`<p>\`, or \`<a>\` inside \`<a>\`.
* **Browser extensions:** Extensions injecting attributes or elements into the DOM.

#### 2. The Clean Solution:
\`\`\`tsx
import { useState, useEffect } from "react";

export function ClientOnlyComponent() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Return identical server fallback
    return <div className="skeleton-placeholder" />;
  }

  return <div>Client-only: {window.innerWidth}px</div>;
}
\`\`\`

SinTech builds robust SSR/SSG web platforms using React 19 & Next.js. [Explore Website Development](/services/website-development).`,
    suggestions: ["React performance tips", "Next.js App Router", "Explore Web Services"]
  },
  {
    keywords: ["infinite loop", "maximum update depth", "re-render", "rerender", "useeffect loop"],
    topic: "React Infinite Re-renders & Update Loops",
    answer: `### Fixing "Maximum update depth exceeded" in React

This occurs when a state update triggers a re-render, which immediately triggers the same state update in an unbroken cycle.

#### 1. Root Causes:
* **Calling setState directly in render:** \`<button onClick={handleClick()}>\` instead of \`<button onClick={() => handleClick()}>\`.
* **Unstable useEffect dependencies:** Updating state inside \`useEffect\` where that state (or an object/array created inside render) is in the dependency array.

#### 2. Recommended Patterns:
\`\`\`tsx
// ❌ WRONG: Creates a new object reference on every render
const options = { filter: activeTab };
useEffect(() => {
  fetchData(options);
}, [options]); // Causes infinite loop!

// ✅ CORRECT: Extract primitives or useMemo
useEffect(() => {
  fetchData(activeTab);
}, [activeTab]);

// ✅ CORRECT: Use functional state updates to avoid dependency cycles
setCount(prev => prev + 1);
\`\`\`

Want fullstack optimization? [Talk to SinTech](/contact).`,
    suggestions: ["State management choice", "React 19 upgrades", "Software Development Service"]
  },
  {
    keywords: ["slow query", "database", "postgres", "sql", "indexing", "n+1"],
    topic: "Database Performance & Query Optimization",
    answer: `### Diagnosing & Optimizing Slow Database Queries

Sluggish database response times degrade entire applications. Here is how we diagnose and fix them at SinTech:

#### 1. Run EXPLAIN ANALYZE
\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.id, u.name, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name;
\`\`\`
Look for **Seq Scan** (Sequential Scan) on large tables—this indicates a missing index!

#### 2. Adding Targeted Indexes
\`\`\`sql
-- Index columns used in WHERE, JOIN, and ORDER BY
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_users_created_at ON users(created_at);
-- Composite index for multi-column filters
CREATE INDEX idx_users_status_created ON users(status, created_at DESC);
\`\`\`

#### 3. Solving the N+1 Query Problem:
In ORMs (Prisma, Drizzle, Hibernate), fetching parent entities and then looping to fetch children triggers N+1 roundtrips. Always use \`include\`, \`joins\`, or batched loading (\`DataLoader\`).

SinTech architects high-throughput databases and data pipelines. [Explore Data Analysis Services](/services/research-data-analysis).`,
    suggestions: ["Postgres vs MongoDB", "Caching with Redis", "Software Development"]
  },
  {
    keywords: ["jwt", "authentication", "session", "auth", "refresh token", "oauth"],
    topic: "Modern Authentication & Token Security",
    answer: `### Secure Authentication Architecture

Token security is critical for enterprise applications. Here is SinTech's recommended standard:

#### 1. Storage Strategy:
* **Access Tokens:** Short-lived (5–15 minutes). Keep in memory or send via \`Authorization: Bearer <token>\`.
* **Refresh Tokens:** Long-lived (7–30 days). Store in **\`HttpOnly, Secure, SameSite=Strict\` cookies** so JavaScript cannot access them (mitigating XSS).

#### 2. Token Invalidation & Rotation:
* When a refresh token is used, issue a new refresh token and invalidate the previous one.
* If a reuse attempt of an old refresh token is detected, invalidate the user's entire session family (indicates token theft).

SinTech implements enterprise-grade authentication with Zero-Trust principles. [Explore Security](/security) or [Software Development](/services/software-development).`,
    suggestions: ["Zero-Trust Security", "API rate limiting", "Discuss a project"]
  },
  {
    keywords: ["flutter", "react native", "mobile", "ios", "android", "app dev"],
    topic: "Flutter vs. React Native Decision Matrix",
    answer: `### Choosing Between Flutter and React Native

Both are industry-leading cross-platform mobile frameworks. Here is our engineering breakdown:

| Criteria | Flutter (Dart) | React Native (TypeScript) |
|---|---|---|
| **Performance** | Compiles to native ARM machine code via Skia/Impeller | Native bridge / TurboModules architecture |
| **UI Consistency** | 100% pixel-perfect identical UI across iOS & Android | Uses native OS widgets, feels natively native |
| **Ecosystem & Code Sharing**| Great widget catalog; separate from web React | Shares components/logic with React web app |
| **Best For** | High-fidelity animations, custom branded apps | Teams with existing React web codebases |

SinTech delivers end-to-end mobile products for both iOS and Android. [Explore Mobile App Development](/services/mobile-app-development).`,
    suggestions: ["Mobile App Development", "Request a mobile quote", "See Team members"]
  },
  {
    keywords: ["scale", "scaling", "architecture", "microservices", "monolith", "high traffic"],
    topic: "System Design: Scaling to High Traffic",
    answer: `### Enterprise System Design: Scaling Web Applications

When preparing a software product for massive user growth:

1. **Stateless App Servers:** Decouple session storage into Redis/Memcached so backend containers can scale horizontally behind a load balancer (AWS ALB/Nginx).
2. **Database Read Replicas:** Route read queries (\`SELECT\`) to read replicas and write queries (\`INSERT/UPDATE\`) to the primary database.
3. **Edge Caching & CDN:** Place Cloudflare or AWS CloudFront in front of static assets and cacheable dynamic GET requests.
4. **Asynchronous Queues:** Offload slow tasks (emails, PDF generation, AI processing, webhooks) to background workers using Redis BullMQ, RabbitMQ, or AWS SQS.
5. **Circuit Breakers & Rate Limiting:** Prevent cascading failures when third-party APIs fail.

SinTech architects resilient, high-availability software platforms. [Schedule a consultation with our architects](/contact).`,
    suggestions: ["Book Free Consultation", "Software Development", "Explore Case Studies"]
  },
  {
    keywords: ["docker", "container", "dockerfile", "deploy", "kubernetes"],
    topic: "Docker & Containerization Best Practices",
    answer: `### Docker Production Best Practices

#### Multi-Stage Build Example (Node.js):
\`\`\`dockerfile
# 1. Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Production Runtime Stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

#### Key Rules:
* Always run as a non-root user (\`USER node\`).
* Use \`.dockerignore\` to exclude \`node_modules\`, \`.git\`, and local secrets.
* Leverage layer caching: copy \`package.json\` before copying source code.

SinTech manages automated CI/CD and cloud container deployments. [Explore DevOps & QA](/services/qa-testing).`,
    suggestions: ["CI/CD pipelines", "Software Development", "Contact SinTech"]
  },
  {
    keywords: ["testing", "qa", "cypress", "jest", "unit test", "playwright"],
    topic: "Quality Assurance & Test Automation Strategy",
    answer: `### Full-Spectrum QA Strategy at SinTech

A resilient software release pipeline follows the **Testing Pyramid**:

1. **Unit Tests (Vitest/Jest):** Test pure functions, business logic, calculations, and data transformers. Fast and deterministic.
2. **Integration Tests:** Verify database queries, API endpoints, and authentication middleware.
3. **End-to-End (E2E) Tests (Playwright / Cypress):** Verify critical user journeys: sign-up, checkout, payment, workflow submission.
4. **Automated CI/CD Gates:** Block pull requests if tests fail, lint errors exist, or code coverage drops.

SinTech offers dedicated QA & Testing services covering manual exploratory and automated suites. [Learn about QA & Testing](/services/qa-testing).`,
    suggestions: ["QA & Testing Service", "Meet the QA Team", "Book a free consultation"]
  }
];

// Website & Company Knowledge Handler
export function generateSinResponse(userQuery: string): SinBotResponse {
  const query = userQuery.trim().toLowerCase();

  if (!query) {
    return {
      reply: "Hello! I am **SIN**, your SinTech Intelligent Navigator. Ask me anything about our services, our team, project models, or any software and coding challenge!",
      suggestions: ["What services do you offer?", "How do I start a project?", "Help me debug an error", "Meet the SinTech team"]
    };
  }

  // 1. Greetings
  if (query.match(/^(hi|hello|hey|greetings|hola|good morning|good evening|who are you|what is your name)/i)) {
    return {
      reply: `Hello! I am **SIN**, the AI Navigator for **SinTech** (*Tech is the Solution*). 

I have full knowledge of our entire company, including:
* 🌐 **Our 6 Core Services** (Software, Web, Mobile, QA, Research/Data, Design)
* 👥 **Our Founders & 15+ Team Specialists**
* 🚀 **Engagement Models & Delivery Process**
* 💻 **Software Engineering & Technical Problem Solving** (React, Next.js, APIs, Postgres, Docker, Security, etc.)

How can I assist your project today?`,
      suggestions: ["Explore our Services", "How do we work together?", "Solve a coding issue", "Book a free consultation"],
      category: "general"
    };
  }

  // 2. Founders & Leadership
  if (query.includes("founder") || query.includes("who started") || query.includes("owner") || query.includes("ceo") || query.includes("leadership")) {
    const foundersList = founders.map(f => `* **${f.name}** — ${f.role} (${f.department})`).join("\n");
    return {
      reply: `### Leadership & Founders of SinTech

SinTech was founded by experienced technologists dedicated to high-standard digital product delivery:

${foundersList}

Supported by a multidisciplinary team spanning Engineering, UI/UX Design, QA Testing, Research, Data Analysis, and HR based in **Dhaka, Bangladesh**.

Would you like to explore our full team or discuss a project?
[View the entire SinTech Team](/team) · [Start a Project](/contact)`,
      suggestions: ["Meet the full team", "Book a consultation", "Explore services"],
      category: "team"
    };
  }

  // 3. Team inquiries
  if (query.includes("team") || query.includes("developer") || query.includes("designer") || query.includes("who works") || query.includes("staff")) {
    const engCount = team.filter(p => p.department === "Engineering").length + 1;
    const designCount = team.filter(p => p.department === "Design").length;
    const qaCount = team.filter(p => p.department === "QA").length;
    const researchCount = team.filter(p => p.department === "Research").length;

    return {
      reply: `### The SinTech Team

SinTech brings together 15+ dedicated professionals across core digital disciplines:

* 💻 **Engineering (${engCount} members):** Lead Architect Mostafic Yellahy Nahid, Lead Dev Enamul Hakim Khan, Coders Mahbul Islam & Shahed Ahmed Sium.
* 🎨 **UI/UX & Design (${designCount} members):** Lead Designer Ashraful Islam, Farhan Alam, Mairea, Tahrim Maria.
* 🛡️ **QA & Testing (${qaCount} members):** QA Engineer Rifat Ahmed Ratul, Lead QA Ashraful Islam.
* 📊 **Research & Data (${researchCount} members):** Ashraful Haque Akash, Md Emon Hossain.
* 📈 **Management & HR:** Iftikher Rahman Ifti, Samir Hossain Sobuj, Monira Islam Eva, Tanzina Akter Tanni.

[Browse individual profiles on our Team Page](/team).`,
      suggestions: ["Services we deliver", "How to hire the team", "Start a project"],
      category: "team"
    };
  }

  // 4. Contact, Booking, Pricing, Quote
  if (query.includes("contact") || query.includes("hire") || query.includes("price") || query.includes("cost") || query.includes("quote") || query.includes("book") || query.includes("email") || query.includes("consultation")) {
    return {
      reply: `### Getting Started With SinTech

We offer clear, transparent collaboration with no hidden obligations:

* 📅 **Free Technical Consultation:** We discuss your brief, scope, and technical roadmap.
* ✉️ **Direct Email:** [${site.contactEmail}](mailto:${site.contactEmail})
* 📍 **Location:** ${site.location}
* 📋 **Project Inquiry Form:** [Open the Project Brief Form](/contact)

#### Available Engagement Models:
1. **Fixed-Scope Project:** Clear deliverables, budget, and review milestones agreed before build begins.
2. **Dedicated Team:** Full-time cross-functional squad embedded into your product lifecycle.
3. **Ongoing Support & Maintenance:** Dedicated SLA for updates, security patches, and optimizations.

[Click here to start a project with SinTech](/contact)`,
      suggestions: ["Book Free Consultation", "Explore Services", "Our Delivery Process"],
      category: "pricing"
    };
  }

  // 5. Specific Service Matching
  for (const s of services) {
    const titleMatch = query.includes(s.title.toLowerCase()) || query.includes(s.slug.replace(/-/g, " "));
    const techMatch = s.technologies.some(t => query.includes(t.toLowerCase()));
    
    if (titleMatch || (techMatch && query.includes("service"))) {
      const delivs = s.deliverables.map(d => `* ${d}`).join("\n");
      const techs = s.technologies.join(", ");
      return {
        reply: `### ${s.title} (Service #${s.number})

${s.description}

#### Key Deliverables:
${delivs}

#### Technologies & Tools:
**${techs}**

* **Target Audience:** ${s.audience}

[Read full service details](/services/${s.slug}) or [Inquire about this service](/contact).`,
        suggestions: ["All 6 Services Overview", "Discuss this service", "Delivery timeline"],
        category: "services"
      };
    }
  }

  // 6. General Services Inquiries
  if (query.includes("service") || query.includes("capabilities") || query.includes("what can you do") || query.includes("what do you build")) {
    const serviceList = services.map(s => `* **[${s.title}](/services/${s.slug}):** ${s.short}`).join("\n");
    return {
      reply: `### SinTech Capabilities & Services

SinTech covers the entire digital product journey:

${serviceList}

Plus specialized **Cybersecurity & Zero-Trust Defense** and **Digital Marketing/SEO Growth**.

Which area matches your current roadmap?`,
      suggestions: ["Software Development", "Website Development", "Mobile App Development", "QA & Testing"],
      category: "services"
    };
  }

  // 7. Delivery Process / How work moves
  if (query.includes("process") || query.includes("workflow") || query.includes("how work moves") || query.includes("steps") || query.includes("timeline")) {
    const steps = processSteps.map((p, i) => `**0${i + 1}. ${p.title}:** ${p.text}`).join("\n\n");
    return {
      reply: `### The SinTech Delivery Process

We take projects through a structured, predictable pipeline:

${steps}

Every stage features regular demos, clear review gates, and complete visibility. [Start your project journey today](/contact).`,
      suggestions: ["Book a consultation", "Explore services", "Security & NDA"],
      category: "process"
    };
  }

  // 8. Security & NDA
  if (query.includes("security") || query.includes("nda") || query.includes("confidential") || query.includes("intellectual property") || query.includes("ip ownership")) {
    return {
      reply: `### Security, Privacy & Intellectual Property

At SinTech, security and client trust are foundational:

* 🛡️ **Non-Disclosure Agreements (NDAs):** We sign standard mutual NDAs before reviewing sensitive technical briefs or proprietary codebases.
* 🔒 **Zero-Trust Architecture:** Principle of least privilege, encrypted data transit, secure environment variable segregation, and automated dependency scanning.
* 📜 **Full IP Ownership:** Upon project completion and payment, 100% of the custom source code, documentation, and design assets belong to you.

[Read our Security Details](/security) or [Contact us directly](/contact).`,
      suggestions: ["Start a Project", "Contact Engineering", "Services Overview"],
      category: "general"
    };
  }

  // 9. Match Technical Problem / Software Solution Knowledge Base
  for (const sol of technicalSolutions) {
    const isMatch = sol.keywords.some(k => query.includes(k));
    if (isMatch) {
      return {
        reply: sol.answer,
        suggestions: sol.suggestions,
        category: "software-problem"
      };
    }
  }

  // 10. General Software / Coding / Technical Query Fallback
  if (query.includes("code") || query.includes("error") || query.includes("bug") || query.includes("react") || query.includes("node") || query.includes("python") || query.includes("api") || query.includes("database") || query.includes("css") || query.includes("typescript")) {
    return {
      reply: `### Technical Guidance from SIN

As SinTech's technical assistant, I can diagnose and provide solutions for:

1. **Frontend & UI:** React 19, Next.js, state management, hydration errors, bundle splitting, and CSS 3D transforms.
2. **Backend & APIs:** Node.js/Express, Python/FastAPI, RESTful standards, GraphQL, WebSockets, CORS, and JWT authentication.
3. **Database Architecture:** PostgreSQL indexing, query optimization with \`EXPLAIN ANALYZE\`, Drizzle/Prisma ORMs, and Redis caching.
4. **Mobile & DevOps:** Cross-platform Flutter/React Native builds, Docker containers, CI/CD pipelines, and zero-downtime deployment.

Please share the specific error message, code snippet, or architectural question you are working through!`,
      suggestions: ["CORS Error fix", "Database slow queries", "Hydration mismatch", "Talk to an Architect"],
      category: "software-problem"
    };
  }

  // 11. Smart Default Fallback
  return {
    reply: `I understand you're asking about **"${userQuery}"**.

As **SIN**, I can assist with both SinTech company information and deep software problem solving:

* 🚀 **Services & Projects:** Learn about our [Software Development](/services/software-development), [Web Platforms](/services/website-development), or [Mobile Apps](/services/mobile-app-development).
* 👥 **Our Team:** Meet our [founders & developers](/team).
* 💻 **Technical Troubleshooting:** Ask about fixing CORS, SQL query performance, React hydration, or Docker builds.
* 📬 **Consultation:** [Book a free project discussion](/contact).

What would you like to explore?`,
    suggestions: [
      "What services do you offer?",
      "How to fix a CORS error?",
      "How do we start a project?",
      "Meet the founders"
    ],
    category: "general"
  };
}
