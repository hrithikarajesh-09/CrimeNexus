/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#12151B',
        panel: {
          DEFAULT: '#181C24',
          subtle: '#1F2430',
        },
        border: '#2B313D',
        ink: {
          DEFAULT: '#E8EAEE',
          dim: '#9AA3B2',
          faint: '#6B7382',
        },
        brass: {
          DEFAULT: '#C68A46',
          hover: '#D49855',
          muted: 'rgba(198, 138, 70, 0.15)',
        },
        steel: '#6C93B8',
        teal: '#4E9C93',
        violet: '#8B81C4',
        red: '#C1655A',
        green: '#5FA876',
      },
      borderRadius: {
        DEFAULT: '5px',
        sm: '4px',
        md: '5px',
        lg: '6px',
        xl: '6px',
        '2xl': '6px',
        '3xl': '6px',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
