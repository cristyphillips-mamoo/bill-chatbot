import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pmb: {
          navy: "#1B3A6B",
          navydark: "#122A52",
          teal: "#2A9D8F",
          tealdark: "#1F7A6F",
          teallight: "#E8F7F5",
          blue: "#264E8A",
          bluelight: "#EBF2FB",
          gray: "#F7F8FA",
          border: "#DDE3EC",
        },
      },
      animation: {
        "typing-bounce": "typing-bounce 1.2s infinite ease-in-out",
      },
      keyframes: {
        "typing-bounce": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "40%": { transform: "translateY(-6px)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
