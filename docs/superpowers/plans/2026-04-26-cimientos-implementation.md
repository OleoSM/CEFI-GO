# Cimientos — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el frontend estático CEFITIPS en aplicación Next.js conectada a Supabase con auth real, RLS, headers de seguridad, límite 3 dispositivos, deploy en Vercel.

**Architecture:** Next.js 15 App Router + TypeScript + Supabase Auth (cookies via `@supabase/ssr`). Server Actions para operaciones sensibles (admin promotion, password updates). RLS deny-by-default. Middleware para refresh de sesión, gating de rutas y headers de seguridad. Multi-device tracking via tabla `user_sessions`.

**Tech Stack:** Next.js 15, TypeScript 5, Supabase (`@supabase/ssr` + `@supabase/supabase-js`), Zod 3, Upstash Redis (`@upstash/redis` + `@upstash/ratelimit`), Vitest 1, Playwright 1, Tailwind no (mantenemos CSS existente migrado a `globals.css`).

**Spec base:** [`docs/superpowers/specs/2026-04-26-cimientos-design.md`](../specs/2026-04-26-cimientos-design.md)

---

## Convenciones del plan

- 🧑 **USER ACTION** = paso donde el usuario humano debe hacer algo en una web externa (Supabase dashboard, Vercel, Google Cloud, etc.). El agente se detiene y espera confirmación.
- 🤖 **AGENT** = paso que ejecuta el agente automáticamente (código, comandos, commits).
- 🔒 **SECURITY** = paso con implicación de seguridad explícita; no saltar ni simplificar.
- ✅ **CHECKPOINT** = pausa para verificación humana antes de continuar la siguiente fase.

Cada commit usa el formato Conventional Commits y el mensaje **NO** debe incluir secretos ni keys.

---

## Estructura de archivos final (Fase 1+)

```
plataforma-cefitips/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                      # landing
│   │   ├── catalogo/page.tsx
│   │   └── simulacro-demo/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── login/actions.ts
│   │   ├── register/page.tsx
│   │   ├── register/actions.ts
│   │   ├── forgot-password/page.tsx
│   │   ├── forgot-password/actions.ts
│   │   ├── reset-password/page.tsx
│   │   ├── reset-password/actions.ts
│   │   └── verify-email/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── cursos/page.tsx
│   │   ├── cursos/[id]/page.tsx
│   │   ├── lecciones/[id]/page.tsx
│   │   ├── simulacros/[id]/page.tsx
│   │   ├── perfil/page.tsx
│   │   ├── perfil/actions.ts
│   │   ├── perfil/dispositivos/page.tsx
│   │   ├── perfil/dispositivos/actions.ts
│   │   └── perfil/completar/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx                      # shell vacío
│   ├── api/auth/callback/route.ts
│   ├── layout.tsx
│   ├── globals.css                        # migración de css/styles.css + css/app.css
│   └── not-found.tsx
├── middleware.ts
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   └── admin.ts
│   ├── auth/
│   │   ├── multi-device.ts
│   │   └── pwned.ts
│   ├── validation/schemas.ts
│   ├── rate-limit.ts
│   ├── security/headers.ts
│   └── utils/device-label.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── PasswordInput.tsx
│   ├── auth/
│   │   ├── AuthLayout.tsx
│   │   └── GoogleButton.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── AuroraBackground.tsx
│   └── exam/
│       └── ExamSimulator.tsx
├── public/
│   └── assets/
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 20260426000001_initial_schema.sql
│   │   ├── 20260426000002_rls_policies.sql
│   │   ├── 20260426000003_triggers.sql
│   │   └── 20260426000004_admin_functions.sql
│   └── seed.sql
├── tests/
│   ├── unit/
│   │   ├── pwned.test.ts
│   │   ├── device-label.test.ts
│   │   └── schemas.test.ts
│   ├── integration/
│   │   ├── rls.test.ts
│   │   ├── multi-device.test.ts
│   │   └── promote-admin.test.ts
│   └── e2e/
│       ├── signup.spec.ts
│       ├── login.spec.ts
│       ├── reset-password.spec.ts
│       ├── multi-device.spec.ts
│       └── admin-gate.spec.ts
├── scripts/
│   ├── check-rls.ts
│   ├── check-bundle-secrets.sh
│   └── promote-first-admin.sql
├── .env.example
├── .env.local                              # gitignored, creado por user
├── next.config.mjs
├── playwright.config.ts
├── tsconfig.json
├── vitest.config.ts
├── vercel.json
├── package.json
└── README.md
```

---

# Fase 0 — Pre-requisitos (USER ACTIONS)

> **Esta fase es 100% del usuario.** El agente espera y luego verifica.

### Task 0.1: Crear cuenta y proyecto en Supabase

- [ ] **🧑 Step 1: Registrarse en Supabase**
  1. Ir a https://supabase.com
  2. "Start your project" → registrarse con cuenta de Google o GitHub
  3. Confirmar email si pide

- [ ] **🧑 Step 2: Crear proyecto**
  1. Botón "New project"
  2. Organization: la default
  3. Name: `cefitips-prod` (cualquier nombre, este es el que vamos a usar todo el proyecto)
  4. Database password: **generar uno fuerte y guardarlo en gestor de contraseñas (1Password / Bitwarden / Apple Keychain)** — lo necesitarás para conexiones directas a Postgres
  5. Region: **South America (São Paulo)** — más cercana a México con buena latencia
  6. Pricing plan: Free
  7. Click "Create new project" — espera ~2 minutos a que termine de provisionar

- [ ] **🧑 Step 3: Recolectar credenciales (NO compartirlas en chat)**
  En el dashboard de Supabase, ir a **Project Settings → API**. Copiar:
  - `Project URL` (algo como `https://xxxxxxxxxxxx.supabase.co`)
  - `anon public` key (es JWT largo, segura para cliente)
  - `service_role secret` key (⚠️ JWT largo, ESCRIBIR EN GESTOR DE CONTRASEÑAS, **nunca en chat**)

- [ ] **🧑 Step 4: Configurar email auth**
  En **Authentication → Providers → Email**:
  - Confirm email: **ON** (verificación obligatoria)
  - Secure email change: ON
  - Secure password change: ON
  - Mailer Autoconfirm: OFF
  - Click Save

- [ ] **🧑 Step 5: Configurar URL de site**
  En **Authentication → URL Configuration**:
  - Site URL: `http://localhost:3000` (lo cambiaremos al deploy)
  - Redirect URLs (whitelist): añadir `http://localhost:3000/**`
  - Click Save

- [ ] **🧑 Step 6: Avisar al agente**
  Decir al agente: *"Supabase listo, tengo URL, anon key y service_role key guardadas"*

---

### Task 0.2: Crear cuenta en Upstash (Redis para rate limiting)

- [ ] **🧑 Step 1: Registrarse en Upstash**
  1. Ir a https://upstash.com
  2. "Login" → con Google o GitHub
  3. Aceptar términos

- [ ] **🧑 Step 2: Crear DB Redis**
  1. Console → "Create Database"
  2. Name: `cefitips-rate-limit`
  3. Type: Regional
  4. Region: `us-east-1` o `sa-east-1` (cualquiera, la latencia para rate limit es trivial)
  5. Eviction: enabled, AllKeys-LRU
  6. TLS: enabled
  7. Click Create

- [ ] **🧑 Step 3: Recolectar credenciales**
  En la página del DB recién creado, scroll a **REST API**:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
  Guardarlos en gestor de contraseñas.

- [ ] **🧑 Step 4: Avisar al agente**
  Decir al agente: *"Upstash listo, tengo URL y token"*

---

### Task 0.3: Crear repositorio en GitHub

- [ ] **🧑 Step 1: Crear repo en GitHub**
  1. https://github.com/new (con cuenta `OleoSM`)
  2. Repository name: `plataforma-cefitips` (o el que prefiera)
  3. Visibility: **Private**
  4. **NO** inicializar con README, .gitignore ni LICENSE (ya tenemos commits locales)
  5. Click "Create repository"

- [ ] **🧑 Step 2: Agente conecta el remote y empuja**
  El usuario copia la URL SSH o HTTPS del repo y se la da al agente. El agente corre:
  ```bash
  git remote add origin <URL>
  git branch -M main   # o mantener master, el usuario decide
  git push -u origin main
  ```

---

> ✅ **CHECKPOINT 0:** Confirmar que las 3 cuentas existen y las credenciales están en el gestor del usuario. **NUNCA commitear las credenciales.**

---

# Fase 1 — Scaffold del proyecto Next.js

### Task 1.1: Inicializar Next.js dentro del repo actual

**Files:**
- Modify: estructura del repo
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `app/layout.tsx`, etc.

**Contexto:** Next.js requiere su propia estructura. Vamos a crear un subfolder `app/` y archivos de config en la raíz, conviviendo con los HTML existentes durante la migración. Al final de la fase de migración, los HTML se borran.

- [ ] **🤖 Step 1: Verificar versiones de Node**

  ```bash
  node --version
  npm --version
  ```

  Esperado: Node ≥ 18.18 y npm ≥ 9. Si no, instalar Node 20 LTS desde https://nodejs.org.

- [ ] **🤖 Step 2: Inicializar package.json y dependencias**

  En la raíz del proyecto, ejecutar:

  ```bash
  npm init -y
  ```

  Luego reemplazar `package.json` con:

  ```json
  {
    "name": "plataforma-cefitips",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "typecheck": "tsc --noEmit",
      "test:unit": "vitest run --dir tests/unit",
      "test:integration": "vitest run --dir tests/integration",
      "test:e2e": "playwright test",
      "test:rls": "tsx scripts/check-rls.ts",
      "test:bundle": "bash scripts/check-bundle-secrets.sh",
      "supabase:gen-types": "supabase gen types typescript --local > lib/supabase/database.types.ts"
    }
  }
  ```

- [ ] **🤖 Step 3: Instalar dependencias de runtime**

  ```bash
  npm install next@latest react@latest react-dom@latest \
    @supabase/ssr @supabase/supabase-js \
    zod \
    @upstash/redis @upstash/ratelimit \
    server-only \
    isomorphic-dompurify
  ```

- [ ] **🤖 Step 4: Instalar dependencias de desarrollo**

  ```bash
  npm install -D typescript @types/node @types/react @types/react-dom \
    eslint eslint-config-next \
    prettier \
    vitest @vitest/coverage-v8 \
    @playwright/test \
    tsx \
    supabase
  ```

- [ ] **🤖 Step 5: Crear `tsconfig.json`**

  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": false,
      "skipLibCheck": true,
      "strict": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "bundler",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [{ "name": "next" }],
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"]
      },
      "types": ["node"]
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules", ".next", "dist"]
  }
  ```

- [ ] **🤖 Step 6: Crear `next.config.mjs`**

  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: {
      serverActions: {
        allowedOrigins: ['localhost:3000']
      }
    },
    typescript: {
      ignoreBuildErrors: false
    },
    eslint: {
      ignoreDuringBuilds: false
    }
  };

  export default nextConfig;
  ```

- [ ] **🤖 Step 7: Crear `.eslintrc.json`**

  ```json
  {
    "extends": ["next/core-web-vitals"],
    "rules": {
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  }
  ```

- [ ] **🤖 Step 8: Crear `.prettierrc.json`**

  ```json
  {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "printWidth": 100,
    "tabWidth": 2,
    "useTabs": false,
    "endOfLine": "lf"
  }
  ```

- [ ] **🤖 Step 9: Actualizar `.gitignore` para Next.js**

  Agregar al final de `.gitignore` existente:

  ```
  # next
  /.next/
  /out/

  # vitest
  /coverage/

  # supabase
  /supabase/.branches
  /supabase/.temp
  /supabase/.env

  # playwright
  /playwright-report/
  /test-results/
  /tests/e2e/.auth/
  ```

  Verificar que ya están las entradas de `.env*` y `node_modules/` (lo están del commit anterior).

- [ ] **🤖 Step 10: Crear `app/layout.tsx` mínimo**

  ```tsx
  import type { Metadata } from 'next';
  import './globals.css';

  export const metadata: Metadata = {
    title: 'CEFITIPS — Entra a la universidad de tus sueños',
    description: 'Plataforma de preparación para examen de admisión a UNAM, IPN, UAM y COMIPEMS.',
  };

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body>{children}</body>
      </html>
    );
  }
  ```

- [ ] **🤖 Step 11: Crear `app/globals.css` placeholder**

  Crear el archivo vacío:

  ```css
  /* migración de css/styles.css y css/app.css en Task 8.1 */
  ```

- [ ] **🤖 Step 12: Crear `app/page.tsx` placeholder**

  ```tsx
  export default function HomePage() {
    return <main>Próximamente — CEFITIPS</main>;
  }
  ```

- [ ] **🤖 Step 13: Verificar build**

  ```bash
  npm run dev
  ```

  Esperado: servidor levanta en http://localhost:3000 mostrando "Próximamente — CEFITIPS". Detener con `Ctrl+C`.

- [ ] **🤖 Step 14: Commit**

  ```bash
  git add package.json package-lock.json tsconfig.json next.config.mjs \
    .eslintrc.json .prettierrc.json .gitignore \
    app/layout.tsx app/globals.css app/page.tsx
  git commit -m "feat: scaffold Next.js 15 + TypeScript + dependencies"
  ```

---

### Task 1.2: Configurar Vitest

**Files:**
- Create: `vitest.config.ts`, `tests/unit/.gitkeep`

- [ ] **🤖 Step 1: Crear `vitest.config.ts`**

  ```ts
  import { defineConfig } from 'vitest/config';
  import path from 'path';

  export default defineConfig({
    test: {
      environment: 'node',
      globals: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  });
  ```

- [ ] **🤖 Step 2: Crear directorio de tests**

  ```bash
  mkdir -p tests/unit tests/integration tests/e2e
  touch tests/unit/.gitkeep tests/integration/.gitkeep tests/e2e/.gitkeep
  ```

- [ ] **🤖 Step 3: Crear test smoke**

  `tests/unit/smoke.test.ts`:

  ```ts
  import { describe, it, expect } from 'vitest';

  describe('smoke', () => {
    it('runs', () => {
      expect(1 + 1).toBe(2);
    });
  });
  ```

- [ ] **🤖 Step 4: Ejecutar tests**

  ```bash
  npm run test:unit
  ```

  Esperado: 1 passed.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add vitest.config.ts tests/
  git commit -m "test: configure vitest with smoke test"
  ```

---

### Task 1.3: Configurar Playwright para E2E

**Files:**
- Create: `playwright.config.ts`

- [ ] **🤖 Step 1: Inicializar Playwright**

  ```bash
  npx playwright install --with-deps chromium
  ```

- [ ] **🤖 Step 2: Crear `playwright.config.ts`**

  ```ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'html',
    use: {
      baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  });
  ```

- [ ] **🤖 Step 3: Crear test E2E smoke**

  `tests/e2e/smoke.spec.ts`:

  ```ts
  import { test, expect } from '@playwright/test';

  test('home loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toContainText('CEFITIPS');
  });
  ```

- [ ] **🤖 Step 4: Ejecutar E2E**

  ```bash
  npm run test:e2e
  ```

  Esperado: 1 passed.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add playwright.config.ts tests/e2e/
  git commit -m "test: configure playwright for e2e"
  ```

---

> ✅ **CHECKPOINT 1:** El proyecto Next.js levanta, Vitest corre, Playwright corre. Lista para configurar Supabase.

---

# Fase 2 — Configuración de Supabase y migraciones

### Task 2.1: Inicializar Supabase CLI en el proyecto

**Files:**
- Create: `supabase/config.toml`

- [ ] **🤖 Step 1: Inicializar**

  ```bash
  npx supabase init
  ```

  Esto crea `supabase/config.toml` y `.gitignore`. Esperado: pregunta si quiere generar config para VS Code/Deno → responder **N**.

- [ ] **🤖 Step 2: Configurar el archivo `.env.example`**

  Crear `.env.example` en raíz:

  ```env
  # === Supabase ===
  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

  # === Site ===
  NEXT_PUBLIC_SITE_URL=http://localhost:3000

  # === Upstash Redis (rate limiting) ===
  UPSTASH_REDIS_REST_URL=https://YOUR.upstash.io
  UPSTASH_REDIS_REST_TOKEN=YOUR_TOKEN

  # === Google OAuth (configurado en Task 6.4) ===
  # No se usan directamente en Next.js — se configuran en Supabase dashboard.
  ```

- [ ] **🧑 Step 3: USER ACTION — Crear `.env.local` con valores reales**

  El usuario crea `.env.local` (gitignored) copiando `.env.example` y rellenando con los valores reales de Supabase y Upstash que tiene en su gestor de contraseñas.

  Verificar:
  ```bash
  cat .env.local | head -1
  ```
  Debe empezar con `NEXT_PUBLIC_SUPABASE_URL=https://`. **El agente NUNCA imprime el contenido completo de este archivo.**

- [ ] **🤖 Step 4: Vincular CLI con el proyecto remoto**

  ```bash
  npx supabase login
  ```

  Esto abre el navegador. **Esto requiere acción del usuario** (confirmar acceso). Después:

  ```bash
  npx supabase link --project-ref YOUR_PROJECT_REF
  ```

  El `project-ref` se obtiene del URL del proyecto en Supabase: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`. El usuario lo provee.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add .env.example supabase/
  git commit -m "feat: initialize supabase cli + env template"
  ```

---

### Task 2.2: Migración inicial — esquema de tablas

**Files:**
- Create: `supabase/migrations/20260426000001_initial_schema.sql`

- [ ] **🤖 Step 1: Crear migración**

  ```bash
  npx supabase migration new initial_schema
  ```

  Esto crea `supabase/migrations/<timestamp>_initial_schema.sql`. Renombrar manualmente si es necesario para que coincida con `20260426000001_initial_schema.sql` (o usar el timestamp generado y mantener el orden lexicográfico).

- [ ] **🤖 Step 2: Escribir el SQL**

  Contenido completo de `supabase/migrations/20260426000001_initial_schema.sql`:

  ```sql
  -- ===========================================
  -- Cimientos: Esquema inicial
  -- ===========================================

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

  COMMENT ON TABLE profiles IS '1:1 con auth.users; datos editables del estudiante';

  -- 2. user_sessions: tracking para límite de 3 dispositivos
  CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT UNIQUE NOT NULL,
    device_label TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE INDEX user_sessions_user_idx ON user_sessions(user_id, last_seen_at DESC);

  COMMENT ON TABLE user_sessions IS 'Sesiones activas para enforcement de límite de 3 dispositivos. Refresh token hashed con SHA-256.';

  -- 3. admin_audit_log: trazabilidad de acciones admin
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

  COMMENT ON TABLE admin_audit_log IS 'Registro inmutable de acciones administrativas. Solo se inserta vía SECURITY DEFINER funcs.';
  ```

- [ ] **🤖 Step 3: Aplicar migración al proyecto remoto**

  ```bash
  npx supabase db push
  ```

  Esperado: "Finished supabase db push." Si falla por confirmación de pérdida de datos, verificar que el proyecto remoto esté limpio (sin tablas previas) y reintentar.

- [ ] **🤖 Step 4: Verificar en Supabase dashboard**

  Esperar instrucción al usuario:

  > 🧑 USER ACTION: ir a Supabase dashboard → Table Editor → confirmar que existen las tablas `profiles`, `user_sessions`, `admin_audit_log`. Avisar al agente.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add supabase/migrations/
  git commit -m "feat(db): initial schema — profiles, user_sessions, admin_audit_log"
  ```

---

### Task 2.3: Migración — Triggers (handle_new_user, touch_updated_at)

**Files:**
- Create: `supabase/migrations/20260426000002_triggers.sql`

- [ ] **🤖 Step 1: Crear migración**

  ```bash
  npx supabase migration new triggers
  ```

- [ ] **🤖 Step 2: Escribir el SQL**

  ```sql
  -- ===========================================
  -- Triggers
  -- ===========================================

  -- Trigger genérico para updated_at
  CREATE OR REPLACE FUNCTION touch_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END $$;

  CREATE TRIGGER profiles_touch_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

  -- Trigger: cuando se crea auth.users → crear fila en profiles
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

  COMMENT ON FUNCTION handle_new_user() IS 'Crea fila en profiles cuando un nuevo usuario se registra en auth.users.';
  ```

- [ ] **🤖 Step 3: Aplicar migración**

  ```bash
  npx supabase db push
  ```

- [ ] **🤖 Step 4: Commit**

  ```bash
  git add supabase/migrations/
  git commit -m "feat(db): triggers for updated_at + new user profile creation"
  ```

---

### Task 2.4: Migración — RLS deny-by-default

**Files:**
- Create: `supabase/migrations/20260426000003_rls_policies.sql`

- [ ] **🤖 Step 1: Crear migración**

  ```bash
  npx supabase migration new rls_policies
  ```

- [ ] **🤖 Step 2: Escribir el SQL** 🔒

  ```sql
  -- ===========================================
  -- RLS deny-by-default + políticas explícitas
  -- ===========================================

  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

  -- profiles: usuario lee/edita el suyo; admin lee/edita todos
  CREATE POLICY profiles_select_own ON profiles
    FOR SELECT USING (auth.uid() = id);

  CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

  CREATE POLICY profiles_admin_all ON profiles
    FOR ALL
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

  -- user_sessions: usuario lee/borra las suyas; service_role escribe (no policy → bypass natural por service_role)
  CREATE POLICY sessions_select_own ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY sessions_delete_own ON user_sessions
    FOR DELETE USING (auth.uid() = user_id);

  -- admin_audit_log: solo admins leen; solo service_role escribe (vía SECURITY DEFINER)
  CREATE POLICY audit_admin_select ON admin_audit_log
    FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  ```

- [ ] **🤖 Step 3: Aplicar migración**

  ```bash
  npx supabase db push
  ```

- [ ] **🤖 Step 4: Verificar RLS habilitado**

  ```bash
  npx supabase db remote query "SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('profiles','user_sessions','admin_audit_log');"
  ```

  Esperado: cada fila con `relrowsecurity = t`.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add supabase/migrations/
  git commit -m "feat(db): RLS deny-by-default + own-row policies + admin override"
  ```

---

### Task 2.5: Migración — Función `promote_to_admin`

**Files:**
- Create: `supabase/migrations/20260426000004_admin_functions.sql`

- [ ] **🤖 Step 1: Crear migración**

  ```bash
  npx supabase migration new admin_functions
  ```

- [ ] **🤖 Step 2: Escribir el SQL** 🔒

  ```sql
  -- ===========================================
  -- Funciones administrativas (SECURITY DEFINER)
  -- ===========================================

  CREATE OR REPLACE FUNCTION promote_to_admin(target_user_id UUID, granted_by UUID)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, auth AS $$
  DECLARE
    granter_role TEXT;
  BEGIN
    -- Verificación: granted_by debe ser admin
    SELECT raw_app_meta_data->>'role' INTO granter_role
      FROM auth.users WHERE id = granted_by;

    IF granter_role IS DISTINCT FROM 'admin' THEN
      RAISE EXCEPTION 'Only admins can promote other admins';
    END IF;

    -- Actualizar metadata
    UPDATE auth.users
      SET raw_app_meta_data =
        COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role','admin')
      WHERE id = target_user_id;

    -- Audit
    INSERT INTO admin_audit_log (admin_id, action, target_type, target_id)
    VALUES (granted_by, 'promote_admin', 'user', target_user_id::text);
  END $$;

  REVOKE ALL ON FUNCTION promote_to_admin(UUID, UUID) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION promote_to_admin(UUID, UUID) TO service_role;

  COMMENT ON FUNCTION promote_to_admin(UUID, UUID) IS 'Promueve user_id a admin. Verifica que granted_by ya sea admin. Solo callable por service_role.';
  ```

- [ ] **🤖 Step 3: Aplicar migración**

  ```bash
  npx supabase db push
  ```

- [ ] **🤖 Step 4: Crear script para primer admin**

  `scripts/promote-first-admin.sql`:

  ```sql
  -- Ejecutar UNA SOLA VEZ desde Supabase dashboard → SQL Editor
  -- Reemplazar el correo con el del usuario administrador principal.

  UPDATE auth.users
    SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role','admin')
    WHERE email = 'TU_CORREO@ejemplo.com';

  -- Verificar
  SELECT id, email, raw_app_meta_data->>'role' AS role
    FROM auth.users WHERE email = 'TU_CORREO@ejemplo.com';
  ```

  **NOTA:** este script NO se ejecuta ahora. Se ejecuta DESPUÉS de que el usuario se registre en Task 6.x. El usuario lo correrá manualmente desde el SQL Editor del dashboard de Supabase.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add supabase/migrations/ scripts/promote-first-admin.sql
  git commit -m "feat(db): promote_to_admin function + first admin script"
  ```

---

### Task 2.6: Generar tipos TypeScript desde el schema

**Files:**
- Create: `lib/supabase/database.types.ts` (generado)

- [ ] **🤖 Step 1: Generar tipos**

  ```bash
  npx supabase gen types typescript --linked > lib/supabase/database.types.ts
  ```

  Esperado: archivo creado con `export type Database = { ... }`.

- [ ] **🤖 Step 2: Verificar contenido**

  ```bash
  head -20 lib/supabase/database.types.ts
  ```

  Esperado: ver `Database` con tablas `profiles`, `user_sessions`, `admin_audit_log`.

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add lib/supabase/database.types.ts
  git commit -m "feat(db): generate typescript types from supabase schema"
  ```

---

> ✅ **CHECKPOINT 2:** DB lista con 3 tablas, RLS habilitado, triggers funcionando, función promote_to_admin disponible. Tipos TS generados.

---

# Fase 3 — Clientes Supabase y helpers

### Task 3.1: Cliente Supabase del lado servidor (cookies)

**Files:**
- Create: `lib/supabase/server.ts`

**Contexto:** `@supabase/ssr` provee `createServerClient` que maneja cookies httpOnly+secure. Este cliente se usa en Server Components, Server Actions y Route Handlers.

- [ ] **🤖 Step 1: Crear `lib/supabase/server.ts`**

  ```ts
  import 'server-only';
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';
  import type { Database } from './database.types';

  export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server Component: cookies() es read-only.
              // Esto es seguro: el middleware refresca antes de llegar aquí.
            }
          },
        },
      }
    );
  }
  ```

- [ ] **🤖 Step 2: Commit**

  ```bash
  git add lib/supabase/server.ts
  git commit -m "feat(supabase): server-side client with cookie handling"
  ```

---

### Task 3.2: Cliente Supabase del lado navegador

**Files:**
- Create: `lib/supabase/client.ts`

- [ ] **🤖 Step 1: Crear `lib/supabase/client.ts`**

  ```ts
  'use client';
  import { createBrowserClient } from '@supabase/ssr';
  import type { Database } from './database.types';

  export function createClient() {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  ```

- [ ] **🤖 Step 2: Commit**

  ```bash
  git add lib/supabase/client.ts
  git commit -m "feat(supabase): browser-side client"
  ```

---

### Task 3.3: Cliente service-role (admin) — server-only

**Files:**
- Create: `lib/supabase/admin.ts`

🔒 **Crítico de seguridad:** este archivo importa `'server-only'` en la primera línea. Si alguien lo importa desde un Client Component, el build falla.

- [ ] **🤖 Step 1: Crear `lib/supabase/admin.ts`**

  ```ts
  import 'server-only';
  import { createClient } from '@supabase/supabase-js';
  import type { Database } from './database.types';

  /**
   * Cliente con service_role key.
   * SOLO usar para:
   *  - llamar funciones SECURITY DEFINER (promote_to_admin, etc.)
   *  - insertar en tablas que el usuario no debería modificar (admin_audit_log)
   *  - operaciones de auth.admin (signOut por refresh_token)
   *
   * NUNCA pasar este cliente a un Client Component ni regresarlo en una Route Handler.
   */
  export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  ```

- [ ] **🤖 Step 2: Crear script de verificación de bundle**

  `scripts/check-bundle-secrets.sh`:

  ```bash
  #!/usr/bin/env bash
  set -e
  echo "Checking that service_role key is not in client bundle..."

  if [ ! -d ".next/static" ]; then
    echo "ERROR: .next/static no existe. Correr 'npm run build' primero."
    exit 1
  fi

  # Patrones que NO deben aparecer en el bundle del cliente
  PATTERNS=(
    "SUPABASE_SERVICE_ROLE_KEY"
    "service_role"
  )

  FOUND=0
  for pattern in "${PATTERNS[@]}"; do
    if grep -r --include="*.js" -l "$pattern" .next/static; then
      echo "❌ LEAK: '$pattern' found in client bundle"
      FOUND=1
    fi
  done

  if [ $FOUND -eq 1 ]; then
    exit 1
  fi
  echo "✅ No secrets in client bundle"
  ```

  Hacerlo ejecutable:

  ```bash
  chmod +x scripts/check-bundle-secrets.sh
  ```

  (En Windows, esto se corre via Git Bash; el `chmod` es informativo.)

- [ ] **🤖 Step 3: Probar import** (validación rápida)

  Crear test temporal `tests/unit/admin-client.test.ts`:

  ```ts
  import { describe, it, expect } from 'vitest';

  describe('admin client', () => {
    it('exports without throwing in node env', async () => {
      const mod = await import('@/lib/supabase/admin');
      expect(mod.supabaseAdmin).toBeDefined();
    });
  });
  ```

  Ejecutar:

  ```bash
  npm run test:unit
  ```

  Esperado: pass. Si falla por env vars faltantes, agregar setup en `vitest.config.ts`:

  ```ts
  // dentro de defineConfig({test: {...}})
  setupFiles: ['./tests/setup.ts']
  ```

  Y `tests/setup.ts`:

  ```ts
  import { config } from 'dotenv';
  config({ path: '.env.local' });
  ```

- [ ] **🤖 Step 4: Commit**

  ```bash
  git add lib/supabase/admin.ts scripts/check-bundle-secrets.sh \
    tests/unit/admin-client.test.ts tests/setup.ts vitest.config.ts
  git commit -m "feat(supabase): admin client (server-only) + bundle leak check script"
  ```

---

### Task 3.4: Helper de Pwned Passwords (k-anonymity)

**Files:**
- Create: `lib/auth/pwned.ts`, `tests/unit/pwned.test.ts`

**Contexto:** la API de HIBP (haveibeenpwned.com) no requiere key. Usamos k-anonymity: enviamos solo los primeros 5 caracteres del SHA-1 del password.

- [ ] **🤖 Step 1: TDD — escribir test primero**

  `tests/unit/pwned.test.ts`:

  ```ts
  import { describe, it, expect } from 'vitest';
  import { isPwnedPassword } from '@/lib/auth/pwned';

  describe('isPwnedPassword', () => {
    it('detecta password muy común', async () => {
      // "password" — aparece en miles de breaches
      const pwned = await isPwnedPassword('password');
      expect(pwned).toBe(true);
    });

    it('acepta password único e improbable', async () => {
      // password aleatorio improbable de aparecer
      const pwned = await isPwnedPassword('xJ#4kL@9mNvB7zQ!eR3');
      expect(pwned).toBe(false);
    });
  });
  ```

- [ ] **🤖 Step 2: Correr test (debe fallar)**

  ```bash
  npm run test:unit -- pwned
  ```

  Esperado: FAIL `Cannot find module '@/lib/auth/pwned'`.

- [ ] **🤖 Step 3: Implementar `lib/auth/pwned.ts`**

  ```ts
  import 'server-only';

  /**
   * Verifica si la password aparece en breaches públicos vía HIBP API.
   * Usa k-anonymity: solo los primeros 5 caracteres del SHA-1 viajan a la red.
   */
  export async function isPwnedPassword(password: string): Promise<boolean> {
    const sha1 = await sha1Hex(password);
    const prefix = sha1.slice(0, 5).toUpperCase();
    const suffix = sha1.slice(5).toUpperCase();

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      // 5 segundos timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      // En caso de fallo de la API, no bloqueamos al usuario.
      // Aceptamos que es mejor permitir registro que bloquearlo.
      console.warn('[pwned] HIBP API failure', res.status);
      return false;
    }

    const text = await res.text();
    return text.split('\n').some((line) => line.split(':')[0] === suffix);
  }

  async function sha1Hex(input: string): Promise<string> {
    const buf = new TextEncoder().encode(input);
    const hash = await crypto.subtle.digest('SHA-1', buf);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  ```

- [ ] **🤖 Step 4: Correr test**

  ```bash
  npm run test:unit -- pwned
  ```

  Esperado: 2 passed. (Requiere conexión a internet.)

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add lib/auth/pwned.ts tests/unit/pwned.test.ts
  git commit -m "feat(auth): pwned password check via HIBP k-anonymity API"
  ```

---

### Task 3.5: Helper para device label legible

**Files:**
- Create: `lib/utils/device-label.ts`, `tests/unit/device-label.test.ts`

- [ ] **🤖 Step 1: TDD — test primero**

  `tests/unit/device-label.test.ts`:

  ```ts
  import { describe, it, expect } from 'vitest';
  import { deviceLabelFromUA } from '@/lib/utils/device-label';

  describe('deviceLabelFromUA', () => {
    it('detecta Chrome en Windows', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      expect(deviceLabelFromUA(ua)).toBe('Chrome en Windows');
    });

    it('detecta Safari en iPhone', () => {
      const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
      expect(deviceLabelFromUA(ua)).toBe('Safari en iPhone');
    });

    it('UA desconocido devuelve "Dispositivo"', () => {
      expect(deviceLabelFromUA('weird-bot/1.0')).toBe('Dispositivo desconocido');
    });

    it('vacío devuelve "Dispositivo desconocido"', () => {
      expect(deviceLabelFromUA('')).toBe('Dispositivo desconocido');
      expect(deviceLabelFromUA(undefined)).toBe('Dispositivo desconocido');
    });
  });
  ```

- [ ] **🤖 Step 2: Correr test**

  ```bash
  npm run test:unit -- device-label
  ```

  Esperado: FAIL.

- [ ] **🤖 Step 3: Implementar**

  `lib/utils/device-label.ts`:

  ```ts
  /**
   * Genera una etiqueta legible "Browser en OS" desde User-Agent.
   * NO se usa para fingerprinting; solo para mostrar al usuario en
   * "Mis dispositivos".
   */
  export function deviceLabelFromUA(ua: string | null | undefined): string {
    if (!ua) return 'Dispositivo desconocido';

    const browser = detectBrowser(ua);
    const os = detectOS(ua);

    if (browser === 'desconocido' && os === 'desconocido') {
      return 'Dispositivo desconocido';
    }

    return `${cap(browser)} en ${cap(os)}`;
  }

  function detectBrowser(ua: string): string {
    if (/Edg\//.test(ua)) return 'Edge';
    if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return 'Safari';
    if (/OPR\//.test(ua)) return 'Opera';
    return 'desconocido';
  }

  function detectOS(ua: string): string {
    if (/Windows NT/.test(ua)) return 'Windows';
    if (/iPhone/.test(ua)) return 'iPhone';
    if (/iPad/.test(ua)) return 'iPad';
    if (/Android/.test(ua)) return 'Android';
    if (/Macintosh/.test(ua)) return 'Mac';
    if (/Linux/.test(ua)) return 'Linux';
    return 'desconocido';
  }

  function cap(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  ```

- [ ] **🤖 Step 4: Correr test**

  ```bash
  npm run test:unit -- device-label
  ```

  Esperado: 4 passed.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add lib/utils/device-label.ts tests/unit/device-label.test.ts
  git commit -m "feat(utils): device label parser from User-Agent"
  ```

---

> ✅ **CHECKPOINT 3:** Clientes Supabase listos, helpers seguros (pwned, device-label) con tests unitarios passing.

---

# Fase 4 — Validación y rate limiting

### Task 4.1: Schemas Zod centralizados

**Files:**
- Create: `lib/validation/schemas.ts`, `tests/unit/schemas.test.ts`

- [ ] **🤖 Step 1: TDD — test primero**

  `tests/unit/schemas.test.ts`:

  ```ts
  import { describe, it, expect } from 'vitest';
  import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    completeProfileSchema,
  } from '@/lib/validation/schemas';

  describe('registerSchema', () => {
    const valid = {
      full_name: 'Ana García',
      email: 'ana@example.com',
      password: 'Securepass1',
      phone: '+52 55 1234 5678',
      exam_target: 'UNAM',
      accept_terms: true,
    };

    it('acepta input válido', () => {
      expect(() => registerSchema.parse(valid)).not.toThrow();
    });

    it('rechaza email inválido', () => {
      expect(() => registerSchema.parse({ ...valid, email: 'no-es-email' })).toThrow();
    });

    it('rechaza password corto', () => {
      expect(() => registerSchema.parse({ ...valid, password: '1234567' })).toThrow();
    });

    it('rechaza exam_target fuera del enum', () => {
      expect(() => registerSchema.parse({ ...valid, exam_target: 'HARVARD' })).toThrow();
    });

    it('rechaza props desconocidas (strict mode)', () => {
      expect(() => registerSchema.parse({ ...valid, evil_field: 'xss' })).toThrow();
    });

    it('rechaza accept_terms=false', () => {
      expect(() => registerSchema.parse({ ...valid, accept_terms: false })).toThrow();
    });

    it('rechaza phone con caracteres inválidos', () => {
      expect(() => registerSchema.parse({ ...valid, phone: 'abc<script>' })).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('acepta email y password', () => {
      expect(() =>
        loginSchema.parse({ email: 'a@b.com', password: 'whatever' })
      ).not.toThrow();
    });

    it('rechaza props extra', () => {
      expect(() =>
        loginSchema.parse({ email: 'a@b.com', password: 'x', evil: 1 })
      ).toThrow();
    });
  });

  describe('resetPasswordSchema', () => {
    it('acepta password fuerte', () => {
      expect(() => resetPasswordSchema.parse({ password: 'NewPass123' })).not.toThrow();
    });

    it('rechaza password corto', () => {
      expect(() => resetPasswordSchema.parse({ password: 'short' })).toThrow();
    });
  });
  ```

- [ ] **🤖 Step 2: Correr test (debe fallar)**

  ```bash
  npm run test:unit -- schemas
  ```

- [ ] **🤖 Step 3: Implementar**

  `lib/validation/schemas.ts`:

  ```ts
  import { z } from 'zod';

  const phoneRegex = /^\+?[0-9 \-()]{8,20}$/;
  const examEnum = z.enum(['UNAM', 'IPN', 'UAM', 'COMIPEMS', 'EXANI', 'undecided']);

  // Campo password reusable
  const passwordField = z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña es demasiado larga');

  export const registerSchema = z
    .object({
      full_name: z.string().trim().min(2, 'Nombre muy corto').max(120),
      email: z.string().email('Correo inválido').max(254),
      password: passwordField,
      phone: z.string().regex(phoneRegex, 'Teléfono inválido'),
      exam_target: examEnum,
      accept_terms: z
        .boolean()
        .refine((v) => v === true, 'Debes aceptar los términos'),
    })
    .strict();

  export type RegisterInput = z.infer<typeof registerSchema>;

  export const loginSchema = z
    .object({
      email: z.string().email().max(254),
      password: z.string().min(1).max(128),
      remember: z.boolean().optional(),
    })
    .strict();

  export type LoginInput = z.infer<typeof loginSchema>;

  export const forgotPasswordSchema = z
    .object({
      email: z.string().email().max(254),
    })
    .strict();

  export const resetPasswordSchema = z
    .object({
      password: passwordField,
    })
    .strict();

  export const completeProfileSchema = z
    .object({
      phone: z.string().regex(phoneRegex),
      exam_target: examEnum.refine((v) => v !== 'undecided', 'Selecciona un examen'),
    })
    .strict();

  export const updateProfileSchema = z
    .object({
      full_name: z.string().trim().min(2).max(120).optional(),
      phone: z.string().regex(phoneRegex).optional(),
      exam_target: examEnum.optional(),
      career_target: z.string().max(120).nullable().optional(),
      course_start_date: z.string().datetime({ offset: true }).nullable().optional(),
      exam_date: z.string().datetime({ offset: true }).nullable().optional(),
      course_end_date: z.string().datetime({ offset: true }).nullable().optional(),
    })
    .strict();
  ```

- [ ] **🤖 Step 4: Correr test**

  ```bash
  npm run test:unit -- schemas
  ```

  Esperado: 11 passed.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add lib/validation/schemas.ts tests/unit/schemas.test.ts
  git commit -m "feat(validation): zod schemas for all auth + profile inputs"
  ```

---

### Task 4.2: Rate limiting con Upstash

**Files:**
- Create: `lib/rate-limit.ts`

- [ ] **🤖 Step 1: Crear `lib/rate-limit.ts`**

  ```ts
  import 'server-only';
  import { Redis } from '@upstash/redis';
  import { Ratelimit } from '@upstash/ratelimit';

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  export const limiters = {
    login: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'rl:login',
      analytics: true,
    }),
    register: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      prefix: 'rl:register',
      analytics: true,
    }),
    forgotPassword: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      prefix: 'rl:forgot',
      analytics: true,
    }),
    apiAuthenticated: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      prefix: 'rl:api',
      analytics: true,
    }),
  } as const;

  /**
   * Determina la IP del request. Vercel usa x-forwarded-for.
   */
  export function getClientIp(headers: Headers): string {
    return (
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      'unknown'
    );
  }

  /**
   * Rate-limit por (ip + identifier). Returns true si OK, false si excedido.
   */
  export async function checkLimit(
    limiter: Ratelimit,
    keyParts: (string | null | undefined)[]
  ): Promise<{ ok: boolean; remaining: number; reset: number }> {
    const key = keyParts.filter(Boolean).join(':') || 'unknown';
    const result = await limiter.limit(key);
    return {
      ok: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  }
  ```

- [ ] **🤖 Step 2: Test rápido (manual)**

  Crear `tests/integration/rate-limit.test.ts`:

  ```ts
  import { describe, it, expect } from 'vitest';
  import { limiters, checkLimit } from '@/lib/rate-limit';

  describe('rate-limit', () => {
    it('permite hasta 5 logins en 15 min', async () => {
      const key = `test-${Date.now()}`;

      for (let i = 0; i < 5; i++) {
        const r = await checkLimit(limiters.login, [key]);
        expect(r.ok).toBe(true);
      }

      const sixth = await checkLimit(limiters.login, [key]);
      expect(sixth.ok).toBe(false);
    });
  });
  ```

  Ejecutar (requiere `.env.local` con Upstash creds):

  ```bash
  npm run test:integration
  ```

  Esperado: pass.

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add lib/rate-limit.ts tests/integration/rate-limit.test.ts
  git commit -m "feat(rate-limit): upstash sliding window limiters"
  ```

---

> ✅ **CHECKPOINT 4:** Validación Zod y rate limiting listos. Tests passing.

---

# Fase 5 — Middleware y headers de seguridad

### Task 5.1: Helpers de headers de seguridad

**Files:**
- Create: `lib/security/headers.ts`

- [ ] **🤖 Step 1: Crear `lib/security/headers.ts`** 🔒

  ```ts
  /**
   * Devuelve el CSP estricto con nonce.
   * El nonce se genera fresh por request y se inyecta en cualquier
   * <script> que necesite ejecutarse inline.
   */
  export function buildCSP(nonce: string): string {
    const directives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https://*.supabase.co'],
      'connect-src': ["'self'", 'https://*.supabase.co'],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'object-src': ["'none'"],
      'upgrade-insecure-requests': [],
    } as const;

    return Object.entries(directives)
      .map(([key, vals]) => (vals.length ? `${key} ${vals.join(' ')}` : key))
      .join('; ');
  }

  export const securityHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  } as const;

  export function generateNonce(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes));
  }
  ```

- [ ] **🤖 Step 2: Commit**

  ```bash
  git add lib/security/headers.ts
  git commit -m "feat(security): security headers + CSP builder with nonce"
  ```

---

### Task 5.2: Middleware principal

**Files:**
- Create: `middleware.ts` (en raíz, no dentro de `app/`)

- [ ] **🤖 Step 1: Crear `middleware.ts`**

  ```ts
  import { NextResponse, type NextRequest } from 'next/server';
  import { createServerClient } from '@supabase/ssr';
  import { buildCSP, securityHeaders, generateNonce } from '@/lib/security/headers';

  const PROTECTED_PREFIXES = ['/dashboard', '/cursos', '/lecciones', '/simulacros', '/perfil'];
  const ADMIN_PREFIX = '/admin';
  const GUEST_ONLY_PATHS = ['/login', '/register'];

  export async function middleware(req: NextRequest) {
    const nonce = generateNonce();
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-nonce', nonce);

    let response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // 1. Refresh de sesión Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            response = NextResponse.next({ request: { headers: requestHeaders } });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const path = req.nextUrl.pathname;

    // 2. Rutas protegidas requieren auth + email confirmado
    if (PROTECTED_PREFIXES.some((p) => path.startsWith(p))) {
      if (!user) {
        const url = new URL('/login', req.url);
        url.searchParams.set('next', path);
        return NextResponse.redirect(url);
      }
      if (!user.email_confirmed_at) {
        return NextResponse.redirect(new URL('/verify-email', req.url));
      }
    }

    // 3. Admin gate
    if (path.startsWith(ADMIN_PREFIX)) {
      const role = (user?.app_metadata as { role?: string } | undefined)?.role;
      if (!user) return NextResponse.redirect(new URL('/login', req.url));
      if (role !== 'admin') return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 4. Rutas guest-only (login, register)
    if (GUEST_ONLY_PATHS.includes(path) && user) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 5. Headers de seguridad
    response.headers.set('Content-Security-Policy', buildCSP(nonce));
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  export const config = {
    matcher: [
      // Aplica a todas las rutas excepto:
      '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
  };
  ```

- [ ] **🤖 Step 2: Probar middleware con curl**

  ```bash
  npm run dev
  ```

  En otra terminal:

  ```bash
  curl -I http://localhost:3000/
  ```

  Esperado: respuesta `200` con headers `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, etc.

  Detener `npm run dev`.

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add middleware.ts
  git commit -m "feat(security): middleware with auth refresh + admin gate + headers"
  ```

---

### Task 5.3: vercel.json con headers backup

**Files:**
- Create: `vercel.json`

**Contexto:** los headers de Next middleware solo se aplican a respuestas que pasan por el middleware. Para assets estáticos (imágenes, fonts), Vercel los sirve directamente. `vercel.json` aplica headers a esos también.

- [ ] **🤖 Step 1: Crear `vercel.json`**

  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=63072000; includeSubDomains; preload"
          },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          {
            "key": "Permissions-Policy",
            "value": "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ]
  }
  ```

- [ ] **🤖 Step 2: Commit**

  ```bash
  git add vercel.json
  git commit -m "feat(security): vercel.json security headers as backup"
  ```

---

> ✅ **CHECKPOINT 5:** Middleware funcional con headers de seguridad. Validar con `curl -I` que CSP, HSTS, X-Frame-Options están presentes.

---

# Fase 6 — Páginas de Auth y Server Actions

> **Nota de migración UI:** las páginas de auth existen en HTML estático (`login.html`, `register.html`). Vamos a portar el markup a JSX y conectarlo a Supabase. El CSS se migra completo en Task 8.1.

### Task 6.1: Página de registro

**Files:**
- Create: `app/(auth)/layout.tsx`, `app/(auth)/register/page.tsx`, `app/(auth)/register/actions.ts`

- [ ] **🤖 Step 1: Crear layout del grupo `(auth)`**

  `app/(auth)/layout.tsx`:

  ```tsx
  export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-blob aurora-blob--1"></div>
          <div className="aurora-blob aurora-blob--2"></div>
          <div className="grid-overlay"></div>
        </div>
        <div className="auth-layout">{children}</div>
      </>
    );
  }
  ```

- [ ] **🤖 Step 2: Crear Server Action `app/(auth)/register/actions.ts`**

  ```ts
  'use server';

  import { redirect } from 'next/navigation';
  import { headers } from 'next/headers';
  import { createClient } from '@/lib/supabase/server';
  import { registerSchema } from '@/lib/validation/schemas';
  import { isPwnedPassword } from '@/lib/auth/pwned';
  import { limiters, checkLimit, getClientIp } from '@/lib/rate-limit';

  export type RegisterState = { error?: string; fieldErrors?: Record<string, string> };

  export async function registerAction(
    _prev: RegisterState,
    formData: FormData
  ): Promise<RegisterState> {
    // 1. Parse + validar
    const raw = Object.fromEntries(formData.entries());
    // accept_terms viene como "on" o ausente
    const parsed = registerSchema.safeParse({
      full_name: raw.full_name,
      email: raw.email,
      password: raw.password,
      phone: raw.phone,
      exam_target: raw.exam_target,
      accept_terms: raw.accept_terms === 'on',
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      return { fieldErrors };
    }

    const data = parsed.data;

    // 2. Rate limit
    const h = await headers();
    const ip = getClientIp(h);
    const rl = await checkLimit(limiters.register, [ip]);
    if (!rl.ok) {
      return { error: 'Demasiados intentos. Intenta más tarde.' };
    }

    // 3. Pwned password check
    if (await isPwnedPassword(data.password)) {
      return {
        fieldErrors: {
          password: 'Esa contraseña aparece en filtraciones públicas. Usa otra.',
        },
      };
    }

    // 4. Sign up
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${siteUrl}/api/auth/callback?next=/dashboard`,
        data: {
          full_name: data.full_name,
          phone: data.phone,
          exam_target: data.exam_target,
        },
      },
    });

    if (error) {
      // No filtrar si el correo ya existe (anti-enumeration)
      console.error('[register] supabase error', error);
      return { error: 'No fue posible crear la cuenta. Intenta de nuevo.' };
    }

    redirect('/verify-email?email=' + encodeURIComponent(data.email));
  }
  ```

- [ ] **🤖 Step 3: Crear página `app/(auth)/register/page.tsx`**

  ```tsx
  'use client';

  import { useFormState, useFormStatus } from 'react-dom';
  import { registerAction, type RegisterState } from './actions';

  const initialState: RegisterState = {};

  export default function RegisterPage() {
    const [state, formAction] = useFormState(registerAction, initialState);

    return (
      <section className="auth-panel">
        <a href="/" className="logo auth-logo">
          <span className="logo__text">CEFI<span className="logo__accent">TIPS</span></span>
        </a>

        <h1 className="auth-title">Crea tu cuenta</h1>
        <p className="auth-sub">Acceso a la plataforma una vez confirmes tu pago.</p>

        <form action={formAction} noValidate>
          <FormField
            label="Nombre completo"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            error={state.fieldErrors?.full_name}
          />
          <FormField
            label="Correo electrónico"
            name="email"
            type="email"
            autoComplete="email"
            required
            error={state.fieldErrors?.email}
          />
          <FormField
            label="Teléfono"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+52 55 1234 5678"
            error={state.fieldErrors?.phone}
          />
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            helper="Mínimo 8 caracteres"
            error={state.fieldErrors?.password}
          />

          <div className="form-field">
            <label htmlFor="exam_target">¿Qué examen vas a presentar?</label>
            <select id="exam_target" name="exam_target" required defaultValue="">
              <option value="" disabled>Selecciona uno</option>
              <option value="UNAM">UNAM</option>
              <option value="IPN">IPN</option>
              <option value="UAM">UAM</option>
              <option value="COMIPEMS">COMIPEMS</option>
              <option value="EXANI">EXANI-II (CENEVAL)</option>
              <option value="undecided">Aún no decido</option>
            </select>
            {state.fieldErrors?.exam_target && (
              <span className="error">{state.fieldErrors.exam_target}</span>
            )}
          </div>

          <label className="checkbox">
            <input type="checkbox" name="accept_terms" required />
            <span>Acepto los <a href="/terminos" className="inline-link">Términos</a> y el <a href="/privacidad" className="inline-link">Aviso de privacidad</a></span>
          </label>
          {state.fieldErrors?.accept_terms && (
            <span className="error">{state.fieldErrors.accept_terms}</span>
          )}

          {state.error && <div className="alert alert--error" role="alert">{state.error}</div>}

          <SubmitButton />

          <p className="auth-footer">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </form>
      </section>
    );
  }

  function FormField({
    label, name, type, autoComplete, required, helper, error, placeholder,
  }: {
    label: string;
    name: string;
    type: string;
    autoComplete?: string;
    required?: boolean;
    helper?: string;
    error?: string;
    placeholder?: string;
  }) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
        {helper && !error && <span className="helper">{helper}</span>}
        {error && <span className="error" role="alert">{error}</span>}
      </div>
    );
  }

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={pending}>
        {pending ? 'Creando cuenta...' : 'Crear mi cuenta'}
      </button>
    );
  }
  ```

- [ ] **🤖 Step 4: Probar manualmente**

  ```bash
  npm run dev
  ```

  Visitar http://localhost:3000/register. Llenar el formulario con datos válidos. Esperado: redirect a `/verify-email?email=...`. Verificar en Supabase dashboard → Authentication → Users que el usuario aparece pero `email_confirmed_at = null`.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add "app/(auth)/"
  git commit -m "feat(auth): registration page + server action with zod + pwned check"
  ```

---

### Task 6.2: Página de login

**Files:**
- Create: `app/(auth)/login/page.tsx`, `app/(auth)/login/actions.ts`

- [ ] **🤖 Step 1: Crear Server Action `app/(auth)/login/actions.ts`**

  ```ts
  'use server';

  import { redirect } from 'next/navigation';
  import { headers } from 'next/headers';
  import { createClient } from '@/lib/supabase/server';
  import { loginSchema } from '@/lib/validation/schemas';
  import { limiters, checkLimit, getClientIp } from '@/lib/rate-limit';
  import { enforceDeviceLimit } from '@/lib/auth/multi-device';

  export type LoginState = { error?: string };

  export async function loginAction(
    _prev: LoginState,
    formData: FormData
  ): Promise<LoginState> {
    const raw = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse({
      email: raw.email,
      password: raw.password,
      remember: raw.remember === 'on',
    });

    if (!parsed.success) return { error: 'Correo o contraseña inválidos.' };
    const { email, password } = parsed.data;

    const h = await headers();
    const ip = getClientIp(h);
    const rl = await checkLimit(limiters.login, [email, ip]);
    if (!rl.ok) {
      return { error: 'Demasiados intentos. Intenta en 15 minutos.' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      // Mensaje genérico anti-enumeration
      return { error: 'Correo o contraseña inválidos.' };
    }

    // Enforce 3-device limit
    await enforceDeviceLimit({
      userId: data.user.id,
      refreshToken: data.session.refresh_token,
      ip,
      userAgent: h.get('user-agent') || '',
    });

    const next = (formData.get('next') as string | null) || '/dashboard';
    redirect(next.startsWith('/') ? next : '/dashboard');
  }
  ```

- [ ] **🤖 Step 2: Crear página `app/(auth)/login/page.tsx`**

  ```tsx
  'use client';

  import { useFormState, useFormStatus } from 'react-dom';
  import { useSearchParams } from 'next/navigation';
  import { loginAction, type LoginState } from './actions';

  const initialState: LoginState = {};

  export default function LoginPage() {
    const params = useSearchParams();
    const next = params.get('next') ?? '/dashboard';
    const [state, formAction] = useFormState(loginAction, initialState);

    return (
      <section className="auth-panel">
        <a href="/" className="logo auth-logo">
          <span className="logo__text">CEFI<span className="logo__accent">TIPS</span></span>
        </a>

        <h1 className="auth-title">Bienvenido de vuelta</h1>
        <p className="auth-sub">Entra a tu cuenta para continuar.</p>

        <form action={formAction} noValidate>
          <input type="hidden" name="next" value={next} />

          <div className="form-field">
            <label htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>

          <div className="form-row">
            <label className="checkbox">
              <input type="checkbox" name="remember" defaultChecked />
              <span>Mantener sesión iniciada</span>
            </label>
            <a href="/forgot-password" className="forgot">¿Olvidaste tu contraseña?</a>
          </div>

          {state.error && <div className="alert alert--error" role="alert">{state.error}</div>}

          <SubmitButton />

          <div className="auth-divider">o continúa con</div>
          <GoogleButton next={next} />

          <p className="auth-footer">
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </p>
        </form>
      </section>
    );
  }

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={pending}>
        {pending ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    );
  }

  function GoogleButton({ next }: { next: string }) {
    const handleClick = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
    };
    return (
      <button type="button" className="social-btn" onClick={handleClick}>
        Continuar con Google
      </button>
    );
  }
  ```

- [ ] **🤖 Step 3: Commit (primera versión)**

  ```bash
  git add "app/(auth)/login/"
  git commit -m "feat(auth): login page + server action (multi-device hook stubbed)"
  ```

> Nota: este commit deja un import a `@/lib/auth/multi-device` que aún no existe. Lo creamos en Fase 7. Si `npm run typecheck` falla, es esperado y se resuelve allí.

---

### Task 6.3: Forgot + Reset password

**Files:**
- Create: `app/(auth)/forgot-password/page.tsx`, `app/(auth)/forgot-password/actions.ts`, `app/(auth)/reset-password/page.tsx`, `app/(auth)/reset-password/actions.ts`

- [ ] **🤖 Step 1: Forgot password — Server Action**

  `app/(auth)/forgot-password/actions.ts`:

  ```ts
  'use server';

  import { headers } from 'next/headers';
  import { createClient } from '@/lib/supabase/server';
  import { forgotPasswordSchema } from '@/lib/validation/schemas';
  import { limiters, checkLimit, getClientIp } from '@/lib/rate-limit';

  export type ForgotState = { ok?: boolean; error?: string };

  export async function forgotPasswordAction(
    _prev: ForgotState,
    formData: FormData
  ): Promise<ForgotState> {
    const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { error: 'Correo inválido.' };

    const h = await headers();
    const ip = getClientIp(h);
    const rl = await checkLimit(limiters.forgotPassword, [parsed.data.email, ip]);
    if (!rl.ok) return { error: 'Demasiados intentos. Intenta en una hora.' };

    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    // Siempre devolver OK (anti-enumeration)
    return { ok: true };
  }
  ```

- [ ] **🤖 Step 2: Forgot password — página**

  `app/(auth)/forgot-password/page.tsx`:

  ```tsx
  'use client';

  import { useFormState, useFormStatus } from 'react-dom';
  import { forgotPasswordAction, type ForgotState } from './actions';

  const initial: ForgotState = {};

  export default function ForgotPasswordPage() {
    const [state, formAction] = useFormState(forgotPasswordAction, initial);

    if (state.ok) {
      return (
        <section className="auth-panel">
          <h1 className="auth-title">Revisa tu correo</h1>
          <p className="auth-sub">Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.</p>
          <a href="/login" className="btn btn--ghost btn--full">Volver al inicio</a>
        </section>
      );
    }

    return (
      <section className="auth-panel">
        <h1 className="auth-title">Restablecer contraseña</h1>
        <p className="auth-sub">Te enviaremos un enlace por correo.</p>
        <form action={formAction} noValidate>
          <div className="form-field">
            <label htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          {state.error && <div className="alert alert--error">{state.error}</div>}
          <Submit />
          <p className="auth-footer">
            <a href="/login">Cancelar</a>
          </p>
        </form>
      </section>
    );
  }

  function Submit() {
    const { pending } = useFormStatus();
    return (
      <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={pending}>
        {pending ? 'Enviando...' : 'Enviar enlace'}
      </button>
    );
  }
  ```

- [ ] **🤖 Step 3: Reset password — Server Action**

  `app/(auth)/reset-password/actions.ts`:

  ```ts
  'use server';

  import { redirect } from 'next/navigation';
  import { createClient } from '@/lib/supabase/server';
  import { supabaseAdmin } from '@/lib/supabase/admin';
  import { resetPasswordSchema } from '@/lib/validation/schemas';
  import { isPwnedPassword } from '@/lib/auth/pwned';

  export type ResetState = { error?: string };

  export async function resetPasswordAction(
    _prev: ResetState,
    formData: FormData
  ): Promise<ResetState> {
    const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
      return { error: 'La contraseña debe tener al menos 8 caracteres.' };
    }

    if (await isPwnedPassword(parsed.data.password)) {
      return { error: 'Esa contraseña aparece en filtraciones. Usa otra.' };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Sesión expirada. Solicita el enlace de nuevo.' };

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) return { error: 'No se pudo actualizar la contraseña.' };

    // Invalidar TODAS las demás sesiones del usuario (las que no son la actual)
    await supabaseAdmin.auth.admin.signOut(user.id, 'others');

    redirect('/dashboard');
  }
  ```

  > Nota: `signOut(userId, 'others')` requiere `@supabase/supabase-js` ≥ 2.45. Si la API en runtime es distinta, ajustar a la versión instalada.

- [ ] **🤖 Step 4: Reset password — página**

  `app/(auth)/reset-password/page.tsx`:

  ```tsx
  'use client';

  import { useFormState, useFormStatus } from 'react-dom';
  import { resetPasswordAction, type ResetState } from './actions';

  const initial: ResetState = {};

  export default function ResetPasswordPage() {
    const [state, formAction] = useFormState(resetPasswordAction, initial);

    return (
      <section className="auth-panel">
        <h1 className="auth-title">Nueva contraseña</h1>
        <form action={formAction} noValidate>
          <div className="form-field">
            <label htmlFor="password">Nueva contraseña</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
            <span className="helper">Mínimo 8 caracteres</span>
          </div>
          {state.error && <div className="alert alert--error">{state.error}</div>}
          <Submit />
        </form>
      </section>
    );
  }

  function Submit() {
    const { pending } = useFormStatus();
    return (
      <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={pending}>
        {pending ? 'Guardando...' : 'Actualizar contraseña'}
      </button>
    );
  }
  ```

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add "app/(auth)/forgot-password/" "app/(auth)/reset-password/"
  git commit -m "feat(auth): forgot + reset password flows"
  ```

---

### Task 6.4: Página verify-email + callback de OAuth/email

**Files:**
- Create: `app/(auth)/verify-email/page.tsx`, `app/api/auth/callback/route.ts`

- [ ] **🤖 Step 1: Página verify-email**

  `app/(auth)/verify-email/page.tsx`:

  ```tsx
  export default function VerifyEmailPage({
    searchParams,
  }: {
    searchParams: { email?: string };
  }) {
    return (
      <section className="auth-panel">
        <h1 className="auth-title">Confirma tu correo</h1>
        <p className="auth-sub">
          Te enviamos un enlace de confirmación{searchParams.email ? ` a ${searchParams.email}` : ''}.
          Revisa tu bandeja (y spam).
        </p>
        <p className="auth-footer">
          ¿Ya confirmaste? <a href="/login">Inicia sesión</a>
        </p>
      </section>
    );
  }
  ```

- [ ] **🤖 Step 2: Route handler para callback**

  `app/api/auth/callback/route.ts`:

  ```ts
  import { NextRequest, NextResponse } from 'next/server';
  import { createClient } from '@/lib/supabase/server';
  import { enforceDeviceLimit } from '@/lib/auth/multi-device';
  import { getClientIp } from '@/lib/rate-limit';

  export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const next = url.searchParams.get('next') ?? '/dashboard';

    if (!code) return NextResponse.redirect(new URL('/login?error=missing_code', req.url));

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      return NextResponse.redirect(new URL('/login?error=invalid_code', req.url));
    }

    // Multi-device tracking
    await enforceDeviceLimit({
      userId: data.user.id,
      refreshToken: data.session.refresh_token,
      ip: getClientIp(req.headers),
      userAgent: req.headers.get('user-agent') || '',
    });

    // Si el usuario llegó vía Google y le falta phone/exam_target, mandarlo a completar
    const meta = data.user.user_metadata as { phone?: string | null; exam_target?: string };
    const needsCompletion = !meta?.phone || !meta?.exam_target || meta.exam_target === 'undecided';
    if (needsCompletion) {
      // Verificar contra profiles (más confiable)
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone, exam_target')
        .eq('id', data.user.id)
        .single();
      if (!profile?.phone || !profile.exam_target || profile.exam_target === 'undecided') {
        return NextResponse.redirect(new URL('/perfil/completar?next=' + encodeURIComponent(next), req.url));
      }
    }

    return NextResponse.redirect(new URL(next, req.url));
  }
  ```

- [ ] **🤖 Step 3: Configurar Google OAuth en Supabase**

  > 🧑 **USER ACTION:**
  >
  > 1. Ir a https://console.cloud.google.com → "Select a project" → "New Project" → Name: `cefitips-auth` → Create
  > 2. Habilitar Google+ API: APIs & Services → Library → buscar "Google+ API" → Enable
  > 3. APIs & Services → OAuth consent screen → External → fill required fields:
  >    - App name: `CEFITIPS`
  >    - User support email: tu correo
  >    - Developer contact: tu correo
  >    - Scopes: agregar `email`, `profile`, `openid`
  > 4. APIs & Services → Credentials → Create Credentials → OAuth client ID:
  >    - Application type: Web application
  >    - Name: `cefitips-supabase`
  >    - Authorized JavaScript origins:
  >      - `http://localhost:3000`
  >      - `https://YOUR_SUPABASE_PROJECT.supabase.co`
  >    - Authorized redirect URIs:
  >      - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
  > 5. Copiar **Client ID** y **Client Secret**
  > 6. En Supabase dashboard → Authentication → Providers → Google → habilitar → pegar Client ID y Client Secret → Save
  > 7. Avisar al agente cuando termine

- [ ] **🤖 Step 4: Commit**

  ```bash
  git add "app/(auth)/verify-email/" app/api/auth/callback/
  git commit -m "feat(auth): verify-email page + oauth/email callback handler"
  ```

---

> ✅ **CHECKPOINT 6:** Auth completo (registro, login, forgot, reset, verify, Google OAuth). NO funciona aún end-to-end porque falta `enforceDeviceLimit` (Fase 7).

---

# Fase 7 — Multi-device session enforcement

### Task 7.1: Implementar `enforceDeviceLimit`

**Files:**
- Create: `lib/auth/multi-device.ts`, `tests/integration/multi-device.test.ts`

- [ ] **🤖 Step 1: TDD — test de integración primero**

  `tests/integration/multi-device.test.ts`:

  ```ts
  import { describe, it, expect, beforeAll, afterEach } from 'vitest';
  import { supabaseAdmin } from '@/lib/supabase/admin';
  import { enforceDeviceLimit } from '@/lib/auth/multi-device';

  let testUserId: string;

  beforeAll(async () => {
    // Crear usuario de prueba con admin client
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword1',
      email_confirm: true,
      user_metadata: { full_name: 'Test User', phone: '+525500000000', exam_target: 'UNAM' },
    });
    if (error) throw error;
    testUserId = data.user.id;
  });

  afterEach(async () => {
    await supabaseAdmin.from('user_sessions').delete().eq('user_id', testUserId);
  });

  describe('enforceDeviceLimit', () => {
    it('inserta hasta 3 sesiones sin borrar', async () => {
      for (let i = 0; i < 3; i++) {
        await enforceDeviceLimit({
          userId: testUserId,
          refreshToken: `token-${i}`,
          ip: '1.2.3.4',
          userAgent: `agent-${i}`,
        });
      }

      const { data } = await supabaseAdmin
        .from('user_sessions')
        .select('id')
        .eq('user_id', testUserId);
      expect(data).toHaveLength(3);
    });

    it('al insertar la 4a, elimina la más antigua', async () => {
      for (let i = 0; i < 4; i++) {
        await enforceDeviceLimit({
          userId: testUserId,
          refreshToken: `token-${i}`,
          ip: '1.2.3.4',
          userAgent: `agent-${i}`,
        });
        await new Promise((r) => setTimeout(r, 10)); // espaciar last_seen_at
      }

      const { data } = await supabaseAdmin
        .from('user_sessions')
        .select('user_agent')
        .eq('user_id', testUserId)
        .order('created_at', { ascending: true });

      expect(data).toHaveLength(3);
      // La más antigua (agent-0) debe haber sido eliminada
      expect(data?.find((r) => r.user_agent === 'agent-0')).toBeUndefined();
      expect(data?.find((r) => r.user_agent === 'agent-3')).toBeDefined();
    });
  });
  ```

- [ ] **🤖 Step 2: Correr test (debe fallar)**

  ```bash
  npm run test:integration -- multi-device
  ```

  Esperado: FAIL `Cannot find module '@/lib/auth/multi-device'`.

- [ ] **🤖 Step 3: Implementar `lib/auth/multi-device.ts`**

  ```ts
  import 'server-only';
  import { createHash } from 'crypto';
  import { supabaseAdmin } from '@/lib/supabase/admin';
  import { deviceLabelFromUA } from '@/lib/utils/device-label';

  const MAX_DEVICES = 3;

  export interface EnforceDeviceLimitArgs {
    userId: string;
    refreshToken: string;
    ip?: string;
    userAgent?: string;
  }

  export async function enforceDeviceLimit(args: EnforceDeviceLimitArgs): Promise<void> {
    const tokenHash = sha256(args.refreshToken);

    // 1. UPSERT — si el mismo token ya existe (re-login del mismo refresh), actualiza last_seen_at.
    const { error: upsertErr } = await supabaseAdmin
      .from('user_sessions')
      .upsert(
        {
          user_id: args.userId,
          refresh_token_hash: tokenHash,
          device_label: deviceLabelFromUA(args.userAgent),
          ip_address: args.ip,
          user_agent: args.userAgent,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'refresh_token_hash' }
      );

    if (upsertErr) {
      console.error('[multi-device] upsert error', upsertErr);
      return;
    }

    // 2. Contar sesiones activas
    const { data: sessions, error: selErr } = await supabaseAdmin
      .from('user_sessions')
      .select('id, refresh_token_hash, last_seen_at')
      .eq('user_id', args.userId)
      .order('last_seen_at', { ascending: true });

    if (selErr || !sessions) return;

    if (sessions.length <= MAX_DEVICES) return;

    // 3. Eliminar las más antiguas hasta dejar MAX_DEVICES
    const toDelete = sessions.slice(0, sessions.length - MAX_DEVICES);
    for (const s of toDelete) {
      await supabaseAdmin.from('user_sessions').delete().eq('id', s.id);
      // Invalidar el refresh token en Supabase Auth
      // Como tenemos solo el hash, no podemos llamar signOut(refresh_token).
      // Alternativa: invalidamos TODAS las sesiones del usuario y dejamos que la actual se mantenga
      // por su access_token vivo (~1h). Para una invalidación más fina ver nota abajo.
    }

    // NOTA OPERATIVA:
    // Supabase no expone API para invalidar un refresh_token específico cuando solo tienes el hash.
    // Hasta que esa API exista, las sesiones expulsadas se invalidarán automáticamente cuando
    // intenten refrescar (porque su user_session no existe → refresh fallará en getUser y middleware
    // las redirigirá a login).
    //
    // Lo verificamos en el middleware: si user existe pero no hay match en user_sessions, sign out.
  }

  function sha256(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }
  ```

- [ ] **🤖 Step 4: Correr test**

  ```bash
  npm run test:integration -- multi-device
  ```

  Esperado: 2 passed.

- [ ] **🤖 Step 5: Hardening en middleware — verificar contra `user_sessions`**

  Editar `middleware.ts` para añadir verificación: si el usuario está autenticado pero su refresh_token no está en `user_sessions`, cerrar sesión.

  Después de la línea `const { data: { user } } = await supabase.auth.getUser();`, agregar:

  ```ts
    // Validar que la sesión actual está en user_sessions
    if (user) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.refresh_token) {
        const { createHash } = await import('crypto');
        const hash = createHash('sha256').update(session.refresh_token).digest('hex');

        const { supabaseAdmin } = await import('@/lib/supabase/admin');
        const { data: sessionRow } = await supabaseAdmin
          .from('user_sessions')
          .select('id')
          .eq('refresh_token_hash', hash)
          .maybeSingle();

        if (!sessionRow) {
          // Esta sesión fue desplazada por otra. Cerrar.
          await supabase.auth.signOut();
          return NextResponse.redirect(new URL('/login?reason=device_limit', req.url));
        }
      }
    }
  ```

  > Esta verificación corre en cada request — es leve (single SELECT por hash indexado) pero asegura que las sesiones desplazadas se cierren al siguiente request.

- [ ] **🤖 Step 6: Commit**

  ```bash
  git add lib/auth/multi-device.ts tests/integration/multi-device.test.ts middleware.ts
  git commit -m "feat(auth): enforce 3-device session limit"
  ```

---

### Task 7.2: Página "Mis dispositivos"

**Files:**
- Create: `app/(app)/perfil/dispositivos/page.tsx`, `app/(app)/perfil/dispositivos/actions.ts`

- [ ] **🤖 Step 1: Server Action para revocar sesión**

  `app/(app)/perfil/dispositivos/actions.ts`:

  ```ts
  'use server';

  import { revalidatePath } from 'next/cache';
  import { createClient } from '@/lib/supabase/server';
  import { z } from 'zod';

  const revokeSchema = z.object({ session_id: z.string().uuid() }).strict();

  export async function revokeSessionAction(formData: FormData) {
    const parsed = revokeSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // RLS: el usuario solo puede borrar las suyas
    await supabase.from('user_sessions').delete().eq('id', parsed.data.session_id);

    revalidatePath('/perfil/dispositivos');
  }
  ```

- [ ] **🤖 Step 2: Página listado**

  `app/(app)/perfil/dispositivos/page.tsx`:

  ```tsx
  import { createClient } from '@/lib/supabase/server';
  import { revokeSessionAction } from './actions';

  export default async function DispositivosPage() {
    const supabase = await createClient();
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('id, device_label, ip_address, last_seen_at, created_at')
      .order('last_seen_at', { ascending: false });

    return (
      <div className="container">
        <h1>Mis dispositivos</h1>
        <p className="muted">Máximo 3 dispositivos simultáneos. Si entras desde un cuarto, el más antiguo se cierra.</p>

        {sessions?.length ? (
          <ul className="device-list">
            {sessions.map((s) => (
              <li key={s.id} className="device-card">
                <div>
                  <strong>{s.device_label || 'Dispositivo'}</strong>
                  <p className="muted">
                    Último uso: {new Date(s.last_seen_at).toLocaleString('es-MX')}
                  </p>
                  {s.ip_address && <p className="muted">IP: {s.ip_address}</p>}
                </div>
                <form action={revokeSessionAction}>
                  <input type="hidden" name="session_id" value={s.id} />
                  <button type="submit" className="btn btn--ghost">Cerrar sesión</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay sesiones activas.</p>
        )}
      </div>
    );
  }
  ```

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add "app/(app)/perfil/dispositivos/"
  git commit -m "feat(auth): mis dispositivos page with revoke action"
  ```

---

> ✅ **CHECKPOINT 7:** Multi-device limit funcional con tests passing. Página de gestión de dispositivos.

---

# Fase 8 — Migración de páginas públicas

### Task 8.1: Migrar CSS a globals.css

**Files:**
- Modify: `app/globals.css`
- Reference: `css/styles.css`, `css/app.css` (commiteados en Task 0 como referencia histórica)

- [ ] **🤖 Step 1: Concatenar CSS existente**

  ```bash
  cat css/styles.css css/app.css > app/globals.css
  ```

- [ ] **🤖 Step 2: Agregar reset/utilities propios al inicio**

  Editar `app/globals.css`, agregar al INICIO del archivo:

  ```css
  /* Migrado de css/styles.css y css/app.css el 2026-04-26 */

  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; }

  /* Utility classes nuevas para Next.js */
  .alert {
    padding: var(--sp-3, 12px) var(--sp-4, 16px);
    border-radius: 8px;
    margin: var(--sp-3, 12px) 0;
    font-size: 0.9rem;
  }
  .alert--error {
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid rgba(244, 63, 94, 0.4);
    color: #fca5a5;
  }
  .error {
    color: #fca5a5;
    font-size: 0.8rem;
    display: block;
    margin-top: 4px;
  }

  .device-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: var(--sp-3, 12px);
  }
  .device-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--sp-4, 16px);
    border: 1px solid var(--border-soft);
    border-radius: 12px;
  }
  ```

- [ ] **🤖 Step 3: Verificar render**

  ```bash
  npm run dev
  ```

  Visitar http://localhost:3000/login y http://localhost:3000/register. Verificar que estilos cargan.

- [ ] **🤖 Step 4: Commit**

  ```bash
  git add app/globals.css
  git commit -m "feat(styles): migrate css/styles.css + css/app.css to globals.css"
  ```

---

### Task 8.2: Migrar landing (`index.html` → `app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`
- Reference: `index.html`

**Estrategia:** copiar el `<body>` de `index.html` a JSX. Cambios obligatorios:
- `class=` → `className=`
- atributos `for=` → `htmlFor=`
- self-close de `<input>`, `<img>`, `<br>`, etc.
- Eliminar `<script src="js/router.js">` y `<script src="js/main.js">` (la lógica de router está en middleware; main.js se migra a Client Component si es necesario)

- [ ] **🤖 Step 1: Crear `app/(public)/layout.tsx`**

  ```tsx
  export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-blob aurora-blob--1"></div>
          <div className="aurora-blob aurora-blob--2"></div>
          <div className="aurora-blob aurora-blob--3"></div>
          <div className="grid-overlay"></div>
        </div>
        {children}
      </>
    );
  }
  ```

- [ ] **🤖 Step 2: Mover `app/page.tsx` a `app/(public)/page.tsx`**

  ```bash
  mv app/page.tsx "app/(public)/page.tsx"
  ```

  Reemplazar contenido con el `<body>` de `index.html` traducido a JSX. Por brevedad, este paso recibe un fragmento como ejemplo del header; el resto se traduce siguiendo el mismo patrón. Ver `index.html:18-79` (navbar) y `index.html:81-200+` (resto). Mantener todos los IDs y clases.

  Esqueleto base de `app/(public)/page.tsx`:

  ```tsx
  import Script from 'next/script';

  export default function HomePage() {
    return (
      <>
        <a className="skip-link" href="#main">Saltar al contenido</a>

        {/* Navbar — copiar fielmente de index.html:32-79 */}
        <header className="navbar" id="navbar">
          {/* ... contenido del nav, cambiar class→className y href="login.html"→href="/login" ... */}
        </header>

        <main id="main">
          {/* Hero — index.html:84-200 */}
          {/* Cursos — etc. */}
          {/* Características */}
          {/* Planes — link de "Empezar gratis" → "/register" */}
          {/* Testimonios */}
          {/* FAQ */}
          {/* Footer */}
        </main>

        {/* main.js: scroll, mobile menu, FAQ accordion, reveal-on-scroll, counters, parallax */}
        <Script src="/legacy/main.js" strategy="afterInteractive" />
      </>
    );
  }
  ```

- [ ] **🤖 Step 3: Mover `js/main.js` a `public/legacy/main.js`**

  ```bash
  mkdir -p public/legacy
  mv js/main.js public/legacy/main.js
  ```

  > Ese script no toca el router (es solo UI: scroll, FAQ, counters). Servirlo como asset estático en `/legacy/main.js` y cargarlo con `<Script>`. Más adelante (sub-proyecto futuro) se reescribirá como Client Components.

- [ ] **🤖 Step 4: Borrar `index.html` original**

  ```bash
  git rm index.html
  ```

- [ ] **🤖 Step 5: Verificar render manualmente**

  ```bash
  npm run dev
  ```

  Visitar http://localhost:3000. Esperado: landing renderizado igual que el HTML original. Probar:
  - Click en "Iniciar sesión" → redirige a `/login`
  - Click en "Empezar gratis" → redirige a `/register`
  - FAQ accordion funciona
  - Scroll-reveal funciona

- [ ] **🤖 Step 6: Commit**

  ```bash
  git add "app/(public)/" public/legacy/
  git rm index.html js/main.js   # ya movido
  git commit -m "feat(landing): migrate index.html to next.js app/(public)/page.tsx"
  ```

---

### Task 8.3: Crear catálogo público y simulacro demo

**Files:**
- Create: `app/(public)/catalogo/page.tsx`, `app/(public)/simulacro-demo/page.tsx`
- Reference: `exam.html` para estructura del simulacro

- [ ] **🤖 Step 1: Catálogo placeholder (sin contenido aún — eso es sub-proyecto #2)**

  `app/(public)/catalogo/page.tsx`:

  ```tsx
  export default function CatalogoPage() {
    return (
      <main id="main">
        <section className="container" style={{ padding: 'var(--sp-12) 0' }}>
          <h1 className="hero__title">Catálogo de cursos</h1>
          <p className="hero__subtitle">
            Próximamente — el catálogo completo se publicará en la siguiente fase del proyecto.
          </p>
          <a href="/simulacro-demo" className="btn btn--primary">Probar un simulacro gratis</a>
        </section>
      </main>
    );
  }
  ```

- [ ] **🤖 Step 2: Simulacro demo — extraer datos de `exam.html`**

  Las preguntas existen en `exam.html:91-186` dentro de `window.__examData`. Extraerlas a un módulo:

  `lib/data/sample-exam.ts`:

  ```ts
  export const sampleExam = {
    total: 10,
    timeSeconds: 9000,
    questions: [
      // copiar fielmente desde exam.html:94-185 las 10 preguntas con options
      {
        text: '¿Cuál de las siguientes estructuras celulares es responsable de la síntesis de proteínas a partir de la información genética del ARNm?',
        options: ['Mitocondria', 'Ribosoma', 'Aparato de Golgi', 'Lisosoma'],
      },
      // ... 9 más, copiar exactamente del archivo original
    ],
  };
  ```

- [ ] **🤖 Step 3: Componente cliente del simulador**

  `components/exam/ExamSimulator.tsx`:

  ```tsx
  'use client';
  import { useEffect, useState } from 'react';

  type Question = { text: string; options: string[] };
  type Props = { total: number; timeSeconds: number; questions: Question[] };

  export function ExamSimulator({ total, timeSeconds, questions }: Props) {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
    const [flagged, setFlagged] = useState<boolean[]>(() => Array(total).fill(false));
    const [timeLeft, setTimeLeft] = useState(timeSeconds);

    useEffect(() => {
      const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
      return () => clearInterval(id);
    }, []);

    const fmt = (s: number) => {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      return h > 0
        ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const q = questions[current];

    return (
      <div className="exam-layout">
        <div className="exam-main">
          <div className="exam-topbar">
            <div className="exam-topbar__left">
              <span className="exam-topbar__name">Simulacro de muestra</span>
              <span className="exam-topbar__id">10 reactivos · acceso gratuito</span>
            </div>
            <div className="timer" aria-live="polite">{fmt(timeLeft)}</div>
          </div>

          <div className="question-card">
            <div className="question-meta">
              <span>Pregunta {current + 1} de {total}</span>
            </div>
            <p className="question-text">{q.text}</p>
            <div className="options">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const selected = answers[current] === i;
                return (
                  <label key={i} className={`option ${selected ? 'is-selected' : ''}`}>
                    <span className="option__letter">{letter}</span>
                    <span className="option__text">{opt}</span>
                    <input
                      type="radio"
                      name={`q${current}`}
                      checked={selected}
                      onChange={() => setAnswers((a) => a.map((v, idx) => (idx === current ? i : v)))}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <nav className="exam-nav">
            <button className="btn btn--glass" onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
              Anterior
            </button>
            <button
              className="btn btn--glass"
              onClick={() => setFlagged((f) => f.map((v, idx) => (idx === current ? !v : v)))}
            >
              {flagged[current] ? 'Desmarcar' : 'Marcar'}
            </button>
            <button className="btn btn--primary" onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}>
              Siguiente
            </button>
          </nav>
        </div>

        <aside className="exam-sidebar">
          <h4>Mapa de preguntas</h4>
          <div className="q-grid">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                className={`q-cell ${i === current ? 'is-current' : ''} ${answers[i] !== null ? 'is-answered' : ''} ${flagged[i] ? 'is-flagged' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Pregunta ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>
    );
  }
  ```

- [ ] **🤖 Step 4: Página simulacro demo**

  `app/(public)/simulacro-demo/page.tsx`:

  ```tsx
  import { ExamSimulator } from '@/components/exam/ExamSimulator';
  import { sampleExam } from '@/lib/data/sample-exam';

  export default function SimulacroDemoPage() {
    return <ExamSimulator {...sampleExam} />;
  }
  ```

- [ ] **🤖 Step 5: Verificar render**

  ```bash
  npm run dev
  ```

  Visitar http://localhost:3000/simulacro-demo. Esperado: 10 preguntas navegables, timer corre, marcar funciona.

- [ ] **🤖 Step 6: Commit**

  ```bash
  git add "app/(public)/catalogo/" "app/(public)/simulacro-demo/" \
    components/exam/ lib/data/
  git commit -m "feat(public): catalog placeholder + demo exam simulator"
  ```

---

> ✅ **CHECKPOINT 8:** Páginas públicas (landing, catálogo, simulacro demo) funcionan en Next.js. CSS migrado.

---

# Fase 9 — Migración de páginas protegidas

### Task 9.1: Layout (app) y dashboard

**Files:**
- Create: `app/(app)/layout.tsx`, `app/(app)/dashboard/page.tsx`
- Reference: `dashboard.html`

- [ ] **🤖 Step 1: Layout con sidebar**

  `app/(app)/layout.tsx`:

  ```tsx
  import { createClient } from '@/lib/supabase/server';
  import { redirect } from 'next/navigation';
  import { Sidebar } from '@/components/layout/Sidebar';

  export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, current_streak_days')
      .eq('id', user.id)
      .single();

    return (
      <>
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-blob aurora-blob--1"></div>
          <div className="grid-overlay"></div>
        </div>
        <div className="sidebar-backdrop" aria-hidden="true"></div>
        <div className="app-shell">
          <Sidebar fullName={profile?.full_name ?? 'Usuario'} />
          {children}
        </div>
      </>
    );
  }
  ```

- [ ] **🤖 Step 2: Componente Sidebar**

  `components/layout/Sidebar.tsx`:

  ```tsx
  'use client';
  import { usePathname } from 'next/navigation';
  import Link from 'next/link';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'home' },
    { href: '/cursos', label: 'Mis cursos', icon: 'book' },
    { href: '/simulacros', label: 'Simulacros', icon: 'check' },
    { href: '/perfil', label: 'Perfil', icon: 'user' },
  ];

  export function Sidebar({ fullName }: { fullName: string }) {
    const path = usePathname();
    return (
      <aside className="sidebar">
        <Link href="/dashboard" className="logo">
          <span className="logo__text">CEFI<span className="logo__accent">TIPS</span></span>
        </Link>
        <nav>
          <div className="sidebar__section">
            <p className="sidebar__label">Principal</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${path?.startsWith(item.href) ? 'is-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="sidebar__section">
            <p className="sidebar__label">Cuenta</p>
            <Link href="/perfil" className="nav-item">{fullName}</Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="nav-item">Cerrar sesión</button>
            </form>
          </div>
        </nav>
      </aside>
    );
  }
  ```

- [ ] **🤖 Step 3: Logout route handler**

  `app/api/auth/logout/route.ts`:

  ```ts
  import { NextResponse } from 'next/server';
  import { createClient } from '@/lib/supabase/server';
  import { supabaseAdmin } from '@/lib/supabase/admin';
  import { createHash } from 'crypto';

  export async function POST() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.refresh_token) {
      const hash = createHash('sha256').update(session.refresh_token).digest('hex');
      await supabaseAdmin.from('user_sessions').delete().eq('refresh_token_hash', hash);
    }

    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL!));
  }
  ```

- [ ] **🤖 Step 4: Dashboard page**

  `app/(app)/dashboard/page.tsx` (basado en `dashboard.html` — copiar el contenido del `<main class="content">`).

  Estructura mínima funcional para este sub-proyecto (los datos reales se llenan en sub-proyecto #2):

  ```tsx
  import { createClient } from '@/lib/supabase/server';

  export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    const firstName = profile?.full_name.split(' ')[0] ?? 'Estudiante';

    return (
      <main className="content">
        <header className="content-header">
          <div>
            <h1>Hola, {firstName} <span className="wave">👋</span></h1>
            <p className="muted">Bienvenido a tu panel.</p>
          </div>
        </header>

        <section className="cards-grid">
          <div className="stat-card">
            <span className="stat-card__label">Racha actual</span>
            <span className="stat-card__value">{profile?.current_streak_days ?? 0} días</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Examen objetivo</span>
            <span className="stat-card__value">{profile?.exam_target ?? '—'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Mejor racha</span>
            <span className="stat-card__value">{profile?.longest_streak_days ?? 0} días</span>
          </div>
        </section>

        <section className="empty-state">
          <h2>Tu curso aparecerá aquí</h2>
          <p>Una vez se valide tu pago verás los cursos asignados.</p>
          <a href="/catalogo" className="btn btn--primary">Ver catálogo</a>
        </section>
      </main>
    );
  }
  ```

- [ ] **🤖 Step 5: Borrar `dashboard.html`**

  ```bash
  git rm dashboard.html
  ```

- [ ] **🤖 Step 6: Verificar manualmente**

  Visitar `/dashboard` con un usuario logueado y confirmado. Esperado: render correcto con nombre.

- [ ] **🤖 Step 7: Commit**

  ```bash
  git add "app/(app)/" components/layout/Sidebar.tsx app/api/auth/logout/
  git rm dashboard.html
  git commit -m "feat(app): protected layout + dashboard page + sidebar + logout"
  ```

---

### Task 9.2: Migrar página de perfil (con form de edición)

**Files:**
- Create: `app/(app)/perfil/page.tsx`, `app/(app)/perfil/actions.ts`
- Reference: `profile.html`

- [ ] **🤖 Step 1: Server Action de actualización**

  `app/(app)/perfil/actions.ts`:

  ```ts
  'use server';

  import { revalidatePath } from 'next/cache';
  import { createClient } from '@/lib/supabase/server';
  import { updateProfileSchema } from '@/lib/validation/schemas';

  export async function updateProfileAction(_prev: unknown, formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    // Convertir strings vacíos a null para campos opcionales
    const cleaned = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v === '' ? null : v])
    );

    const parsed = updateProfileSchema.safeParse(cleaned);
    if (!parsed.success) {
      return { error: 'Datos inválidos.' };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Sesión expirada.' };

    const { error } = await supabase.from('profiles').update(parsed.data).eq('id', user.id);
    if (error) return { error: 'No se pudo guardar.' };

    revalidatePath('/perfil');
    return { ok: true };
  }
  ```

- [ ] **🤖 Step 2: Página de perfil**

  `app/(app)/perfil/page.tsx`:

  ```tsx
  import { createClient } from '@/lib/supabase/server';
  import { ProfileForm } from './ProfileForm';

  export default async function PerfilPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    return (
      <main className="content">
        <header className="content-header">
          <h1>Mi perfil</h1>
        </header>
        <ProfileForm profile={profile!} email={user!.email!} />
      </main>
    );
  }
  ```

- [ ] **🤖 Step 3: Client Component del form**

  `app/(app)/perfil/ProfileForm.tsx`:

  ```tsx
  'use client';
  import { useFormState, useFormStatus } from 'react-dom';
  import { updateProfileAction } from './actions';
  import type { Database } from '@/lib/supabase/database.types';

  type Profile = Database['public']['Tables']['profiles']['Row'];

  export function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
    const [state, formAction] = useFormState(updateProfileAction, {});

    return (
      <form action={formAction} className="profile-form">
        <div className="form-field">
          <label>Correo (no editable)</label>
          <input type="email" value={email} disabled />
        </div>
        <div className="form-field">
          <label htmlFor="full_name">Nombre completo</label>
          <input id="full_name" name="full_name" type="text" defaultValue={profile.full_name} />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Teléfono</label>
          <input id="phone" name="phone" type="tel" defaultValue={profile.phone ?? ''} />
        </div>
        <div className="form-field">
          <label htmlFor="exam_target">Examen objetivo</label>
          <select id="exam_target" name="exam_target" defaultValue={profile.exam_target}>
            <option value="UNAM">UNAM</option>
            <option value="IPN">IPN</option>
            <option value="UAM">UAM</option>
            <option value="COMIPEMS">COMIPEMS</option>
            <option value="EXANI">EXANI</option>
            <option value="undecided">Aún no decido</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="career_target">Carrera objetivo</label>
          <input id="career_target" name="career_target" type="text" defaultValue={profile.career_target ?? ''} />
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="course_start_date">Inicio del curso</label>
            <input id="course_start_date" name="course_start_date" type="date" defaultValue={profile.course_start_date ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="exam_date">Fecha de examen</label>
            <input id="exam_date" name="exam_date" type="date" defaultValue={profile.exam_date ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="course_end_date">Fin del curso</label>
            <input id="course_end_date" name="course_end_date" type="date" defaultValue={profile.course_end_date ?? ''} />
          </div>
        </div>

        {(state as { error?: string }).error && (
          <div className="alert alert--error">{(state as { error?: string }).error}</div>
        )}
        {(state as { ok?: boolean }).ok && (
          <div className="alert">Guardado.</div>
        )}

        <Submit />
      </form>
    );
  }

  function Submit() {
    const { pending } = useFormStatus();
    return <button type="submit" className="btn btn--primary" disabled={pending}>
      {pending ? 'Guardando...' : 'Guardar cambios'}
    </button>;
  }
  ```

- [ ] **🤖 Step 4: Borrar `profile.html`**

  ```bash
  git rm profile.html
  ```

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add "app/(app)/perfil/"
  git rm profile.html
  git commit -m "feat(app): profile page with edit form"
  ```

---

### Task 9.3: Migrar restantes (course, lesson, exam) como placeholders

**Files:**
- Create: `app/(app)/cursos/page.tsx`, `app/(app)/cursos/[id]/page.tsx`, `app/(app)/lecciones/[id]/page.tsx`, `app/(app)/simulacros/[id]/page.tsx`

**Contexto:** la lógica completa de cursos/lecciones/exámenes pertenece a sub-proyectos #2 y #5. Aquí solo creamos placeholders que respetan el gating de auth + email confirmado.

- [ ] **🤖 Step 1: Listado de cursos**

  `app/(app)/cursos/page.tsx`:

  ```tsx
  export default function CursosPage() {
    return (
      <main className="content">
        <header className="content-header">
          <h1>Mis cursos</h1>
        </header>
        <div className="empty-state">
          <p>Aún no tienes cursos asignados.</p>
          <p className="muted">Una vez se valide tu pago, los cursos aparecerán aquí.</p>
          <a href="/catalogo" className="btn btn--primary">Ver catálogo</a>
        </div>
      </main>
    );
  }
  ```

- [ ] **🤖 Step 2: Curso detalle (placeholder)**

  `app/(app)/cursos/[id]/page.tsx`:

  ```tsx
  export default function CursoDetallePage({ params }: { params: { id: string } }) {
    return (
      <main className="content">
        <h1>Curso {params.id}</h1>
        <p>Contenido pendiente — se implementa en sub-proyecto #2 (Catálogo de cursos).</p>
      </main>
    );
  }
  ```

- [ ] **🤖 Step 3: Lección y simulacro detalle (placeholders similares)**

  `app/(app)/lecciones/[id]/page.tsx`:

  ```tsx
  export default function LeccionPage({ params }: { params: { id: string } }) {
    return (
      <main className="content">
        <h1>Lección {params.id}</h1>
        <p>Contenido pendiente — sub-proyecto #2.</p>
      </main>
    );
  }
  ```

  `app/(app)/simulacros/[id]/page.tsx`:

  ```tsx
  export default function SimulacroPage({ params }: { params: { id: string } }) {
    return (
      <main className="content">
        <h1>Simulacro {params.id}</h1>
        <p>Contenido pendiente — sub-proyecto #5 (Persistencia de exámenes).</p>
      </main>
    );
  }
  ```

- [ ] **🤖 Step 4: Borrar HTML originales**

  ```bash
  git rm course.html lesson.html exam.html
  ```

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add "app/(app)/cursos/" "app/(app)/lecciones/" "app/(app)/simulacros/"
  git rm course.html lesson.html exam.html login.html register.html
  # también borrar los HTML de auth que ya migramos antes
  git commit -m "feat(app): placeholder pages for cursos/lecciones/simulacros + remove old html"
  ```

---

### Task 9.4: Página /perfil/completar (post-OAuth)

**Files:**
- Create: `app/(app)/perfil/completar/page.tsx`, `app/(app)/perfil/completar/actions.ts`

- [ ] **🤖 Step 1: Server Action**

  `app/(app)/perfil/completar/actions.ts`:

  ```ts
  'use server';

  import { redirect } from 'next/navigation';
  import { createClient } from '@/lib/supabase/server';
  import { completeProfileSchema } from '@/lib/validation/schemas';

  export async function completeProfileAction(_prev: { error?: string }, formData: FormData) {
    const parsed = completeProfileSchema.safeParse({
      phone: formData.get('phone'),
      exam_target: formData.get('exam_target'),
    });
    if (!parsed.success) return { error: 'Datos inválidos.' };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    await supabase.from('profiles').update(parsed.data).eq('id', user.id);

    const next = (formData.get('next') as string | null) ?? '/dashboard';
    redirect(next.startsWith('/') ? next : '/dashboard');
  }
  ```

- [ ] **🤖 Step 2: Página**

  `app/(app)/perfil/completar/page.tsx`:

  ```tsx
  'use client';
  import { useFormState } from 'react-dom';
  import { useSearchParams } from 'next/navigation';
  import { completeProfileAction } from './actions';

  export default function CompletarPerfilPage() {
    const params = useSearchParams();
    const next = params.get('next') ?? '/dashboard';
    const [state, formAction] = useFormState(completeProfileAction, {});

    return (
      <main className="content">
        <h1>Completa tu perfil</h1>
        <p>Necesitamos un par de datos más antes de continuar.</p>
        <form action={formAction}>
          <input type="hidden" name="next" value={next} />
          <div className="form-field">
            <label htmlFor="phone">Teléfono</label>
            <input id="phone" name="phone" type="tel" required />
          </div>
          <div className="form-field">
            <label htmlFor="exam_target">Examen objetivo</label>
            <select id="exam_target" name="exam_target" required defaultValue="">
              <option value="" disabled>Selecciona uno</option>
              <option value="UNAM">UNAM</option>
              <option value="IPN">IPN</option>
              <option value="UAM">UAM</option>
              <option value="COMIPEMS">COMIPEMS</option>
              <option value="EXANI">EXANI-II</option>
            </select>
          </div>
          {(state as { error?: string }).error && (
            <div className="alert alert--error">{(state as { error?: string }).error}</div>
          )}
          <button type="submit" className="btn btn--primary">Continuar</button>
        </form>
      </main>
    );
  }
  ```

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add "app/(app)/perfil/completar/"
  git commit -m "feat(app): perfil/completar page for post-oauth users"
  ```

---

> ✅ **CHECKPOINT 9:** Todas las páginas migradas. HTML originales borrados.

---

# Fase 10 — Admin shell

### Task 10.1: Página /admin con gate

**Files:**
- Create: `app/admin/layout.tsx`, `app/admin/page.tsx`

- [ ] **🤖 Step 1: Layout con verificación adicional (defense-in-depth)**

  `app/admin/layout.tsx`:

  ```tsx
  import { createClient } from '@/lib/supabase/server';
  import { redirect } from 'next/navigation';

  export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const role = (user.app_metadata as { role?: string } | undefined)?.role;
    if (role !== 'admin') redirect('/dashboard');

    return (
      <div className="app-shell">
        <aside className="sidebar">
          <a href="/admin" className="logo">
            <span className="logo__text">CEFI<span className="logo__accent">TIPS</span> Admin</span>
          </a>
          <nav>
            <a href="/admin" className="nav-item">Inicio</a>
            <a href="/dashboard" className="nav-item">Salir a estudiante</a>
          </nav>
        </aside>
        {children}
      </div>
    );
  }
  ```

- [ ] **🤖 Step 2: Página index del admin**

  `app/admin/page.tsx`:

  ```tsx
  export default function AdminHomePage() {
    return (
      <main className="content">
        <header className="content-header">
          <h1>Panel administrativo</h1>
        </header>
        <p>Las funcionalidades del panel se implementan en el sub-proyecto #4.</p>
        <ul>
          <li>📋 Validación de pagos por transferencia (sub-proyecto #4)</li>
          <li>👥 Gestión de usuarios (sub-proyecto #4)</li>
          <li>📚 Gestión de cursos (sub-proyecto #2)</li>
          <li>🛡️ Audit log (este sub-proyecto, expandido en #4)</li>
        </ul>
      </main>
    );
  }
  ```

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add app/admin/
  git commit -m "feat(admin): shell page with role gate (deferred to sub-project #4)"
  ```

---

### Task 10.2: Promote first admin (USER ACTION)

- [ ] **🧑 Step 1: USER ACTION — registrarse en /register**

  Usuario va a http://localhost:3000/register y crea su cuenta de admin con su correo principal. Confirma el email cuando le llegue.

- [ ] **🧑 Step 2: USER ACTION — correr SQL**

  En Supabase dashboard → SQL Editor → New Query, pegar y ajustar el correo:

  ```sql
  UPDATE auth.users
    SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role','admin')
    WHERE email = 'TU_CORREO@ejemplo.com';

  SELECT id, email, raw_app_meta_data->>'role' AS role
    FROM auth.users WHERE email = 'TU_CORREO@ejemplo.com';
  ```

  Click "Run". Esperado: 1 fila actualizada y la query final muestra `role = 'admin'`.

- [ ] **🧑 Step 3: USER ACTION — verificar acceso al panel**

  Cerrar sesión en la app y volver a iniciar (los custom claims se cargan en el JWT al login). Visitar /admin. Esperado: ver el panel.

- [ ] **🤖 Step 4: Test E2E del gate**

  `tests/e2e/admin-gate.spec.ts`:

  ```ts
  import { test, expect } from '@playwright/test';

  test('non-admin user redirected from /admin', async ({ page }) => {
    // Login como usuario regular (test fixture)
    await page.goto('/login');
    await page.fill('[name=email]', process.env.TEST_USER_EMAIL!);
    await page.fill('[name=password]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type=submit]');
    await page.waitForURL('/dashboard');

    // Intentar /admin
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('admin user can access /admin', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', process.env.TEST_ADMIN_EMAIL!);
    await page.fill('[name=password]', process.env.TEST_ADMIN_PASSWORD!);
    await page.click('button[type=submit]');
    await page.waitForURL('/dashboard');

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText('Panel administrativo');
  });
  ```

  > Las credenciales de prueba (`TEST_USER_*`, `TEST_ADMIN_*`) se ponen en `.env.local` y NO se commitean. Son cuentas de prueba creadas manualmente.

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add tests/e2e/admin-gate.spec.ts
  git commit -m "test(admin): e2e gate verification"
  ```

---

> ✅ **CHECKPOINT 10:** Admin shell + primer admin promovido + test E2E pasa.

---

# Fase 11 — Tests adicionales y CI

### Task 11.1: Tests de integración para RLS

**Files:**
- Create: `tests/integration/rls.test.ts`

- [ ] **🤖 Step 1: Test que verifica que un usuario no puede leer profiles de otro**

  ```ts
  import { describe, it, expect, beforeAll } from 'vitest';
  import { createClient } from '@supabase/supabase-js';
  import { supabaseAdmin } from '@/lib/supabase/admin';

  let userA: { id: string; jwt: string };
  let userB: { id: string; jwt: string };

  beforeAll(async () => {
    const a = await supabaseAdmin.auth.admin.createUser({
      email: `rls-a-${Date.now()}@example.com`,
      password: 'TestRls1234',
      email_confirm: true,
      user_metadata: { full_name: 'A', phone: '+525500000001', exam_target: 'UNAM' },
    });
    const b = await supabaseAdmin.auth.admin.createUser({
      email: `rls-b-${Date.now()}@example.com`,
      password: 'TestRls1234',
      email_confirm: true,
      user_metadata: { full_name: 'B', phone: '+525500000002', exam_target: 'IPN' },
    });

    if (a.error || b.error) throw a.error || b.error;

    // Generar JWTs vía signInWithPassword
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const sa = await anonClient.auth.signInWithPassword({
      email: a.data.user!.email!,
      password: 'TestRls1234',
    });
    const sb = await anonClient.auth.signInWithPassword({
      email: b.data.user!.email!,
      password: 'TestRls1234',
    });

    userA = { id: a.data.user!.id, jwt: sa.data.session!.access_token };
    userB = { id: b.data.user!.id, jwt: sb.data.session!.access_token };
  });

  describe('RLS: profiles', () => {
    it('userA puede leer su propio perfil', async () => {
      const c = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${userA.jwt}` } } }
      );
      const { data, error } = await c.from('profiles').select('*').eq('id', userA.id).single();
      expect(error).toBeNull();
      expect(data?.id).toBe(userA.id);
    });

    it('userA NO puede leer perfil de userB', async () => {
      const c = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${userA.jwt}` } } }
      );
      const { data } = await c.from('profiles').select('*').eq('id', userB.id);
      // RLS filtra a 0 filas (no error, solo vacío)
      expect(data).toEqual([]);
    });

    it('userA NO puede UPDATE perfil de userB', async () => {
      const c = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${userA.jwt}` } } }
      );
      const { error } = await c.from('profiles').update({ full_name: 'hacked' }).eq('id', userB.id);
      // Error o 0 filas afectadas, en cualquier caso B no fue modificado
      const { data: bAfter } = await supabaseAdmin
        .from('profiles')
        .select('full_name')
        .eq('id', userB.id)
        .single();
      expect(bAfter?.full_name).not.toBe('hacked');
    });
  });
  ```

- [ ] **🤖 Step 2: Correr**

  ```bash
  npm run test:integration -- rls
  ```

  Esperado: 3 passed.

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add tests/integration/rls.test.ts
  git commit -m "test(rls): cross-user isolation tests for profiles"
  ```

---

### Task 11.2: Test de promote_to_admin

**Files:**
- Create: `tests/integration/promote-admin.test.ts`

- [ ] **🤖 Step 1: Test**

  ```ts
  import { describe, it, expect, beforeAll } from 'vitest';
  import { supabaseAdmin } from '@/lib/supabase/admin';

  let admin: { id: string };
  let target: { id: string };
  let nonAdmin: { id: string };

  beforeAll(async () => {
    const a = await supabaseAdmin.auth.admin.createUser({
      email: `promote-admin-${Date.now()}@example.com`,
      password: 'TestPromote1',
      email_confirm: true,
      app_metadata: { role: 'admin' },
      user_metadata: { full_name: 'Admin', phone: '+525500000003', exam_target: 'UNAM' },
    });
    const t = await supabaseAdmin.auth.admin.createUser({
      email: `promote-target-${Date.now()}@example.com`,
      password: 'TestPromote1',
      email_confirm: true,
      user_metadata: { full_name: 'Target', phone: '+525500000004', exam_target: 'IPN' },
    });
    const n = await supabaseAdmin.auth.admin.createUser({
      email: `promote-nonadmin-${Date.now()}@example.com`,
      password: 'TestPromote1',
      email_confirm: true,
      user_metadata: { full_name: 'NonAdmin', phone: '+525500000005', exam_target: 'UAM' },
    });

    admin = { id: a.data.user!.id };
    target = { id: t.data.user!.id };
    nonAdmin = { id: n.data.user!.id };
  });

  describe('promote_to_admin', () => {
    it('admin puede promover a otro usuario', async () => {
      const { error } = await supabaseAdmin.rpc('promote_to_admin', {
        target_user_id: target.id,
        granted_by: admin.id,
      });
      expect(error).toBeNull();

      const { data: u } = await supabaseAdmin.auth.admin.getUserById(target.id);
      expect((u.user!.app_metadata as { role?: string }).role).toBe('admin');
    });

    it('non-admin NO puede promover (RAISE EXCEPTION)', async () => {
      const { error } = await supabaseAdmin.rpc('promote_to_admin', {
        target_user_id: target.id,
        granted_by: nonAdmin.id,
      });
      expect(error?.message).toMatch(/Only admins/);
    });

    it('admin_audit_log registra la promoción', async () => {
      const { data } = await supabaseAdmin
        .from('admin_audit_log')
        .select('action, target_id')
        .eq('action', 'promote_admin')
        .eq('target_id', target.id)
        .order('created_at', { ascending: false })
        .limit(1);
      expect(data?.[0]?.target_id).toBe(target.id);
    });
  });
  ```

- [ ] **🤖 Step 2: Correr**

  ```bash
  npm run test:integration -- promote-admin
  ```

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add tests/integration/promote-admin.test.ts
  git commit -m "test(admin): promote_to_admin function authorization"
  ```

---

### Task 11.3: Tests E2E de signup, login, reset, multi-device

**Files:**
- Create: `tests/e2e/signup.spec.ts`, `tests/e2e/login.spec.ts`, `tests/e2e/reset-password.spec.ts`, `tests/e2e/multi-device.spec.ts`

- [ ] **🤖 Step 1: Signup E2E**

  `tests/e2e/signup.spec.ts`:

  ```ts
  import { test, expect } from '@playwright/test';

  test('user can sign up and lands on verify-email', async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;

    await page.goto('/register');
    await page.fill('[name=full_name]', 'Test User');
    await page.fill('[name=email]', email);
    await page.fill('[name=phone]', '+525500001234');
    await page.fill('[name=password]', 'TestE2EPass1');
    await page.selectOption('[name=exam_target]', 'UNAM');
    await page.check('[name=accept_terms]');
    await page.click('button[type=submit]');

    await page.waitForURL(/\/verify-email/);
    await expect(page.locator('h1')).toContainText('Confirma tu correo');
  });

  test('signup rejects pwned password', async ({ page }) => {
    await page.goto('/register');
    await page.fill('[name=full_name]', 'Pwned User');
    await page.fill('[name=email]', `pwned-${Date.now()}@example.com`);
    await page.fill('[name=phone]', '+525500001234');
    await page.fill('[name=password]', 'password');
    await page.selectOption('[name=exam_target]', 'UNAM');
    await page.check('[name=accept_terms]');
    await page.click('button[type=submit]');

    await expect(page.locator('.error, .alert--error')).toContainText(/filtraciones/i);
  });
  ```

- [ ] **🤖 Step 2: Login E2E**

  `tests/e2e/login.spec.ts`:

  ```ts
  import { test, expect } from '@playwright/test';

  test('confirmed user can login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', process.env.TEST_USER_EMAIL!);
    await page.fill('[name=password]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type=submit]');
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText(/Hola/);
  });

  test('rate limit blocks 6th wrong attempt', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.goto('/login');
      await page.fill('[name=email]', 'rate-limit-test@example.com');
      await page.fill('[name=password]', 'wrong');
      await page.click('button[type=submit]');
      await page.waitForSelector('.alert--error');
    }
    await page.goto('/login');
    await page.fill('[name=email]', 'rate-limit-test@example.com');
    await page.fill('[name=password]', 'wrong');
    await page.click('button[type=submit]');
    await expect(page.locator('.alert--error')).toContainText(/Demasiados intentos/);
  });
  ```

- [ ] **🤖 Step 3: Multi-device E2E**

  `tests/e2e/multi-device.spec.ts`:

  ```ts
  import { test, expect } from '@playwright/test';

  test('4th login invalidates oldest session', async ({ browser }) => {
    const email = process.env.TEST_USER_EMAIL!;
    const password = process.env.TEST_USER_PASSWORD!;

    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const ctx3 = await browser.newContext();
    const ctx4 = await browser.newContext();

    for (const ctx of [ctx1, ctx2, ctx3, ctx4]) {
      const p = await ctx.newPage();
      await p.goto('/login');
      await p.fill('[name=email]', email);
      await p.fill('[name=password]', password);
      await p.click('button[type=submit]');
      await p.waitForURL('/dashboard');
    }

    // ctx1 (más antigua) debe ser desconectada al siguiente request
    const p1 = ctx1.pages()[0];
    await p1.goto('/dashboard');
    await expect(p1).toHaveURL(/\/login/);
  });
  ```

- [ ] **🤖 Step 4: Correr todos los E2E**

  ```bash
  npm run test:e2e
  ```

- [ ] **🤖 Step 5: Commit**

  ```bash
  git add tests/e2e/
  git commit -m "test(e2e): signup, login rate-limit, multi-device flows"
  ```

---

### Task 11.4: Script CI — verificar RLS y bundle

**Files:**
- Create: `scripts/check-rls.ts`

- [ ] **🤖 Step 1: Script de verificación de RLS**

  `scripts/check-rls.ts`:

  ```ts
  import { supabaseAdmin } from '../lib/supabase/admin';

  async function main() {
    const { data, error } = await supabaseAdmin
      .from('pg_class')
      .select('relname, relrowsecurity')
      .in('relname', ['profiles', 'user_sessions', 'admin_audit_log']);

    if (error) {
      console.error('Error querying pg_class:', error);
      process.exit(1);
    }

    let failed = false;
    for (const row of data ?? []) {
      if (!row.relrowsecurity) {
        console.error(`❌ Table ${row.relname} does NOT have RLS enabled`);
        failed = true;
      } else {
        console.log(`✅ ${row.relname} RLS enabled`);
      }
    }

    if (failed) process.exit(1);
  }

  main();
  ```

  > Nota: la query directa a `pg_class` puede requerir permisos especiales. Alternativa funcional:

  ```ts
  const tables = ['profiles', 'user_sessions', 'admin_audit_log'];
  for (const t of tables) {
    const { error } = await supabaseAdmin.rpc('check_rls_enabled', { table_name: t });
    // ... o usar una migración que cree esa RPC helper
  }
  ```

  Para simplicidad inicial, ejecutar via Supabase CLI:

  ```bash
  npx supabase db remote query "SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('profiles','user_sessions','admin_audit_log');"
  ```

  Y verificar que todos digan `t`.

- [ ] **🤖 Step 2: Build y check de bundle**

  ```bash
  npm run build
  bash scripts/check-bundle-secrets.sh
  ```

  Esperado: build exitoso + "✅ No secrets in client bundle".

- [ ] **🤖 Step 3: Commit**

  ```bash
  git add scripts/check-rls.ts
  git commit -m "test: scripts to verify rls + bundle secret leakage"
  ```

---

> ✅ **CHECKPOINT 11:** Toda la suite de tests pasa. RLS verificada. Bundle limpio.

---

# Fase 12 — Deploy en Vercel

### Task 12.1: Configurar Vercel CLI

- [ ] **🤖 Step 1: Instalar Vercel CLI**

  ```bash
  npm i -g vercel
  ```

- [ ] **🧑 Step 2: USER ACTION — login en Vercel**

  ```bash
  vercel login
  ```

  Seleccionar GitHub, confirmar en navegador.

- [ ] **🧑 Step 3: USER ACTION — link al proyecto**

  ```bash
  vercel link
  ```

  - Set up and deploy? Y
  - Which scope? (la cuenta del usuario)
  - Link to existing project? N
  - Project name? `cefitips-prod` (o el deseado)
  - Directory? `./`
  - Override settings? N

  Esperado: archivo `.vercel/project.json` creado (gitignored).

---

### Task 12.2: Configurar variables de entorno en Vercel

- [ ] **🧑 Step 1: USER ACTION — copiar `.env.local` a Vercel**

  Para cada variable en `.env.local`:

  ```bash
  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  # pegar valor cuando pida
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
  vercel env add SUPABASE_SERVICE_ROLE_KEY production
  vercel env add UPSTASH_REDIS_REST_URL production
  vercel env add UPSTASH_REDIS_REST_TOKEN production
  vercel env add NEXT_PUBLIC_SITE_URL production
  # NEXT_PUBLIC_SITE_URL en producción será el dominio real, ver Task 12.4
  ```

- [ ] **🧑 Step 2: USER ACTION — agregar también para preview**

  ```bash
  vercel env add NEXT_PUBLIC_SUPABASE_URL preview
  # ... repetir para todas
  ```

  Mismo valor que producción (un solo entorno por ahora).

---

### Task 12.3: Primer deploy

- [ ] **🤖 Step 1: Deploy de preview**

  ```bash
  vercel
  ```

  Esperado: URL temporal `https://cefitips-prod-xxxx.vercel.app`. Esperar build.

- [ ] **🤖 Step 2: Smoke test del preview**

  Visitar la URL devuelta. Verificar:
  - Landing carga
  - `/login` carga
  - `curl -I` muestra headers de seguridad
  - Login con usuario test funciona
  - `/admin` con admin funciona

- [ ] **🤖 Step 3: Promover a producción**

  ```bash
  vercel --prod
  ```

---

### Task 12.4: Configurar dominio (cuando el TBD se resuelva)

> Esta tarea **solo se ejecuta cuando el usuario decida** la relación cefimat.com ↔ marca CEFITIPS (TBD del spec).

- [ ] **🧑 Step 1: USER ACTION — agregar dominio en Vercel**

  En Vercel dashboard del proyecto → Settings → Domains:
  - Add: `cefimat.com` (o subdominio elegido)
  - Vercel mostrará registros DNS a configurar (TXT para verificación, A o CNAME)

- [ ] **🧑 Step 2: USER ACTION — configurar DNS en Wix**

  En Wix → My Domains → cefimat.com → DNS Records:
  - Borrar A records de Wix
  - Agregar A record: `@` → `76.76.21.21` (IP de Vercel — Vercel lo confirma)
  - Agregar CNAME: `www` → `cname.vercel-dns.com`
  - Agregar TXT record que Vercel pidió para verificación

- [ ] **🧑 Step 3: USER ACTION — esperar propagación DNS (5-30 min) y verificar en Vercel**

- [ ] **🤖 Step 4: Actualizar `NEXT_PUBLIC_SITE_URL`**

  ```bash
  vercel env rm NEXT_PUBLIC_SITE_URL production
  vercel env add NEXT_PUBLIC_SITE_URL production
  # valor: https://cefimat.com (o lo que se decidió)
  ```

- [ ] **🤖 Step 5: Actualizar Site URL en Supabase**

  En Supabase dashboard → Authentication → URL Configuration:
  - Site URL: `https://cefimat.com`
  - Redirect URLs: agregar `https://cefimat.com/**`

- [ ] **🤖 Step 6: Actualizar Google OAuth**

  En Google Cloud Console → Credentials → editar el OAuth Client:
  - Authorized JavaScript origins: agregar `https://cefimat.com`
  - Authorized redirect URIs: ya está `https://YOUR_SUPABASE.supabase.co/auth/v1/callback`, no cambia

- [ ] **🤖 Step 7: Re-deploy con env actualizado**

  ```bash
  vercel --prod
  ```

- [ ] **🤖 Step 8: Smoke test final en producción**

  Visitar `https://cefimat.com`. Probar todo el flujo: signup → confirmar email → login → ver dashboard.

---

> ✅ **CHECKPOINT 12 (FINAL):** Aplicación funcionando en producción con dominio. Auth completo, multi-device limit funcional, admin panel accesible para promovidos.

---

## Acceptance Criteria — verificación final

Antes de marcar Cimientos como completo, ejecutar y verificar:

- [ ] `npm run dev` levanta sin errores
- [ ] `npm run typecheck` sin errores
- [ ] `npm run lint` sin errores
- [ ] `npm run test:unit` — todos passing
- [ ] `npm run test:integration` — todos passing
- [ ] `npm run test:e2e` — todos passing
- [ ] `bash scripts/check-bundle-secrets.sh` — pass
- [ ] Las 8 pantallas originales del frontend renderizan en Next.js con look & feel preservado
- [ ] Registro con email/password → recibe email de confirmación → confirma → entra al dashboard
- [ ] Registro con Google OAuth → completa perfil → entra al dashboard
- [ ] Email NO confirmado bloquea acceso a `(app)/*`
- [ ] Reset de password vía email funciona
- [ ] Cuatro logins simultáneos: el más antiguo se desconecta automáticamente
- [ ] Página `/perfil/dispositivos` lista 3 sesiones, revoke funciona
- [ ] Acceder a `/admin` sin claim redirige a `/dashboard`
- [ ] `promote_to_admin` falla si granted_by no es admin
- [ ] `curl -I https://<deploy>` muestra: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] CSP no contiene `unsafe-eval` ni `*`
- [ ] La página funciona sin warnings de violación de CSP en consola
- [ ] Rate limit bloquea 6° intento de login en 15 min
- [ ] RLS habilitado en `profiles`, `user_sessions`, `admin_audit_log` (verificado vía SQL)
- [ ] Service role key no aparece en `.next/static/**/*.js`
- [ ] Deploy en Vercel responde 200 en raíz

---

## Self-Review del plan

### Spec coverage

Verificación de cada item de la sección 13 del spec contra una tarea del plan:

| Spec | Task |
|---|---|
| `npm run dev` levanta sin errores | Task 1.1 step 13 |
| 8 pantallas migradas | Tasks 8.2, 9.1, 9.2, 9.3 |
| Registro email/password con confirm | Task 6.1 |
| Registro Google OAuth + completar | Tasks 6.2 GoogleButton, 6.4, 9.4 |
| Email no verificado bloquea | middleware Task 5.2 |
| Reset password | Task 6.3 |
| 4 logins → más antigua se invalida | Task 7.1, 7.2 |
| Mis dispositivos | Task 7.2 |
| Admin gate | Task 5.2, 10.1 |
| promote_to_admin valida granted_by | Task 2.5 + test 11.2 |
| Headers de seguridad | Tasks 5.1, 5.2, 5.3 |
| CSP estricta sin unsafe-eval/`*` | Task 5.1 |
| Rate limit 6° intento | Tasks 4.2, 11.3 |
| RLS habilitado | Task 2.4 + 11.4 |
| service_role no en bundle | Task 3.3 + 11.4 |
| Deploy en Vercel funciona | Task 12.3 |
| E2E tests passing | Tasks 11.3, 10.2 |

### Type consistency

- `enforceDeviceLimit` firma única en `lib/auth/multi-device.ts`, usada en login (Task 6.2), callback (Task 6.4), no diverge.
- `RegisterState`, `LoginState`, `ForgotState`, `ResetState` distintos por archivo, no se mezclan.
- `Database` type generado en Task 2.6 usado consistentemente.

### Placeholders

- Páginas placeholder en Fase 9.3 (cursos/lecciones/simulacros) son intencionales — pertenecen a otros sub-proyectos.
- Tareas de dominio (Task 12.4) condicionadas a la decisión TBD del usuario, lo cual está documentado.
- No hay TODOs/TBDs sin contexto.

---

## Execution Handoff

**Plan completo y guardado en `docs/superpowers/plans/2026-04-26-cimientos-implementation.md`. Dos opciones de ejecución:**

**1. Subagent-Driven (recomendado)** — el agente despacha un sub-agente fresco por tarea, revisión entre tareas, iteración rápida. Bueno para mantener contexto limpio en proyectos largos.

**2. Inline Execution** — ejecuta tareas en esta misma sesión usando `executing-plans`, batches con checkpoints para tu revisión.

**¿Cuál prefieres?**
