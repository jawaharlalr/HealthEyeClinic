/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: '#3b82f6',   // Soft Blue
          secondary: '#1e1b4b', // Deep Navy
          accent: '#22d3ee',    // Light Cyan
          glass: 'rgba(255, 255, 255, 0.05)',
          glassBorder: 'rgba(255, 255, 255, 0.1)',
        }
      }
    },
  },
  plugins: [],
};