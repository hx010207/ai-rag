/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        goa: {
          teal: '#1D9E75',
          'teal-chip': '#E1F5EE',
          'teal-dark': '#04342C',

          coral: '#993C1D',
          'coral-chip': '#F5C4B3',
          'coral-dark': '#712B13',

          amber: '#EF9F27',
          'amber-chip': '#FAEEDA',
          'amber-dark': '#633806',
        },
        slate: {
          950: '#0a0f16',
          900: '#111722',
          800: '#1a2232',
          700: '#263248',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1.0)' },
        }
      }
    },
  },
  plugins: [],
}
