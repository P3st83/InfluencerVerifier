/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          DEFAULT: '#0A0F1C',
          dark: '#070B14',
          light: '#151C2F'
        },
        'accent': {
          green: '#10B981',
          blue: '#2563EB'
        },
        'gray': {
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        }
      },
      borderRadius: {
        'xl': '1rem'
      },
      boxShadow: {
        'glow': '0 0 0 1px rgba(16, 185, 129, 0.1)',
        'inner-glow': 'inset 0 0 0 1px rgba(16, 185, 129, 0.1)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 