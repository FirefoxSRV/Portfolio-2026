import { useEffect, useState, type RefObject } from 'react';

/**
 * Returns whether the referenced element is intersecting the viewport.
 * Use this to gate expensive per-frame work (canvases, useFrame loops).
 */
export function useInView(ref: RefObject<Element>, rootMargin = '0px'): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
