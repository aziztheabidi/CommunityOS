/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--cos-ink)",
        teal: "var(--cos-teal)",
        sand: "var(--cos-sand)",
        accent: "var(--cos-accent)",
      },
      fontFamily: {
        sans: ["var(--font-sora)", "Segoe UI", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
