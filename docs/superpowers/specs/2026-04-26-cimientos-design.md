# Sub-proyecto #1 — Cimientos: Diseño

**Fecha:** 2026-04-26
**Estado:** aprobado por usuario, listo para plan de implementación
**Sub-proyecto:** 1 de 6

## 1. Objetivo

Reemplazar la sesión simulada en `localStorage` del frontend estático actual por una base sólida sobre la cual se construirán los demás sub-proyectos: backend Supabase, autenticación real, esquema de base de datos inicial, modelo de roles, despliegue en Vercel y postura de seguridad por defecto (RLS, headers, validación, rate limiting).

## 2. Alcance

**Incluye:**

- Migración del HTML/CSS/JS existente a Next.js (App Router) + TypeScript
- Integración de Supabase Auth (email/password + Google OAuth + verificación de correo + reset de contraseña)
- Esquema inicial de DB: `profiles`, `user_sessions`, `admin_audit_log`
- RLS habilitado en toda tabla nueva
- Custom claims para admin en `auth.users.raw_app_meta_data`
- Función `promote_to_admin` con auditoría
- Middleware con headers de seguridad (CSP, HSTS, X-Frame-Options, etc.)
- Enforcement de máximo 3 dispositivos simultáneos por usuario
- Validación server-side con Zod en todas las Server Actions
- Rate limiting (Upstash Redis o Vercel KV)
- Variables de entorno separadas para cliente y servidor
- Despliegue en Vercel con un solo entorno (producción)
- Suite mínima de tests (Vitest + Playwright)

**No incluye** (otros sub-proyectos):

- Modelo de cursos y planes (#2)
- Flujo de pago por transferencia y upload de comprobante (#3)
- Panel de administrador funcional (#4) — este sub-proyecto deja un shell vacío en `/admin` solo con el gate de claim
- Persistencia de respuestas de examen y progreso (#5)
- Auditoría final de seguridad (#6)

## 3. Decisiones consolidadas

| Tema | Decisión |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Backend | Supabase (Postgres + Auth + Storage) |
| Hosting | Vercel (Hobby tier inicialmente) |
| Auth providers | email + password, Google OAuth |
| Verificación de email | obligatoria antes de acceder a rutas protegidas |
| Reset de password | habilitado vía email |
| Reglas de password | longitud ≥ 8, rechazar top-100k filtradas, sin requisito de mayúsculas/símbolos |
| Rate limit login | 5 intentos / 15 min por email + por IP |
| Datos perfil al registro | `full_name`, `email`, `password`, `phone`, `exam_target` |
| Datos editables después | `career_target`, `course_start_date`, `exam_date`, `course_end_date`, racha (auto) |
| Modelo de acceso | paywall directo, sin trial. Pre-pago: landing + catálogo + 1 simulacro demo |
| Mecanismo admin | custom claim `role: 'admin'` en `raw_app_meta_data` (JWT) |
| Primer admin | creado vía SQL manual en dashboard de Supabase |
| Sesiones simultáneas | máximo 3; al login del 4° se invalida la más antigua |
| Repo | GitHub privado, usuario `OleoSM` |
| Entornos | uno solo (producción) inicialmente; migrar a dev+staging+prod en sub-proyecto #6 |
| Dominio | `cefimat.com` registrado en Wix; relación con marca CEFITIPS — **TBD** |
| Términos / Aviso de privacidad | placeholders genéricos al inicio; redacción legal antes de salir a producción (LFPDPPP) |
| Admins iniciales | 3 personas (usuario principal + 2 más, nombres pendientes) |

## 4. Estructura del proyecto

```
plataforma-cefitips/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # landing (era index.html)
│   │   ├── catalogo/page.tsx         # catálogo visible sin pagar
│   │   └── simulacro-demo/page.tsx   # los 10 reactivos hardcoded
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (app)/                         # protegido (auth + email verificado)
│   │   ├── dashboard/page.tsx
│   │   ├── cursos/[id]/page.tsx
│   │   ├── lecciones/[id]/page.tsx
│   │   ├── simulacros/[id]/page.tsx
│   │   ├── perfil/page.tsx
│   │   ├── perfil/dispositivos/page.tsx
│   │   └── perfil/completar/page.tsx  # post-Google OAuth
│   ├── admin/                         # solo claim role=admin
│   │   └── page.tsx                   # shell vacío en este sub-proyecto
│   ├── api/auth/callback/route.ts     # OAuth y email verification callback
│   ├── layout.tsx
│   └── middleware.ts
├── lib/
│   ├── supabase/
│   │   ├── server.ts                  # createServerClient (cookies)
│   │   ├── client.ts                  # createBrowserClient
│   │   └── admin.ts                   # service-role; "import 'server-only'"
│   ├── auth/
│   │   ├── session.ts
│   │   └── multi-device.ts
│   ├── validation/schemas.ts          # Zod schemas centralizados
│   ├── rate-limit.ts                  # Upstash o Vercel KV
│   └── db/types.ts                    # generados de schema Supabase
├── components/                         # UI migrada del HTML
├── public/assets/
├── styles/globals.css                  # migración de css/styles.css + css/app.css
├── supabase/
│   ├── migrations/                     # SQL versionado
│   └── seed.sql
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local                          # gitignored
├── .env.example                        # plantilla pública
├── next.config.js
├── tsconfig.json
├── vercel.json
└── package.json
```

## 5. Esquema de base de datos

### 5.1 Tablas

```sql
-- 1. profiles: 1:1 con auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (length(full_name) BETWEEN 2 AND 120),
  phone TEXT CHECK (phone IS NULL OR phone ~ '^\+?[0-9 \-()]{8,20}$'),
  exam_target TEXT NOT NULL DEFAULT 'undecided'
    CHECK (exam_target IN ('UNAM','IPN','UAM','COMIPEMS','EXANI','undecided')),

  career_target TEXT,
  course_start_date DATE,
  exam_date DATE,
  course_end_date DATE,

  last_login_date DATE,
  current_streak_days INT NOT NULL DEFAULT 0 CHECK (current_streak_days >= 0),
  longest_streak_days INT NOT NULL DEFAULT 0 CHECK (longest_streak_days >= 0),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER profiles_touch_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- 2. user_sessions: tracking para límite de 3 dispositivos
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT UNIQUE NOT NULL,    -- SHA-256 del refresh token
  device_label TEXT,                            -- "Chrome en Windows · CDMX"
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX user_sessions_user_idx ON user_sessions(user_id, last_seen_at DESC);

-- Nota operativa: last_seen_at se actualiza desde middleware al refrescar sesión
-- (~1x por hora cuando expira el access token), NO en cada request HTTP.
-- Cleanup: cron job periódico borra sesiones con last_seen_at < now() - 30 days.

-- 3. admin_audit_log: trazabilidad de acciones admin (se expandirá en #4)
CREATE TABLE admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX admin_audit_log_admin_idx ON admin_audit_log(admin_id, created_at DESC);
CREATE INDEX admin_audit_log_action_idx ON admin_audit_log(action, created_at DESC);
```

### 5.2 Trigger de creación de perfil

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, exam_target)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''), 'Usuario'),
    NULLIF(trim(NEW.raw_user_meta_data->>'phone'), ''),
    COALESCE(NEW.raw_user_meta_data->>'exam_target', 'undecided')
  );
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5.3 Función de promoción a admin

```sql
CREATE OR REPLACE FUNCTION promote_to_admin(target_user_id UUID, granted_by UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE
  granter_role TEXT;
BEGIN
  -- Verificación: granted_by debe ser admin
  SELECT raw_app_meta_data->>'role' INTO granter_role
    FROM auth.users WHERE id = granted_by;

  IF granter_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Only admins can promote other admins';
  END IF;

  UPDATE auth.users
    SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role','admin')
    WHERE id = target_user_id;

  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id)
  VALUES (granted_by, 'promote_admin', 'user', target_user_id::text);
END $$;

REVOKE ALL ON FUNCTION promote_to_admin(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION promote_to_admin(UUID, UUID) TO service_role;
```

> El primer admin se crea con un INSERT manual: `UPDATE auth.users SET raw_app_meta_data = '{"role":"admin"}' WHERE email = '...'`.

### 5.4 RLS — política deny-by-default

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_admin_all ON profiles
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- user_sessions: usuario lee/borra las suyas; service_role escribe
CREATE POLICY sessions_select_own ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY sessions_delete_own ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- admin_audit_log: solo admins leen; solo service_role escribe (vía promote_to_admin)
CREATE POLICY audit_admin_select ON admin_audit_log
  FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

> Regla operativa: **ninguna tabla nueva se crea sin RLS habilitado**. Verificación automatizada en CI (query a `pg_class.relrowsecurity`).

## 6. Flujos de autenticación

### 6.1 Registro (email/password)

1. Form `/register` → Server Action
2. Zod valida: `full_name` (2-120), `email` (RFC 5321), `password` (≥8 + check contra Pwned Passwords API), `phone` (requerido en este flujo, debe pasar regex de teléfono), `exam_target` (enum, requerido). Nota: aunque la columna `phone` en DB es nullable (para soportar usuarios OAuth), en este formulario es requerido por el Zod
3. `supabase.auth.signUp({ email, password, options: { data: { full_name, phone, exam_target }, emailRedirectTo: `${SITE_URL}/api/auth/callback` } })`
4. Trigger `handle_new_user` crea fila en `profiles`
5. Email de confirmación → click → `/api/auth/callback?token=...`
6. Callback verifica → `enforceDeviceLimit` → redirect a `/dashboard`
7. Si email no verificado, middleware redirige `(app)/*` → `/verify-email`

### 6.2 Login (email/password)

1. Form `/login` → Server Action
2. Zod valida
3. Rate limit check (Upstash) → si excedido, 429
4. `supabase.auth.signInWithPassword`
5. `enforceDeviceLimit(user_id, refresh_token, request_metadata)` en una transacción:
   - Hash SHA-256 del refresh token
   - Insert en `user_sessions` (count efectivo ahora puede ser hasta 4)
   - `SELECT count(*) FROM user_sessions WHERE user_id = ?`
   - Si count > 3, ordenar por `last_seen_at ASC`, tomar la(s) más antigua(s) hasta dejar 3, eliminar de DB y llamar `auth.admin.signOut(refresh_token_old)` con cliente service-role para invalidar el refresh token en Supabase
6. Redirect a `next` o `/dashboard`

### 6.3 Login Google OAuth

1. Botón → `signInWithOAuth({ provider: 'google', redirectTo: `${SITE_URL}/api/auth/callback` })`
2. Google → Supabase → `/api/auth/callback`
3. Callback intercambia code → session
4. Si primer login: trigger crea `profiles` con `full_name` de Google, `phone=null`, `exam_target='undecided'`
5. `enforceDeviceLimit`
6. Si `phone IS NULL OR exam_target = 'undecided'`, redirect a `/perfil/completar` (form para completar)
7. Si no, redirect a `/dashboard`

### 6.4 Reset de password

1. `/forgot-password` → Zod valida email → rate limit
2. `supabase.auth.resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/reset-password` })`
3. Email con link → `/reset-password?code=...` (el link auto-establece una sesión temporal con la cookie de Supabase)
4. Form de nueva password → Zod (≥8 + Pwned check)
5. `supabase.auth.updateUser({ password })`
6. Invalidar **todas las demás sesiones** del usuario en `user_sessions` (las que existían antes del reset, en otros dispositivos), preservando solo la actual del flujo de reset; llamar `auth.admin.signOut` para los refresh tokens revocados
7. Redirect a `/dashboard` (el usuario queda logueado con la sesión nueva del reset)

### 6.5 Logout

1. Botón con `data-logout` → Server Action
2. Eliminar fila de `user_sessions` correspondiente al refresh token actual
3. `supabase.auth.signOut()`
4. Redirect a `/`

## 7. Middleware

```ts
// app/middleware.ts (pseudocódigo)
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL,
                                       env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                                       { cookies: cookieAdapter(req, res) });

  // 1. Refresh de sesión
  const { data: { user } } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  // 2. Rutas (app)/* requieren auth + email verificado
  if (path.startsWith('/dashboard') || path.startsWith('/cursos')
      || path.startsWith('/lecciones') || path.startsWith('/simulacros')
      || path.startsWith('/perfil')) {
    if (!user) return NextResponse.redirect(new URL(`/login?next=${path}`, req.url));
    if (!user.email_confirmed_at) return NextResponse.redirect(new URL('/verify-email', req.url));
  }

  // 3. Gate de admin
  if (path.startsWith('/admin')) {
    const role = user?.app_metadata?.role;
    if (role !== 'admin') return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 4. Rutas (auth)/* solo para invitados
  if (['/login','/register'].includes(path) && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 5. Headers de seguridad
  applySecurityHeaders(res);
  return res;
}

export const config = { matcher: ['/((?!_next|favicon.ico|assets/).*)'] };
```

### Headers de seguridad

| Header | Valor |
|---|---|
| `Content-Security-Policy` | (ver abajo, con nonce dinámico) |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

**CSP** (con nonce por request):

```
default-src 'self';
script-src 'self' 'nonce-{generated}';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https://*.supabase.co;
connect-src 'self' https://*.supabase.co;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests
```

**CORS:** no se abre CORS a ningún origen externo. Server Actions y Route Handlers son same-origin por defecto en Next.js.

## 8. Validación contra inyección

- **Zod** en strict mode (`.strict()`) en cada Server Action y Route Handler — rechaza props desconocidas
- Postgres + Supabase JS usan parámetros preparados → SQL injection eliminado en queries normales
- Para contenido rich-text futuro (sub-proyecto #2): sanitizer `isomorphic-dompurify`
- Headers Content-Type: forzar `application/json` en respuestas API
- Escape HTML por defecto de React; nunca `dangerouslySetInnerHTML` con datos de DB sin sanitizar

## 9. Rate limiting

Stack: **Upstash Redis** (free tier, 10k req/día) + paquete `@upstash/ratelimit`.

| Endpoint | Límite | Clave |
|---|---|---|
| `/login` | 5 / 15 min | email + IP |
| `/register` | 3 / hora | IP |
| `/forgot-password` | 3 / hora | email + IP |
| `/api/auth/callback` | 30 / min | IP |
| Server Actions autenticadas | 60 / min | user_id |

Si excede: HTTP 429 + `Retry-After` header.

## 10. Variables de entorno

`.env.example` (commiteado):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
```

`.env.local` (gitignored): valores reales en desarrollo.
Vercel: mismas variables en Project Settings → Environment Variables.

**Protección de la service role key:**

```ts
// lib/supabase/admin.ts
import 'server-only';   // build falla si se importa en Client Component
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

## 11. Testing

| Capa | Herramienta | Cobertura inicial |
|---|---|---|
| Unit | Vitest | validators, hash de refresh token, helpers |
| Integration | Vitest + supabase-js + DB de prueba | RLS policies, triggers, `promote_to_admin` |
| E2E | Playwright | signup, login, reset password, límite 3 dispositivos, gate admin |
| Security | scripts CI | service_role no en bundle del cliente, RLS en cada tabla, CSP en respuestas |

CI sugerido: GitHub Actions corriendo `npm run lint && npm run typecheck && npm run test:unit && npm run test:integration && npm run test:e2e` en cada PR.

## 12. Plan de migración del HTML existente

| Fase | Trabajo | Verificación |
|---|---|---|
| 1 | Scaffold: `npx create-next-app@latest`, TS, ESLint, Prettier, paquetes Supabase, Zod, Upstash | `npm run dev` funciona |
| 2 | Migrar CSS (`css/styles.css` + `css/app.css`) a `styles/globals.css`; portar `index.html` → `app/(public)/page.tsx` | Render visual idéntico |
| 3 | Portar `login.html`, `register.html`, conectar Server Actions reales a Supabase Auth | Registro real crea usuario en Supabase |
| 4 | Portar `dashboard.html`, `course.html`, `lesson.html`, `exam.html`, `profile.html` con datos placeholder; aplicar guards en middleware | Rutas protegidas redirigen correctamente |
| 5 | Implementar `enforceDeviceLimit`, función `promote_to_admin`, página `/perfil/dispositivos` | Test E2E pasa |
| 6 | Configurar Vercel, conectar GitHub, configurar dominio (TBD), DNS, certificado | Smoke test en producción |

## 13. Criterios de aceptación

El sub-proyecto se considera completo cuando:

- [ ] `npm run dev` levanta el proyecto sin errores
- [ ] Las 8 pantallas originales del frontend renderizan en Next.js con el mismo look & feel
- [ ] Un usuario puede registrarse con email/password y recibir email de confirmación
- [ ] Un usuario puede registrarse con Google OAuth y completar perfil después
- [ ] Email no verificado bloquea acceso a `(app)/*`
- [ ] Reset de password funciona vía email
- [ ] Cuatro logins simultáneos invalidan automáticamente el más antiguo
- [ ] Página `/perfil/dispositivos` lista las 3 sesiones y permite revocar manualmente
- [ ] Acceder a `/admin` sin claim `role=admin` redirige a `/dashboard`
- [ ] `promote_to_admin` falla si el `granted_by` no es admin
- [ ] Headers de seguridad están presentes en todas las respuestas (verificar con `curl -I`)
- [ ] CSP no permite `unsafe-eval` ni `*`
- [ ] CSP es estricta y la página funciona sin warnings de violación
- [ ] Rate limiting bloquea el 6° intento de login en 15 min
- [ ] RLS habilitado en `profiles`, `user_sessions`, `admin_audit_log`
- [ ] `service_role` key no aparece en el bundle del cliente (verificación scripted)
- [ ] El proyecto se despliega en Vercel y la página de inicio responde 200
- [ ] Suite de tests E2E (signup, login, reset, multi-device, admin gate) pasa

## 14. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Filtración de service_role key | media | crítico | `import 'server-only'`, regex check en CI, rotación si se sospecha |
| RLS mal configurada permite leakage | media | alto | Tests de integración explícitos por tabla; revisión humana de cada policy |
| Bypass del límite 3 dispositivos | baja | medio | El bypass solo funciona si el atacante manipula DB directo (no en el cliente). Aceptable. |
| Downtime de Supabase | baja | alto | Status page monitoreado; Pro tier con SLA cuando haya tráfico real |
| Domain TBD bloquea Google OAuth setup | alta | medio | Configurar OAuth en `localhost` y dominio Vercel `*.vercel.app` para empezar; cambiar a dominio real cuando se decida |

## 15. Pendientes (TBD)

- **Dominio definitivo:** `cefimat.com` raíz, `tips.cefimat.com`, `cefitips.cefimat.com` u otro. Decidir antes del paso 6 del plan de migración.
- **Correo remitente** para emails transaccionales: depende del dominio.
- **Nombres de los 2 admins adicionales:** se promoverán manualmente cuando lleguen.
- **Términos y Aviso de Privacidad:** redacción legal antes de producción.

## 16. Próximo paso

Invocar el skill `superpowers:writing-plans` para generar el plan de implementación detallado paso a paso a partir de este spec.
