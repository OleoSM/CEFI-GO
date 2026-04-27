/* ============================================
   CEFITIPS Router — Single-source navigation layer

   Responsibilities:
   - Route registry with metadata (title, nav key, guards)
   - Session management via localStorage
   - Synchronous auth guards (no flash, runs before paint)
   - Dynamic document title
   - Active sidebar highlighting based on current route
   - View Transitions API for smooth same-origin navigation
   - Auth form submission (saves session, redirects with ?next)
   - Logout flow
   - Public programmatic API: window.CEFITIPS

   Load this file with a SYNCHRONOUS <script> in <head> on every page.
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'cefitips:session';

  /* Route registry — path → { name, title, nav, protected, guestOnly } */
  const ROUTES = {
    'index.html': {
      name: 'home',
      title: 'CEFITIPS · Entra a la universidad de tus sueños',
      public: true,
      nav: null,
    },
    'login.html': {
      name: 'login',
      title: 'Iniciar sesión · CEFITIPS',
      guestOnly: true,
    },
    'register.html': {
      name: 'register',
      title: 'Crear cuenta · CEFITIPS',
      guestOnly: true,
    },
    'dashboard.html': {
      name: 'dashboard',
      title: 'Dashboard · CEFITIPS',
      protected: true,
      nav: 'dashboard',
    },
    'course.html': {
      name: 'course',
      title: 'Mis cursos · CEFITIPS',
      protected: true,
      nav: 'course',
    },
    'lesson.html': {
      name: 'lesson',
      title: 'Lección · CEFITIPS',
      protected: true,
      nav: 'course',
    },
    'exam.html': {
      name: 'exam',
      title: 'Simulacro · CEFITIPS',
      protected: true,
      nav: 'exam',
    },
    'profile.html': {
      name: 'profile',
      title: 'Mi perfil · CEFITIPS',
      protected: true,
      nav: 'profile',
    },
  };

  /* -------- Current path resolution -------- */
  function getCurrentPath() {
    let p = location.pathname.split('/').pop();
    if (!p) p = 'index.html';
    return p.toLowerCase();
  }

  const currentPath = getCurrentPath();
  const currentRoute = ROUTES[currentPath] || ROUTES['index.html'];

  /* -------- Session (localStorage) -------- */
  const Session = {
    get() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    set(user) {
      const payload = Object.assign(
        {
          name: 'Ana García',
          email: 'ana@cefitips.mx',
          exam: 'UNAM',
          plan: 'Pro',
        },
        user || {},
        { loggedAt: Date.now() }
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) { /* quota/safari private */ }
      return payload;
    },
    clear() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    },
    isLoggedIn() {
      return this.get() !== null;
    },
  };

  /* ============================================
     SYNCHRONOUS GUARDS — runs before paint
     ============================================ */
  const hasSession = Session.isLoggedIn();

  if (currentRoute.protected && !hasSession) {
    location.replace('login.html?next=' + encodeURIComponent(currentPath));
    return;
  }
  if (currentRoute.guestOnly && hasSession) {
    location.replace('dashboard.html');
    return;
  }

  /* ============================================
     DOM-READY SETUP
     ============================================ */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function getInitials(name) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || '')
      .join('')
      .toUpperCase();
  }

  function getFirstName(name) {
    return (name || '').trim().split(/\s+/)[0] || '';
  }

  function applyTitle() {
    document.title = currentRoute.title;
  }

  function applyActiveNav() {
    const activeKey = currentRoute.nav;
    if (!activeKey) return;

    document.querySelectorAll('.nav-item').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const file = href.split('/').pop().toLowerCase();
      const match = ROUTES[file];
      if (match && match.nav === activeKey) {
        link.classList.add('is-active');
      } else if (link.classList.contains('is-active')) {
        // Only clear if it came from static markup that disagrees
        if (!match || match.nav !== activeKey) {
          link.classList.remove('is-active');
        }
      }
    });
  }

  function personalizeUI() {
    const session = Session.get();
    if (!session) return;

    const initials = getInitials(session.name);
    const first = getFirstName(session.name);

    document.querySelectorAll('[data-user-initials], .avatar-circle, .profile-avatar').forEach((el) => {
      el.textContent = initials;
    });
    document.querySelectorAll('[data-user-name]').forEach((el) => {
      el.textContent = session.name;
    });
    document.querySelectorAll('.avatar-name').forEach((el) => {
      el.textContent = first;
    });
    document.querySelectorAll('[data-user-email]').forEach((el) => {
      el.textContent = session.email;
    });
  }

  function supportsViewTransition() {
    return typeof document.startViewTransition === 'function';
  }

  function navigateTo(href) {
    if (!href) return;
    if (supportsViewTransition()) {
      document.startViewTransition(() => {
        window.location.href = href;
      });
    } else {
      window.location.href = href;
    }
  }

  function isExternal(href) {
    if (!href) return true;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        return new URL(href, location.href).origin !== location.origin;
      } catch (e) {
        return true;
      }
    }
    return false;
  }

  function installLinkInterception() {
    if (!supportsViewTransition()) return;

    document.addEventListener('click', (e) => {
      // Ignore modified clicks (new tab, save link, etc.)
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const a = e.target.closest('a');
      if (!a) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      if (a.hasAttribute('data-no-transition')) return;
      if (a.hasAttribute('data-logout')) return; // handled separately

      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const absolute = new URL(href, location.href);
      if (absolute.origin !== location.origin) return;

      // Same-page hash navigation? skip.
      if (
        absolute.pathname === location.pathname &&
        absolute.search === location.search &&
        absolute.hash
      ) return;

      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = absolute.href;
      });
    });
  }

  function installAuthForms() {
    document.querySelectorAll('[data-auth-form]').forEach((form) => {
      // Prevent double-binding if other scripts have already attached
      if (form.dataset.routerBound === '1') return;
      form.dataset.routerBound = '1';

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isRegister = form.dataset.authForm === 'register';
        const data = new FormData(form);

        const user = {
          name: (data.get('name') || '').toString().trim() || 'Ana García',
          email: (data.get('email') || '').toString().trim() || 'ana@cefitips.mx',
          exam: (data.get('exam') || '').toString() || 'UNAM',
          plan: 'Pro',
          isNew: isRegister,
        };

        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.classList.add('is-loading');
          btn.innerHTML =
            '<span class="spinner"></span> ' +
            (isRegister ? 'Creando cuenta...' : 'Iniciando...');
        }

        // Save session, then redirect (respect ?next param)
        setTimeout(() => {
          Session.set(user);
          const next = new URLSearchParams(location.search).get('next');
          const target = next && ROUTES[next] ? next : 'dashboard.html';
          navigateTo(target);
        }, 700);
      });
    });
  }

  function installLogout() {
    document.querySelectorAll('[data-logout]').forEach((btn) => {
      if (btn.dataset.routerBound === '1') return;
      btn.dataset.routerBound = '1';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        Session.clear();
        navigateTo('index.html');
      });
    });
  }

  onReady(function () {
    applyTitle();
    applyActiveNav();
    personalizeUI();
    installLinkInterception();
    installAuthForms();
    installLogout();
  });

  /* -------- Public API -------- */
  window.CEFITIPS = {
    routes: ROUTES,
    currentRoute: currentRoute,
    session: Session,
    navigate(routeName) {
      const entry = Object.entries(ROUTES).find(([, r]) => r.name === routeName);
      if (!entry) return;
      navigateTo(entry[0]);
    },
    navigateTo: navigateTo,
    logout() {
      Session.clear();
      navigateTo('index.html');
    },
  };
})();
