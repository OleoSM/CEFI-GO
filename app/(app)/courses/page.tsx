import Link from "next/link";
import Image from "next/image";

type Course = {
  slug: string;
  title: string;
  tag: string;
  duration: string;
  enrolled: string;
  image: string;
  accent: string;
  progress: number;
  module: string;
  lesson: string;
  lessonNum: number;
  lessonTotal: number;
  remainingMin: number;
  owned: boolean;
};

const COURSES: Course[] = [
  {
    slug: "unam",
    title: "Examen UNAM",
    tag: "Licenciatura",
    duration: "6 meses",
    enrolled: "32,400",
    image: "/courses/unam.jpg",
    accent: "#FABD00",
    progress: 78,
    module: "Módulo 4",
    lesson: "Biología celular y genética",
    lessonNum: 4,
    lessonTotal: 12,
    remainingMin: 35,
    owned: true,
  },
  {
    slug: "ipn",
    title: "Examen IPN",
    tag: "Física-Matemáticas",
    duration: "5 meses",
    enrolled: "21,200",
    image: "/courses/ipn.jpg",
    accent: "#EF5350",
    progress: 0,
    module: "Módulo 1",
    lesson: "Introducción al IPN",
    lessonNum: 1,
    lessonTotal: 14,
    remainingMin: 45,
    owned: false,
  },
  {
    slug: "ceneval",
    title: "EXANI-II (CENEVAL)",
    tag: "Licenciatura",
    duration: "4 meses",
    enrolled: "12,300",
    image: "/courses/ceneval.png",
    accent: "#81D4FA",
    progress: 42,
    module: "Módulo 2",
    lesson: "Pensamiento matemático",
    lessonNum: 2,
    lessonTotal: 10,
    remainingMin: 28,
    owned: true,
  },
  {
    slug: "uam",
    title: "Examen UAM",
    tag: "Licenciatura",
    duration: "4 meses",
    enrolled: "9,120",
    image: "/courses/uam.jpg",
    accent: "#CE93D8",
    progress: 0,
    module: "Módulo 1",
    lesson: "Comprensión lectora y redacción",
    lessonNum: 1,
    lessonTotal: 11,
    remainingMin: 40,
    owned: false,
  },
];

const activeCourses = COURSES.filter((c) => c.progress > 0).length;

export default function CoursesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>
            Mis cursos
          </h1>
          <p className="text-sm text-white/45 mt-1">Todos tus materiales de preparación en un solo lugar</p>
        </div>
        <span className="badge badge--violet text-sm px-3 py-1.5 font-bold">
          {activeCourses} activos
        </span>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {COURSES.map((course) => (
          <div key={course.slug} className="card flex flex-col gap-4 overflow-hidden p-0">

            {/* Image header */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Lock badge */}
              {!course.owned && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
              )}

              {/* Progress pill */}
              {course.owned && course.progress > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: `${course.accent}cc` }}>
                    {course.progress}%
                  </span>
                </div>
              )}

              {/* Title over image */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-black/30 text-white/70 rounded-full px-2 py-0.5 mb-1 backdrop-blur-sm">
                  {course.tag}
                </span>
                <h2 className="text-lg font-black text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {course.title}
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 px-4 pb-4">
              {/* Meta */}
              <div className="flex items-center gap-3 text-[11px] text-white/40">
                <span className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {course.duration}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  {course.enrolled}
                </span>
              </div>

              {/* Progress bar (owned) */}
              {course.owned && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/35">
                    <span>{course.module} · Lec {course.lessonNum}/{course.lessonTotal}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${course.progress}%`, background: course.accent }}
                    />
                  </div>
                  <p className="text-[11px] text-white/50 truncate">{course.lesson}</p>
                </div>
              )}

              {/* CTA */}
              {course.owned ? (
                <Link
                  href={`/courses/${course.slug}`}
                  className="mt-auto text-center py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${course.accent}88, ${course.accent}44)`, border: `1px solid ${course.accent}44` }}
                >
                  {course.progress > 0 ? "Continuar" : "Comenzar"}
                </Link>
              ) : (
                <div className="mt-auto space-y-2">
                  <p className="text-[11px] text-white/30 flex items-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    No incluido en tu plan
                  </p>
                  <Link
                    href="/suscribirse"
                    className="block text-center py-2.5 px-4 rounded-xl text-sm font-bold border transition-all hover:bg-violet-500/10"
                    style={{ borderColor: `${course.accent}55`, color: course.accent }}
                  >
                    Adquirir acceso
                  </Link>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
