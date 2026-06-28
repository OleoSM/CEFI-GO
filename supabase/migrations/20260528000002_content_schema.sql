-- =====================================================================
-- CEFIGO - Contenido: cursos, materias, modulos, lecciones, quizzes
-- Fecha: 2026-05-28
-- =====================================================================

-- -----------------------------------------------------------------------
-- 1. ENUMS NUEVOS
-- -----------------------------------------------------------------------

create type public.quiz_mode as enum (
  'attached',      -- post-video
  'standalone',    -- acceso independiente
  'exam',          -- simulacro completo
  'diagnostic'     -- solo al registro
);

create type public.quiz_difficulty as enum (
  'facil',
  'medio',
  'dificil'
);

-- -----------------------------------------------------------------------
-- 2. COURSES
-- Un curso por examen: ECOEMS, UNAM_Examen, IPN, UAM
-- -----------------------------------------------------------------------

create table public.courses (
  id          uuid        primary key default gen_random_uuid(),
  exam_type   public.exam_type not null unique,
  title       text        not null,   -- "Preparacion UNAM"
  description text,
  slug        text        not null unique,  -- "unam-examen"
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- 3. SUBJECTS
-- Materias de cada curso (varian por examen)
-- -----------------------------------------------------------------------

create table public.subjects (
  id          uuid        primary key default gen_random_uuid(),
  course_id   uuid        not null references public.courses(id) on delete cascade,
  title       text        not null,   -- "Biologia", "Matematicas"
  slug        text        not null,   -- "biologia"
  description text,
  "order"     integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(course_id, slug)
);

-- -----------------------------------------------------------------------
-- 4. MODULES
-- Modulos dentro de cada materia
-- -----------------------------------------------------------------------

create table public.modules (
  id          uuid        primary key default gen_random_uuid(),
  subject_id  uuid        not null references public.subjects(id) on delete cascade,
  title       text        not null,   -- "Modulo 1 - La Celula"
  description text,
  "order"     integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- 5. LESSONS
-- Leccion individual con video de Vimeo
-- -----------------------------------------------------------------------

create table public.lessons (
  id               uuid        primary key default gen_random_uuid(),
  module_id        uuid        not null references public.modules(id) on delete cascade,
  title            text        not null,
  slug             text        not null,
  description      text,
  vimeo_id         text,               -- ID numerico del video en Vimeo
  duration_seconds integer,
  "order"          integer     not null default 0,
  is_free          boolean     not null default false,  -- true = tier gratuito
  is_active        boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique(module_id, slug)
);

-- -----------------------------------------------------------------------
-- 6. USER LESSON PROGRESS
-- Que lecciones ha visto/completado cada alumno
-- -----------------------------------------------------------------------

create table public.user_lesson_progress (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  lesson_id       uuid        not null references public.lessons(id) on delete cascade,
  completed       boolean     not null default false,
  completed_at    timestamptz,
  watch_seconds   integer     not null default 0,  -- segundos vistos
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, lesson_id)
);

-- -----------------------------------------------------------------------
-- 7. QUIZZES
-- Cuestionarios (post-video, standalone, simulacro, diagnostico)
-- -----------------------------------------------------------------------

create table public.quizzes (
  id                  uuid              primary key default gen_random_uuid(),
  lesson_id           uuid              references public.lessons(id) on delete set null,
  title               text              not null,
  description         text,
  mode                public.quiz_mode  not null default 'standalone',
  difficulty          public.quiz_difficulty not null default 'medio',
  time_limit_minutes  integer,          -- null = sin limite
  passing_score       integer           not null default 70
                                        check (passing_score between 0 and 100),
  randomize_questions boolean           not null default false,
  randomize_options   boolean           not null default false,
  show_feedback_after text              not null default 'submit'
                                        check (show_feedback_after in ('submit', 'review')),
  is_active           boolean           not null default true,
  created_at          timestamptz       not null default now(),
  updated_at          timestamptz       not null default now()
);

-- -----------------------------------------------------------------------
-- 8. QUESTIONS
-- Preguntas de quizzes Y de video checkpoints (quiz_id nullable)
-- -----------------------------------------------------------------------

create table public.questions (
  id          uuid        primary key default gen_random_uuid(),
  quiz_id     uuid        references public.quizzes(id) on delete cascade,  -- null si es de checkpoint
  text        text        not null,
  "order"     integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- 9. QUESTION OPTIONS
-- Opciones A/B/C/D — SIN marcar cual es correcta
-- El cliente recibe esta tabla. Nunca recibe question_answers.
-- -----------------------------------------------------------------------

create table public.question_options (
  id          uuid        primary key default gen_random_uuid(),
  question_id uuid        not null references public.questions(id) on delete cascade,
  text        text        not null,
  "order"     integer     not null default 0
);

-- -----------------------------------------------------------------------
-- 10. QUESTION ANSWERS
-- Respuesta correcta — NUNCA se envia al cliente.
-- Solo el servidor (service_role via Server Action) la consulta.
-- RLS activado sin policy de SELECT = ningun usuario autenticado puede leerla.
-- -----------------------------------------------------------------------

create table public.question_answers (
  question_id        uuid  primary key references public.questions(id) on delete cascade,
  correct_option_id  uuid  not null references public.question_options(id) on delete cascade,
  explanation        text  -- por que es correcta (se muestra DESPUES de responder)
);

-- -----------------------------------------------------------------------
-- 11. QUIZ ATTEMPTS
-- Intento completo de un cuestionario por un alumno
-- -----------------------------------------------------------------------

create table public.quiz_attempts (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.profiles(id) on delete cascade,
  quiz_id            uuid        not null references public.quizzes(id) on delete cascade,
  score              integer     check (score between 0 and 100),
  passed             boolean,
  time_spent_seconds integer,
  started_at         timestamptz not null default now(),
  completed_at       timestamptz
);

-- -----------------------------------------------------------------------
-- 12. QUIZ ATTEMPT ANSWERS
-- Respuesta por pregunta dentro de un intento
-- -----------------------------------------------------------------------

create table public.quiz_attempt_answers (
  id                 uuid    primary key default gen_random_uuid(),
  attempt_id         uuid    not null references public.quiz_attempts(id) on delete cascade,
  question_id        uuid    not null references public.questions(id) on delete cascade,
  selected_option_id uuid    references public.question_options(id) on delete set null,
  is_correct         boolean not null default false
);

-- -----------------------------------------------------------------------
-- 13. VIDEO CHECKPOINTS
-- Timestamp en el video donde pausa + pregunta a mostrar
-- -----------------------------------------------------------------------

create table public.video_checkpoints (
  id                uuid        primary key default gen_random_uuid(),
  lesson_id         uuid        not null references public.lessons(id) on delete cascade,
  question_id       uuid        not null references public.questions(id) on delete cascade,
  timestamp_seconds integer     not null,
  "order"           integer     not null default 0,
  created_at        timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- 14. CHECKPOINT ATTEMPTS
-- Respuesta del alumno a un checkpoint de video
-- Un intento por checkpoint por usuario (unique)
-- -----------------------------------------------------------------------

create table public.checkpoint_attempts (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.profiles(id) on delete cascade,
  checkpoint_id      uuid        not null references public.video_checkpoints(id) on delete cascade,
  selected_option_id uuid        references public.question_options(id) on delete set null,
  is_correct         boolean     not null default false,
  answered_at        timestamptz not null default now(),
  unique(user_id, checkpoint_id)
);

-- -----------------------------------------------------------------------
-- 15. INDICES
-- -----------------------------------------------------------------------

create index idx_subjects_course_id         on public.subjects(course_id);
create index idx_modules_subject_id         on public.modules(subject_id);
create index idx_lessons_module_id          on public.lessons(module_id);
create index idx_lessons_slug               on public.lessons(slug);
create index idx_lessons_is_free            on public.lessons(is_free);
create index idx_progress_user_id           on public.user_lesson_progress(user_id);
create index idx_progress_lesson_id         on public.user_lesson_progress(lesson_id);
create index idx_quizzes_lesson_id          on public.quizzes(lesson_id);
create index idx_quizzes_mode               on public.quizzes(mode);
create index idx_questions_quiz_id          on public.questions(quiz_id);
create index idx_question_options_question  on public.question_options(question_id);
create index idx_attempts_user_id           on public.quiz_attempts(user_id);
create index idx_attempts_quiz_id           on public.quiz_attempts(quiz_id);
create index idx_checkpoints_lesson_id      on public.video_checkpoints(lesson_id);
create index idx_cp_attempts_user_id        on public.checkpoint_attempts(user_id);

-- -----------------------------------------------------------------------
-- 16. TRIGGERS updated_at
-- -----------------------------------------------------------------------

create trigger set_courses_updated_at
  before update on public.courses
  for each row execute procedure public.handle_updated_at();

create trigger set_subjects_updated_at
  before update on public.subjects
  for each row execute procedure public.handle_updated_at();

create trigger set_modules_updated_at
  before update on public.modules
  for each row execute procedure public.handle_updated_at();

create trigger set_lessons_updated_at
  before update on public.lessons
  for each row execute procedure public.handle_updated_at();

create trigger set_progress_updated_at
  before update on public.user_lesson_progress
  for each row execute procedure public.handle_updated_at();

create trigger set_quizzes_updated_at
  before update on public.quizzes
  for each row execute procedure public.handle_updated_at();

-- -----------------------------------------------------------------------
-- 17. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------

alter table public.courses              enable row level security;
alter table public.subjects             enable row level security;
alter table public.modules              enable row level security;
alter table public.lessons              enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.quizzes              enable row level security;
alter table public.questions            enable row level security;
alter table public.question_options     enable row level security;
alter table public.question_answers     enable row level security;
alter table public.quiz_attempts        enable row level security;
alter table public.quiz_attempt_answers enable row level security;
alter table public.video_checkpoints    enable row level security;
alter table public.checkpoint_attempts  enable row level security;

-- CONTENIDO PUBLICO (todos los autenticados pueden leer)
-- courses, subjects, modules, lessons, quizzes, questions, question_options, video_checkpoints

create policy "publico: lee courses"
  on public.courses for select using (auth.role() = 'authenticated');

create policy "publico: lee subjects"
  on public.subjects for select using (auth.role() = 'authenticated');

create policy "publico: lee modules"
  on public.modules for select using (auth.role() = 'authenticated');

create policy "publico: lee lessons"
  on public.lessons for select using (auth.role() = 'authenticated');

create policy "publico: lee quizzes"
  on public.quizzes for select using (auth.role() = 'authenticated');

create policy "publico: lee questions"
  on public.questions for select using (auth.role() = 'authenticated');

create policy "publico: lee question_options"
  on public.question_options for select using (auth.role() = 'authenticated');

create policy "publico: lee video_checkpoints"
  on public.video_checkpoints for select using (auth.role() = 'authenticated');

-- question_answers: SIN policy de SELECT
-- Ningun usuario autenticado puede leerla.
-- Solo service_role (Server Actions) bypasea RLS y la consulta.

-- PROGRESO: el usuario solo ve/edita el suyo

create policy "progreso: usuario lee el suyo"
  on public.user_lesson_progress for select
  using (auth.uid() = user_id);

create policy "progreso: usuario inserta el suyo"
  on public.user_lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "progreso: usuario actualiza el suyo"
  on public.user_lesson_progress for update
  using (auth.uid() = user_id);

-- QUIZ ATTEMPTS: el usuario solo ve los suyos

create policy "attempts: usuario lee los suyos"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "attempts: usuario inserta los suyos"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "attempts: usuario lee sus respuestas"
  on public.quiz_attempt_answers for select
  using (
    exists (
      select 1 from public.quiz_attempts
      where id = attempt_id and user_id = auth.uid()
    )
  );

create policy "attempts: usuario inserta sus respuestas"
  on public.quiz_attempt_answers for insert
  with check (
    exists (
      select 1 from public.quiz_attempts
      where id = attempt_id and user_id = auth.uid()
    )
  );

-- CHECKPOINT ATTEMPTS: el usuario solo ve los suyos

create policy "cp: usuario lee los suyos"
  on public.checkpoint_attempts for select
  using (auth.uid() = user_id);

create policy "cp: usuario inserta los suyos"
  on public.checkpoint_attempts for insert
  with check (auth.uid() = user_id);

-- ADMIN: lee y escribe todo el contenido

create policy "admin: gestiona courses"
  on public.courses for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona subjects"
  on public.subjects for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona modules"
  on public.modules for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona lessons"
  on public.lessons for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona quizzes"
  on public.quizzes for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona questions"
  on public.questions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona question_options"
  on public.question_options for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona question_answers"
  on public.question_answers for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: gestiona checkpoints"
  on public.video_checkpoints for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: lee todos los attempts"
  on public.quiz_attempts for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admin: lee todos los cp attempts"
  on public.checkpoint_attempts for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- =====================================================================
-- FIN DE LA MIGRACION
-- =====================================================================
