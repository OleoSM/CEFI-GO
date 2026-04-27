/* ============================================
   CEFITIPS App Shell — Interactions
   Handles: sidebar toggle, password toggle, tabs, exam sim, logout
   ============================================ */

(() => {
  'use strict';

  /* -------- Sidebar toggle (mobile) -------- */
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const backdrop = document.querySelector('.sidebar-backdrop');

  if (sidebarToggle && sidebar) {
    const setSidebar = (open) => {
      sidebar.classList.toggle('is-open', open);
      if (backdrop) backdrop.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      sidebarToggle.setAttribute('aria-expanded', String(open));
    };

    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      setSidebar(!isOpen);
    });

    if (backdrop) backdrop.addEventListener('click', () => setSidebar(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        setSidebar(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && sidebar.classList.contains('is-open')) {
        setSidebar(false);
      }
    });
  }

  /* -------- Password visibility toggle -------- */
  document.querySelectorAll('.toggle-pass').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrap').querySelector('input');
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.setAttribute('aria-label', isPw ? 'Ocultar contraseña' : 'Mostrar contraseña');
      btn.querySelector('.eye-on').style.display = isPw ? 'none' : 'block';
      btn.querySelector('.eye-off').style.display = isPw ? 'block' : 'none';
    });
  });

  /* -------- Tabs -------- */
  document.querySelectorAll('[data-tabs]').forEach((container) => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
        panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === target));
      });
    });
  });

  /* -------- Exam simulator -------- */
  const examData = window.__examData;
  if (examData) initExamSim(examData);

  function initExamSim(data) {
    const state = {
      current: 0,
      answers: Array(data.total).fill(null),
      flagged: Array(data.total).fill(false),
      timeLeft: data.timeSeconds || 1800,
    };

    const elQ = document.querySelector('[data-exam-question]');
    const elCounter = document.querySelector('[data-exam-counter]');
    const elOptions = document.querySelector('[data-exam-options]');
    const elGrid = document.querySelector('[data-exam-grid]');
    const elTimer = document.querySelector('[data-exam-timer]');
    const elPrev = document.querySelector('[data-exam-prev]');
    const elNext = document.querySelector('[data-exam-next]');
    const elFlag = document.querySelector('[data-exam-flag]');

    if (!elQ || !elOptions || !elGrid) return;

    // Render question grid
    elGrid.innerHTML = Array.from({ length: data.total }, (_, i) =>
      `<button class="q-cell" data-q="${i}" aria-label="Pregunta ${i + 1}">${i + 1}</button>`
    ).join('');

    const qCells = elGrid.querySelectorAll('.q-cell');
    qCells.forEach((cell) => {
      cell.addEventListener('click', () => {
        state.current = parseInt(cell.dataset.q, 10);
        render();
      });
    });

    function render() {
      const q = data.questions[state.current] || data.questions[0];
      elQ.textContent = q.text;
      elCounter.textContent = `Pregunta ${state.current + 1} de ${data.total}`;

      elOptions.innerHTML = q.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const selected = state.answers[state.current] === i ? 'is-selected' : '';
        return `
          <label class="option ${selected}" data-opt="${i}">
            <span class="option__letter">${letter}</span>
            <span class="option__text">${opt}</span>
            <input type="radio" name="q${state.current}" ${selected ? 'checked' : ''}>
          </label>
        `;
      }).join('');

      elOptions.querySelectorAll('.option').forEach((opt) => {
        opt.addEventListener('click', (e) => {
          e.preventDefault();
          state.answers[state.current] = parseInt(opt.dataset.opt, 10);
          render();
        });
      });

      // Update grid
      qCells.forEach((cell, i) => {
        cell.classList.toggle('is-current', i === state.current);
        cell.classList.toggle('is-answered', state.answers[i] !== null);
        cell.classList.toggle('is-flagged', state.flagged[i]);
      });

      // Update flag
      if (elFlag) {
        elFlag.classList.toggle('is-flagged', state.flagged[state.current]);
        const label = state.flagged[state.current] ? 'Desmarcar' : 'Marcar';
        elFlag.querySelector('.flag-label').textContent = label;
      }
    }

    if (elPrev) elPrev.addEventListener('click', () => {
      state.current = Math.max(0, state.current - 1);
      render();
    });
    if (elNext) elNext.addEventListener('click', () => {
      state.current = Math.min(data.total - 1, state.current + 1);
      render();
    });
    if (elFlag) elFlag.addEventListener('click', () => {
      state.flagged[state.current] = !state.flagged[state.current];
      render();
    });

    // Timer
    if (elTimer) {
      const fmt = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return h > 0
          ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
          : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      };
      elTimer.textContent = fmt(state.timeLeft);
      setInterval(() => {
        if (state.timeLeft > 0) {
          state.timeLeft--;
          elTimer.textContent = fmt(state.timeLeft);
        }
      }, 1000);
    }

    render();
  }

  /* Logout and auth form submission are handled by js/router.js */
})();
