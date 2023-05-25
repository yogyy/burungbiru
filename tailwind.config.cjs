/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#010100",
        border: "rgb(47, 51, 54)",
        accent: "rgb(113, 118, 123)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
