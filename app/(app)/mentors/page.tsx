import Link from "next/link";

const upcomingSessions = [
  {
    id: 1,
    mentor: "Javier Silva",
    subject: "Biología celular",
    date: "Hoy",
    time: "6:00 pm",
    live: true,
  },
  {
    id: 2,
    mentor: "Daniela Reyes",
    subject: "Matemáticas — Álgebra",
    date: "Mañana",
    time: "5:00 pm",
    live: false,
  },
  {
    id: 3,
    mentor: "Carlos Mendoza",
    subject: "Química orgánica",
    date: "Jue 15 may",
    time: "7:00 pm",
    live: false,
  },
];

const allMentors = [
  {
    initials: "JS",
    name: "Javier Silva",
    specialty: "Biología y Química",
    university: "Medicina UNAM 2023",
    rating: 4.9,
    gradient: "from-cyan-500 to-violet-600",
    assigned: true,
  },
  {
    initials: "DR",
    name: "Daniela Reyes",
    specialty: "Matemáticas y Física",
    university: "Ingeniería IPN 2022",
    rating: 4.8,
    gradient: "from-violet-600 to-pink-500",
    assigned: false,
  },
  {
    initials: "CM",
    name: "Carlos Mendoza",
    specialty: "Historia y Español",
    university: "Filosofía UNAM 2023",
    rating: 4.7,
    gradient: "from-amber-500 to-pink-500",
    assigned: false,
  },
  {
    initials: "LT",
    name: "Lucía Torres",
    specialty: "Química y Biología",
    university: "Química UNAM 2024",
    rating: 4.9,
    gradient: "from-emerald-500 to-cyan-500",
    assigned: false,
  },
  {
    initials: "AR",
    name: "Andrés Ramírez",
    specialty: "Física y Matemáticas",
    university: "Ingeniería IPN 2021",
    rating: 4.6,
    gradient: "from-pink-600 to-violet-600",
    assigned: false,
  },
  {
    initials: "MG",
    name: "Mariana García",
    specialty: "Español y Literatura",
    university: "Letras UNAM 2022",
    rating: 4.8,
    gradient: "from-cyan-500 to-blue-600",
    assigned: false,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mt-0.5">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z" />
          </svg>
        ))}
      <span className="text-xs text-white/45 ml-1">{rating}</span>
    </div>
  );
}

export default function MentorsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <header>
        <h1
          className="text-3xl font-black gradient-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mentorías
        </h1>
        <p className="text-sm text-white/45 mt-1">
          Aprende con egresados de las mejores universidades del país
        </p>
      </header>

      {/* Assigned mentor */}
      <section>
        <h2
          className="text-lg font-black mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Tu mentor asignado
        </h2>
        <div className="card bg-gradient-to-br from-cyan-900/30 to-violet-900/20 border-cyan-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white shrink-0">
              JS
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                  Javier Silva
                </p>
                <span className="badge badge--violet text-[10px]">Tu mentor</span>
              </div>
              <p className="text-sm text-white/55 mb-1">
                Medicina UNAM 2023 · Especialidad en Biología y Química
              </p>
              <StarRating rating={4.9} />
              <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-xl">
                Egresé de la UNAM con honores. He ayudado a más de 200 estudiantes a ingresar a
                la licenciatura de su elección. Mi método se enfoca en entender los conceptos
                desde la raíz para que ninguna pregunta te tome por sorpresa.
              </p>
            </div>
            <button
              className="btn btn--ghost shrink-0 opacity-60 cursor-not-allowed"
              disabled
              title="Próximamente"
            >
              Enviar mensaje
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming sessions */}
      <section>
        <h2
          className="text-lg font-black mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Próximas sesiones
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="card space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40">
                  {session.date} · {session.time}
                </p>
                {session.live ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    En vivo
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-white/40 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 uppercase tracking-wider">
                    Próximamente
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{session.mentor}</p>
                <p className="text-xs text-white/50">{session.subject}</p>
              </div>
              <button
                className={`btn text-xs w-full text-center ${
                  session.live ? "btn--primary" : "btn--ghost opacity-50 cursor-not-allowed"
                }`}
                disabled={!session.live}
              >
                {session.live ? "Unirse ahora" : "Agendar recordatorio"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* All mentors */}
      <section>
        <h2
          className="text-lg font-black mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Todos los mentores disponibles
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMentors.map((mentor) => (
            <div key={mentor.name} className="card flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${mentor.gradient} flex items-center justify-center text-base font-black text-white shrink-0`}
                >
                  {mentor.initials}
                </div>
                <div>
                  <p className="font-bold text-sm">{mentor.name}</p>
                  <p className="text-xs text-white/45">{mentor.university}</p>
                  <StarRating rating={mentor.rating} />
                </div>
              </div>
              <p className="text-xs text-white/55 bg-white/4 rounded-lg px-3 py-2">
                {mentor.specialty}
              </p>
              <button
                className="btn btn--ghost text-sm opacity-50 cursor-not-allowed"
                disabled
                title="Próximamente"
              >
                {mentor.assigned ? "Ver perfil" : "Agendar"}
                {!mentor.assigned && (
                  <span className="ml-1.5 text-[9px] bg-white/10 rounded px-1.5 py-0.5">
                    Próximamente
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
