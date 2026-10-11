import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const publicRoot = path.join(packageDir, "dist/public");
const rawBasePath = process.env.BASE_PATH || "/";
const basePrefix = `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`.replace(
  /^\/$/,
  "",
);
const errors = [];

async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await htmlFiles(fullPath)));
    else if (entry.name.endsWith(".html")) result.push(fullPath);
  }
  return result;
}

function routeFromFile(file) {
  const relative = path.relative(publicRoot, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative === "404.html") return "/__404__";
  return `/${relative.replace(/\/index\.html$/, "").replace(/\.html$/, "")}`;
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match?.[1] ?? match?.[2] ?? "";
}

function stripBase(pathname) {
  if (!basePrefix || pathname === basePrefix) return pathname === basePrefix ? "/" : pathname;
  if (pathname.startsWith(`${basePrefix}/`)) {
    return pathname.slice(basePrefix.length) || "/";
  }
  return pathname;
}

async function resolvePublicFile(pathname) {
  const normalized = decodeURIComponent(pathname);
  const candidates = [...new Set([normalized, stripBase(normalized)])];
  for (const candidate of candidates) {
    const safePath = path.resolve(publicRoot, `.${candidate.startsWith("/") ? candidate : `/${candidate}`}`);
    if (!safePath.startsWith(`${publicRoot}${path.sep}`) && safePath !== publicRoot) continue;
    try {
      const details = await stat(safePath);
      if (details.isFile()) return safePath;
      if (details.isDirectory()) {
        const indexFile = path.join(safePath, "index.html");
        await access(indexFile);
        return indexFile;
      }
    } catch {
      if (!path.extname(safePath)) {
        try {
          const indexFile = path.join(safePath, "index.html");
          await access(indexFile);
          return indexFile;
        } catch {
          // Try the base-stripped candidate next.
        }
      }
    }
  }
  return undefined;
}

async function main() {
  await access(publicRoot);
  const pages = (await htmlFiles(publicRoot)).sort();
  const routePages = pages.filter((file) => !file.endsWith(`${path.sep}404.html`) && file !== path.join(publicRoot, "404.html"));
  if (routePages.length < 17) {
    errors.push(`Expected at least 17 published route pages; found ${routePages.length}.`);
  }

  for (const file of pages) {
    const html = await readFile(file, "utf8");
    const route = routeFromFile(file);
    const is404 = route === "/__404__";
    const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
    const descriptions = [...html.matchAll(/<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']*["'])[^>]*>/gi)];
    const headings = [...html.matchAll(/<h1\b/gi)];

    if (titles.length !== 1 || !titles[0]?.[1].trim()) {
      errors.push(`${route}: expected exactly one non-empty title.`);
    }
    if (descriptions.length !== 1) {
      errors.push(`${route}: expected exactly one meta description.`);
    }
    if (headings.length !== 1) {
      errors.push(`${route}: expected exactly one H1; found ${headings.length}.`);
    }
    if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) {
      errors.push(`${route}: document language is missing.`);
    }
    if (!/<main\b/i.test(html)) errors.push(`${route}: main landmark is missing.`);
    if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) {
      errors.push(`${route}: viewport metadata is missing.`);
    }
    if (is404 && !/<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex/i.test(html)) {
      errors.push("404 route should be marked noindex.");
    }

    const tags = [...html.matchAll(/<(?:a|link|img|script|source)\b[^>]*>/gi)].map((item) => item[0]);
    for (const tag of tags) {
      const isImage = /^<img\b/i.test(tag);
      if (isImage && !/\balt\s*=/i.test(tag)) {
        errors.push(`${route}: image is missing alt text.`);
      }
      for (const name of ["href", "src"]) {
        const value = attribute(tag, name).trim();
        if (!value || value.startsWith("#") || /^(?:data:|mailto:|tel:|javascript:|https?:|\/\/)/i.test(value)) continue;
        const url = new URL(value, `https://sintech.invalid${route === "/__404__" ? "/" : route}`);
        const targetFile = await resolvePublicFile(url.pathname);
        if (!targetFile) {
          errors.push(`${route}: local ${name} target does not exist: ${value}`);
          continue;
        }
        if (url.hash && targetFile.endsWith(".html")) {
          const targetHtml = await readFile(targetFile, "utf8");
          const id = decodeURIComponent(url.hash.slice(1));
          if (id && !new RegExp(`\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(targetHtml)) {
            errors.push(`${route}: local anchor target was not found: ${value}`);
          }
        }
      }
      const srcset = attribute(tag, "srcset");
      if (srcset) {
        for (const candidate of srcset.split(",")) {
          const value = candidate.trim().split(/\s+/)[0];
          if (!value || /^(?:data:|https?:|\/\/)/i.test(value)) continue;
          const url = new URL(value, `https://sintech.invalid${route === "/__404__" ? "/" : route}`);
          if (!(await resolvePublicFile(url.pathname))) {
            errors.push(`${route}: local srcset target does not exist: ${value}`);
          }
        }
      }
    }
  }

  if (errors.length) {
    process.stderr.write(`Site output check failed (${errors.length}):\n- ${errors.join("\n- ")}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    `Site output check passed: ${routePages.length} prerendered route pages and a 404 page; titles, descriptions, H1s, landmarks, images, internal links, and anchors checked.\n`,
  );
}

main().catch((error) => {
  process.stderr.write(
    `Site output check failed: ${error instanceof Error ? error.stack : String(error)}\n`,
  );
  process.exitCode = 1;
});
