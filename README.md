# Tailwind CSS в Enjoint

Это руководство описывает, как Tailwind CSS подключён в Enjoint, где находятся стили и как они заменили прежние правила из `Register.css`.

## Быстрый запуск

В терминале перейдите в папку приложения, где лежит этот `README.md`, и выполните:

```powershell
npm install
npm run dev
```

Для production-сборки:

```powershell
npm run build
```

В проекте используется Tailwind CSS 4 и официальный Vite-плагин `@tailwindcss/vite`. Обе зависимости объявлены в `package.json`; после `npm install` плагин не должен требовать установки в родительской папке или глобально.

## Как Tailwind попадает в приложение

Путь подключения выглядит так:

1. `src/main.jsx` импортирует `src/index.css`.
2. `src/index.css` импортирует Tailwind директивой `@import "tailwindcss"`.
3. `vite.config.js` регистрирует плагин `tailwindcss()`.
4. Во время сборки Vite находит используемые в исходниках utility-классы и генерирует для них CSS.
   В этой версии используется CSS-first конфигурация Tailwind 4. Команда `npx tailwindcss init -p` относится к старым инструкциям и для текущей связки не нужна.

## Где находятся стили

- `src/index.css` — подключение Tailwind, дизайн-токены, глобальный reset, анимации карточки и исключение для браузерного автозаполнения.
- `src/pages/Register.jsx` — фон страницы, шапка, индикатор шага, общая карточка, переключение темы.
- `src/components/Step1Account.jsx` — создание аккаунта.
- `src/components/Step2Verification.jsx` — ввод кода подтверждения.
- `src/components/Step3Profile.jsx` — профиль и выбор пола.
- `src/components/Step4PhotoBio.jsx` — фото и биография.
- `src/components/Step5Interests.jsx` — интересы.
- `src/components/Step6Instagram.jsx` — Instagram.
- `src/components/Step7Location.jsx` — геолокация.
- `src/components/Step8Notifications.jsx` — уведомления.

Стили конкретного элемента находятся рядом с JSX, в его `className`. Отдельного `Register.css` больше нет.

## Дизайн-токены

В `src/index.css` блок `@theme` задаёт общие цвета и шрифт. Например:

```css
@theme {
  --font-rubik: "Rubik", sans-serif;
  --color-ink: #262626;
  --color-brand-pink: #ff7fc0;
  --color-dark-surface: #11161d;
}
```

Tailwind создаёт на их основе классы:

- `font-rubik` — шрифт интерфейса.
- `text-ink` и `text-muted` — основной и вторичный текст.
- `bg-brand-pink` и `text-brand-pink` — фирменный розовый.
- `bg-dark-surface` — тёмный фон поля или контролла.
- `bg-dark-card` — фон большой карточки.

Добавляя новый повторно используемый цвет, сначала внесите переменную в `@theme`, затем используйте соответствующий класс. Размеры, которые должны точно совпадать с макетом, заданы точечными значениями, например `w-[674px]` или `h-[57px]`.

## Светлая и тёмная темы

`Register.jsx` хранит выбор темы в React-состоянии `isDark`, сохраняет его в `localStorage` под ключом `theme` и добавляет класс `dark` на корневой контейнер страницы.

В `index.css` этот класс подключён как вариант Tailwind:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Поэтому `dark:` меняет оформление, если класс `dark` присутствует на элементе или его предке:

```jsx
className = "bg-white text-ink dark:bg-dark-surface dark:text-white";
```

Обычные классы задают светлую тему, `dark:` — её тёмный вариант. Для меняющегося состояния используйте условие в JSX:

```jsx
className={isSelected
	? "bg-brand-pink text-white"
	: "bg-white text-ink dark:bg-dark-surface dark:text-white"}
```

Не добавляйте второй набор глобальных селекторов вида `.dark .my-control`. Состояние темы должно оставаться рядом с компонентом в виде `dark:`-классов.

## Из чего состоит страница

### Общая карточка

Родитель в `Register.jsx` задаёт всем шагам одну карточку: её ширину `674px`, высоту `min(640px, 85vh)`, внутренние отступы, фон, скругление, тень и центрирование. Поэтому отдельному шагу не нужно создавать собственную карточку.

Кнопки действий абсолютными классами располагаются у нижнего края карточки: `absolute inset-x-0 bottom-10`. Центральная часть шага размещается внутри свободной области. Например, код подтверждения использует `my-auto`, чтобы держать поля по центру.

Переходы «вперёд» и «назад» используют `@keyframes` в `index.css` и utility-классы `animate-[...]` на карточке. Анимации оставлены в CSS, потому что это небольшие именованные последовательности кадров, а не оформление отдельных элементов.

### Шаги формы

Каждый `StepN*.jsx` отвечает за свою разметку и состояния. Например:

- шаг 1 меняет рамку поля на `border-danger`, когда его значение не прошло проверку;
- шаг 2 создаёт шесть отдельных полей и меняет цвет рамки при ошибочном коде; `dark:focus:bg-dark-surface` не даёт сфокусированному полю стать белым;
- шаг 3 использует условные классы для выбранного варианта пола;
- шаг 4 отображает загруженное изображение и состояние ошибки;
- шаг 5 формирует карточки интересов из массива и переключает классы выбранного элемента;
- шаги 6–8 показывают состояния подключения, доступа и уведомлений.

Динамические классы записываются полными строками в JSX. Не собирайте имя класса по частям, например `bg-${color}-500`: Tailwind анализирует исходный код и должен увидеть целый класс, чтобы добавить его в сборку.

## Как переносились правила из `Register.css`

В обычном CSS селектор задавал свойства для всех совпадающих элементов:

```css
.header-nav-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
```

В Tailwind те же правила перечисляются в `className` нужной кнопки:

```jsx
className = "flex size-11 items-center justify-center rounded-full";
```

Состояния становятся частью класса:

```jsx
className =
  "border bg-white transition-colors hover:border-brand-pink dark:bg-dark-surface";
```

Здесь `hover:` действует при наведении, `dark:` — в тёмной теме. Внутри JSX условия добавляют состояния, которые зависят от React:

```jsx
className={hasError ? "border-danger" : "border-transparent"}
```

При переносе сохранены заданные размеры, цвета, скругления, тени, состояния ошибок и поведение обеих тем. Поэтому встречаются произвольные значения в квадратных скобках: например, `h-[50px]`, `shadow-[...]` или `bg-[image:linear-gradient(...)]`. Они нужны для точного соответствия прежнему дизайну.

## Почему часть CSS осталась

Цель переноса — убрать отдельные правила оформления компонентов. Небольшое количество CSS в `index.css` осталось для задач, которые удобнее задавать глобально:

- `@import` подключает шрифт и Tailwind;
- `@theme` задаёт дизайн-токены;
- `@layer base` содержит общий reset и размеры документа;
- `@keyframes` описывают переходы карточки;
- `@layer utilities` исправляет фон и цвет текста браузерного autofill.

Важно: reset расположен в `@layer base`. Если вынести `* { margin: 0; padding: 0 }` за пределы слоёв Tailwind, он может перекрывать utility-классы отступов, например `pt-9`, `px-8` и `mb-5`.

## Изменение оформления

1. Найдите компонент, который отображает нужный элемент.
2. Измените его `className`, используя утилиты Tailwind.
3. Для светлой и тёмной тем добавьте пары обычного класса и `dark:`.
4. Для ошибок и выбора используйте условные классы из полного списка строк.
5. Если значение нужно нескольким компонентам, добавьте токен в `@theme`.
6. Оставляйте глобальный CSS только для reset, токенов, keyframes и браузерных особенностей.
7. Проверьте результат командами `npm run build` и `npm run lint`.

## Конфигурация Tailwind 4

Активная конфигурация проекта находится в `src/index.css`. Файл `src/tailwind.config.js` содержит настройки старого JavaScript-формата; он не подключён к CSS-first конфигурации Tailwind 4, так как в `index.css` нет директивы `@config`. Для новых цветов, вариантов темы или токенов используйте `@theme` и `@custom-variant` в `index.css`, а не рассчитывайте на значения из старого файла.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
