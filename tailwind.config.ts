import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        paper: '#f3f0e8',
        gold: '#c9a96e',
        graphite: '#202020',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        accent: ['var(--font-cormorant)', 'serif'],
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
