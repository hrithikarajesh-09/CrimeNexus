/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          blue: '#5680E9',       // Palette 1: Vibrant Electric Blue
          sky: '#84CEEB',        // Palette 2: Ice Sky Cyan
          azure: '#5AB9EA',      // Palette 3: Azure Ocean Blue
          lavender: '#C1C8E4',   // Palette 4: Soft Pale Periwinkle
          violet: '#8860D0',     // Palette 5: Radiant Iris Purple
          bg: '#080c18',         // Deep midnight void
          surface: '#0f1629',    // Surface Layer 1
          card: '#151f38',       // Surface Layer 2
          cardHover: '#1c294a',  // Hover Surface
          border: 'rgba(86, 128, 233, 0.25)',
          muted: '#8e9cc2',      // Subdued text
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
