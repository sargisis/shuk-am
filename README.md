# Shuk.am

Первый армянский маркетплейс — сайт на **Next.js** (v1, без полного backend).

## Страницы

- `/` — главная
- `/catalog` — каталог с фильтрами (без поиска)
- `/product/[id]` — товар
- `/seller/[slug]` — магазин продавца
- `/cart` — корзина
- `/login`, `/register` — вход (покупатель / продавец)
- `/account` — кабинет покупателя, заказы
- `/seller/dashboard` — кабинет продавца (товары, заказы, статистика)
- `/sell` — заявка продавца
- `/about`, `/delivery`, `/how-to-order` — инфо
- `/checkout/success` | `/cancel` — после оплаты

**Два режима данных:**

- Без Supabase — демо в **localStorage** (как раньше).
- С Supabase — PostgreSQL + Auth (регистрация, заказы, каталог из БД).

Платёжные провайдеры (ArCa / IDram) — позже; при включённом Supabase в корзине только **Telegram**.

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

Скопируйте `.env.example` → `.env.local`.

См. `.env.example` → скопируйте в `.env.local`.

### Supabase (рекомендуется для v2)

1. Создайте проект на [supabase.com](https://supabase.com).
2. **SQL Editor** → выполните `supabase/migrations/001_initial.sql`, затем `supabase/seed.sql` (демо-продавцы и товары).
3. **Settings → API** → скопируйте URL и `anon` key в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

4. **Authentication → Providers** → включите Email (в dev можно отключить подтверждение email).
5. Создайте таблицы — один из способов:
   - **Авто:** добавьте в `.env.local` пароль БД `SUPABASE_DB_PASSWORD=...` (Project Settings → Database) и выполните `npm run db:setup`
   - **Вручную:** SQL Editor → вставьте содержимое `supabase/schema.sql` → Run
6. Проверка: `curl http://localhost:3000/api/health` → `"schemaReady": true`
7. Перезапустите `npm run dev`

Пока таблицы не созданы, сайт автоматически работает в режиме localStorage (демо).

### Stripe test

1. Регистрация: [dashboard.stripe.com/register](https://dashboard.stripe.com/register) (нужна поддерживаемая страна для аккаунта).
2. **Developers → API keys** → скопировать test keys в `.env.local`.
3. Перезапустить `npm run dev`.
4. В корзине появится **«Оплатить картой (Stripe test)»**.
5. Тестовая карта: `4242 4242 4242 4242`, любая дата в будущем, CVC любой.

Без ключей Stripe работает только **Telegram** — это нормально.

Позже провайдер меняется в `src/lib/payments/` (добавить ArCa / IDram), UI корзины остаётся.

## Дальше

- Оплата ArCa / IDram (вместо или вместе со Stripe)
- React Native приложение на том же API

## Товары

Демо-товары в `src/data/products.ts` — замените на реальных продавцов.
