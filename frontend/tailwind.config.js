/** @type {import('tailwindcss').Config} */

import { primaryColor } from "./constants";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        primary: primaryColor,
        secondary: "rgb(252,136,55)",
        "line-red": "rgb(255, 99, 132)",
        asian: "#FF5050",
        blackstudents: "#4472C4",
        hispanic: "#FF9900",
        whitestudents: "#339933",
        other: "#FFC000",
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [],
};
