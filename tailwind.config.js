/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        reef: {
          sky: '#B8E4F9',
          mint: '#B8F5D6',
          peach: '#FFD6B8',
          lavender: '#E0B8F9',
          yellow: '#FFF3B8',
          coral: '#FFB8C8',
          ocean: '#5BC8F5',
          grass: '#5BD48A',
          sun: '#FFD95B',
          purple: '#B85BF5',
          bg: '#FFF8F0',
        },
        elsa: {
          primary: '#7EC8E3',
          secondary: '#B8E4F9',
          dark: '#4A90A4',
        },
        stitch: {
          primary: '#6B5CE7',
          secondary: '#E0B8F9',
          dark: '#4A3DA4',
        },
      },
      fontFamily: {
        reef: ['"Fredoka One"', '"Nunito"', 'sans-serif'],
        hebrew: ['"Heebo"', '"Rubik"', 'sans-serif'],
      },
      fontSize: {
        'kid-sm': ['1.125rem', { lineHeight: '1.5' }],
        'kid-md': ['1.375rem', { lineHeight: '1.5' }],
        'kid-lg': ['1.75rem', { lineHeight: '1.4' }],
        'kid-xl': ['2.25rem', { lineHeight: '1.3' }],
        'kid-2xl': ['3rem', { lineHeight: '1.2' }],
      },
      minWidth: { touch: '60px' },
      minHeight: { touch: '60px' },
      borderRadius: {
        '4xl': '3rem',
      },
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'star-pop': 'starPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        starPop: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '70%': { transform: 'scale(1.3) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      boxShadow: {
        'kid': '0 8px 32px rgba(0,0,0,0.12)',
        'kid-lg': '0 16px 48px rgba(0,0,0,0.16)',
        'elsa': '0 8px 32px rgba(126,200,227,0.4)',
        'stitch': '0 8px 32px rgba(107,92,231,0.4)',
      },
    },
  },
  plugins: [],
}
