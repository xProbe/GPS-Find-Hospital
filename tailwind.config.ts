import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,ts}', 
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [],
} satisfies Config;
