import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Fraunces', 'Georgia', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        palette: {
          dark: '#1F1C1C',
          white: '#FEFEFE',
          olive: '#7B7557',
          sage: '#69AC7C',
          grey: '#D9D9D9',
          cream: '#FFF6EF',
          brown: '#59543E',
        },
        workflow: {
          green: '#69AC7C',
        },
      },
      borderRadius: {
        workflow: '0.75rem',
        'workflow-lg': '1rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        'svg.iconify, [data-icon] svg, .NuxtIcon svg': {
          fill: 'currentColor',
          color: 'inherit',
        },
      })
    },
  ],
} satisfies Config
