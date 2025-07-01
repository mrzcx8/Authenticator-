/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-green-500', 'bg-red-500', 'bg-blue-500', 'bg-yellow-500',
    'text-green-500', 'text-red-500', 'text-blue-500', 'text-yellow-500',
  ],
}

