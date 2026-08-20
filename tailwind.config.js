/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F6', // Changed to off-white hex per request
        'off-white': '#FDFBF7',
        beige: '#F5F0E6',
        brown: '#5C4033',
        espresso: '#3B2F2F',
        gold: '#D4AF37',
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
