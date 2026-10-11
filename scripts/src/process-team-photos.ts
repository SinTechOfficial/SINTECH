import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

type Crop = { left: number; top: number; size: number };

// Normalized, per-card crops focused on the person in the right/lower area.
const crops: Record<string, Crop> = {
  "Akash.png": { left: 0.59, top: 0.3, size: 0.36 },
  "Asha.png": { left: 0.59, top: 0.28, size: 0.36 },
  "Ashraful.png": { left: 0.59, top: 0.28, size: 0.36 },
  "Emon.jpg": { left: 0.59, top: 0.3, size: 0.36 },
  "Eva.jpg": { left: 0.59, top: 0.28, size: 0.36 },
  "Farhan.jpg": { left: 0.59, top: 0.28, size: 0.36 },
  "Mahbub.jpg": { left: 0.59, top: 0.3, size: 0.36 },
  "Mariea.png": { left: 0.59, top: 0.28, size: 0.36 },
  "Nahid.jpg": { left: 0.64, top: 0.31, size: 0.28 },
  "Ratul.jpg": { left: 0.59, top: 0.38, size: 0.36 },
  "Sium.png": { left: 0.59, top: 0.29, size: 0.36 },
  "Sobuj.png": { left: 0.57, top: 0.31, size: 0.36 },
  "fAHIM.png": { left: 0.59, top: 0.31, size: 0.36 },
  "iFTI.png": { left: 0.57, top: 0.3, size: 0.36 },
  "tANNI.png": { left: 0.59, top: 0.29, size: 0.36 },
};

const imageDir = path.resolve(
  process.cwd(),
  "../artifacts/sintech-portfolio/public/images",
);
const outputDir = path.join(imageDir, "team");

function circularMask(size: number): Buffer {
  const radius = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="white"/></svg>`,
  );
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  for (const [fileName, crop] of Object.entries(crops)) {
    const sourcePath = path.join(imageDir, fileName);
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Could not read image dimensions for ${fileName}`);
    }

    const size = Math.floor(
      Math.min(metadata.width, metadata.height) * crop.size,
    );
    const left = Math.max(
      0,
      Math.min(
        Math.round(metadata.width * crop.left),
        metadata.width - size,
      ),
    );
    const top = Math.max(
      0,
      Math.min(Math.round(metadata.height * crop.top), metadata.height - size),
    );
    const extract = { left, top, width: size, height: size };
    const slug = fileName.replace(/\.(png|jpe?g)$/i, "").toLowerCase();

    await sharp(sourcePath)
      .extract(extract)
      .resize(320, 320, { fit: "cover" })
      .composite([{ input: circularMask(320), blend: "dest-in" }])
      .webp({ quality: 80, effort: 4 })
      .toFile(path.join(outputDir, `${slug}-320.webp`));

    await sharp(sourcePath)
      .extract(extract)
      .resize(640, 640, { fit: "cover" })
      .composite([{ input: circularMask(640), blend: "dest-in" }])
      .webp({ quality: 82, effort: 4 })
      .toFile(path.join(outputDir, `${slug}-640.webp`));

    await sharp(sourcePath)
      .extract(extract)
      .resize(20, 20, { fit: "cover" })
      .blur(1.1)
      .composite([{ input: circularMask(20), blend: "dest-in" }])
      .webp({ quality: 30 })
      .toFile(path.join(outputDir, `${slug}-blur.webp`));
  }
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Team photo processing failed: ${error instanceof Error ? error.message : "unknown error"}\n`,
  );
  process.exitCode = 1;
});
