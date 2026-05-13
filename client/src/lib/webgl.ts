/**
 * One-time, cached WebGL availability check.
 * Returns true only if the browser can actually hand out a usable WebGL context.
 *
 * Use this to branch before mounting any <Canvas> / three.js renderer —
 * if it returns false, we render a 2D fallback so the page never blanks out.
 */
let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cached = false;
    return cached;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}

/** For tests / manual overrides — clears the memoized result. */
export function _resetWebGLCache(): void {
  cached = null;
}
