/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palco preto em camadas: #000 (galeria) → #111 (módulos) → #1d1d1f/#333336 (controles).
        ink: { DEFAULT: '#000000', 900: '#000000', 800: '#111111', 700: '#1d1d1f', 600: '#333336' },
        // Dourado da marca: único sinal de compra/destaque sobre o palco monocromático.
        gold: { DEFAULT: '#c9a54c', light: '#e6cf8b', dark: '#9c7c2e' },
        cream: { DEFAULT: '#f5f5f7', dark: '#e8e8ed' },
        paper: '#ffffff',
        steel: '#86868b',
        graphite: '#6e6e73',
      },
      fontFamily: {
        display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #9c7c2e 0%, #e6cf8b 45%, #c9a54c 60%, #9c7c2e 100%)',
      },
    },
  },
  plugins: [],
};
