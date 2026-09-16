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
      <nav className="fixed top-3 left-3 sm:top-6 sm:left-6 z-50 max-w-[62vw] sm:max-w-none">
        <a href="#hero" className="flex items-center gap-2 sm:gap-3 group">
          <span className="relative inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-wolf-red shrink-0">
            <span className="absolute inset-0 rounded-full bg-wolf-red animate-pulse_ring" />
          </span>
          <span className="font-mono text-[9px] tracking-[0.15em] sm:text-sm sm:tracking-[0.3em] text-bone uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            SHREYAS VISWESHWARAN
          </span>
        </a>
      </nav>

      <nav className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50">
        <ul className="flex flex-col gap-1.5 sm:gap-2 items-end font-mono text-[9px] sm:text-[12px] tracking-[0.15em] sm:tracking-[0.25em] text-bone uppercase">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="hover:text-wolf-red transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                data-cursor="hover"
              >
                {/* phones get the index only — the full labels would overlap the name plate */}
                <span className="sm:hidden">{l.label.split(' / ')[0]}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right-side progress bar */}
      <div className="fixed top-0 right-0 h-svh md:h-screen w-[2px] z-40 bg-bone/10">
        <div
          className="w-full bg-gradient-to-b from-wolf-red via-wolf-white to-gs-blue origin-top"
          style={{ height: `${progress * 100}%`, willChange: 'height' }}
        />
      </div>
    </>
  );
}
