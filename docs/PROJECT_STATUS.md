# Plataforma_UNITIPS / CEFITIPS — Estado del Proyecto

> Documento vivo. Actualizar al final de cada sesión de trabajo para que la siguiente conversación retome contexto sin perder hilo.

## Resumen

Convertir el frontend estático ya construido (marca **CEFITIPS**, directorio `Plataforma_UNITIPS`) en una clonación funcional de [unitips.mx](https://www.unitips.mx).

- **Stack elegido:** Supabase (DB + Auth + Storage) · despliegue tentativo en Vercel
- **Modelo de pago:** transferencia bancaria con validación manual por admin (NO pasarela)
- **Prioridad #1:** ciberseguridad — RLS, validación server-side, CORS estricto, anti-inyección, headers de seguridad

## Pantallas existentes en frontend

`index.html` · `login.html` · `register.html` · `dashboard.html` · `course.html` · `lesson.html` · `exam.html` · `profile.html`

Sesión actual: `localStorage` placeholder en `js/router.js` con guards síncronos. Será reemplazado por Supabase Auth.

## Descomposición en sub-proyectos

| # | Sub-proyecto | Estado | Spec |
|---|---|---|---|
| 1 | Cimientos: Supabase + Auth + Seguridad base + Vercel | 🟡 plan escrito, ejecución en curso | [spec](superpowers/specs/2026-04-26-cimientos-design.md) · [plan](superpowers/plans/2026-04-26-cimientos-implementation.md) |
| 2 | Catálogo de cursos y planes | ⚪ no iniciado | — |
| 3 | Pago por transferencia + upload de comprobante | ⚪ no iniciado | — |
| 4 | Panel de administrador | ⚪ no iniciado | — |
| 5 | Persistencia de exámenes y progreso | ⚪ no iniciado | — |
| 6 | Hardening final + auditoría de seguridad | ⚪ no iniciado | — |

Cada sub-proyecto sigue el flujo: **brainstorm → spec → plan → implementación**.
La seguridad se aplica **transversalmente** en cada uno, no solo al final.

## Sesión actual

**Fecha:** 2026-04-26
**Sub-proyecto activo:** #1 Cimientos
**Etapa:** plan de implementación escrito y commiteado. Ejecutando con `superpowers:executing-plans`. Fase 1 (scaffold Next.js) en curso; Fase 0 (cuentas Supabase/Upstash/GitHub) pendiente del usuario.

### Decisiones tomadas

- **2026-04-26 — Framework:** Next.js (App Router) + Supabase. Razón principal: operaciones sensibles (admin valida pagos, otorga acceso) deben correr server-side, no en el navegador. Middleware permite CSP/CORS por ruta. Migración del HTML existente es mecánica.
- **2026-04-26 — Auth:** correo+contraseña + Google OAuth + verificación de correo obligatoria + reset por correo. Sin Facebook. Reglas de password: ≥8 chars, rechazar top-100k filtradas, rate-limit 5 intentos / 15 min por cuenta+IP.
- **2026-04-26 — Datos de perfil al registro:** nombre, correo, contraseña, examen objetivo, **teléfono**. Campos editables después: carrera objetivo, fecha de ingreso al curso, fecha del examen, fecha de finalización del curso, racha de conexión.
- **2026-04-26 — Modelo de acceso:** paywall directo (sin trial). Pre-pago: solo landing + catálogo de cursos + 1 simulacro de muestra (los 10 reactivos hardcoded actuales).
- **2026-04-26 — Admin role:** Custom claims en JWT (`auth.users.raw_app_meta_data`). Primer admin via SQL manual; admins pueden promover otros desde el panel.
- **2026-04-26 — Sesiones simultáneas:** máximo 3 dispositivos al mismo tiempo. Tabla `user_sessions` para tracking.
- **2026-04-26 — Términos/Privacidad:** placeholder genérico al inicio; redactar antes de salir a producción.
- **2026-04-26 — Stack técnico:** TypeScript. Repo en GitHub privado (usuario `OleoSM`). Un solo entorno (producción) para empezar; migrar a dev+staging+prod después.
- **2026-04-26 — Admins iniciales:** 3 personas (usuario + 2 más, nombres pendientes).
- **2026-04-26 — Dominio:** `cefimat.com` registrado en Wix. ⚠️ pendiente confirmar relación con marca CEFITIPS (ver pregunta abajo).

### Preguntas abiertas

- **¿Dominio vs marca?** Compraste `cefimat.com` pero el frontend dice "CEFITIPS". Necesito saber: ¿la plataforma vive en `cefimat.com` (rebrandeamos a CEFIMAT) o en un subdominio tipo `tips.cefimat.com` / `plataforma.cefimat.com` (mantenemos marca CEFITIPS)?
- **¿Correo remitente?** (`hola@cefimat.com` / `no-reply@cefimat.com` / otro)
- ¿Verificación de email obligatoria antes de acceder?
- ¿Free trial estilo unitips.mx o paywall desde día uno?
- ¿Forma de marcar admin? (columna `role` vs tabla aparte vs custom claims)
- ¿Datos de perfil más allá de email/nombre? (examen objetivo, escuela, etc.)

## Cómo retomar la próxima sesión

1. Lee este archivo (`docs/PROJECT_STATUS.md`)
2. Lee la memoria del proyecto en `~/.claude/projects/.../memory/MEMORY.md`
3. Lee el spec aprobado en `docs/superpowers/specs/2026-04-26-cimientos-design.md`
4. Lee el plan en `docs/superpowers/plans/2026-04-26-cimientos-implementation.md` y revisa qué fases están commiteadas en `git log` para saber qué falta
5. **Próximo paso concreto:** invocar `superpowers:executing-plans` y continuar la siguiente fase pendiente (cada fase termina con un CHECKPOINT)
6. Si el usuario te pide otra cosa primero, atender eso.

## Specs y artefactos

- Specs de diseño: `docs/superpowers/specs/YYYY-MM-DD-<tema>-design.md`
- Memoria persistente: `~/.claude/projects/C--Users-arcti-OneDrive-Escritorio-CEFIMAT-Plataforma-UNITIPS/memory/`
