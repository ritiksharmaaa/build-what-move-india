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
        // PathFinder India brand palette — deep navy, saffron, emerald & gemini gradients
        brand: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c2d5ff',
          300: '#93b4ff',
          400: '#5e8aff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#0f172a',
          950: '#020617',
        },
        navy: {
          800: '#112240',
          900: '#0a192f',
          950: '#030712',
        },
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
        },
        tiranga: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          blue: '#000080',
        },
        gemini: {
          blue: '#1a73e8',
          cyan: '#24c1e0',
          purple: '#9333ea',
          indigo: '#4f46e5',
          sparkle: '#8ab4f8',
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
          box: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-latin)', 'system-ui', 'sans-serif'],
        devanagari: ['var(--font-devanagari)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      lineHeight: {
        'hindi': '1.6', // Prevents Devanagari matra clipping
      },
      animation: {
        'status-change': 'statusChange 300ms ease-in-out',
        'count-up': 'countUp 400ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'toast-in': 'toastIn 300ms ease-out',
        'marquee': 'marquee 30s linear infinite',
        'marquee-fast': 'marquee 18s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fission-pulse': 'fissionPulse 2.5s ease-in-out infinite',
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
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.9', filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(34, 197, 94, 0.9))' },
        },
        fissionPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
