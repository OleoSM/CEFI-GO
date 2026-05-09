# Diseño: Migración Frontend a React + Next.js App Router

**Fecha:** 2026-05-08  
**Estado:** Aprobado

---

## Contexto

El proyecto tiene 8 páginas HTML con CSS y JS vanilla que se migran a Next.js 16 App Router con React 19. El scaffold (estructura base) de Next.js ya existe. El backend (Supabase) se pausa — las páginas usan datos mock (datos de prueba) por ahora.

---

## Decisiones de diseño

| Decisión | Elección |
|----------|----------|
| Estilos | Tailwind CSS + shadcn/ui |
| Routing | Next.js App Router con route groups |
| Datos | Mock data (datos de prueba) — sin Supabase por ahora |
| Tipado | TypeScript estricto |
| CSS anterior | Eliminado (styles.css, app.css) |
| JS anterior | Eliminado (router.js, app.js, main.js) |
| HTML anterior | Eliminado (8 archivos .html) |

---

## Estructura de carpetas resultante

```
app/
├── layout.tsx                        ← root layout (fuentes, providers)
├── page.tsx                          ← landing page
├── globals.css
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
└── (app)/
    ├── layout.tsx                    ← layout con sidebar + navbar
    ├── dashboard/page.tsx
    ├── courses/
    │   └── [slug]/
    │       ├── page.tsx              ← detalle de curso
    │       └── lessons/
    │           └── [lessonId]/page.tsx ← clase con video
    ├── exam/
    │   └── [examId]/page.tsx
    └── profile/page.tsx

components/
├── ui/                               ← componentes shadcn (Button, Input, Card…)
├── layout/                           ← Navbar, Sidebar, Footer
├── auth/                             ← LoginForm, RegisterForm
├── dashboard/                        ← CourseCard, ProgressBar
├── exam/                             ← QuestionCard, Timer, Results
└── lesson/                           ← VideoPlayer, LessonNav

lib/
├── supabase/                         ← existente
├── mock-data/                        ← datos de prueba para desarrollo
└── utils.ts

public/                               ← imágenes, íconos estáticos
```

---

## Páginas y rutas

| HTML anterior | Ruta nueva | Descripción |
|---------------|------------|-------------|
| index.html | `/` | Landing page (página de inicio) |
| login.html | `/login` | Iniciar sesión |
| register.html | `/register` | Registro |
| dashboard.html | `/dashboard` | Panel del alumno |
| course.html | `/courses/[slug]` | Detalle de curso |
| lesson.html | `/courses/[slug]/lessons/[lessonId]` | Clase con video |
| exam.html | `/exam/[examId]` | Simulador de examen |
| profile.html | `/profile` | Perfil de usuario |

---

## Grupos de rutas (route groups)

**`(auth)`** — Login y registro. Layout de pantalla completa sin sidebar.

**`(app)`** — Todas las páginas autenticadas. Comparten layout con sidebar y navbar.

---

## Componentes compartidos

- **Navbar** — barra superior con logo, usuario y botón de salir
- **Sidebar** — menú lateral con navegación entre secciones
- **CourseCard** — tarjeta de curso reutilizable en dashboard y listados
- **VideoPlayer** — reproductor de video para la página de clase (hosting por definir)
- **Timer** — cronómetro para el simulador de examen

---

## Mock data (datos de prueba)

Mientras el backend está pausado, los datos se sirven desde `lib/mock-data/`. Incluye cursos, lecciones, preguntas de examen y perfil de usuario de ejemplo. Cuando se conecte Supabase, solo se cambia el origen del dato — los componentes no cambian.

---

## Video hosting (alojamiento de video)

Pendiente de definir. El componente `VideoPlayer` se construye con una URL de video como prop (propiedad), de modo que cualquier plataforma (YouTube embed, Bunny.net, Cloudflare Stream, etc.) solo requiere cambiar la URL, no el componente.

---

## Lo que NO entra en este sprint (entrega)

- Autenticación real con Supabase
- Pagos y panel de admin
- Subida de comprobantes
- Exámenes persistidos en base de datos

---

## Criterios de éxito

- Las 8 rutas cargan sin errores en `http://localhost:3000`
- `npm run build` pasa sin errores de TypeScript
- Los archivos HTML, css/ y js/ legacy han sido eliminados
- La estructura de carpetas coincide con el diagrama de arriba
