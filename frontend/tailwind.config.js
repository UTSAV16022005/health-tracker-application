/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#f3f4f6',
        card: '#ffffff',
        accent: {
          purple: '#8b5cf6',
          green: '#10b981',
          orange: '#f97316',
          blue: '#3b82f6',
          rose: '#f43f5e',
          teal: '#14b8a6',
        },
        gradient: {
          orange: { from: '#ff6b35', to: '#f7931e' },
          cyan: { from: '#00d4ff', to: '#0099ff' },
          emerald: { from: '#00d084', to: '#00a86b' },
          magenta: { from: '#ff006e', to: '#d62828' },
          purple: { from: '#9d4edd', to: '#7209b7' },
          indigo: { from: '#4361ee', to: '#3a0ca3' },
          pink: { from: '#ff10f0', to: '#ff006e' },
          amber: { from: '#ffa500', to: '#ff8c00' },
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'soft-hover': '0 20px 40px -10px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
