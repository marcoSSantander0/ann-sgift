/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        blush: '#ffe5ec',
        rose: '#ff8fab',
        wine: '#7a284b',
        cream: '#fff8f2',
        ink: '#402233'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(122, 40, 75, 0.12)'
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 143, 171, 0.35)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255, 143, 171, 0)' }
        }
      },
      animation: {
        floaty: 'floaty 3.2s ease-in-out infinite',
        fadeInUp: 'fadeInUp 450ms ease-out both',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
