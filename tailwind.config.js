/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFF4CC',
          dark: '#B8860B',
        },
        silver: {
          DEFAULT: '#C0C0C0',
          light: '#E8E8E8',
          dark: '#808080',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 10s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px #FFD700, 0 0 20px #FFD700, 0 0 60px #FFD700' 
          },
          '50%': { 
            boxShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 80px #FFD700' 
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)' 
          },
          '50%': { 
            boxShadow: '0 0 0 20px rgba(255, 215, 0, 0)' 
          },
        },
      },
    },
  },
  plugins: [],
};