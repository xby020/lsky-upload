import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['cupcake', 'night'],
    darkTheme: 'night', // name of one of the included themes for dark mode
    prefix: 'd-',
    logs: false,
  },
};
