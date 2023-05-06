/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      'blue':"#3a86ff",
      'purple':"#8338ec",
      'white':"#FFFFFF",
      'hoverGray':"#D4DADB",
      'darkPurple':"#5B0BCB",
      'red':"#FF6C6C",
      'green':"#7AD8A0",      
    },
    fontSize:
    {
      'xl':'3rem',
      'lg':'1.875rem',
      'm':'1.4rem',
      'sm':'1rem',
      'xs':'0.75rem',
      'xxs':'0.55rem'

    },
    extend: {},
  },
  plugins: [],
}
