// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-light": "#00adf5",
        "blue-mid": "#0085e9",
        "bg-dark": "#000a17",
        "off-white": "#f1efe4",
      },
    },
  },
  plugins: [],
};
