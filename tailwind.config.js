const colors = require('tailwindcss/colors')

module.exports = {
    purge: ['./pages/**/*.js', './components/**/*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gray: colors.trueGray,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
