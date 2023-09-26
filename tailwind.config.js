/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/*.{tsx,ts}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        'MidAutumnBg': "url('/bg.jpg')"
   }},
  },
  plugins: [],
}
