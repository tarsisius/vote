/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'my-purple': '#D323FF',
        'my-black': '#212121',
        'my-white': '#F8F8F8',
      },
      fontFamily:{
        'my-base': ['Noto Sans', 'sans-serif'],
        'my-head': ['Ubuntu', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
