import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        {eyebrow ? <p className="ui-eyebrow">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h1 className="ui-page-title">{title}</h1>
          {description ? <p className="ui-page-copy">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("ui-card", className)}>{children}</section>;
}

export function SectionTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[var(--outline-variant)] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold text-[var(--on-background)]">{title}</h2>
        {description ? <p className="text-sm text-[var(--on-surface-variant)]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <SurfaceCard className="relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(42,96,137,0.14),transparent_68%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--on-surface-variant)]">{label}</p>
          <p className="font-heading text-3xl font-semibold text-[var(--on-background)]">{value}</p>
          {hint ? <p className="text-xs text-[var(--on-surface-variant)]">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] text-[var(--primary)]">
            {icon}
          </div>
        ) : null}
      </div>
    </SurfaceCard>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-[color:rgba(42,96,137,0.12)] text-[var(--primary)]"
      : tone === "success"
        ? "bg-[color:rgba(26,161,107,0.12)] text-[color:#1a7a54]"
        : tone === "warning"
          ? "bg-[color:rgba(217,142,26,0.12)] text-[color:#9f6200]"
          : tone === "danger"
            ? "bg-[color:rgba(186,26,26,0.12)] text-[var(--error)]"
            : "bg-[var(--surface-container-low)] text-[var(--on-surface-variant)]";

  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", toneClass)}>
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <SurfaceCard className="flex min-h-56 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-container-low)] text-xl text-[var(--primary)]">
        ✦
      </div>
      <div className="space-y-2">
        <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{title}</h3>
        <p className="mx-auto max-w-xl text-sm text-[var(--on-surface-variant)]">{description}</p>
      </div>
      {action}
    </SurfaceCard>
  );
}

export function FilterInput({
  defaultValue,
  name = "q",
  placeholder,
}: {
  defaultValue?: string;
  name?: string;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="ui-input min-w-0 flex-1"
    />
  );
}

export function SelectField({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <select name={name} defaultValue={defaultValue} className="ui-input min-w-[160px]">
      {children}
    </select>
  );
}

export function PrimaryButton({
  children,
  className,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button type={type} className={cn("ui-button ui-button-primary", className)}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button type={type} className={cn("ui-button ui-button-secondary", className)}>
      {children}
    </button>
  );
}
