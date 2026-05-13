import { useEffect, useRef } from 'react';

/**
 * Canvas-2d Experience background used when WebGL is unavailable.
 * Renders concentric rotating portal rings + drifting stars.
 * Read across as: a flat tunnel from a top-down view.
 */
const RED = '#CC0000';
const BLUE = '#4F90D2';
const WHITE = '#FFFFFF';
const RING_COLORS = [RED, BLUE, WHITE, RED, BLUE];

export function ExperienceFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const STARS = 220;
    const stars = Array.from({ length: STARS }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random() * 0.9 + 0.1,
      speed: Math.random() * 0.05 + 0.01,
      size: Math.random() * 1.4 + 0.4,
    }));

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.45;

      ctx.fillStyle = 'rgba(5,5,7,0.35)';
      ctx.fillRect(0, 0, w, h);

      // stars drifting outward
      for (const s of stars) {
        s.r += s.speed * 0.01;
        if (s.r > 1) s.r = 0.05;
        const rr = s.r * maxR * 1.4;
        const x = cx + Math.cos(s.a) * rr;
        const y = cy + Math.sin(s.a) * rr;
        ctx.beginPath();
        ctx.arc(x, y, s.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245,242,232,0.55)';
        ctx.fill();
      }

      // concentric portal rings
      RING_COLORS.forEach((color, i) => {
        const baseR = maxR * (0.18 + i * 0.16);
        const pulse = baseR * (1 + Math.sin(t * 1.2 + i * 0.7) * 0.04);
        const rot = (i % 2 ? 1 : -1) * t * 0.4 + i;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        // outer thin ring
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.stroke();

        // inner haze
        const grad = ctx.createRadialGradient(0, 0, pulse * 0.9, 0, 0, pulse * 1.15);
        grad.addColorStop(0, `${color}00`);
        grad.addColorStop(0.5, `${color}28`);
        grad.addColorStop(1, `${color}00`);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, pulse * 1.15, 0, Math.PI * 2);
        ctx.fill();

        // satellites — 3 dots evenly spaced
        ctx.fillStyle = color;
        ctx.globalAlpha = 1;
        for (let k = 0; k < 3; k++) {
          const a = (k / 3) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * pulse, Math.sin(a) * pulse, 3 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden
    />
  );
}
