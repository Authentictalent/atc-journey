import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#002446",
        lime: "#d1da8f",
        teal: "#61a4b0",
        salmon: "#eba687",
        "off-white": "#f6f6f2",
        background: "var(--background)",
        foreground: "var(--foreground)",
        "card-bg": "var(--card-bg)",
        "border-color": "var(--border-color)",
        "text-secondary": "var(--text-secondary)",
      },
      fontFamily: {
        sans: ["'Nunito Sans'", "sans-serif"],
        serif: ["'Jost'", "sans-serif"],
      },
      borderRadius: {
        xl: "10px",
        "2xl": "14px",
      },
    },
  },
  plugins: [],
};

export default config;
