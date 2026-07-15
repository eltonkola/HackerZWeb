import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function roundedSquareMask(x, y, size, radius) {
  // returns true if point (x,y) is inside a rounded square of given size/radius
  const cx = Math.min(Math.max(x, radius), size - radius);
  const cy = Math.min(Math.max(y, radius), size - radius);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function makeIcon(size) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  const radius = size * 0.22;
  const barColor = [255, 255, 255, 255];
  const barGap = size * 0.1;
  const barHeight = size * 0.11;
  const barWidth = size * 0.56;
  const barX = (size - barWidth) / 2;
  const barsTopY = size * 0.32;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    raw[rowStart] = 0; // filter type: none
    for (let x = 0; x < size; x++) {
      const idx = rowStart + 1 + x * 4;
      const inside = roundedSquareMask(x + 0.5, y + 0.5, size, radius);
      if (!inside) {
        raw[idx] = 0;
        raw[idx + 1] = 0;
        raw[idx + 2] = 0;
        raw[idx + 3] = 0;
        continue;
      }
      const t = (x + y) / (2 * size);
      const r = Math.round(lerp(255, 214, t));
      const g = Math.round(lerp(102, 40, t));
      const b = Math.round(lerp(20, 10, t));

      let pr = r, pg = g, pb = b, pa = 255;

      for (let i = 0; i < 3; i++) {
        const by = barsTopY + i * (barHeight + barGap);
        const w = i === 2 ? barWidth * 0.62 : barWidth;
        if (x >= barX && x <= barX + w && y >= by && y <= by + barHeight) {
          pr = barColor[0];
          pg = barColor[1];
          pb = barColor[2];
          pa = barColor[3];
        }
      }

      raw[idx] = pr;
      raw[idx + 1] = pg;
      raw[idx + 2] = pb;
      raw[idx + 3] = pa;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = deflateSync(raw, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const png = Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  return png;
}

mkdirSync(new URL("../public/icons", import.meta.url), { recursive: true });
for (const size of [16, 48, 128]) {
  const png = makeIcon(size);
  writeFileSync(new URL(`../public/icons/icon-${size}.png`, import.meta.url), png);
  console.log(`wrote icon-${size}.png (${png.length} bytes)`);
}
