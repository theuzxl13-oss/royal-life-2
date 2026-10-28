/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0b0b0b', 900: '#0b0b0b', 800: '#141414', 700: '#1d1d1d', 600: '#2a2a2a' },
        gold: { DEFAULT: '#c9a54c', light: '#e6cf8b', dark: '#9c7c2e' },
        cream: { DEFAULT: '#f4ede1', dark: '#e3d7c3' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #9c7c2e 0%, #e6cf8b 45%, #c9a54c 60%, #9c7c2e 100%)',
      },
    },
  },
  plugins: [],
};
