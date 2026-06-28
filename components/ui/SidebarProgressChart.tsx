interface Props {
  current: number;
  target:  number;
  label:   string;
  chartStart?: string;
  chartEnd?:   string;
}

export default function SidebarProgressChart({
  current,
  target,
  label,
  chartStart = "#A78BFA",
  chartEnd   = "#F43F5E",
}: Props) {
  const pct    = Math.min(100, Math.round((current / target) * 100));
  const radius = 28;
  const circ   = 2 * Math.PI * radius;
  const dash   = (pct / 100) * circ;

  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke="url(#sidebar-prog-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <defs>
          <linearGradient id="sidebar-prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={chartStart} />
            <stop offset="100%" stopColor={chartEnd} />
          </linearGradient>
        </defs>
      </svg>
      <div className="min-w-0">
        <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Meta {label}</p>
        <p
          className="text-xl font-black"
          style={{
            fontFamily: "var(--font-display)",
            background: `linear-gradient(to right, ${chartStart}, ${chartEnd})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {pct}%
        </p>
        <p className="text-[11px] text-white/45">
          {current} / {target} aciertos
        </p>
      </div>
    </div>
  );
}
