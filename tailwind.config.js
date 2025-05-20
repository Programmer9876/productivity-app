/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",               // ✅ required
    "./src/**/*.{js,ts,jsx,tsx}"  // ✅ must cover your files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}