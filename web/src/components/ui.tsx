import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "dark" | "outline";
}) {
  const styles = {
    primary:
      "bg-[var(--accent)] text-[var(--paper)] hover:opacity-90",
    dark: "bg-ink text-paper hover:opacity-90",
    ghost: "bg-transparent hover:bg-black/5",
    outline: "hairline bg-transparent hover:bg-white/40",
  }[variant];
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${styles} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-[0.16em] text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl hairline bg-white/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
