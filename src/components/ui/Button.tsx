import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-terracotta to-terracotta-dark text-white shadow-md shadow-terracotta/25 hover:shadow-lg hover:shadow-terracotta/30 active:scale-[0.98]",
  secondary:
    "bg-wheat text-ink border border-gold/45 hover:bg-gold-soft/50 active:scale-[0.98]",
  outline:
    "border-2 border-terracotta/80 text-terracotta bg-transparent hover:bg-terracotta/5 active:scale-[0.98]",
  ghost: "text-ink-muted hover:text-ink hover:bg-ink/5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
