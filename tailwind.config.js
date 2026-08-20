/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8D6', // Pale bento yellow
        'off-white': '#FFFCF0', // Lightest bento yellow
        beige: '#FFE485', // Light bento yellow
        'bento-grey': '#333333',
        'bento-black': '#111111',
        'bento-yellow': '#FFD700',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(92, 64, 51, 0.08)',
      },
    },
  },
  plugins: [],
}
