module.exports = {
  purge: [],

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
        pingslow : 'ping 1s ease-in-out infinite',
      },  
      backgroundImage: {
        'bg': "url('~/img/bg.jpg')",
        'svg': "url('~/img/wave.svg')",
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
