import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-light': 'rgb(var(--border-light) / <alpha-value>)',
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        cream: 'rgb(var(--cream) / <alpha-value>)',
        olive: 'rgb(var(--olive) / <alpha-value>)',
        
        // Aliases to make refactoring easier initially
        navy: {
          700: 'rgb(var(--border-light) / <alpha-value>)', // Used sometimes as a lighter border/text
          800: 'rgb(var(--surface) / <alpha-value>)',      // Used mostly for cards in dark mode
          900: 'rgb(var(--background) / <alpha-value>)',   // Used mostly for background in dark mode
        },
        sage: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent-hover) / <alpha-value>)',
        }
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
      },
      borderRadius: {
        'card': 'var(--radius-card)',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
