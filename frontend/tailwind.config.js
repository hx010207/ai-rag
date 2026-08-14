/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#060913',
          900: '#0c101d',
          800: '#141a2e',
          700: '#1e2640',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        sunset: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        palm: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        neon: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          pink: '#ec4899',
        }
      },
      backgroundImage: {
        'hh-sunset': 'linear-gradient(135deg, #4f46e5 0%, #f43f5e 50%, #f59e0b 100%)',
        'hh-tropical': 'linear-gradient(135deg, #06b6d4 0%, #10b981 50%, #f59e0b 100%)',
        'hh-glow': 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'glow-spin': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1.0)' },
        }
      }
    },
  },
  plugins: [],
}
