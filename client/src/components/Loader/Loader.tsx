import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { wolfPath } from '@/lib/wolfPath';

const SYMBOLS = ['$', '%', '∑', '∆', 'Σ', 'π', '→', '⚡', '◆', '◇', '01', '10', 'λ', 'µ', 'σ', '∞'];

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  char: string;
  alpha: number;
  color: string;
}

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setLoaded = useAppStore((s) => s.setLoaded);

  useEffect(() => {
    const start = Date.now();
    const DURATION = 2600;
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / DURATION);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setDone(true);
          setTimeout(() => setLoaded(true), 700);
        }, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };
    resize();

    const targets = wolfPath(canvas.width, canvas.height);
    const COUNT = 380;
    const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => {
      const target = targets[i % targets.length];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        tx: target[0],
        ty: target[1],
        vx: 0,
        vy: 0,
        char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        alpha: Math.random() * 0.6 + 0.4,
        color: Math.random() < 0.7 ? '#CC0000' : '#4F90D2',
      };
    });

    ctx.font = `${14 * dpr}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let raf = 0;
    const loop = () => {
      ctx.fillStyle = 'rgba(5,5,7,0.32)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.012;
        p.vy += dy * 0.012;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[#050507] flex flex-col items-center justify-center transition-all duration-700 ${
        done ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100'
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 w-full max-w-md px-6 pointer-events-none">
        <div className="flex items-baseline justify-between mb-2 font-mono text-[10px] tracking-[0.4em] text-bone/60 uppercase">
          <span>NCSU // GS</span>
          <span>{Math.floor(progress * 100).toString().padStart(3, '0')}%</span>
        </div>
        <div className="relative h-[2px] w-full bg-bone/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-wolf-red via-wolf-white to-gs-blue"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-3 font-mono text-[10px] tracking-[0.3em] text-bone/50 uppercase">
          assembling.the.wolf
        </div>
      </div>
    </div>
  );
}
