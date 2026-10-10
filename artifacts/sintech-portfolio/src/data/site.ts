export const site = {
  name: "SinTech",
  tagline: "Tech is the Solution",
  positioning: "",
  metaDescription: "Explore SinTech services: software, website, and mobile development, QA and testing, research and data analysis, and UI/UX and graphic design.",
  contactEmail: "sintech11395@gmail.com",
  domain: import.meta.env.VITE_SITE_URL || "",
  analyticsUrl: import.meta.env.VITE_ANALYTICS_URL || "",
  analyticsSiteId: import.meta.env.VITE_ANALYTICS_SITE_ID || "",
  budgetRanges: [] as string[],
  timelines: [] as string[],
} as const;

export const CONTENT_TODO = [
  "Confirm a one-sentence company positioning statement and the audiences or industries SinTech serves; the home page currently uses the approved tagline instead.",
  "Provide owned client logos, approved project case studies, and permissioned testimonials before publishing proof sections.",
  "Provide the production domain for canonical metadata and site discovery files.",
  "Confirm security practices, privacy/legal text, communication cadence, IP terms, NDA availability, and response expectations.",
  "Provide any booking URL, social links, WhatsApp number, careers details, and company location intended for publication.",
  "Confirm image rights and approved biographies for team members. The source portrait card says “Najid” while the existing team record says “Nahid”; confirm the correct spelling.",
  "Provide approved budget ranges and timeline options if fixed choices should appear in the contact form; both fields are free text until confirmed.",
  "Confirm the six-step project sequence before presenting it as SinTech's official delivery process.",
  "Provide final article copy before publishing any insight post.",
] as const;
