# Payment UI Design — CEFIGO

**Date:** 2026-05-25  
**Scope:** Frontend UI for Stripe subscription checkout, paywall enforcement, and post-payment welcome screen.

---

## 1. Overview

CEFIGO offers two subscription plans (6 months, 12 months) processed via **Stripe Hosted Checkout**. Free users have access to 2 topics from 1 subject and 1 practice exam. All other content requires an active plan.

This spec covers three UI surfaces:
1. `/suscribirse` — plan selector page
2. `PaywallOverlay` — reusable component that blocks locked content
3. `/bienvenida` — post-payment success page

---

## 2. Plans

| Plan | Duration | Price |
|------|----------|-------|
| Semestral | 6 months | TBD (set in Stripe dashboard) |
| Anual | 12 months | TBD (set in Stripe dashboard) |

Prices are configured in Stripe and fetched at runtime — no hardcoded values in code.

---

## 3. Navigation Flow

```
Free user hits locked content
        ↓
  PaywallOverlay (inline, not modal)
        ↓ "Ver planes"
  /suscribirse
        ↓ selects plan → "Continuar con Stripe"
  stripe.com/checkout (Stripe Hosted)
        ↓ success                ↓ cancel
  /bienvenida                /suscribirse?cancelled=true
  ?session_id={id}           (toast: "Pago cancelado")
```

Secondary entry point: "Obtener Pro" button in sidebar/dashboard → `/suscribirse`.

---

## 4. `/suscribirse` Page

**Route:** `app/(app)/suscribirse/page.tsx`  
**Layout:** Inside app shell (sidebar + topbar visible). Content centered, max-width 700px.

### Layout (top to bottom)

1. **Back link** — `← Volver` (goes to previous page via `router.back()`)
2. **Heading** — "Elige tu plan" + subtitle "Acceso completo a todo CEFIGO"
3. **Plan cards** (side by side on desktop, stacked on mobile)
   - 6 meses card: standard `.card` glassmorphism
   - 12 meses card: `.card-featured` gradient border (same as landing Pro card) + "★ Más popular" badge
   - Each card shows: plan name, price (fetched from Stripe), feature list, "Elegir" toggle button
   - Selected card: violet border highlight; unselected card: attenuated opacity
4. **CTA button** — "Continuar con Stripe →" — disabled (opacity-50, pointer-events-none) until a plan is selected
5. **Trust line** — "🔒 Pago seguro · SSL · Stripe"

### Cancelled state

If URL contains `?cancelled=true`, show a dismissible toast at the top: "Pago cancelado — puedes intentarlo de nuevo."

### Feature lists per card

**6 meses:**
- Todos los cursos y materias
- Exámenes ilimitados
- Recursos y materiales
- Acceso por 6 meses

**12 meses:**
- Todo lo del plan semestral
- 2 meses adicionales de acceso
- Mejor precio por mes

---

## 5. `PaywallOverlay` Component

**File:** `components/ui/paywall-overlay.tsx`  
**Type:** `'use client'` component, inline (not a modal).

### Props

```ts
interface PaywallOverlayProps {
  contentType: 'lesson' | 'exam' | 'resource';
}
```

### Behavior

- Wraps locked content with `blur(8px)` + `pointer-events: none` behind the card
- Card is centered within the content area (not fixed/portal)
- `contentType` controls the headline: "Este tema es Pro" / "Este examen es Pro" / "Este recurso es Pro"

### Layout

1. Lock icon
2. Headline (dynamic by `contentType`)
3. "Tu plan gratuito incluye:" — 2-item list of free tier limits
4. "Con Pro desbloqueas:" — 3-item checklist
5. Primary CTA: "Ver planes →" → `/suscribirse`
6. Secondary link: "Ya soy Pro · Iniciar sesión" → `/login`

---

## 6. `/bienvenida` Page

**Route:** `app/(app)/bienvenida/page.tsx`  
**Guard:** If `session_id` query param is absent or invalid → redirect to `/dashboard`.

### Layout (top to bottom)

1. **Hero** — "✦ ¡Ya eres Pro! ✦" heading with hero-enter animation
2. **Expiry line** — "Tu acceso está activo hasta [fecha]" (calculated: today + 6 or 12 months)
3. **Plan summary chip** — "Plan: 6 meses · $XXX MXN"
4. **Suggestions heading** — "¿Por dónde empezar?"
5. **3 suggestion cards** (horizontal row):
   - Cursos → `/courses`
   - Exámenes → `/exam`
   - Recursos → `/resources`
6. **Dashboard CTA** — "Ir a mi dashboard →" → `/dashboard`

### Session verification

- `session_id` from URL is verified server-side via Stripe API
- Verified response populates: plan name, amount, expiry date
- On failure (invalid/used session): redirect to `/dashboard`

---

## 7. Free Tier Limits (enforced by backend, reflected in UI)

| Content | Free limit |
|---------|-----------|
| Subjects | 1 (first subject only) |
| Topics per subject | 2 (first 2 topics) |
| Exams | 1 (first exam) |
| Resources | Locked |

`PaywallOverlay` is rendered by each page when the backend signals the content is locked — the component does not make this decision itself.

---

## 8. Files

| File | Type | Description |
|------|------|-------------|
| `app/(app)/suscribirse/page.tsx` | Server + Client | Plan selector page |
| `app/(app)/bienvenida/page.tsx` | Server Component | Post-payment success page |
| `components/ui/paywall-overlay.tsx` | Client Component | Inline paywall for locked content |

No new dependencies required. Stripe SDK (`@stripe/stripe-js`, `stripe`) will be added during backend implementation.
