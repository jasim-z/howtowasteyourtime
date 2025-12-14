/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#E8E0F0',    // Soft lavender - main background
        primary: '#FF8A80',       // Warm coral - buttons, accents
        secondary: '#B8F0D8',     // Pale mint - secondary accents
        card: '#FFF8F0',          // Soft cream - cards, containers
        text: '#5C5470',          // Muted purple - all text
        textLight: '#8E8A9D',     // Lighter purple - secondary text
      },
    },
  },
  plugins: [],
}

