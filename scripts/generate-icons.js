const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

/* ── PNG encoder ── */
function crc32(buf) {
  let c = 0xffffffff;
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let v = n;
    for (let k = 0; k < 8; k++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
    table[n] = v;
  }
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData));
  return Buffer.concat([len, t, data, crc]);
}

function createPNG(width, height, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Build raw row data (filter byte 0 + RGBA pixels)
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const off = y * (1 + width * 4);
    raw[off] = 0; // filter none
    for (let x = 0; x < width; x++) {
      const pi = y * width + x;
      const po = off + 1 + x * 4;
      raw[po] = pixels[pi * 4];
      raw[po + 1] = pixels[pi * 4 + 1];
      raw[po + 2] = pixels[pi * 4 + 2];
      raw[po + 3] = pixels[pi * 4 + 3];
    }
  }

  const compressed = zlib.deflateSync(raw);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))]);
}

/* ── S icon drawing ── */
// SVG viewBox 32x32, scaled to target size.
// The S is made of 5 rounded rects on a dark rounded-rect background.
const S_PARTS = [
  { x: 6, y: 5, w: 20, h: 5, r: 2 },   // top bar
  { x: 6, y: 10, w: 5, h: 5, r: 1 },   // left stem
  { x: 6, y: 15, w: 20, h: 5, r: 2 },  // middle bar
  { x: 21, y: 20, w: 5, h: 5, r: 1 },  // right stem
  { x: 6, y: 25, w: 20, h: 5, r: 2 },  // bottom bar
];

const BG_R = 10, BG_G = 10, BG_B = 10;
const ACCENT_R = 78, ACCENT_G = 255, ACCENT_B = 168;

function isInRoundedRect(px, py, rx, ry, rw, rh, rr) {
  // Check if point (px, py) is inside rounded rect at (rx,ry) with size (rw,rh) and corner radius rr.
  const l = rx, r = rx + rw, t = ry, b = ry + rh;
  // Inside the inner rect (after removing corners)
  const ix1 = l + rr, ix2 = r - rr, iy1 = t + rr, iy2 = b - rr;
  if (px >= ix1 && px <= ix2 && py >= iy1 && py <= iy2) return true;
  // Check vertical bars (left/right)
  if (px >= l && px <= r && py >= t + rr && py <= b - rr) return true;
  if (px >= l + rr && px <= r - rr && py >= t && py <= b) return true;
  // Check four corners
  const corners = [
    [l + rr, t + rr],
    [r - rr, t + rr],
    [l + rr, b - rr],
    [r - rr, b - rr],
  ];
  for (const [cx, cy] of corners) {
    const dx = px - cx, dy = py - cy;
    if (dx * dx + dy * dy <= rr * rr) return true;
  }
  return false;
}

function isInBackground(px, py, w, h) {
  // Rounded background: 32x32 with rx=8
  const rr = w / 4; // 8/32 = 0.25 → scaled
  const l = 0, r = w, t = 0, b = h;
  const ix1 = rr, ix2 = w - rr, iy1 = rr, iy2 = h - rr;
  if (px >= ix1 && px <= ix2 && py >= iy1 && py <= iy2) return true;
  if (px >= 0 && px <= w && py >= rr && py <= h - rr) return true;
  if (px >= rr && px <= w - rr && py >= 0 && py <= h) return true;
  const corners = [
    [rr, rr], [w - rr, rr],
    [rr, h - rr], [w - rr, h - rr],
  ];
  for (const [cx, cy] of corners) {
    const dx = px - cx, dy = py - cy;
    if (dx * dx + dy * dy <= rr * rr) return true;
  }
  return false;
}

function inSShape(px, py, scale) {
  for (const part of S_PARTS) {
    const rx = part.x * scale, ry = part.y * scale;
    const rw = part.w * scale, rh = part.h * scale;
    const rr = part.r * scale;
    if (isInRoundedRect(px, py, rx, ry, rw, rh, rr)) return true;
  }
  return false;
}

function generateIcon(size) {
  const scale = size / 32;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (inSShape(x, y, scale)) {
        pixels[i] = ACCENT_R;
        pixels[i + 1] = ACCENT_G;
        pixels[i + 2] = ACCENT_B;
        pixels[i + 3] = 255;
      } else if (isInBackground(x, y, size, size)) {
        pixels[i] = BG_R;
        pixels[i + 1] = BG_G;
        pixels[i + 2] = BG_B;
        pixels[i + 3] = 255;
      } else {
        pixels[i] = 0;
        pixels[i + 1] = 0;
        pixels[i + 2] = 0;
        pixels[i + 3] = 0;
      }
    }
  }
  return createPNG(size, size, pixels);
}

/* ── Main ── */
const outDir = path.resolve(__dirname, "..", "public");
[192, 512].forEach((size) => {
  const png = generateIcon(size);
  const outPath = path.join(outDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`Generated ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
});
