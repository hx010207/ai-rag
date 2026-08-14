/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hh: {
          emerald: '#00E676',
          'emerald-chip': '#E0F2F1',
          'emerald-dark': '#004D40',

          coral: '#FF3D00',
          'coral-chip': '#FFEBEE',
          'coral-dark': '#880E4F',

          gold: '#FFD600',
          'gold-chip': '#FFFDE7',
          'gold-dark': '#5D4037',
        },
        slate: {
          950: '#080c14',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
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
