/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [  "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        skyBlue: '#38bdf8',
        darkBlue:'#0284c7',
        grey:'#9ca3af',
      }
    }
  },
  plugins: []
};

