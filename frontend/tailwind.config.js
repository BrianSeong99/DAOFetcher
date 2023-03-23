/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4AA182",
        foreground: "#1D1E35",
        "on-surface": "#222C29",
        surface: "#F6F6F6",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "2/3": "2 / 3",
        "4/5": "4 / 5",
      },
    },
  },
  plugins: [],
};
