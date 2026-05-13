import { create } from 'zustand';

interface AppState {
  loaded: boolean;
  setLoaded: (v: boolean) => void;
  cursorHover: boolean;
  setCursorHover: (v: boolean) => void;
  scrollProgress: number;
  setScrollProgress: (v: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  loaded: false,
  setLoaded: (v) => set({ loaded: v }),
  cursorHover: false,
  setCursorHover: (v) => set({ cursorHover: v }),
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),
}));
