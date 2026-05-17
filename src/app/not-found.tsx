import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-display text-8xl font-semibold text-terracotta/90">
        404
      </p>
      <p className="mt-4 text-lg text-ink-muted">Страница не найдена</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-2xl bg-gradient-to-b from-terracotta to-terracotta-dark px-6 py-3 text-sm font-semibold text-white shadow-md shadow-terracotta/25 transition-all hover:shadow-lg"
      >
        На главную
      </Link>
    </PageContainer>
  );
}
