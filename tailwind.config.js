/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sadya: {
          blue: {
            light: '#eff6ff',
            DEFAULT: '#2563eb',
            dark: '#1d4ed8',
            vibrant: '#2563eb',
          },
          orange: '#ea580c',
          green: '#16a34a',
          purple: '#7c3aed',
          yellow: '#facc15',
          red: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
