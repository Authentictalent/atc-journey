import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0d1520",
        lime: "#d1da8f",
        teal: "#61a4b0",
        salmon: "#eba687",
        "off-white": "#f5f5f0",
      },
      fontFamily: {
        sans: ["'Nunito Sans'", "sans-serif"],
        serif: ["'Jost'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
