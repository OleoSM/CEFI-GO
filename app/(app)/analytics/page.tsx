"use client";

// Mock data
const KPI_DATA = {
  lastSimulacro: { score: 71, date: "14 Jun 2026", prevScore: 64, label: "Ultimo simulacro" },
  courseProgress: { percent: 38, label: "Avance del curso" },
  streak: { days: 7, longest: 14, label: "Racha de estudio" },
  planCompliance: { percent: 82, label: "Cumplimiento del plan" },
  avgScore: { score: 73, label: "Promedio general" },
  totalHours: { hours: 42, thisWeek: 8.5, label: "Tiempo estudiado" },
};

const SUBJECT_DATA = [
  { name: "Matemáticas", score: 65, target: 80, color: "#3B82F6" },
  { name: "Español", score: 78, target: 85, color: "#10B981" },
  { name: "Biología", score: 82, target: 85, color: "#8B5CF6" },
  { name: "Historia", score: 70, target: 80, color: "#F59E0B" },
  { name: "Química", score: 58, target: 75, color: "#EC4899" },
  { name: "Física", score: 74, target: 80, color: "#06B6D4" },
];

const HISTORY_SCORES = [64, 68, 71, 66, 73, 71, 75, 78];
const HISTORY_LABELS = ["12 May", "19 May", "26 May", "02 Jun", "07 Jun", "14 Jun", "21 Jun", "28 Jun"];

const WEEKLY_MINUTES = {
  current: [90, 120, 0, 150, 180, 90, 60],
  prev: [60, 90, 90, 120, 90, 120, 30],
  labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
};

// Heatmap: last 4 weeks (28 days), values: 0=none, 1=miss, 2=partial, 3=full
const HEATMAP: number[][] = [
  [3, 2, 0, 3, 3, 1, 0],
  [3, 3, 2, 3, 2, 3, 0],
  [2, 3, 0, 1, 3, 3, 1],
  [3, 2, 3, 3, 0, 2, 0],
];

function KpiCard({ label, main, sub, up, ring, ringColor }: {
  label: string; main: React.ReactNode; sub?: string;
  up?: boolean; ring?: number; ringColor?: string;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</p>
      {ring !== undefined ? (
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke={ringColor || "#7C3AED"} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - ring / 100)}`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{ring}%</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{main}</div>
            {sub && <div className="text-xs text-white/40 mt-0.5">{sub}</div>}
          </div>
        </div>
      ) : (
        <>
          <div className="text-3xl font-black text-white">{main}</div>
          {sub && (
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${up === true ? "text-emerald-400" : up === false ? "text-red-400" : "text-white/40"}`}>
              {up !== undefined && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  {up ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                </svg>
              )}
              {sub}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SubjectBars() {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-base font-black text-white">Progreso por materia</h2>
      <div className="space-y-3.5">
        {SUBJECT_DATA.map(s => (
          <div key={s.name}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/65 font-medium">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-white">{s.score}%</span>
                <span className="text-white/30">/ {s.target}%</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
              <div className="absolute top-0 h-full w-0.5 bg-white/30" style={{ left: `${s.target}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-1 text-xs text-white/35">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-white/30" />
          <span>Meta</span>
        </div>
      </div>
    </div>
  );
}

function HistoryChart() {
  const W = 560, H = 140;
  const PAD = { t: 10, r: 20, b: 30, l: 35 };
  const w = W - PAD.l - PAD.r;
  const h = H - PAD.t - PAD.b;
  const minV = 50, maxV = 90;

  function x(i: number) { return PAD.l + (i / (HISTORY_SCORES.length - 1)) * w; }
  function y(v: number) { return PAD.t + (1 - (v - minV) / (maxV - minV)) * h; }

  const points = HISTORY_SCORES.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `M ${x(0)},${y(HISTORY_SCORES[0])} ` +
    HISTORY_SCORES.map((v, i) => `L ${x(i)},${y(v)}`).join(" ") +
    ` L ${x(HISTORY_SCORES.length - 1)},${PAD.t + h} L ${x(0)},${PAD.t + h} Z`;

  return (
    <div className="card p-6">
      <h2 className="text-base font-black text-white mb-4">Historial de simulacros</h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[60, 70, 80].map(v => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">{v}%</text>
          </g>
        ))}
        <path d={area} fill="url(#hg)" />
        <polyline points={points} fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {HISTORY_SCORES.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="4" fill="#0E0A18" stroke="#A78BFA" strokeWidth="2.5" />
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">{HISTORY_LABELS[i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function WeeklyActivity() {
  const maxMin = Math.max(...WEEKLY_MINUTES.current, ...WEEKLY_MINUTES.prev);
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-white">Actividad semanal</h2>
        <div className="flex items-center gap-4 text-xs text-white/35">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-violet-500/70" /><span>Esta semana</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white/10" /><span>Semana anterior</span></div>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2 h-28">
        {WEEKLY_MINUTES.labels.map((day, i) => {
          const curr = WEEKLY_MINUTES.current[i];
          const prev = WEEKLY_MINUTES.prev[i];
          const currH = (curr / maxMin) * 96;
          const prevH = (prev / maxMin) * 96;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div className="relative w-full flex items-end justify-center gap-0.5" style={{ height: "96px" }}>
                <div className="w-2.5 rounded-t bg-white/10" style={{ height: `${prevH}px` }} />
                <div className="w-2.5 rounded-t bg-violet-500/70" style={{ height: `${currH}px` }} />
              </div>
              <span className="text-[10px] text-white/30">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HEATMAP_COLORS = ["transparent", "#7F1D1D", "#D97706", "#10B981"];
const HEATMAP_LABELS = ["S. anterior", "S. anterior", "Sem. pasada", "Esta semana"];
const DAYS_LABEL = ["L", "M", "X", "J", "V", "S", "D"];

function ComplianceHeatmap() {
  return (
    <div className="card p-6">
      <h2 className="text-base font-black text-white mb-4">Cumplimiento del plan — últimas 4 semanas</h2>
      <div className="space-y-2">
        {HEATMAP.map((week, wi) => (
          <div key={wi} className="flex items-center gap-2">
            <span className="text-[10px] text-white/25 w-20 shrink-0">{HEATMAP_LABELS[wi]}</span>
            <div className="flex gap-1.5">
              {week.map((val, di) => (
                <div key={di} title={DAYS_LABEL[di]}
                  className="w-7 h-7 rounded-md border border-white/5 flex items-center justify-center text-[9px] font-bold text-white/40"
                  style={{ background: val === 0 ? "rgba(255,255,255,0.04)" : HEATMAP_COLORS[val] + (val > 0 ? "33" : "") }}>
                  <div className="w-3 h-3 rounded-sm" style={{ background: val === 0 ? "rgba(255,255,255,0.06)" : HEATMAP_COLORS[val] }} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
          <span className="text-[10px] text-white/25 w-20" />
          <div className="flex gap-1.5">
            {DAYS_LABEL.map(d => <span key={d} className="w-7 text-center text-[10px] text-white/25">{d}</span>)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-white/35">
        {[["No cumplido", "#7F1D1D"], ["Parcial", "#D97706"], ["Cumplido", "#10B981"]].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: c }} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-display, sans-serif)" }}>
          Mi desempeño
        </h1>
        <p className="text-sm text-white/45 mt-1">Seguimiento detallado de tu preparación</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <KpiCard
          label={KPI_DATA.lastSimulacro.label}
          main={<span>{KPI_DATA.lastSimulacro.score}<span className="text-lg font-semibold text-white/40">%</span></span>}
          sub={`+${KPI_DATA.lastSimulacro.score - KPI_DATA.lastSimulacro.prevScore}% vs anterior`}
          up={true}
        />
        <KpiCard
          label={KPI_DATA.courseProgress.label}
          main={`${KPI_DATA.courseProgress.percent}%`}
          ring={KPI_DATA.courseProgress.percent}
          ringColor="#7C3AED"
        />
        <KpiCard
          label={KPI_DATA.streak.label}
          main={<span>{KPI_DATA.streak.days} <span className="text-lg font-semibold text-white/40">días</span></span>}
          sub={`Mejor racha: ${KPI_DATA.streak.longest} días`}
        />
        <KpiCard
          label={KPI_DATA.planCompliance.label}
          main={`${KPI_DATA.planCompliance.percent}%`}
          ring={KPI_DATA.planCompliance.percent}
          ringColor="#10B981"
        />
        <KpiCard
          label={KPI_DATA.avgScore.label}
          main={<span>{KPI_DATA.avgScore.score}<span className="text-lg font-semibold text-white/40">%</span></span>}
          sub="En todos los exámenes"
        />
        <KpiCard
          label={KPI_DATA.totalHours.label}
          main={<span>{KPI_DATA.totalHours.hours}<span className="text-lg font-semibold text-white/40">h</span></span>}
          sub={`Esta semana: ${KPI_DATA.totalHours.thisWeek}h`}
        />
      </div>

      {/* Charts */}
      <SubjectBars />
      <HistoryChart />
      <div className="grid lg:grid-cols-2 gap-4">
        <WeeklyActivity />
        <ComplianceHeatmap />
      </div>
    </div>
  );
}
