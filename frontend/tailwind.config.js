/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        ocean: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 16px 48px rgba(31, 38, 135, 0.2)',
        soft: '0 6px 24px rgba(2, 6, 23, 0.08)',
        'soft-lg': '0 14px 44px rgba(2, 6, 23, 0.12)',
        glow: '0 0 0 1px rgba(99,102,241,0.15), 0 10px 40px rgba(99,102,241,0.35)',
        'glow-accent': '0 0 0 1px rgba(244,63,94,0.15), 0 10px 40px rgba(244,63,94,0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.75, transform: 'scale(1.04)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pop-in': {
          '0%': { opacity: 0, transform: 'scale(0.92)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
