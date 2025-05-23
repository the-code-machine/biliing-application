// tailwind.config.js
module.exports = {
    darkMode:['class'],
    content: [
      './frontend/components/**/*.{js,ts,jsx,tsx}',
      './frontend/pages/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
          borderRadius: {
            lg: `var(--radius)`,
            md: `calc(var(--radius) - 2px)`,
            sm: "calc(var(--radius) - 4px)",
          },
        },
      },
      plugins: [require("tailwindcss-animate")],
  }
  