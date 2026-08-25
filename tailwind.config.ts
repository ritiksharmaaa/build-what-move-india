import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PathFinder India brand palette — premium, not generic
        brand: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c2d5ff',
          300: '#93b4ff',
          400: '#5e8aff',
          500: '#3366ff',
          600: '#1a4fff',
          700: '#0d3ae6',
          800: '#1030b8',
          900: '#132d91',
          950: '#0e1d58',
        },
        // Door status colors — accessible contrast ratios
        door: {
          open: '#16a34a',        // green-600
          conditional: '#ca8a04', // yellow-600
          harder: '#ea580c',      // orange-600
          closed: '#dc2626',      // red-600
          reopenable: '#9333ea',  // purple-600
          unverified: '#6b7280',  // gray-500
        },
        // Surface colors
        surface: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          elevated: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-latin)', 'system-ui', 'sans-serif'],
        devanagari: ['var(--font-devanagari)', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        'hindi': '1.6', // Prevents Devanagari matra clipping
      },
      animation: {
        'status-change': 'statusChange 300ms ease-in-out',
        'count-up': 'countUp 400ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'toast-in': 'toastIn 300ms ease-out',
      },
      keyframes: {
        statusChange: {
          '0%': { opacity: '0.5', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
