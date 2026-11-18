import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#581c87',
          900: '#3b0764',
          950: '#2e1065',
        },
        royal: {
          purple: '#3B0764',
          deep: '#2E1065',
          light: '#6D28D9',
          lavender: '#F5F3FF',
          surface: '#FAF8FF',
        },
        accent: {
          yellow: '#FACC15',
          gold: '#EAB308',
          dark: '#CA8A04',
          light: '#FEF08A',
        },
        navy: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        hindi: ['var(--font-devanagari)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(59, 7, 100, 0.08)',
        'card': '0 2px 12px -1px rgba(59, 7, 100, 0.06)',
        'hover': '0 10px 25px -3px rgba(59, 7, 100, 0.12)',
      }
    },
  },
  plugins: [],
};
export default config;
