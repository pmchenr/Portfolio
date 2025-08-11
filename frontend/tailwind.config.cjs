/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#0b0b0b',
        ash: '#5b6166',
        paper: '#ffffff',
        line: '#e6e6e6',
        // Patagonia-ish accents
        pine: '#0f766e',     // green-blue
        rust: '#9a3412',     // warm rust
        sand: '#f5f3ea',     // light sand bg
        sky:  '#e6f1f7',     // pale blue bg
      },
      boxShadow: {
        card: '0 1px 1px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        brand: '18px',
      },
    },
  },
  plugins: [],
};
