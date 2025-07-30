/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "rabbit-red": "rgb(0,0,0)",
      },
    },
  },
  plugins: [],
};
