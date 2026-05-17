import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-terracotta">404</p>
      <p className="mt-4 text-ink-muted">Страница не найдена</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-dark"
      >
        На главную
      </Link>
    </div>
  );
}
