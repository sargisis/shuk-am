# Shuk.am

Первый армянский маркетплейс — сайт на **Next.js** (v1, без полного backend).

## Страницы

- `/` — главная (баннер, категории, популярные товары)
- `/catalog` — каталог с фильтрами
- `/product/[id]` — карточка товара
- `/sell` — для продавцов

Языки: **հայերեն** / **русский** (переключатель в шапке).

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Деплой

Подходит [Vercel](https://vercel.com) — импорт репозитория, build: `npm run build`.

## Переменные окружения

```env
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_channel
```

## Дальше (v2)

- API + PostgreSQL
- Корзина, оплата (Arca / IDram)
- Кабинет продавца
- React Native приложение на том же API

## Товары

Демо-товары в `src/data/products.ts` — замените на реальных продавцов.
