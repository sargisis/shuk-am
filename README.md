# Shuk.am

Первый армянский маркетплейс — сайт на **Next.js** (v1, без полного backend).

## Страницы

- `/` — главная (баннер, категории, популярные товары)
- `/catalog` — каталог с фильтрами
- `/product/[id]` — карточка товара
- `/cart` — корзина, оплата
- `/sell` — для продавцов
- `/checkout/success` | `/checkout/cancel` — после Stripe

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

```env
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_channel
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe TEST (опционально)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_CURRENCY=usd
STRIPE_AMD_PER_USD=400
```

### Stripe test

1. Регистрация: [dashboard.stripe.com/register](https://dashboard.stripe.com/register) (нужна поддерживаемая страна для аккаунта).
2. **Developers → API keys** → скопировать test keys в `.env.local`.
3. Перезапустить `npm run dev`.
4. В корзине появится **«Оплатить картой (Stripe test)»**.
5. Тестовая карта: `4242 4242 4242 4242`, любая дата в будущем, CVC любой.

Без ключей Stripe работает только **Telegram** — это нормально.

Позже провайдер меняется в `src/lib/payments/` (добавить ArCa / IDram), UI корзины остаётся.

## Дальше (v2)

- API + PostgreSQL
- Оплата ArCa / IDram (вместо или вместе со Stripe)
- Кабинет продавца
- React Native приложение на том же API

## Товары

Демо-товары в `src/data/products.ts` — замените на реальных продавцов.
