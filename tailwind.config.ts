import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#060d16',
          900: '#0d1520',
          800: '#111d2b',
          700: '#162438',
          600: '#1c2e45',
          500: '#223552',
        },
        accent: '#3db88a',
        content: {
          primary: '#e2eef8',
          secondary: '#8aabc4',
          muted: 'rgba(226,238,248,0.35)',
        },
        threat: {
          low: '#22c98a',
          watch: '#3b9eff',
          moderate: '#f5a623',
          high: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
