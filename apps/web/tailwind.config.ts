import type { Config } from 'tailwindcss';

// Manara design tokens — Mediterranean teal + desert sand + gold.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefaf9',
          100: '#d5f2f0',
          200: '#aee5e2',
          300: '#77d2cf',
          400: '#3bb6b4',
          500: '#189a9b',
          600: '#117d80',
          700: '#116568',
          800: '#125053',
          900: '#134345',
          950: '#05292c',
        },
        sand: {
          50: '#faf8f4',
          100: '#f4efe6',
          200: '#e7dccb',
          300: '#d6c4a4',
          400: '#c4a97c',
          500: '#b7935d',
          600: '#a5804f',
          700: '#8a6842',
          800: '#70553a',
          900: '#5b4631',
        },
        gold: {
          300: '#f4cf6e',
          400: '#efbc4c',
          500: '#e8a72e',
          600: '#cf8a1e',
          700: '#ab691b',
        },
        ink: {
          50: '#f6f7f8',
          100: '#e9edee',
          200: '#d6dcde',
          300: '#b4bfc2',
          400: '#8b9aa0',
          500: '#6c7d84',
          600: '#56666d',
          700: '#46535a',
          800: '#3b464c',
          900: '#0d1b1e',
          950: '#081517',
        },
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,27,30,0.05), 0 8px 24px -12px rgba(13,27,30,0.18)',
        lift: '0 4px 8px rgba(13,27,30,0.06), 0 16px 40px -16px rgba(17,101,104,0.28)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
