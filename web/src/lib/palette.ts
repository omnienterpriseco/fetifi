export function hexFromRgb(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function lum(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export async function extractPalette(file: File): Promise<string[]> {
  try {
    const image = await loadImage(file);
    const canvas = document.createElement("canvas");
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback();
    ctx.drawImage(image, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 80) continue;
      const L = lum(r, g, b);
      if (L > 245 || L < 12) continue;
      const key = `${Math.round(r / 24)}-${Math.round(g / 24)}-${Math.round(b / 24)}`;
      const cur = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
      cur.n += 1;
      cur.r += r;
      cur.g += g;
      cur.b += b;
      buckets.set(key, cur);
    }
    const ranked = [...buckets.values()]
      .sort((a, b) => b.n - a.n)
      .map((c) =>
        hexFromRgb(Math.round(c.r / c.n), Math.round(c.g / c.n), Math.round(c.b / c.n)),
      );
    const unique = [...new Set(ranked)];
    if (unique.length >= 3) return unique.slice(0, 3);
    return [...unique, ...fallback()].slice(0, 3);
  } catch {
    return fallback();
  }
}

async function loadImage(file: File): Promise<HTMLImageElement | ImageBitmap> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function fallback() {
  return ["#2F4A3C", "#F3E2B4", "#C45C26"];
}
