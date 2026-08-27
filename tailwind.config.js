/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFCF7',
          100: '#F9F5EC',
          200: '#F3E5AB',
          300: '#E6CA65',
          400: '#D4AF37',
          500: '#C59B27',
          600: '#AA7C1E',
          700: '#8A5E18',
          800: '#694314',
          900: '#4D2F10',
          glow: 'rgba(212, 175, 55, 0.4)',
        },
        dark: {
          950: '#070709',
          900: '#0C0D12',
          850: '#12141C',
          800: '#1A1C27',
          700: '#262938',
          600: '#3A3F54',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #996515 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0C0D12 0%, #070709 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
};
