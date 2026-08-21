/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFD700', // Solid Yellow
        'off-white': '#FFCC00', // Solid Yellow (slightly different for depth if needed, or same)
        beige: '#E6B800', // Darker Yellow for borders/accents
        'bento-grey': '#9CA3AF', // Lighter Gray for text on black background
        'bento-black': '#000000', // Solid Black
        'bento-yellow': '#FFD700', // Solid Yellow
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
