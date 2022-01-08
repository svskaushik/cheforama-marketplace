module.exports = {
  content: [
      './pages/**/*.{html,js}'
  ],

  theme: {
    extend: {
      keyframes: {
        loadtransition: {
          '0%': {opacity: 0},
          '100%': {opacity: 100},
        },
        floatation: {
          '0%': { transform: 'translatey(0px)' },
          '50%':  { transform: 'translatey(15px)' },
          '100%':   { transform: 'translatey(-0px)' },
        },
      },
      animation: {
        loadtransition : 'loadtransition 1s ease-in-out',
        pingslow : 'ping 1.2s ease-in-out infinite',
        floatation : 'floatation 3s ease-in-out infinite',
      },  
      backgroundImage: {
        'bg': "url('~/img/bg.jpg')",
        'svg': "url('~/img/wave.svg')",
      },
      colors: {
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
