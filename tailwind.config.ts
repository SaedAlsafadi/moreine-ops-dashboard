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
        // Horizon UI base background
        light: '#F4F7FE',
      },
      boxShadow: {
        'horizon': '0px 18px 40px rgba(112, 144, 176, 0.12)',
        'horizon-sm': '0px 8px 20px rgba(112, 144, 176, 0.08)',
      },
      borderRadius: {
        'xl': '20px',
      }
    },
  },
  plugins: [],
}

export default config
