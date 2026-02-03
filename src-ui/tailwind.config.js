/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prism: {
          bg: '#1e1e2e',
          fg: '#cdd6f4',
          accent: '#89b4fa',
          secondary: '#313244',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'], // Suggest using a good mono font
      }
    },
  },
  plugins: [],
}
