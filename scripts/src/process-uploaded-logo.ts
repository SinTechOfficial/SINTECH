import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const inputPath =
  "C:/Users/nahid/.gemini/antigravity-ide/brain/f8d76308-3f22-4933-a5ee-f3d105e77a3d/.user_uploaded/media_1791731728595.png";
const publicImageDir = path.resolve(
  scriptsDir,
  "../../artifacts/sintech-portfolio/public/images",
);

async function main() {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Step 1: Detect background pixels using BFS flood-fill from borders
  const isBg = new Uint8Array(width * height);
  const queue: number[] = [];

  function isWhiteLike(x: number, y: number): boolean {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Background is near-pure white (RGB >= 242)
    return r >= 242 && g >= 242 && b >= 242;
  }

  // Seed borders
  for (let x = 0; x < width; x++) {
    if (isWhiteLike(x, 0) && !isBg[0 * width + x]) {
      isBg[0 * width + x] = 1;
      queue.push(x, 0);
    }
    if (isWhiteLike(x, height - 1) && !isBg[(height - 1) * width + x]) {
      isBg[(height - 1) * width + x] = 1;
      queue.push(x, height - 1);
    }
  }
  for (let y = 0; y < height; y++) {
    if (isWhiteLike(0, y) && !isBg[y * width + 0]) {
      isBg[y * width + 0] = 1;
      queue.push(0, y);
    }
    if (isWhiteLike(width - 1, y) && !isBg[y * width + (width - 1)]) {
      isBg[y * width + (width - 1)] = 1;
      queue.push(width - 1, y);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const npos = ny * width + nx;
        if (!isBg[npos] && isWhiteLike(nx, ny)) {
          isBg[npos] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Also include enclosed counters in letterforms (e.g., in 'e', 'O' in text area x >= 340)
  for (let y = 0; y < height; y++) {
    for (let x = 340; x < width; x++) {
      const pos = y * width + x;
      if (!isBg[pos] && isWhiteLike(x, y)) {
        isBg[pos] = 1;
      }
    }
  }

  // Create two buffers:
  // 1. outputOriginal: Exact original colors (dark navy "Sin") with background transparent
  // 2. outputDarkTheme: High-contrast white "Sin" & white tagline text for dark navy background
  const outputOriginal = Buffer.alloc(width * height * 4);
  const outputDarkTheme = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;
      const pos = y * width + x;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      if (isBg[pos]) {
        // Completely transparent
        outputOriginal[dstIdx] = 0;
        outputOriginal[dstIdx + 1] = 0;
        outputOriginal[dstIdx + 2] = 0;
        outputOriginal[dstIdx + 3] = 0;

        outputDarkTheme[dstIdx] = 0;
        outputDarkTheme[dstIdx + 1] = 0;
        outputDarkTheme[dstIdx + 2] = 0;
        outputDarkTheme[dstIdx + 3] = 0;
      } else {
        // Foreground pixel
        // Check if neighboring any background pixel for anti-aliasing / defringing
        let hasBgNeighbor = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx]) {
                hasBgNeighbor = true;
                break;
              }
            }
          }
          if (hasBgNeighbor) break;
        }

        let alpha = 255;
        let outR = r;
        let outG = g;
        let outB = b;

        if (hasBgNeighbor) {
          // Compute luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum > 220) {
            // Anti-aliased transition edge against white
            alpha = Math.max(0, Math.min(255, Math.round((255 - lum) * (255 / 35))));
            // De-fringe: unmultiply white background
            const aNorm = alpha / 255;
            if (aNorm > 0.05) {
              outR = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - aNorm)) / aNorm)));
              outG = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - aNorm)) / aNorm)));
              outB = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - aNorm)) / aNorm)));
            }
          }
        }

        // Original transparent logo
        outputOriginal[dstIdx] = outR;
        outputOriginal[dstIdx + 1] = outG;
        outputOriginal[dstIdx + 2] = outB;
        outputOriginal[dstIdx + 3] = alpha;

        // Dark theme logo:
        // In the text area (x >= 340), dark navy text (low r, g, and b < 95) becomes crisp white
        // While the cyan/blue "Tech" (b > 140, g > 60) and the colorful emblem remain untouched!
        const isDarkNavyText =
          x >= 340 &&
          r < 65 &&
          g < 75 &&
          b < 105;

        if (isDarkNavyText) {
          outputDarkTheme[dstIdx] = 255;
          outputDarkTheme[dstIdx + 1] = 255;
          outputDarkTheme[dstIdx + 2] = 255;
          outputDarkTheme[dstIdx + 3] = alpha;
        } else {
          outputDarkTheme[dstIdx] = outR;
          outputDarkTheme[dstIdx + 1] = outG;
          outputDarkTheme[dstIdx + 2] = outB;
          outputDarkTheme[dstIdx + 3] = alpha;
        }
      }
    }
  }

  // Save the full-resolution transparent original
  const rawTransparentOriginal = path.join(publicImageDir, "sintech-logo-transparent-original.png");
  await sharp(outputOriginal, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(rawTransparentOriginal);

  // Save the full-resolution dark-theme logo (white text for dark headers)
  const rawTransparentDarkTheme = path.join(publicImageDir, "sintech-logo-transparent.png");
  await sharp(outputDarkTheme, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(rawTransparentDarkTheme);

  // Trim and resize for site usage (width ~ 800, max height ~ 240)
  const outputTrimmed = path.join(publicImageDir, "sintech-logo-trimmed.png");
  const trimmed = await sharp(outputDarkTheme, { raw: { width, height, channels: 4 } })
    .trim()
    .resize({ width: 800, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(outputTrimmed);

  console.log("Generated transparent logo successfully!");
  console.log("Trimmed dimensions:", trimmed.width, "x", trimmed.height);
}

main().catch((err) => {
  console.error("Error processing logo:", err);
  process.exit(1);
});
