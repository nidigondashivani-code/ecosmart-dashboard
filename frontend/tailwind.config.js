/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // Emerald 500
        secondary: "#0f766e", // Teal 700
        background: "#0f172a", // Slate 900
        surface: "#1e293b", // Slate 800
        surfaceLight: "#334155", // Slate 700
        danger: "#ef4444", // Red 500
        warning: "#f59e0b", // Amber 500
        info: "#3b82f6", // Blue 500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
