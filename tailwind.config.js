/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1E36',
          dark: '#061426',
          50: '#E8EDF3',
          100: '#C9D4E3',
          200: '#9AABC4',
          300: '#6B82A5',
          400: '#3C5986',
          500: '#1E3D63',
          600: '#152E4D',
          700: '#0B1E36',
          800: '#08182B',
          900: '#061426',
          950: '#030B16',
        },
        gold: {
          DEFAULT: '#DEAD42',
          dark: '#BE8A33',
          light: '#F3D477',
          50: '#FBF3DC',
          100: '#F7E8B8',
          200: '#F3D477',
          300: '#E5BC52',
          400: '#DEAD42',
          500: '#D29B36',
          600: '#BE8A33',
          700: '#9A6E28',
          800: '#73531E',
          900: '#4D3814',
        },
        offwhite: '#F2F1ED',
        status: {
          success: '#16805C',
          warning: '#D97706',
          danger: '#C0392B',
          info: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
