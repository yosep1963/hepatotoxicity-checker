/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 간독성 등급 색상
        hepato: {
          A: '#DC2626', // red-600 - Well-known hepatotoxin
          B: '#EA580C', // orange-600 - Highly likely
          C: '#CA8A04', // yellow-600 - Probable
          D: '#65A30D', // lime-600 - Possible
          E: '#16A34A', // green-600 - Unlikely
        },
        // 경고 레벨 색상
        alert: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#CA8A04',
          low: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
