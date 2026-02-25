/* ─────────────────────────────────────────
   BĀK INSTITUTE — SCRIPT
   ───────────────────────────────────────── */

// Use 'var' or a check to prevent "already declared" errors if script is loaded twice
if (typeof tickerInnerInitialized === 'undefined') {
  window.tickerInnerInitialized = true;

  // ─── TICKER: Clone items via JS ───
  const tickerInner = document.getElementById('ticker-inner');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (tickerInner && !prefersReducedMotion) {
    const originalItems = Array.from(tickerInner.children);
    originalItems.forEach(item => {
      tickerInner.appendChild(item.cloneNode(true));
    });
  }

  // ─── SCROLL REVEAL ANIMATIONS ───
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  // ─── NAV SCROLL EFFECT ───
  const nav = document.querySelector('nav');
  let navTicking = false;
  if (nav) {
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(() => {
          if (nav.style) {
            nav.style.borderBottomColor = window.scrollY > 80
              ? 'rgba(200, 154, 46, 0.35)'
              : 'rgba(200, 154, 46, 0.2)';
          }
          navTicking = false;
        });
        navTicking = true;
      }
    }, { passive: true });
  }

  // ─── MOBILE HAMBURGER MENU ───
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── BACK TO TOP ───
  const backToTop = document.getElementById('back-to-top');
  let bttTicking = false;
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (!bttTicking) {
        requestAnimationFrame(() => {
          backToTop.classList.toggle('visible', window.scrollY > 400);
          bttTicking = false;
        });
        bttTicking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
