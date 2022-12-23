/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {},
  plugins: [],
  purge: {
    options: {
      safelist: [
        //text sizes
        "text-xs",
        "text-sm",
        "text-base",
        "text-lg",
        "text-xl",
        "text-2xl",
        "text-3xl",
        "text-4xl",
        "text-5xl",
        "text-6xl",
        "text-7xl",
        "text-8xl",
        "text-9xl",
      ],
    },
  },
};
