/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'judcd-green': '#008751',
        'judcd-green-light': '#00A860',
        'judcd-green-dark': '#006B41',
        'judcd-yellow': '#FFD100',
        'judcd-yellow-light': '#FFE44D',
        'judcd-red': '#D21034',
        'judcd-blue': '#002060',
        'judcd-blue-light': '#003A8C',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Poppins', 'sans-serif'],
        'ui': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}