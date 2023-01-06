module.exports = {
  // content: ['./src/**/*.{js,jsx,ts,tsx}'],
  content: [
    './pages/**/*.{html,jsx,js}',
    './components/**/*.{html,jsx,js}',
    './src/**/*.{html,js}',
    './src/**/*.{html,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
