/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F17',
        panel: {
          DEFAULT: '#131A26',
          subtle: '#1A2332',
          elevated: '#1D2738',
        },
        border: {
          DEFAULT: '#222D3F',
          subtle: '#1A2332',
          elevated: '#2E3D55',
        },
        amber: {
          DEFAULT: '#D4A359',
          hover: '#E0B268',
          muted: 'rgba(212, 163, 89, 0.12)',
        },
        brass: {
          DEFAULT: '#D4A359',
          hover: '#E0B268',
          muted: 'rgba(212, 163, 89, 0.12)',
        },
        ink: {
          DEFAULT: '#F1F5F9',
          bone: '#F1F5F9',
          dim: '#94A3B8',
          faint: '#64748B',
        },
        steel: '#3B82F6',
        blue: {
          DEFAULT: '#3B82F6',
          muted: 'rgba(59, 130, 246, 0.12)',
        },
        teal: {
          DEFAULT: '#14B8A6',
          muted: 'rgba(20, 184, 166, 0.12)',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          muted: 'rgba(139, 92, 246, 0.12)',
        },
        purple: {
          DEFAULT: '#8B5CF6',
          muted: 'rgba(139, 92, 246, 0.12)',
        },
        crimson: {
          DEFAULT: '#E05252',
          bright: '#F87171',
          muted: 'rgba(224, 82, 82, 0.14)',
        },
        red: {
          DEFAULT: '#E05252',
          muted: 'rgba(224, 82, 82, 0.14)',
        },
        green: {
          DEFAULT: '#34D399',
          muted: 'rgba(52, 211, 153, 0.12)',
        },
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
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
