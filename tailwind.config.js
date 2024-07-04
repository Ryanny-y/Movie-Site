/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '*.{html,js}',
  ],
  theme: {
    container: {
      center: true,
      screens: {
        default: '100%',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '160px',
      },
    },
    extend: {
      colors : {
        'red': '#FF0000',
        'light-1': 'D9D9D9',
      },
      maxWidth: {
        'max-c': '1440px'
      },
      fontFamily: {
        'Poppins': ['Poppins', 'Arial', 'sans-serif'],
      },
      width: {
        '100': '416px'
      },
      gap: {
        '18': '72px'
      },
      height: {
        'height-1': '744px',
        'height-2': '640px'
      },
      padding: {
        '2.5': '10px'
      }
    },
  },
  plugins: [],
}

