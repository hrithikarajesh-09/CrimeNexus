/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0D13',
          surface: '#11141D',
          panel: '#151924',
          subtle: '#1C2230',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
        },
        brand: {
          primary: '#6366F1',   // Refined Indigo
          accent: '#38BDF8',    // Ice Blue
          amber: '#F59E0B',     // Warm Amber (Bridge Broker)
          emerald: '#10B981',   // Verified Green
          rose: '#F43F5E',      // Alert Red
          slate: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
