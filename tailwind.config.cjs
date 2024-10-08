/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "500px",
        modal: "720px",
      },
      boxShadow: {
        x: [
          "rgba(136, 153, 166, 0.2) 0px 0px 15px",
          "rgba(136, 153, 166, 0.15) 0px 0px 3px 1px",
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        "twitter-chirp": ["TwitterChirp", "sans-serif"],
        "twitter-chirp-extended": ["TwitterChirpExtendedHeavy", "sans-serif"],
      },
      colors: {
        dark: "#010100",
        border: "rgb(47, 51, 54)",
        accent: "rgb(113, 118, 123)",
        card: "rgb(32, 35, 39)",
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        desctructive: "hsl(var(--desctructive))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
