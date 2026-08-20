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
      ? "bg-[var(--cos-teal)] text-white"
      : variant === "secondary"
        ? "bg-[var(--cos-teal-soft)] text-[var(--cos-ink)]"
        : "bg-transparent text-[var(--cos-ink)]";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50",
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

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="cos-card p-5">
      <p className="text-sm text-[color-mix(in_oklab,var(--cos-ink)_65%,transparent)]">{label}</p>
      <p className="mt-2 font-[family-name:var(--cos-font-display)] text-3xl text-[var(--cos-ink)]">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-[var(--cos-teal)]">{hint}</p> : null}
    </div>
  );
}
