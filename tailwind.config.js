/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('https://firebasestorage.googleapis.com/v0/b/to-do-app-8e78e.appspot.com/o/money.png?alt=media&token=61f92260-0a4c-4ef7-ab71-dcdeca23b49e')"
      },
      backgroundColor: {
        mainColor: '#FBF8F9',
        secondaryColor: '#F0F0F0',
        blackOverlay: 'rgba(0, 0 ,0 ,0.7)',
      },
      
      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
        'slide-fwd': ' slide-fwd 0.45s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};