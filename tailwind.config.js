const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx', './layouts/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
      minWidth: theme => theme('spacing'),
      maxWidth: {
        screen: '100vw',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/custom-forms')],
}
