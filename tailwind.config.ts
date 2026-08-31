import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#9db090',
          dark: '#7a9070',
          light: '#b8c9b0',
        },
        cream: {
          DEFAULT: '#ece7d4',
          dark: '#d4ccb0',
          light: '#f5f2e8',
        },
        olive: {
          DEFAULT: '#3d4a2e',
          dark: '#2a3320',
          light: '#556640',
        },
        charcoal: '#2c2c2c',
      },
    },
  },
  plugins: [],
}

export default config
