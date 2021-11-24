module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        loadtransition: {
          '0%': {opacity: 0},
          '100%': {opacity: 100},
        },
      },
      animation: {
        loadtransition : 'loadtransition 1s ease-in-out',
      },  
      backgroundImage: {
        'bg': "linear-gradient(180deg, rgba(30,62,124,1) 0%, rgba(3,88,95,1) 21%, rgba(3,88,95,1) 75%, rgba(30,62,124,1) 100%);",
        'svg': "url('~/img/test.svg')",
      },
      colors: {
        glass: {
          DEFAULT: '#21242d'
        }
      },
    },   
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
