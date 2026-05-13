import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, type ProjectItem } from '@/data/profile';
import { getGitHubStats } from '@/lib/api';

interface GhStats {
  total_stars?: number;
  followers?: number;
  public_repos?: number;
  recent?: Array<{ name: string; stars: number; language: string }>;
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: ProjectItem;
  index: number;
  onOpen: () => void;
}) {
  const tilt = (index % 2 ? 1 : -1) * (3 + (index % 3));
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 60, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        y: -8,
        boxShadow: '0 30px 80px rgba(204,0,0,0.35)',
      }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      viewport={{ once: true, margin: '-80px' }}
      className="scanlines group relative text-left bg-gs-slate/85 border border-bone/15 p-5 xs:p-6 sm:p-8 cursor-none overflow-hidden"
      data-cursor="hover"
    >
      {/* corner brackets */}
      <span className="absolute top-2 xs:top-3 left-2 xs:left-3 w-2 xs:w-3 h-2 xs:h-3 border-t border-l border-wolf-red" />
      <span className="absolute top-2 xs:top-3 right-2 xs:right-3 w-2 xs:w-3 h-2 xs:h-3 border-t border-r border-gs-blue" />
      <span className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 w-2 xs:w-3 h-2 xs:h-3 border-b border-l border-gs-blue" />
      <span className="absolute bottom-2 xs:bottom-3 right-2 xs:right-3 w-2 xs:w-3 h-2 xs:h-3 border-b border-r border-wolf-red" />

      <div className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.3em] xs:tracking-[0.4em] text-bone/40 uppercase">
        proj/{String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-4xl font-bold text-bone mt-2 xs:mt-3 leading-tight group-hover:text-wolf-red transition-colors">
        {project.name}
      </h3>
      <p className="font-mono text-xs xs:text-sm text-bone/60 mt-1 xs:mt-2">{project.tagline}</p>
      <p className="text-xs xs:text-sm sm:text-base text-bone/80 mt-3 xs:mt-4 leading-relaxed">{project.blurb}</p>

      <div className="mt-4 xs:mt-6 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="font-mono text-[7px] xs:text-[8px] sm:text-[10px] tracking-[0.15em] xs:tracking-[0.2em] uppercase border border-bone/20 px-2 py-1 text-bone/70"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 xs:mt-6 font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.2em] xs:tracking-[0.3em] text-wolf-red uppercase opacity-0 group-hover:opacity-100 transition-opacity">
        ▸ click to explode
      </div>

      {/* shimmer line */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-y-12 -inset-x-1/2 w-[200%] bg-gradient-to-r from-transparent via-bone/5 to-transparent rotate-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </motion.button>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectItem;
  onClose: () => void;
}) {
  // explosion fragments
  const fragments = Array.from({ length: 14 });
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-[#050507]/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* explosion particles */}
      {fragments.map((_, i) => {
        const a = (i / fragments.length) * Math.PI * 2;
        const dx = Math.cos(a) * (200 + Math.random() * 200);
        const dy = Math.sin(a) * (200 + Math.random() * 200);
        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3"
            style={{ background: i % 2 ? '#CC0000' : '#4F90D2' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        );
      })}

      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="scanlines crt relative max-w-2xl w-full bg-gs-slate border border-bone/20 p-6 xs:p-8 sm:p-10 shadow-[0_0_120px_rgba(204,0,0,0.4)] max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 xs:top-4 right-3 xs:right-4 font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.2em] xs:tracking-[0.3em] uppercase text-bone/60 hover:text-wolf-red"
          data-cursor="hover"
        >
          [ esc ]
        </button>

        <div className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.3em] xs:tracking-[0.4em] text-wolf-red uppercase">
          ◆ project / detonated
        </div>
        <h3 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-5xl font-extrabold text-bone mt-2 xs:mt-3 leading-tight">
          {project.name}
        </h3>
        <p className="font-mono text-xs xs:text-sm text-gs-blue mt-2">{project.tagline}</p>
        <p className="text-bone/80 mt-4 xs:mt-6 text-sm xs:text-base leading-relaxed">{project.blurb}</p>

        <div className="mt-4 xs:mt-6 grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 font-mono text-[8px] xs:text-xs">
          {project.stack.map((s) => (
            <div key={s} className="border border-bone/15 px-2 xs:px-3 py-2 text-bone/70 tracking-[0.15em] xs:tracking-[0.2em] uppercase">
              ▸ {s}
            </div>
          ))}
        </div>

        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 xs:mt-8 font-mono text-xs tracking-[0.2em] xs:tracking-[0.3em] uppercase border border-wolf-red text-wolf-red px-4 xs:px-5 py-2 xs:py-3 hover:bg-wolf-red hover:text-bone transition-colors"
          data-cursor="hover"
        >
          ▸ view repo
        </a>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [active, setActive] = useState<ProjectItem | null>(null);
  const [stats, setStats] = useState<GhStats | null>(null);

  useEffect(() => {
    getGitHubStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <section id="projects" className="section relative bg-[#050507] py-20 xs:py-24 sm:py-28 md:py-32 px-4 xs:px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col xs:flex-row xs:items-baseline xs:justify-between gap-6 xs:gap-4 mb-8 xs:mb-12">
          <div>
            <div className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.3em] xs:tracking-[0.4em] sm:tracking-[0.5em] text-bone/50 uppercase">
              04 / projects
            </div>
            <h2 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold text-bone mt-2 leading-none">
              the workbench.
            </h2>
          </div>
          {stats && (
            <div className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.2em] xs:tracking-[0.3em] text-bone/50 uppercase xs:text-right">
              <div>github / live</div>
              <div className="text-bone mt-1 space-y-0.5">
                <div><span className="text-wolf-red">★ {stats.total_stars ?? '—'}</span></div>
                <div><span className="text-gs-blue">repos {stats.public_repos ?? '—'}</span></div>
                <div>followers {stats.followers ?? '—'}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xs:gap-7 sm:gap-8">
          {profile.projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={() => setActive(p)} />
          ))}
        </div>

        {/* Publications band */}
        {profile.publications.length > 0 && (
          <div className="mt-20 border-t border-bone/10 pt-10">
            <div className="font-mono text-[10px] tracking-[0.5em] text-bone/50 uppercase mb-6">
              ◆ research + publications
            </div>
            <ul className="space-y-3">
              {profile.publications.map((pub, i) => (
                <li
                  key={i}
                  className="flex gap-4 items-start font-mono text-xs md:text-sm text-bone/80 leading-relaxed"
                >
                  <span className="text-wolf-red shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                  <span>{pub.cite}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
