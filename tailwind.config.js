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
          elevated: '#232834',
        },
        border: {
          DEFAULT: '#2B313D',
          subtle: '#222733',
          elevated: '#384152',
        },
        bone: '#F4EFE6',
        taupe: {
          DEFAULT: '#787167',
          light: '#948B7E',
          muted: '#5A534B',
        },
        crimson: {
          DEFAULT: '#8B2626',
          bright: '#B83232',
          muted: 'rgba(139, 38, 38, 0.15)',
        },
        ink: {
          DEFAULT: '#E8EAEE',
          bone: '#F4EFE6',
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
        mono: ['"Courier Prime"', '"IBM Plex Mono"', 'Courier', 'monospace'],
        typewriter: ['"Courier Prime"', 'Courier', 'monospace'],
      }
    },
  },
  plugins: [],
}
