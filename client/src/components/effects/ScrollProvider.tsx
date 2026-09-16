import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useAppStore } from '@/store/useAppStore';

export function ScrollProvider({ children }: { children: ReactNode }) {
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);

  useEffect(() => {
    const lenis = new Lenis({
      // lerp mode: each frame moves `lerp` toward target. Feels direct + locked to RAF.
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
      syncTouch: true,
    });

    // Lenis keeps its own scroll target, so reset it too — otherwise it can
    // animate back to a position the browser restored before mount.
    lenis.scrollTo(0, { immediate: true, force: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const handle = requestAnimationFrame(raf);

    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      const p = limit > 0 ? scroll / limit : 0;
      setScrollProgress(p);
      document.documentElement.style.setProperty('--scroll', String(p));
    });

    return () => {
      cancelAnimationFrame(handle);
      lenis.destroy();
    };
  }, [setScrollProgress]);

  return <>{children}</>;
}
