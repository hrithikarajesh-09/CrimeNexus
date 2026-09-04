/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sleek: {
          bg: '#121816',         // Deepest background
          dark: '#1a221f',       // Surface 1
          card: '#222b27',       // Surface 2
          charcoal: '#2C3531',   // Palette Color 1 (#2C3531)
          teal: '#116466',       // Palette Color 2 (#116466)
          tealHover: '#167b7e',  // Bright Teal
          bronze: '#D9B08C',     // Palette Color 3 (#D9B08C)
          peach: '#FFCB9A',      // Palette Color 4 (#FFCB9A)
          ice: '#D1E8E2',        // Palette Color 5 (#D1E8E2)
          muted: '#7e968e',      // Subdued tactical text
          border: 'rgba(17, 100, 102, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
