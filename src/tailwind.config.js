/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Переключение тёмной темы по классу 'dark' на родительском контейнере
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        // Базовые цвета
        'brand-pink': 'rgba(255, 127, 192, 1)',
        'brand-orange': 'rgba(255, 129, 62, 1)',
        'brand-dark-text': 'rgba(38, 38, 38, 1)',
        'brand-muted-text': 'rgba(119, 119, 119, 1)',
        'brand-border': 'rgba(232, 230, 234, 1)',
        'brand-error': 'rgba(214, 40, 40, 1)',
        'brand-success': 'rgba(50, 129, 70, 1)',
        'brand-blue': 'rgba(82, 195, 255, 1)',
        
        // Цвета тёмной темы
        'dark-bg-page': 'rgba(5, 7, 10, 1)',
        'dark-bg-card': 'rgba(11, 15, 20, 1)',
        'dark-bg-input': 'rgba(17, 22, 29, 1)',
        'dark-border': 'rgba(255, 255, 255, 0.0784)',
        'dark-border-card': 'rgba(255, 255, 255, 0.0706)',
      },
      backgroundImage: {
        // Градиенты страницы (Светлая и Тёмная темы)
        'page-light-gradient': 'radial-gradient(circle at 100% 0%, rgba(255, 129, 62, 0.35) 0%, rgba(255, 255, 255, 0) 55%), radial-gradient(circle at 0% 100%, rgba(255, 127, 192, 0.4) 0%, rgba(255, 255, 255, 0) 55%), #ffffff',
        'page-dark-gradient': 'linear-gradient(225deg, rgba(255, 127, 192, 0.5) 0%, rgba(5, 7, 10, 0) 50%), linear-gradient(45deg, rgba(255, 129, 62, 0.75) 0%, rgba(5, 7, 10, 0) 60%), rgba(5, 7, 10, 1)',
        
        // Градиенты кнопок и карточек
        'btn-gradient': 'linear-gradient(90deg, rgba(255, 127, 192, 1) 0%, rgba(255, 129, 62, 1) 100%)',
        'accent-gradient': 'linear-gradient(135deg, rgba(255, 127, 192, 1) 0%, rgba(255, 129, 62, 1) 100%)',
      },
      boxShadow: {
        'card-light': '0px 10px 30px rgba(0, 0, 0, 0.05)',
        'card-dark': '0px 20px 40px rgba(0, 0, 0, 0.5)',
        'input-light': '0px 8px 20px rgba(0, 0, 0, 0.06)',
        'btn-nav': '0px 4px 12px rgba(0, 0, 0, 0.05)',
        'selected-pink': '0px 4px 15px rgba(255, 127, 192, 0.35)',
      },
      keyframes: {
        cardSlideNext: {
          '0%': { opacity: '0', transform: 'translateX(60px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        cardSlidePrev: {
          '0%': { opacity: '0', transform: 'translateX(-60px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
      },
      animation: {
        'slide-next': 'cardSlideNext 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-prev': 'cardSlidePrev 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};