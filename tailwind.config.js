/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      // --- Tambahkan ini ---
      keyframes: {
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-15deg)' },
          '60%': { transform: 'rotate(10deg)' },
          '80%': { transform: 'rotate(-10deg)' },
        },
      },
      animation: {
        'ring-bell': 'ring 0.4s ease-in-out infinite',
      },
      // --------------------
    },
  },
  plugins: [],
}