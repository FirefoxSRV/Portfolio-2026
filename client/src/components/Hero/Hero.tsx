import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/profile';

const NAME_LINES = ['SHREYAS', 'VISWESHWARAN'];

// Syne 800 uppercase runs very wide (W alone is 1.88em). Measured advance of the
// longest line, tracking-tight included, is 14.43em — size both lines off that so
// the name always fits inside the padded column instead of spilling past it.
const LONGEST_LINE_EM = 14.43;
const TITLE_FONT_SIZE = `min(9rem, ${(100 / LONGEST_LINE_EM).toFixed(2)}cqi)`;

function GlitchTitle({ text }: { text: string }) {
  return (
    <h1
      className="glitch font-display font-extrabold uppercase leading-[0.85] tracking-tight text-bone drop-shadow-2xl whitespace-nowrap"
      style={{ fontSize: TITLE_FONT_SIZE }}
      data-text={text}
    >
      {text}
    </h1>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  // The portrait sits flush on top of the ticker, so it has to know how tall the
  // ticker actually is — measured rather than hardcoded, since its font can change.
  const [tickerHeight, setTickerHeight] = useState(0);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;
    const measure = () => setTickerHeight(ticker.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ticker);
    return () => ro.disconnect();
  }, []);

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

      {/* Picture - blended on top, bottom edge resting on the ticker */}
      <div
        className="absolute inset-x-0 top-0 flex items-end justify-center overflow-hidden"
        style={{ zIndex: 5, bottom: tickerHeight }}
      >
        {/* shreyas-cutout.webp is the headshot with its studio backdrop already
            removed and the transparent margins trimmed off, so there is no
            rectangle to hide and nothing to mask at runtime. On phones a blurred
            copy of it fills the tall band above the portrait. */}
        <img
          src={`${import.meta.env.BASE_URL}shreyas-cutout.webp`}
          alt=""
          aria-hidden
          className="sm:hidden absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-35"
        />
        <div className="sm:hidden absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-[#050507] via-[#050507]/60 to-transparent" />
        <img
          src={`${import.meta.env.BASE_URL}shreyas-cutout.webp`}
          alt="Shreyas Visweshwaran"
          className="relative w-full h-auto max-h-full object-contain sm:h-[80%] sm:w-auto sm:max-h-none opacity-95"
        />
      </div>

      {/* Text overlay - positioned lower to not cover face */}
      <div
        className="relative w-full h-svh md:h-screen flex flex-col items-center justify-end pointer-events-none text-center px-4 xs:px-5 sm:px-12 md:px-16 lg:px-24 max-w-6xl mx-auto pb-16 xs:pb-20 sm:pb-40 md:pb-48"
        style={{ zIndex: 20, containerType: 'inline-size' }}
      >
        <div className="font-mono text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-bone/60 uppercase mb-2 xs:mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
          ▌ NC STATE // GOLDMAN SACHS ▐
        </div>
        {NAME_LINES.map((line) => (
          <GlitchTitle key={line} text={line} />
        ))}
        <div className="mt-2 xs:mt-3 sm:mt-4 md:mt-6 font-mono text-[11px] xs:text-[12px] sm:text-sm tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.3em] text-bone/70 uppercase px-1 xs:px-2 drop-shadow-lg max-w-xs xs:max-w-sm sm:max-w-md">
          {profile.tagline}
        </div>
      </div>


      {/* Bottom ticker */}
      <div
        ref={tickerRef}
        className="absolute bottom-0 left-0 right-0 border-t border-bone/10 bg-[#050507]/95 overflow-hidden"
        style={{ zIndex: 30 }}
      >
        <div className="flex whitespace-nowrap py-2 sm:py-3 animate-ticker font-mono text-[10px] sm:text-[13px] tracking-[0.15em] sm:tracking-[0.25em] uppercase">
          {Array.from({ length: 2 }).map((_, repeat) => (
            <div key={repeat} className="flex gap-5 px-5 sm:gap-8 sm:px-8">
              <span className="text-bone/70">▲ TYPESCRIPT +12.4%</span>
              <span className="text-wolf-red">● NCSU 3.83</span>
              <span className="text-gs-blue">◆ GS +0.8σ</span>
              <span className="text-bone/70">▼ COFFEE -78%</span>
              <span className="text-bone/70">▲ COMMITS +∞</span>
              <span className="text-wolf-red">● WOLFPACK</span>
              <span className="text-gs-blue">◆ GS SUMMER '26</span>
              <span className="text-bone/70">▲ REACT 18 STABLE</span>
              <span className="text-bone/70">▼ SLEEP -34%</span>
              <span className="text-wolf-red">● BUILD MODE</span>
              <span className="text-gs-blue">◆ RAG // VECTOR SEARCH</span>
              <span className="text-bone/70">▲ SHIP IT</span>
            </div>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <div
        className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center pointer-events-none"
        style={{ zIndex: 25 }}
      >
        <div className="font-mono text-[11px] tracking-[0.5em] text-bone/50 uppercase mb-2">
          scroll
        </div>
        <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-wolf-red to-transparent" />
      </div>
    </section>
  );
}
