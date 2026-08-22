/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bento-bg': '#FFFDF9', // Vanilla (Light)
        'bento-bg-dark': '#F4EFE6', 
        'bento-text': '#000000', // Pure Black for text
        'bento-text-inverse': '#FFFFFF', // Pure White for text on dark backgrounds
        'bento-yellow': '#D81B60', // Strawberry Pink/Red for accents
        'bento-grey': '#757575', // Neutral grey
        
        chocolate: '#3E2723',
        vanilla: '#FFFDF9',
        strawberry: '#D81B60',
        
        cream: '#FFFDF9',
        'off-white': '#F4EFE6',
        beige: '#E8DCCB',
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
