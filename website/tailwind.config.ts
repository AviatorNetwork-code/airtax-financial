import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1F44',
        silver: '#C4C7CC',
        surface: '#F8F9FB',
        ink: {
          900: '#0B1220',
          800: '#111B2D',
          700: '#1A2944',
          600: '#2B3A56',
          500: '#3B4A66',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        md: '10px',
        lg: '12px',
      },
      boxShadow: {
        subtle: '0 1px 1px rgba(10, 31, 68, 0.04), 0 6px 20px rgba(10, 31, 68, 0.06)',
      },
    },
  },
  plugins: [],
}
export default config
