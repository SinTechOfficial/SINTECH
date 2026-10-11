import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const configFile = path.join(packageDir, "vite.config.ts");
const publicDir = path.join(packageDir, "dist/public");
const serverDir = path.join(packageDir, "dist/server");
const rawBasePath = process.env.BASE_PATH || "/";
const basePrefix = rawBasePath.startsWith("/")
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : `/${rawBasePath.replace(/^\.?\/+|\/+$/g, "")}`;

process.env.PORT ||= "4173";
process.env.BASE_PATH ||= "/";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function getAppPath(routePath) {
  const prefix = basePrefix === "/" ? "" : basePrefix;
  return routePath === "/" ? `${prefix}/` : `${prefix}${routePath}`;
}

function createHead(seo, routePath, origin) {
  const title = `${seo.title} | SinTech`;
  const isNotFound = routePath === "/__not-found__";
  const canonical = origin && !isNotFound
    ? `<link rel="canonical" href="${escapeHtml(`${origin}${routePath}`)}">`
    : "";
  const openGraphUrl = origin
    ? `<meta property="og:url" content="${escapeHtml(`${origin}${routePath}`)}">`
    : "";
  const imageUrl = origin
    ? `<meta property="og:image" content="${escapeHtml(`${origin}/opengraph.jpg`)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:image" content="${escapeHtml(`${origin}/opengraph.jpg`)}">`
    : "";
  const type = routePath.startsWith("/insights/") ? "article" : "website";
  const jsonLd = seo.jsonLd
    ? `<script id="route-jsonld" type="application/ld+json">${safeJson(seo.jsonLd)}</script>`
    : "";
  const noindex = isNotFound ? `<meta name="robots" content="noindex, nofollow">` : "";
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:type" content="${type}">`,
    openGraphUrl,
    imageUrl,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="theme-color" content="#0a1224">`,
    noindex,
    canonical,
    jsonLd,
  ]
    .filter(Boolean)
    .join("\n    ");
}

function withSeoAndMarkup(template, markup, seo, routePath, origin) {
  const titlePattern = /<title>[\s\S]*?<\/title>/i;
  const rootPattern = /<div id="root"><\/div>/;
  if (!titlePattern.test(template) || !rootPattern.test(template)) {
    throw new Error("The Vite HTML shell does not contain the expected title and root.");
  }
  return template
    .replace(titlePattern, "")
    .replace("</head>", `${createHead(seo, routePath, origin)}\n  </head>`)
    .replace(rootPattern, `<div id="root">${markup}</div>`);
}

async function main() {
  if (process.env.ANALYZE === "true") {
    await mkdir(path.resolve(packageDir, "../../generated-artifacts"), {
      recursive: true,
    });
  }
  await build({ configFile, mode: "production" });
  process.env.SINTECH_SSR_BUILD = "true";
  await build({
    configFile,
    mode: "production",
    build: {
      ssr: path.join(packageDir, "src/entry-server.tsx"),
      outDir: serverDir,
      emptyOutDir: true,
      rollupOptions: {
        output: { entryFileNames: "entry-server.js" },
      },
    },
  });
  delete process.env.SINTECH_SSR_BUILD;

  const serverEntry = path.join(serverDir, "entry-server.js");
  const server = await import(
    `${pathToFileURL(serverEntry).href}?built=${Date.now()}`
  );
  // Reuse the same route/content data as the application rather than keeping
  // a second, handwritten list of routes in this build script.
  const { publicRouteSeo, getSiteOrigin, assertPublishableContent, site } = server;
  assertPublishableContent();
  const origin = getSiteOrigin();
  const template = await readFile(path.join(publicDir, "index.html"), "utf8");

  for (const route of publicRouteSeo) {
    const outputDir = path.join(publicDir, route.path.replace(/^\/+|\/+$/g, ""));
    const htmlPath =
      route.path === "/"
        ? path.join(publicDir, "index.html")
        : path.join(outputDir, "index.html");
    await mkdir(path.dirname(htmlPath), { recursive: true });
    const markup = await server.renderRoute(getAppPath(route.path));
    await writeFile(
      htmlPath,
      withSeoAndMarkup(template, markup, route, route.path, origin),
    );
  }

  const notFoundPath = "/__not-found__";
  const notFoundHtml = withSeoAndMarkup(
    template,
    await server.renderRoute(getAppPath(notFoundPath)),
    {
      title: "Page not found",
      description: "The page you requested could not be found.",
    },
    notFoundPath,
    origin,
  );
  await writeFile(path.join(publicDir, "404.html"), notFoundHtml);

  const sitemapEntries = origin
    ? publicRouteSeo
        .map(
          (route) =>
            `<url><loc>${escapeHtml(`${origin}${route.path}`)}</loc></url>`,
        )
        .join("\n  ")
    : "<!-- Set VITE_SITE_URL to generate absolute sitemap entries. -->";
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${sitemapEntries}\n</urlset>\n`;
  await writeFile(path.join(publicDir, "sitemap.xml"), sitemap);

  const robots = [
    "User-agent: *",
    "Allow: /",
    ...(origin ? [`Sitemap: ${origin}/sitemap.xml`] : []),
    "",
  ].join("\n");
  await writeFile(path.join(publicDir, "robots.txt"), robots);

  const publicLinks = publicRouteSeo
    .map(
      (route) =>
        `- [${route.title}](${origin ? `${origin}${route.path}` : route.path})`,
    )
    .join("\n");
  const llms = `# ${site.name}\n\n> ${site.tagline}\n\nSinTech's listed service areas are software development, website development, mobile app development, QA and testing, research and data analysis, and UI/UX and graphic design.\n\n## Public pages\n\n${publicLinks}\n\n## Contact\n\nEmail: ${site.contactEmail}\n\nCase studies, testimonials, and insight articles are only listed here after approved content is supplied and published.\n`;
  await writeFile(path.join(publicDir, "llms.txt"), llms);

  console.log(
    `Prerendered ${publicRouteSeo.length} routes. ${
      origin ? "Canonical URLs and sitemap entries are enabled." : "Set VITE_SITE_URL to enable canonical URLs and sitemap entries."
    }`,
  );
}

main().catch((error) => {
  process.stderr.write(
    `Static prerender failed: ${error instanceof Error ? error.stack : String(error)}\n`,
  );
  process.exitCode = 1;
});
