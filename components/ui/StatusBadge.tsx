const STYLES: Record<string, string> = {
  active:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  inactive:  "bg-white/8 text-white/40 border-white/10",
  pending:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
  pro:       "bg-violet-500/15 text-violet-400 border-violet-500/25",
  free:      "bg-white/8 text-white/50 border-white/10",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/25",
  suspended: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  draft:     "bg-white/8 text-white/40 border-white/10",
  published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

export function StatusBadge({ status, variant }: { status?: string; variant?: string }) {
  const key = status ?? variant ?? "";
  const cls = STYLES[key] ?? "bg-white/8 text-white/40 border-white/10";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${cls}`}>
      {key}
    </span>
  );
}
