import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve(
  process.cwd(),
  "../artifacts/sintech-portfolio/public",
);
const imageDir = path.join(publicDir, "images");
const sourceLogo = path.join(imageDir, "sintech-logo-transparent.png");

const ogImage = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1224"/>
      <stop offset="0.56" stop-color="#0f1f3d"/>
      <stop offset="1" stop-color="#132c55"/>
    </linearGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#ffffff" stroke-opacity=".045"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1020" cy="115" r="235" fill="#1e4ab8" fill-opacity=".28"/>
  <circle cx="1030" cy="110" r="158" fill="none" stroke="#4f8ef7" stroke-opacity=".26" stroke-width="2"/>
  <rect x="84" y="85" width="11" height="440" rx="5.5" fill="#4f8ef7"/>
  <text x="132" y="185" fill="#8cb5ff" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4">SINTECH</text>
  <text x="132" y="300" fill="#f4f7fb" font-family="Arial, sans-serif" font-size="74" font-weight="700">Tech is the</text>
  <text x="132" y="386" fill="#f4f7fb" font-family="Arial, sans-serif" font-size="74" font-weight="700">Solution.</text>
  <text x="136" y="465" fill="#bac7da" font-family="Arial, sans-serif" font-size="24">Software · Web · Mobile · Design · Research · QA</text>
  <rect x="136" y="505" width="130" height="5" rx="2.5" fill="#4f8ef7"/>
</svg>`;

async function main() {
  await fs.access(sourceLogo);
  const trimmedLogo = await sharp(sourceLogo).trim().png().toBuffer();
  const logoMetadata = await sharp(trimmedLogo).metadata();
  if (!logoMetadata.width || !logoMetadata.height) {
    throw new Error("The trimmed SinTech logo has no readable dimensions.");
  }

  const outputLogo = path.join(imageDir, "sintech-logo-trimmed.png");
  await sharp(trimmedLogo)
    .resize({ width: 800, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(outputLogo);

  const faviconSvg = await fs.readFile(
    path.join(publicDir, "favicon.svg"),
  );
  await sharp(faviconSvg).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32.png"));
  await sharp(faviconSvg).resize(192, 192).png().toFile(path.join(publicDir, "favicon-192.png"));
  await sharp(faviconSvg).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));
  await sharp(Buffer.from(ogImage))
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(publicDir, "opengraph.jpg"));

  process.stdout.write(
    `Generated brand assets. Trimmed logo: ${logoMetadata.width}×${logoMetadata.height}; output: ${outputLogo}\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Brand asset generation failed: ${error instanceof Error ? error.message : "unknown error"}\n`,
  );
  process.exitCode = 1;
});
