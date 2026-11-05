/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14161A",
        paper: "#FFFFFF",
        soft: "#F6F7F9",
        accent: "#D9472A",
        "accent-strong": "#C2452A",
        secondary: "#3A3E45",
        muted: "#5B5F66",
        line: "#E3E5E8",
        tag: "#FDE6DE",
        chip: "#F1F3F5",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        card: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 22, 26, 0.04), 0 18px 50px -28px rgba(20, 22, 26, 0.18)",
        lift: "0 24px 60px -28px rgba(20, 22, 26, 0.28)",
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};
