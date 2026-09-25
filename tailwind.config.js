/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4fc',
          100: '#fae6f7',
          200: '#f4ceef',
          300: '#efa8e2',
          400: '#e474ce',
          500: '#d143b5',
          600: '#b42897',
          700: '#95298E', // Main accent
          800: '#792072',
          900: '#641f5e',
          950: '#3e0b39',
        }
      }
    },
  },
  plugins: [],
}
