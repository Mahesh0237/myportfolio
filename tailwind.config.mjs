/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nayeshdaggula/tailify/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        inter: ["Inter", "Arial", "Helvetica", "sans-serif"],
        roboto: ["Roboto", "sans-serif"], // Corrected quotation
        manrope: ["Manrope", "sans-serif"], // Added Manrope since it’s in your CSS
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar')
  ],
};
