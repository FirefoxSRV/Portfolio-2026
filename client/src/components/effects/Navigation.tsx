import { useAppStore } from '@/store/useAppStore';

const links = [
  { id: 'hero', label: '00 / start' },
  { id: 'about', label: '01 / about' },
  { id: 'experience', label: '02 / experience' },
  { id: 'skills', label: '03 / skills' },
  { id: 'projects', label: '04 / projects' },
  { id: 'contact', label: '05 / contact' },
];

export function Navigation() {
  const progress = useAppStore((s) => s.scrollProgress);

  return (
    <>
      <nav className="fixed top-6 left-6 z-50">
        <a href="#hero" className="flex items-center gap-3 group">
          <span className="relative inline-block w-3 h-3 rounded-full bg-wolf-red">
            <span className="absolute inset-0 rounded-full bg-wolf-red animate-pulse_ring" />
          </span>
          <span className="font-mono text-xs tracking-[0.3em] text-bone uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            SRV / portfolio.26
          </span>
        </a>
      </nav>

      <nav className="fixed top-6 right-6 z-50">
        <ul className="flex flex-col gap-2 items-end font-mono text-[10px] tracking-[0.25em] text-bone uppercase">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="hover:text-wolf-red transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                data-cursor="hover"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right-side progress bar */}
      <div className="fixed top-0 right-0 h-screen w-[2px] z-40 bg-bone/10">
        <div
          className="w-full bg-gradient-to-b from-wolf-red via-wolf-white to-gs-blue origin-top"
          style={{ height: `${progress * 100}%`, willChange: 'height' }}
        />
      </div>
    </>
  );
}
