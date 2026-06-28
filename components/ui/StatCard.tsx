import type { ReactNode } from "react";

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  accentColor,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{title}</span>
        {icon && <span style={{ color: accentColor }}>{icon}</span>}
      </div>
      <p className="text-3xl font-black" style={{ color: accentColor ?? "#A78BFA" }}>{value}</p>
      {subtitle && <p className="text-xs text-white/35">{subtitle}</p>}
      {trend && (
        <p className="text-xs text-emerald-400">
          +{trend.value}% {trend.label}
        </p>
      )}
    </div>
  );
}
