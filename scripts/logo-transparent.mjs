// One-off: removes the white background from public/logo.png.
// Flood-fills near-white pixels from the image edges only, so white parts
// inside the logo (shield outline, lettering) are preserved.
import { copyFileSync, existsSync } from "node:fs";
import sharp from "sharp";

const input = "public/logo.png";
const backup = "public/logo-original.png";

if (!existsSync(backup)) {
  copyFileSync(input, backup);
  console.log(`Backed up original to ${backup}`);
}

const { data, info } = await sharp(backup)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const visited = new Uint8Array(width * height);
const stack = [];

function isNearWhite(pixelIndex) {
  const offset = pixelIndex * 4;
  return (
    data[offset] >= 232 &&
    data[offset + 1] >= 232 &&
    data[offset + 2] >= 232
  );
}

function seed(x, y) {
  const pixelIndex = y * width + x;
  if (!visited[pixelIndex] && isNearWhite(pixelIndex)) {
    visited[pixelIndex] = 1;
    stack.push(pixelIndex);
  }
}

for (let x = 0; x < width; x += 1) {
  seed(x, 0);
  seed(x, height - 1);
}
for (let y = 0; y < height; y += 1) {
  seed(0, y);
  seed(width - 1, y);
}

let cleared = 0;
while (stack.length) {
  const pixelIndex = stack.pop();
  data[pixelIndex * 4 + 3] = 0;
  cleared += 1;

  const x = pixelIndex % width;
  const y = Math.floor(pixelIndex / width);
  if (x > 0) seed(x - 1, y);
  if (x < width - 1) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y < height - 1) seed(x, y + 1);
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .toFile(input);

console.log(
  `Done: cleared ${cleared} background pixels of ${width * height} total.`,
);
