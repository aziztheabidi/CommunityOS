import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
>;

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-[linear-gradient(135deg,#0d9488,#06b6d4)] text-white shadow-md shadow-teal-500/25"
      : variant === "secondary"
        ? "bg-white/90 text-[var(--cos-ink)] ring-1 ring-[var(--cos-border)]"
        : "bg-transparent text-[var(--cos-ink)]";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-95 disabled:opacity-50",
        variantClass,
        className,
      )}
      type={props.type ?? "button"}
      {...props}
    >
      {children}
    </button>
  );
}

const toneStyles = {
  teal: "from-teal-500/20 via-cyan-400/10 to-transparent text-teal-800",
  coral: "from-orange-500/20 via-amber-400/10 to-transparent text-orange-800",
  emerald: "from-emerald-500/20 via-teal-400/10 to-transparent text-emerald-800",
  sky: "from-sky-500/20 via-cyan-400/10 to-transparent text-sky-800",
} as const;

export function StatCard({
  label,
  value,
  hint,
  tone = "teal",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <div
      className={cn(
        "cos-card relative overflow-hidden bg-gradient-to-br p-5",
        toneStyles[tone],
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
      <p className="relative text-sm font-medium text-[color-mix(in_oklab,var(--cos-ink)_62%,transparent)]">
        {label}
      </p>
      <p className="relative mt-2 font-[family-name:var(--cos-font-display)] text-3xl text-[var(--cos-ink)] md:text-4xl">
        {value}
      </p>
      {hint ? (
        <p className="relative mt-2 text-xs font-semibold text-[var(--cos-teal-deep)]">{hint}</p>
      ) : null}
    </div>
  );
}
