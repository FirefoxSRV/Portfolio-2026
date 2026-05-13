import { useEffect, useRef } from 'react';

/**
 * Lightweight ambient particle field behind the whole page.
 * Pauses its RAF loop when the tab/window isn't visible.
 */
export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = (canvas.width = window.innerWidth * dpr);
    let h = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: (Math.random() - 0.5) * 0.15 * dpr,
      r: (Math.random() * 1.1 + 0.4) * dpr,
      hue: Math.random() < 0.5 ? 0 : 220,
    }));

    let mx = w / 2;
    let my = h / 2;
    let active = !document.hidden;
    let raf = 0;

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX * dpr;
      my = e.clientY * dpr;
    };
    const onResize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
    };
    const onVis = () => {
      active = !document.hidden;
      if (active) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    const loop = () => {
      if (!active) return;
      ctx.fillStyle = 'rgba(5,5,7,0.20)';
      ctx.fillRect(0, 0, w, h);

      const INFLUENCE_R2 = (180 * dpr) * (180 * dpr);

      for (const p of particles) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < INFLUENCE_R2) {
          const dist = Math.sqrt(d2) || 1;
          const f = (180 * dpr - dist) / (180 * dpr);
          p.vx += (dx / dist) * f * 0.04;
          p.vy += (dy / dist) * f * 0.04;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 0 ? 'rgba(204,0,0,0.85)' : 'rgba(79,144,210,0.75)';
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.55 }}
    />
  );
}
