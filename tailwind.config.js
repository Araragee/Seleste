/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'c-white': '#fff',
        'c-light-gray': '#f5f5f5',
        'c-gray': '#7e7e7e',
        'c-black': '#000',
        'c-ash': '#eaeef6',
        'c-charcoal': '#abb8c3',
        'c-void': '#141b22',
        'c-fair-pink': '#ffedec',
        'c-apricot': '#fbc8be',
        'c-coffee': '#754d42',
        'c-del-rio': '#917072',
        'c-java': '#1fcac5',
        'c-titan-white': '#f1eeff',
        'c-cold-purple': '#a69fd6',
        'c-indigo': '#6558d3',
        'c-governor': '#4133b7',
        'c-green': '#11b196',
        'c-light-green': '#e2f5f2',
        'c-red': '#dd1d26',
        'c-star': '#ffd966',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        spline: ['Spline Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
