import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/profile';

interface Node {
  id: string;
  label: string;
  group: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  fontPx: number;
  exploded: boolean;
  ex?: number;
  ey?: number;
}

// Keys must match the group names in profile.skills, which mirror the resume.
const GROUP_COLORS: Record<string, string> = {
  Languages: '#CC0000',
  'Backend & Data': '#4F90D2',
  Frontend: '#FF6B6B',
  'Cloud & DevOps': '#6BB6FF',
  'AI / ML': '#F5F2E8',
};

const LABEL_PX = 12;
const LABEL_PX_NARROW = 8;

export function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const dprRef = useRef(1);
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    dprRef.current = dpr;
    // A phone has to fit the same 43 skills into a fraction of the area, so the
    // labels and the bubbles they size start smaller there.
    const narrow = canvas.clientWidth < 640;
    const labelPx = (narrow ? LABEL_PX_NARROW : LABEL_PX) * dpr;

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      // Resizing a canvas resets its context state, so restore the label font.
      ctx.font = `${labelPx}px "JetBrains Mono", monospace`;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let inView = true;
    // Pause the physics RAF when the section scrolls out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting;
        if (next && !inView) raf = requestAnimationFrame(tick);
        inView = next;
      },
      { rootMargin: '200px' }
    );
    io.observe(section);

    // initialize nodes
    const minR = (narrow ? 16 : 26) * dpr;
    const pad = (narrow ? 8 : 14) * dpr;
    const maxR = Math.min(canvas.width * (narrow ? 0.16 : 0.24), (narrow ? 46 : 90) * dpr);

    const nodes: Node[] = [];
    Object.entries(profile.skills).forEach(([group, items]) => {
      items.forEach((label) => {
        const textW = ctx.measureText(label).width;
        let fontPx = labelPx;
        let r = Math.max(minR + Math.random() * (narrow ? 6 : 10) * dpr, textW / 2 + pad);
        if (r > maxR) {
          // Long labels would burst the bubble on a narrow canvas — shrink the
          // type for that node instead of letting the circle eat the screen.
          r = maxR;
          fontPx = Math.max(6 * dpr, (fontPx * (2 * maxR - pad)) / textW);
        }
        nodes.push({
          id: `${group}:${label}`,
          label,
          group,
          color: GROUP_COLORS[group] ?? '#f5f2e8',
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r,
          fontPx,
          exploded: false,
        });
      });
    });
    nodesRef.current = nodes;

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * dpr;
      mouseRef.current.y = (e.clientY - rect.top) * dpr;
    };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * dpr;
      const my = (e.clientY - rect.top) * dpr;
      for (const n of nodes) {
        const d = Math.hypot(n.x - mx, n.y - my);
        if (d < n.r) {
          n.exploded = !n.exploded;
          if (n.exploded) {
            n.ex = n.x;
            n.ey = n.y;
          }
          break;
        }
      }
    };
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('click', onClick);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // physics
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          const min = a.r + b.r;
          if (d < min) {
            const overlap = (min - d) * 0.5;
            const ox = (dx / d) * overlap;
            const oy = (dy / d) * overlap;
            a.x -= ox;
            a.y -= oy;
            b.x += ox;
            b.y += oy;
            // exchange velocity components
            const tmp = a.vx;
            a.vx = b.vx;
            b.vx = tmp;
            const tmp2 = a.vy;
            a.vy = b.vy;
            b.vy = tmp2;
          } else if (d < min + 60 * dpr) {
            // soft connection (links between same group)
            if (a.group === b.group) {
              ctx.strokeStyle = `${a.color}33`;
              ctx.lineWidth = dpr;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      let hoveredId: string | null = null;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const n of nodes) {
        // mouse repulsion
        const dx = mx - n.x;
        const dy = my - n.y;
        const d = Math.hypot(dx, dy);
        if (d < (narrow ? 70 : 150) * dpr) {
          n.vx -= (dx / d) * 0.4;
          n.vy -= (dy / d) * 0.4;
        }
        if (d < n.r) hoveredId = n.id;

        // gentle attraction toward center
        n.vx += (w / 2 - n.x) * 0.00018;
        n.vy += (h / 2 - n.y) * 0.00018;

        n.vx *= 0.94;
        n.vy *= 0.94;
        n.x += n.vx;
        n.y += n.vy;

        // walls
        if (n.x < n.r) { n.x = n.r; n.vx *= -1; }
        if (n.x > w - n.r) { n.x = w - n.r; n.vx *= -1; }
        if (n.y < n.r) { n.y = n.r; n.vy *= -1; }
        if (n.y > h - n.r) { n.y = h - n.r; n.vy *= -1; }

        // draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}1F`;
        ctx.fill();
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.2 * dpr;
        ctx.stroke();

        // label
        ctx.fillStyle = '#f5f2e8';
        ctx.font = `${n.fontPx}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y);

        // exploded burst
        if (n.exploded && n.ex !== undefined && n.ey !== undefined) {
          for (let k = 0; k < 6; k++) {
            const a = (k / 6) * Math.PI * 2;
            const rr = 70 * dpr;
            ctx.beginPath();
            ctx.arc(n.ex + Math.cos(a) * rr, n.ey + Math.sin(a) * rr, 3 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.fill();
          }
        }
      }
      setHovered((cur) => (cur === hoveredId ? cur : hoveredId));

      if (inView) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  const hoveredNode = nodesRef.current.find((n) => n.id === hovered);

  return (
    <section ref={sectionRef} id="skills" className="section relative bg-[#050507] overflow-hidden">
      {/* top ticker */}
      <div className="absolute top-10 sm:top-0 left-0 right-0 z-10 border-b border-bone/10 overflow-hidden">
        <div className="flex whitespace-nowrap py-3 animate-ticker font-mono text-[12px] tracking-[0.25em] uppercase">
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={r} className="flex gap-8 px-8 text-bone/50">
              {Object.values(profile.skills).flat().map((s, i) => (
                <span key={i}>◆ {s}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative pt-24 pb-8 px-5 md:pt-32 md:pb-12 md:px-12 z-10 pointer-events-none">
        <div className="font-mono text-[9px] tracking-[0.3em] md:text-[12px] md:tracking-[0.5em] text-bone/50 uppercase">
          03 / skills
        </div>
        <h2 className="font-display text-[clamp(1.4rem,8.5vw,2.25rem)] sm:text-4xl md:text-7xl font-extrabold text-bone mt-2 leading-none">
          the network.
        </h2>
        <p className="hidden sm:block font-mono text-[11px] md:text-sm text-bone/40 mt-3 max-w-md">
          click any node. they bounce. they repel. they connect within their groups.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
        style={{ touchAction: 'none' }}
      />

      {/* legend */}
      <div className="absolute bottom-4 left-5 right-5 md:bottom-6 md:left-12 md:right-auto z-10 flex flex-wrap gap-x-3 gap-y-1.5 md:gap-x-6 md:gap-y-2 pointer-events-none">
        {Object.keys(profile.skills).map((group) => (
          <div key={group} className="flex items-center gap-1.5 md:gap-2 font-mono text-[8px] tracking-[0.15em] md:text-[12px] md:tracking-[0.3em] text-bone/70 uppercase">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: GROUP_COLORS[group] ?? '#f5f2e8' }}
            />
            {group}
          </div>
        ))}
      </div>

      {hoveredNode && (
        <div
          className="absolute z-20 pointer-events-none font-mono text-sm tracking-[0.2em] uppercase bg-[#050507]/90 border border-bone/20 px-3 py-2"
          style={{
            left: hoveredNode.x / dprRef.current + 24,
            top: hoveredNode.y / dprRef.current + 24,
            color: hoveredNode.color,
          }}
        >
          {hoveredNode.group} / {hoveredNode.label}
        </div>
      )}
    </section>
  );
}
