const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
      minWidth: theme => theme('spacing'),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
