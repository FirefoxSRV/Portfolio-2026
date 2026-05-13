/**
 * Sample points along a stylized wolf-head silhouette.
 * Shared by the Loader's particle assembly and the HeroFallback's static wolf.
 */
export function wolfPath(w: number, h: number): Array<[number, number]> {
  const cx = w / 2;
  const cy = h / 2;
  const s = Math.min(w, h) * 0.32;

  const pts: Array<[number, number]> = [
    [cx - s * 1.1, cy + s * 0.2],
    [cx - s * 0.95, cy - s * 0.2],
    [cx - s * 1.05, cy - s * 0.55],
    [cx - s * 0.7, cy - s * 0.45],
    [cx - s * 0.45, cy - s * 0.85],
    [cx - s * 0.15, cy - s * 0.45],
    [cx + s * 0.15, cy - s * 0.85],
    [cx + s * 0.5, cy - s * 0.45],
    [cx + s * 0.85, cy - s * 0.55],
    [cx + s * 0.9, cy - s * 0.15],
    [cx + s * 0.75, cy + s * 0.25],
    [cx + s * 0.45, cy + s * 0.55],
    [cx + s * 0.1, cy + s * 0.85],
    [cx - s * 0.25, cy + s * 0.7],
    [cx - s * 0.6, cy + s * 0.55],
  ];

  const samples: Array<[number, number]> = [];
  const STEPS = 28;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    for (let t = 0; t < 1; t += 1 / STEPS) {
      samples.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
    }
  }
  samples.push([cx - s * 0.45, cy - s * 0.1]);
  samples.push([cx + s * 0.45, cy - s * 0.1]);
  return samples;
}
