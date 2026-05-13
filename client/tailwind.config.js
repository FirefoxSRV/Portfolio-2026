/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // NC State — red, white, black
        wolf: {
          red: '#CC0000',
          deep: '#990000',
          white: '#FFFFFF',
          black: '#000000',
          ash: '#1A1A1A',
        },
        // Goldman Sachs — blue
        gs: {
          ink: '#050816',
          slate: '#0F1B33',
          navy: '#002F65',
          blue: '#4F90D2',
          steel: '#6B7280',
        },
        // utility
        bone: '#F5F2E8',
        glow: '#FF2E2E',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        glitch: {
          '0%,100%': { transform: 'translate(0,0)', filter: 'hue-rotate(0deg)' },
          '20%': { transform: 'translate(-2px,1px)', filter: 'hue-rotate(20deg)' },
          '40%': { transform: 'translate(2px,-1px)', filter: 'hue-rotate(-15deg)' },
          '60%': { transform: 'translate(-1px,2px)', filter: 'hue-rotate(8deg)' },
          '80%': { transform: 'translate(1px,-2px)', filter: 'hue-rotate(-5deg)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulse_ring: {
          '0%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        glitch: 'glitch 350ms steps(2, end) infinite',
        ticker: 'ticker 40s linear infinite',
        scanline: 'scanline 2.5s linear infinite',
        pulse_ring: 'pulse_ring 1.6s cubic-bezier(0.4,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
};
