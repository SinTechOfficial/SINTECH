import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const publicImagesDir = path.resolve(scriptsDir, "../../artifacts/sintech-portfolio/public/images");
const conceptBannerPath = path.resolve(scriptsDir, "../../attached_assets/SinTech_Hero_Concept.png");

async function main() {
  console.log("Refining assets from concept banner:", conceptBannerPath);

  // 1. Refine the 3D hexagon emblem from concept banner
  // Concept banner is 1024x356. The 3D hexagon is at: left ~90, top ~65, width ~155, height ~180
  const bannerMeta = await sharp(conceptBannerPath).metadata();
  console.log("Banner meta:", bannerMeta.width, bannerMeta.height);

  // Extract emblem with ample margin
  const emblemRaw = await sharp(conceptBannerPath)
    .extract({ left: 80, top: 60, width: 170, height: 195 })
    .toBuffer();

  const { data: emblemData, info: emblemInfo } = await sharp(emblemRaw)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: ew, height: eh, channels: ec } = emblemInfo;
  const cleanEmblemBuffer = Buffer.alloc(ew * eh * 4);

  // Background in the concept banner around the emblem is dark navy #070f22 (R < 25, G < 30, B < 65)
  // But let's check and make the outer background completely transparent while keeping the glowing emblem
  for (let y = 0; y < eh; y++) {
    for (let x = 0; x < ew; x++) {
      const srcIdx = (y * ew + x) * ec;
      const dstIdx = (y * ew + x) * 4;
      const r = emblemData[srcIdx];
      const g = emblemData[srcIdx + 1];
      const b = emblemData[srcIdx + 2];

      // Keep pixel if it has colorful gradient or luminous value
      // Dark navy background around emblem has r < 18, g < 26, b < 60
      const isDarkBg = r < 20 && g < 32 && b < 72 && (r + g + b < 95);

      if (isDarkBg) {
        cleanEmblemBuffer[dstIdx] = 0;
        cleanEmblemBuffer[dstIdx + 1] = 0;
        cleanEmblemBuffer[dstIdx + 2] = 0;
        cleanEmblemBuffer[dstIdx + 3] = 0;
      } else {
        cleanEmblemBuffer[dstIdx] = r;
        cleanEmblemBuffer[dstIdx + 1] = g;
        cleanEmblemBuffer[dstIdx + 2] = b;
        cleanEmblemBuffer[dstIdx + 3] = 255;
      }
    }
  }

  const emblemOutPath = path.join(publicImagesDir, "sintech-emblem-3d.webp");
  await sharp(cleanEmblemBuffer, { raw: { width: ew, height: eh, channels: 4 } })
    .trim()
    .webp({ quality: 95 })
    .toFile(emblemOutPath);
  console.log("Saved clean 3D emblem:", emblemOutPath);

  // 2. Extract Workstation Scene with clean crop (excluding the top navigation pill and bottom dock slice)
  // In the 1024x356 banner:
  // Workstation is located on the right: left ~520 to 1024 (width 504), top ~38 to 356 (height 318)
  const workstationOutPath = path.join(publicImagesDir, "hero-3d-workstation.webp");
  await sharp(conceptBannerPath)
    .extract({ left: 520, top: 40, width: 504, height: 316 })
    .webp({ quality: 95 })
    .toFile(workstationOutPath);
  console.log("Saved clean workstation scene:", workstationOutPath);

  // Also save a full panoramic hero background webp
  const heroConceptOutPath = path.join(publicImagesDir, "hero-3d-concept.webp");
  await sharp(conceptBannerPath)
    .webp({ quality: 95 })
    .toFile(heroConceptOutPath);
  console.log("Saved full concept banner:", heroConceptOutPath);
}

main().catch((err) => {
  console.error("Asset refinement failed:", err);
  process.exit(1);
});
