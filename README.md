
# Maria Popilian Website + CMS

Лендінг тепер працює разом із локальним CMS для фото і текстів:

- публічний сайт на Vite + React;
- локальний сервер на Node;
- SQLite-база для фото-слотів;
- SQLite-документ для всього текстового контенту;
- адмін-панель на `/admin`;
- завантаження нових фото в `storage/uploads/`.

## Швидкий старт

1. `npm i`
2. створіть `.env` або `.env.local`
3. `npm run dev`
4. відкрийте сайт на Vite URL
5. відкрийте `/admin` для керування фото і текстами

Якщо ви змінювали `.env.local` або серверний код, обов'язково повністю перезапустіть `npm run dev`.

## Змінні середовища

Приклад:

```env
ADMIN_PASSWORD=your-strong-password
PORT=3001
HOST=127.0.0.1
```

Якщо `ADMIN_PASSWORD` не заданий, сервер тимчасово використовує `change-me-please`.

## Команди

- `npm run dev` — запускає фронтенд і CMS-сервер разом
- `npm run dev:client` — тільки Vite
- `npm run dev:server` — тільки CMS-сервер
- `npm run build` — production build фронтенду
- `npm run start` — запускає CMS-сервер і роздає `dist`

## Де зберігаються дані

- база даних: `storage/cms.sqlite`
- завантажені фото: `storage/uploads/`
- структура слотів фото: `src/content/photoManifest.json`

## Як працює CMS

- публічний сайт читає дані з `/api/public/site-content`
- адмінка дозволяє:
  - змінити тексти майже в усіх секціях
  - додавати і видаляти елементи в `portfolio`, `reels`, `press`, `journal`
  - змінити URL фото
  - оновити alt-текст
  - завантажити файл прямо з комп'ютера
- fixed фото розкладені по сторінках: `Головна`, `Про Марію`
  
# mariapopilian
