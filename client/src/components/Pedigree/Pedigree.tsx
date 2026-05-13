import { motion } from 'framer-motion';
import { profile } from '@/data/profile';

const COLORS = ['#CC0000', '#4F90D2'];

export function Pedigree() {
  return (
    <section
      id="pedigree"
      className="relative bg-[#050507] py-24 px-6 md:px-12 border-y border-bone/10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <div className="font-mono text-[10px] tracking-[0.5em] text-bone/50 uppercase">
              01.5 / pedigree
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-bone mt-2 leading-none">
              the schools.
            </h2>
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-bone/40 uppercase text-right hidden md:block">
            two campuses.<br />one wolf.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {profile.schools.map((s, i) => (
            <motion.div
              key={s.org}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="scanlines relative bg-gs-slate/80 border border-bone/15 p-8 overflow-hidden"
            >
              {/* corner brackets */}
              <span
                className="absolute top-3 left-3 w-3 h-3 border-t border-l"
                style={{ borderColor: COLORS[i % COLORS.length] }}
              />
              <span
                className="absolute bottom-3 right-3 w-3 h-3 border-b border-r"
                style={{ borderColor: COLORS[i % COLORS.length] }}
              />

              <div
                className="font-mono text-[10px] tracking-[0.4em] uppercase"
                style={{ color: COLORS[i % COLORS.length] }}
              >
                ◆ {s.window}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-bone mt-3 leading-tight">
                {s.role}
              </h3>
              <div
                className="font-mono text-xs tracking-[0.25em] uppercase mt-2"
                style={{ color: COLORS[i % COLORS.length] }}
              >
                {s.org}
              </div>
              <p className="text-bone/75 text-sm mt-4 leading-relaxed">{s.blurb}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
