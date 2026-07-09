/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cod: {
          bg: '#0b0d0a',
          panel: '#14170f',
          panel2: '#1b1f16',
          border: '#2a2f22',
          accent: '#9acd32',
          gold: '#d4af37',
          diamond: '#7fd8ff',
        },
      },
    },
  },
  plugins: [],
}
