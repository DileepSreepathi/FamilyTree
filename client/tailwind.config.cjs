module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ebf5ff',
          100: '#d6e9ff',
          200: '#aed3ff',
          300: '#7fbaff',
          400: '#4fa1ff',
          500: '#3182ce',
          600: '#2c6fb0',
          700: '#255c91',
          800: '#1e4a73',
          900: '#183a59'
        }
      }
    }
  },
  plugins: []
};