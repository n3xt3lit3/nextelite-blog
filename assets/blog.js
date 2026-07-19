// nextelite blog — delt klient-JS for statisk genererte sider.
// Innholdet er statisk i HTML (begge språk emittet som .l-no/.l-en).
// Denne fila gjør KUN: språkbryter, fade-in-observer, nav-skjuling.
// Oppførselen er bevart 1:1 fra de originale inline-skriptene.

(function () {
  'use strict';

  var langBtns = document.querySelectorAll('[data-lang-btn]');

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.body.setAttribute('data-lang', lang);

    langBtns.forEach(function (b) {
      b.classList.remove('active');
      if (b.getAttribute('data-lang-btn') === lang) b.classList.add('active');
    });

    // swap nav labels with data-no / data-en
    document.querySelectorAll('[data-no][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });

    // bilingual media attributes (alt / aria-label)
    document.querySelectorAll('[data-alt-no][data-alt-en]').forEach(function (el) {
      el.setAttribute('alt', el.getAttribute('data-alt-' + lang));
    });
    document.querySelectorAll('[data-aria-no][data-aria-en]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang));
    });

    // sidebar promo CTA
    var sidebarCta = document.querySelector('[data-sidebar-cta]');
    if (sidebarCta) {
      sidebarCta.innerHTML = (lang === 'no' ? 'Se mer' : 'See more') + ' <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
    }

    // boxing promo links carry current language — Mission Babel
    document.querySelectorAll('[data-boxing-link]').forEach(function (link) {
      link.href = 'https://nextelite.no/boxing/?lang=' + lang;
    });
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang-btn'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ═══════════════════════════════════════
  // INTERSECTION OBSERVER — fade-in on scroll
  // (index-sider: threshold 0.1 + rootMargin; vega-sider: 0.15)
  // ═══════════════════════════════════════
  var isVega = document.body.classList.contains('v-vega');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, isVega ? { threshold: 0.15 } : { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

  // ═══════════════════════════════════════
  // MARQUEE — invisible pause + prefers-reduced-motion runtime
  // Portert fra rhode-staging (Mission Cassini). Synlig pause-knapp fjernet
  // 2026-07-19 (CEO-korreksjon: satt midt i teksten, off UI). Pause-mekanisme
  // beholdt usynlig for WCAG 2.2.2 (32s > 5s krever pause-tilgang):
  //   - Desktop: mouseenter/leave paa .marquee (JS her).
  //   - Touch:   touchstart/touchend/touchcancel paa .marquee (JS her).
  //   - Keyboard: :focus-within paa .marquee (CSS-only, blog.css).
  //   - System:  prefers-reduced-motion runtime + OS-toggle-lytter (JS her).
  // enc0re REVIEW-260709 ISSUE-003 matchMedia change-listener med Safari<14
  // addListener-fallback bevart.
  // ═══════════════════════════════════════
  var marqueeEl = document.querySelector('.marquee');
  if (marqueeEl) {
    var pauseOn  = function () { marqueeEl.classList.add('is-paused'); };
    var pauseOff = function () { marqueeEl.classList.remove('is-paused'); };
    marqueeEl.addEventListener('mouseenter', pauseOn);
    marqueeEl.addEventListener('mouseleave', pauseOff);
    marqueeEl.addEventListener('touchstart',  pauseOn,  { passive: true });
    marqueeEl.addEventListener('touchend',    pauseOff, { passive: true });
    marqueeEl.addEventListener('touchcancel', pauseOff, { passive: true });

    // Runtime reduced-motion: init state fra OS-preferansen + OS-toggle mid-økt.
    var mm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mm && mm.matches) marqueeEl.classList.add('is-paused');
    if (mm) {
      var onReduceChange = function (e) {
        marqueeEl.classList.toggle('is-paused', e.matches);
      };
      if (mm.addEventListener) {
        mm.addEventListener('change', onReduceChange);
      } else if (mm.addListener) {
        mm.addListener(onReduceChange);
      }
    }
  }

  // ═══════════════════════════════════════
  // NAV HIDE ON SCROLL DOWN, SHOW ON UP
  // (marquee slides sammen med nav når den er tilstede — sømløs top-of-page-motiv)
  // ═══════════════════════════════════════
  var lastScroll = 0;
  var navEl = document.querySelector('nav');
  window.addEventListener('scroll', function () {
    var current = window.scrollY;
    var hide = current > lastScroll && current > 100;
    if (navEl) navEl.style.transform = hide ? 'translateY(-100%)' : 'translateY(0)';
    if (marqueeEl) marqueeEl.style.transform = hide ? 'translateY(-100%)' : 'translateY(0)';
    lastScroll = current;
  }, { passive: true });
})();
