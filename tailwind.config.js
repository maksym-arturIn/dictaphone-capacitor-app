/** @type {import('tailwindcss').Config} */

/* eslint-disable */
const colors = require('tailwindcss/colors')

// removing old colors
delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      accent: {
        300: '#07B794',
        500: '#2f8a71'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
