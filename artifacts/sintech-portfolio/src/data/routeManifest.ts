import { faqs } from "./faq";
import { posts } from "./posts";
import { projects } from "./projects";
import { services } from "./services";
import { site } from "./site";
import { testimonials } from "./testimonials";

export type RouteSeo = {
  path: string;
  title: string;
  description: string;
  jsonLd?: unknown;
};

const origin = site.domain ? new URL(site.domain).origin : "";
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  email: site.contactEmail,
  ...(origin ? { url: origin } : {}),
};
const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  ...(origin ? { url: origin } : {}),
};
const faqSchema = (items: readonly { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

export const publicRouteSeo: RouteSeo[] = [
  {
    path: "/",
    title: "Software, web and mobile development",
    description: site.metaDescription,
    jsonLd: [organization, website, faqSchema(faqs)],
  },
  {
    path: "/services",
    title: "Services",
    description:
      "Explore SinTech software, website, mobile, quality assurance, research, and design services.",
  },
  {
    path: "/work",
    title: "Work",
    description: "Published SinTech case studies and project examples.",
  },
  {
    path: "/about",
    title: "About SinTech",
    description:
      "Learn about SinTech and the software, web, mobile, design, research, and QA services it offers.",
    jsonLd: organization,
  },
  {
    path: "/team",
    title: "Team",
    description: "Meet the founders and team members listed by SinTech.",
  },
  {
    path: "/careers",
    title: "Careers",
    description: "SinTech careers and open roles.",
  },
  {
    path: "/insights",
    title: "Insights",
    description: "Articles and practical notes from SinTech.",
  },
  {
    path: "/security",
    title: "Security",
    description: "How to ask SinTech about security requirements for a project.",
  },
  {
    path: "/contact",
    title: "Contact",
    description:
      "Send SinTech a project brief with your service, budget, timeline, and contact details.",
  },
  {
    path: "/privacy",
    title: "Privacy",
    description:
      "Privacy information for the SinTech website and project contact form.",
  },
  {
    path: "/terms",
    title: "Terms",
    description: "Website terms information for SinTech.",
  },
  ...services.map((service) => ({
    path: `/services/${service.slug}`,
    title: service.title,
    description: service.short,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: organization,
        ...(origin ? { url: `${origin}/services/${service.slug}` } : {}),
      },
      faqSchema(service.faqs),
    ],
  })),
  ...projects
    .filter((project) => project.published)
    .map((project) => ({
      path: `/work/${project.slug}`,
      title: project.title,
      description: project.summary,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        ...(origin ? { url: `${origin}/work/${project.slug}` } : {}),
      },
    })),
  ...posts
    .filter((post) => post.published)
    .map((post) => ({
      path: `/insights/${post.slug}`,
      title: post.title,
      description: post.summary,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.summary,
        ...(post.date ? { datePublished: post.date } : {}),
        author: organization,
        publisher: organization,
        ...(origin ? { mainEntityOfPage: `${origin}/insights/${post.slug}` } : {}),
      },
    })),
];

export function normalizeRoutePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

export function getSeoForPath(path: string): RouteSeo | undefined {
  const normalized = normalizeRoutePath(path);
  return publicRouteSeo.find((route) => route.path === normalized);
}

export function getSiteOrigin(): string {
  return origin;
}

export function assertPublishableContent(): void {
  const errors: string[] = [];
  const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  for (const service of services) {
    if (!validSlug.test(service.slug)) {
      errors.push(`Service has an invalid URL slug: ${service.slug}`);
    }
  }
  for (const project of projects.filter((item) => item.published)) {
    if (!validSlug.test(project.slug)) {
      errors.push(`Published case study has an invalid URL slug: ${project.slug}`);
    }
    for (const field of ["title", "service", "summary", "problem", "approach", "solution"] as const) {
      if (!project[field].trim()) {
        errors.push(`Published case study "${project.slug}" is missing ${field}.`);
      }
    }
  }
  for (const post of posts.filter((item) => item.published)) {
    if (!validSlug.test(post.slug)) {
      errors.push(`Published article has an invalid URL slug: ${post.slug}`);
    }
    if (!post.title.trim() || !post.summary.trim() || !post.body?.trim()) {
      errors.push(`Published article "${post.slug}" needs a title, summary, and final body.`);
    }
    if (post.date && Number.isNaN(Date.parse(post.date))) {
      errors.push(`Published article "${post.slug}" has an invalid publication date.`);
    }
  }
  for (const testimonial of testimonials.filter((item) => item.published)) {
    if (![testimonial.quote, testimonial.name, testimonial.role, testimonial.company].every((value) => value.trim())) {
      errors.push("A published testimonial is missing its quote or attribution.");
    }
  }

  if (errors.length) {
    throw new Error(`Published content is incomplete:\n- ${errors.join("\n- ")}`);
  }
}
