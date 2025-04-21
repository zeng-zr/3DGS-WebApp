/** @type {import('@tailwindcss/postcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#206cc9',
        secondary: '#94a3b8',
        disabled: '#cbd5e1',
        text: {
          primary: '#1e293b',
          secondary: '#334155',
        },
      },
    },
  },
  plugins: [],
} 