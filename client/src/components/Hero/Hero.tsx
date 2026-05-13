import { useRef } from 'react';
import { profile } from '@/data/profile';

function GlitchTitle({ text }: { text: string }) {
  return (
    <h1
      className="glitch font-display font-extrabold uppercase leading-[0.85] tracking-tight text-bone drop-shadow-2xl"
      style={{ fontSize: 'clamp(2rem, 8vw, 9rem)' }}
      data-text={text}
    >
      {text}
    </h1>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section relative overflow-hidden isolate bg-[#050507]"
    >
      {/* Background with design gradient */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div
          className="w-full h-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(204,0,0,0.15) 0%, rgba(5,5,7,0.7) 40%, #050507 100%)',
          }}
        />
      </div>

      {/* Picture - blended on top */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 5 }}>
        <img
          src="/shreyas.jpg"
          alt="Shreyas Visweshwaran"
          className="h-full w-auto object-contain opacity-95"
        />
      </div>

      {/* Text overlay - positioned lower to not cover face */}
      <div
        className="relative w-full h-screen flex flex-col items-center justify-end pointer-events-none text-center px-3 xs:px-4 sm:px-6 max-w-4xl mx-auto pb-24 xs:pb-32 sm:pb-40 md:pb-48"
        style={{ zIndex: 20 }}
      >
        <div className="font-mono text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-bone/60 uppercase mb-2 xs:mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
          ▌ portfolio.26 / shreyas ▐
        </div>
        <GlitchTitle text="SHREYAS" />
        <GlitchTitle text="VISWESHWARAN" />
        <div className="mt-2 xs:mt-3 sm:mt-4 md:mt-6 font-mono text-[9px] xs:text-[10px] sm:text-xs tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.3em] text-bone/70 uppercase px-1 xs:px-2 drop-shadow-lg max-w-xs xs:max-w-sm sm:max-w-md">
          {profile.tagline}
        </div>
      </div>


      {/* Bottom ticker */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t border-bone/10 bg-[#050507]/95 overflow-hidden"
        style={{ zIndex: 30 }}
      >
        <div className="flex whitespace-nowrap py-3 animate-ticker font-mono text-[11px] tracking-[0.25em] uppercase">
          {Array.from({ length: 2 }).map((_, repeat) => (
            <div key={repeat} className="flex gap-8 px-8">
              <span className="text-bone/70">▲ TYPESCRIPT +12.4%</span>
              <span className="text-wolf-red">● NCSU 4.0</span>
              <span className="text-gs-blue">◆ GS +0.8σ</span>
              <span className="text-bone/70">▼ COFFEE -78%</span>
              <span className="text-bone/70">▲ COMMITS +∞</span>
              <span className="text-wolf-red">● WOLFPACK</span>
              <span className="text-gs-blue">◆ AWM</span>
              <span className="text-bone/70">▲ REACT 18 STABLE</span>
              <span className="text-bone/70">▼ SLEEP -34%</span>
              <span className="text-wolf-red">● BUILD MODE</span>
              <span className="text-gs-blue">◆ RAG · LANGCHAIN</span>
              <span className="text-bone/70">▲ SHIP IT</span>
            </div>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
        style={{ zIndex: 25 }}
      >
        <div className="font-mono text-[9px] tracking-[0.5em] text-bone/50 uppercase mb-2">
          scroll
        </div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-wolf-red to-transparent" />
      </div>
    </section>
  );
}
