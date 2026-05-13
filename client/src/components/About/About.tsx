import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '@/data/profile';

function useTypewriter(text: string, start: boolean, speed = 20) {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!start) return;
    let i = 0;
    setOut('');
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, start, speed]);
  return out;
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ['-30%', '0%', '0%', '-30%']);
  const rightX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ['30%', '0%', '0%', '30%']);
  const collisionFlash = useTransform(scrollYProgress, [0.32, 0.36, 0.4], [0, 1, 0]);

  const [typeStart, setTypeStart] = useState(false);
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (v > 0.4 && v < 0.85) setTypeStart(true);
    });
    return () => unsub();
  }, [scrollYProgress]);

  const typed = useTypewriter(profile.bio, typeStart, 18);

  return (
    <section ref={sectionRef} id="about" className="section relative overflow-hidden">
      {/* Desktop halves */}
      <div className="absolute inset-0 hidden md:flex">
        {/* LEFT — NC State */}
        <motion.div style={{ x: leftX }} className="w-1/2 h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#CC0000_0%,#7A0000_55%,#000000_100%)]" />
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 38px, rgba(0,0,0,0.5) 38px 40px), repeating-linear-gradient(90deg, transparent 0 88px, rgba(0,0,0,0.5) 88px 90px)',
            }}
          />
          <div className="relative h-full p-12 flex flex-col justify-between text-bone">
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-70">◢ side a</div>
              <h2 className="font-display text-7xl md:text-8xl font-extrabold mt-4 leading-none">
                NC<br />STATE.
              </h2>
            </div>
            <div className="max-w-sm">
              <div className="font-mono text-xs uppercase tracking-[0.3em] opacity-80 mb-3">ms cs · wolfpack · 2025—2027</div>
              <p className="font-sans text-sm leading-relaxed opacity-90">
                Generative Intelligent Computing Lab. RAG systems, VLM-powered urban analytics, late nights pushing the loop from days to minutes. B.Tech from Amrita got me here.
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Goldman Sachs */}
        <motion.div style={{ x: rightX }} className="w-1/2 h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(225deg,#050816_0%,#0F1B33_50%,#002F65_100%)]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 20% 30%, rgba(79,144,210,0.3), transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(79,144,210,0.2), transparent 50%)',
            }}
          />
          <div className="relative h-full p-12 flex flex-col justify-between text-bone">
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-gs-blue/70">side b ◣</div>
              <h2 className="font-display text-7xl md:text-8xl font-extrabold mt-4 leading-none">
                GOLDMAN<br />SACHS.
              </h2>
            </div>
            <div className="max-w-sm ml-auto text-right">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-gs-blue/80 mb-3">awm · richardson, tx · summer 26</div>
              <p className="font-sans text-sm leading-relaxed opacity-90">
                Asset & Wealth Management. Scalable backends and low-latency pipelines on a $3T+ AUS platform — ML-powered analytics for wealth managers and HNW clients. Code that has to be right the first time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile stacked version */}
      <div className="md:hidden absolute inset-0 flex flex-col">
        {/* Mobile NC State */}
        <div className="flex-1 w-full relative overflow-hidden bg-[linear-gradient(135deg,#CC0000_0%,#7A0000_55%,#000000_100%)]">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 38px, rgba(0,0,0,0.5) 38px 40px), repeating-linear-gradient(90deg, transparent 0 88px, rgba(0,0,0,0.5) 88px 90px)',
            }}
          />
          <div className="relative h-full p-4 xs:p-6 sm:p-8 flex flex-col justify-between text-bone">
            <div>
              <div className="font-mono text-[8px] xs:text-[9px] tracking-[0.3em] xs:tracking-[0.4em] uppercase opacity-70">NC State</div>
              <h2 className="font-display text-4xl xs:text-5xl sm:text-6xl font-extrabold mt-3 leading-tight">
                NC<br />STATE.
              </h2>
            </div>
            <div className="w-full">
              <div className="font-mono text-[8px] xs:text-[9px] uppercase tracking-[0.2em] xs:tracking-[0.25em] opacity-80 mb-2">ms cs · wolfpack · 2025—2027</div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed opacity-90">Generative Intelligent Computing Lab. RAG systems, VLM-powered urban analytics.</p>
            </div>
          </div>
        </div>

        {/* Mobile Goldman Sachs */}
        <div className="flex-1 w-full relative overflow-hidden bg-[linear-gradient(225deg,#050816_0%,#0F1B33_50%,#002F65_100%)]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 20% 30%, rgba(79,144,210,0.3), transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(79,144,210,0.2), transparent 50%)',
            }}
          />
          <div className="relative h-full p-4 xs:p-6 sm:p-8 flex flex-col justify-between text-bone">
            <div>
              <div className="font-mono text-[8px] xs:text-[9px] tracking-[0.3em] xs:tracking-[0.4em] uppercase text-gs-blue/70">Goldman Sachs</div>
              <h2 className="font-display text-4xl xs:text-5xl sm:text-6xl font-extrabold mt-3 leading-tight">
                GOLDMAN<br />SACHS.
              </h2>
            </div>
            <div className="w-full">
              <div className="font-mono text-[8px] xs:text-[9px] uppercase tracking-[0.2em] xs:tracking-[0.25em] text-gs-blue/80 mb-2">awm · richardson, tx · summer 26</div>
              <p className="font-sans text-xs xs:text-sm leading-relaxed opacity-90">Asset & Wealth Management. Scalable backends and low-latency pipelines on $3T+ AUS.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collision flash */}
      <motion.div style={{ opacity: collisionFlash }} className="absolute inset-0 pointer-events-none bg-bone z-20" />
      
      {/* Center seam */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-bone/40 to-transparent z-10 pointer-events-none" />

      {/* Terminal bio overlay - desktop only */}
      <div className="relative z-30 hidden md:flex items-center justify-center min-h-screen pointer-events-none">
        <div className="scanlines crt bg-[#050507]/95 border border-bone/15 max-w-2xl mx-auto p-8 md:p-10 font-mono text-sm leading-relaxed text-bone shadow-[0_0_60px_rgba(204,0,0,0.25)]">
          <div className="flex items-center gap-2 mb-4 text-[10px] tracking-[0.3em] uppercase opacity-60">
            <span className="w-2 h-2 rounded-full bg-wolf-red" />
            <span className="w-2 h-2 rounded-full bg-gs-blue" />
            <span className="w-2 h-2 rounded-full bg-bone/40" />
            <span className="ml-2">whois shreyas</span>
          </div>
          <div className="text-bone/60">
            <span className="text-wolf-red">srv@portfolio</span>
            <span className="opacity-50">:</span>
            <span className="text-gs-blue">~</span>
            <span className="opacity-50">$ </span>
            cat bio.txt
          </div>
          <div className="mt-3 min-h-[6.5rem]">
            {typed}
            <span className="inline-block w-2 h-4 ml-0.5 bg-bone animate-pulse align-middle" />
          </div>
        </div>
      </div>
    </section>
  );
}
