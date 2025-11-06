/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cuvee-gold': '#D4AF37',
        'cuvee-dark': '#1F2937',
        'cuvee-gray': '#4B5563',
        'cuvee-lite': '#F3F4F6',
        'cuvee-black': '#0F172A',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #C4A137 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      },
    },
  },
  plugins: [],
}
