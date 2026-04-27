/* ============================================
   CEFITIPS — Interactions
   ============================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------
     Navbar scroll state
  --------------------------------------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 16) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------
     Mobile menu
  --------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const setMenu = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) {
      mobileMenu.hidden = false;
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.hidden = true;
      document.body.style.overflow = '';
    }
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Reset mobile menu on resize to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && navToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
      }
    }, 120);
  });

  /* ---------------------------------------
     FAQ — close others on open
  --------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------------------------------------
     Reveal on scroll (IntersectionObserver)
  --------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------
     Animated counters
  --------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');

  const formatNumber = (n) => {
    if (n >= 1000) return Math.round(n).toLocaleString('es-MX');
    return Math.round(n);
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || (target >= 1000 ? '+' : '');
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = formatNumber(value) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  if (prefersReducedMotion) {
    counters.forEach((el) => {
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.suffix || (target >= 1000 ? '+' : '');
      el.textContent = formatNumber(target) + suffix;
    });
  } else if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterIO.observe(el));
  }

  /* ---------------------------------------
     Smooth-scroll offset for sticky navbar
  --------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  });

  /* ---------------------------------------
     Subtle parallax on device frame (desktop only)
  --------------------------------------- */
  const deviceFrame = document.querySelector('.device-frame');
  if (deviceFrame && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const heroVisual = document.querySelector('.hero__visual');
    let ticking = false;

    heroVisual.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        deviceFrame.style.transform = `perspective(1400px) rotateY(${-8 + x * 4}deg) rotateX(${4 - y * 4}deg)`;
        ticking = false;
      });
    });

    heroVisual.addEventListener('mouseleave', () => {
      deviceFrame.style.transform = '';
    });
  }
})();
