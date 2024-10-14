/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,scss}",
    ],
    theme: {
      extend: {
        colors: {
          'hsl': {
            50: '#e6f5ff',
            100: '#ccebff',
            200: '#99d8ff',
            300: '#66c4ff',
            400: '#33b1ff',
            500: '#009dff',
            600: '#007ecc',
            608: '#007ac8',
            700: '#005e99',
            800: '#003f66',
            900: '#001f33',
            950: '#00101a',
          },
        },
      },
    },
    plugins: [],
  }