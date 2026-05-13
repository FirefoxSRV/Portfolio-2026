import { useEffect, useRef } from 'react';
import { wolfPath } from '@/lib/wolfPath';

/**
 * Canvas-2d Hero background used when WebGL is unavailable.
 * Renders the assembled wolf silhouette as glyph particles that breathe
 * and react to the mouse — no WebGL required.
 */
const SYMBOLS = ['$', '%', '∑', '∆', 'Σ', 'π', '→', '⚡', '◆', '◇', 'λ', '∞'];
const RED = '#CC0000';
const BLUE = '#4F90D2';
const WHITE = '#FFFFFF';

export function HeroFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let raf = 0;
    let mx = -9999;
    let my = -9999;

    interface P {
      x: number;
      y: number;
      bx: number;
      by: number;
      char: string;
      color: string;
      alpha: number;
    }
    let particles: P[] = [];

    const seed = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      const targets = wolfPath(canvas.width, canvas.height);
      const COUNT = 420;
      particles = Array.from({ length: COUNT }, (_, i) => {
        const t = targets[i % targets.length];
        const r = Math.random();
        return {
          x: t[0],
          y: t[1],
          bx: t[0],
          by: t[1],
          char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          color: r < 0.55 ? RED : r < 0.85 ? BLUE : WHITE,
          alpha: 0.55 + Math.random() * 0.4,
        };
      });
      ctx.font = `${14 * dpr}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    };
    seed();

    const onResize = () => seed();
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left) * dpr;
      my = (e.clientY - rect.top) * dpr;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };

    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    const start = performance.now();
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      // soft trail
      ctx.fillStyle = 'rgba(5,5,7,0.28)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const breatheR = 1 + Math.sin(t * 1.1) * 0.02;
      const REPEL_R = 140 * dpr;
      const REPEL_R2 = REPEL_R * REPEL_R;

      for (const p of particles) {
        // gentle breathing around center
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        let tx = cx + (p.bx - cx) * breatheR;
        let ty = cy + (p.by - cy) * breatheR;

        // mouse repulsion
        const dx = tx - mx;
        const dy = ty - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_R2) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / REPEL_R) * 50 * dpr;
          tx += (dx / d) * force;
          ty += (dy / d) * force;
        }

        // ease toward target
        p.x += (tx - p.x) * 0.18;
        p.y += (ty - p.y) * 0.18;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
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
