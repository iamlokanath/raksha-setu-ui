/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--rs-brand)",
        sky: "var(--rs-sky)",
        sun: "var(--rs-sun)",
        amber: "var(--rs-amber)",
        alert: "var(--rs-alert)",
        stable: "var(--rs-stable)",
        canvas: "var(--rs-canvas)",
        surface: "var(--rs-surface)",
        muted: "var(--rs-surface-muted)",
        ink: "var(--rs-text)",
        "ink-muted": "var(--rs-text-muted)",
        line: "var(--rs-border)",
      },
      fontFamily: { sans: ["var(--font-sans)", "var(--font-deva)", "var(--font-oriya)", "sans-serif"] },
      boxShadow: { card: "0 10px 30px rgba(27, 82, 164, 0.06)" },
      minHeight: { control: "var(--rs-control)" },
    },
  },
  plugins: [],
};
