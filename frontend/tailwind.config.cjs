/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F1C',
        'navy-dark': '#070B14',
        'navy-light': '#151C2F',
        'accent-green': '#10B981',
        'accent-blue': '#2563EB',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 