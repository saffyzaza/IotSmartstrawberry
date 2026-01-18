/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // 1. ตั้งค่า Font ตรงนี้เลย
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'], // ต้องใส่ quote ถ้าชื่อมีเครื่องหมาย
      },
      // 2. สร้าง Background Pattern ขึ้นมาใช้งานได้เลย
      backgroundImage: {
        'dot-pattern': "radial-gradient(#e0e0e5 1px, transparent 1px)",
      },
      backgroundSize: {
        '20': '20px',
      }
    },
  },
  plugins: [],
}