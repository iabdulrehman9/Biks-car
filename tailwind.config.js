/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      /* =========================================================
         B.I.K.S. BRAND COLORS
      ========================================================= */
      colors: {
        navy: {
          DEFAULT: '#001030',
          dark: '#000A20',
          light: '#102044',
        },

        gold: {
          DEFAULT: '#D0A030',
          dark: '#A77D20',
          light: '#E6C45C',
        },

        offwhite: '#F2F1ED',

        status: {
          success: '#16805C',
          warning: '#D97706',
          danger: '#C0392B',
          info: '#2563EB',
        },
      },

      /* =========================================================
         TYPOGRAPHY
      ========================================================= */
      fontFamily: {
        // Main website font
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          'sans-serif',
        ],

        // B.I.K.S. automotive / technical display font
        logo: [
          'Orbitron',
          'sans-serif',
        ],

        // TRADING COMPANY technical condensed font
        trading: [
          'Rajdhani',
          'Arial Narrow',
          'sans-serif',
        ],
      },

      /* =========================================================
         MAX WIDTH
      ========================================================= */
      maxWidth: {
        '8xl': '88rem',
      },

      /* =========================================================
         ANIMATIONS
      ========================================================= */
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },

      /* =========================================================
         KEYFRAMES
      ========================================================= */
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },

        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },

  plugins: [],
};