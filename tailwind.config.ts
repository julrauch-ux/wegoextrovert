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
        wge: {
          black: "#000000",
          blue: "#2A2AFF",
          purple: "#7B61FF",
          cream: "#F5F0E8",
          white: "#FFFFFF",
        },
      },
      backgroundImage: {
        "wge-gradient": "linear-gradient(135deg, #2A2AFF, #7B61FF)",
        "wge-gradient-radial":
          "radial-gradient(ellipse at center, rgba(42,42,255,0.15) 0%, transparent 70%)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
        "fadeUp-delay-1": "fadeUp 0.6s ease-out 0.15s forwards",
        "fadeUp-delay-2": "fadeUp 0.6s ease-out 0.3s forwards",
        "fadeUp-delay-3": "fadeUp 0.6s ease-out 0.45s forwards",
      },
    },
  },
  plugins: [],
};

export default config;
