import type { Config } from 'tailwindcss';

const preset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#F4F4F0',
        'brand-red': '#DA251D',
        'brand-yellow': '#FFC62F',
        'brand-pink': '#FF90E8',
        'brand-mint': '#86EFAC',
        'brand-lavender': '#C084FC',
        'brand-cyan': '#00E5FF',
        'brand-blue': '#93C5FD',
        'text-main': '#1A1A1A',
        'text-muted': '#666666',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px rgba(26, 26, 26, 1)',
        'brutal': '4px 4px 0px 0px rgba(26, 26, 26, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(26, 26, 26, 1)',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default preset;
