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
  // MARQUEE — pause/play + prefers-reduced-motion runtime
  // Portert fra rhode-staging (Mission Cassini). Kun aktiv når forsiden
  // har renderet marquee-elementet (post-/arkiv-sider ignorerer denne blokka).
  // enc0re REVIEW-260709 ISSUE-002 + ISSUE-003: bilingual applyPauseState
  // helper (les data-lang, oppdater aria + ikon), matchMedia change-listener
  // med Safari<14 addListener-fallback så OS-toggle mid-økt respekteres.
  // ═══════════════════════════════════════
  var marqueeEl = document.querySelector('.marquee');
  var marqueePause = document.querySelector('.marquee__pause');
  if (marqueeEl && marqueePause) {
    // Husstil: norsk pause-verb = «pause bånd», play-verb = «fortsett bånd»
    // (per enc0re REVIEW-260709 ISSUE-002; CEO kan overstyre ved ja).
    var MARQUEE_LABELS = {
      no: { pause: 'pause bånd', play: 'fortsett bånd' },
      en: { pause: 'pause announcement', play: 'play announcement' }
    };
    var PAUSE_ICON = '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';
    var PLAY_ICON = '<path d="M6 4l12 8-12 8V4z" fill="currentColor"/>';

    function applyPauseState(paused) {
      var lang = document.body.getAttribute('data-lang') || 'no';
      var role = paused ? 'play' : 'pause';
      marqueeEl.classList.toggle('is-paused', paused);
      marqueePause.setAttribute('aria-pressed', paused ? 'true' : 'false');
      marqueePause.setAttribute('aria-label', MARQUEE_LABELS[lang][role]);
      // Oppdater data-aria-no/en så eksisterende lang-toggle-mekanikk
      // (blog.js linje 29-31) plukker riktig label ved språkbryt.
      marqueePause.setAttribute('data-aria-no', MARQUEE_LABELS.no[role]);
      marqueePause.setAttribute('data-aria-en', MARQUEE_LABELS.en[role]);
      var svg = marqueePause.querySelector('svg');
      if (svg) svg.innerHTML = paused ? PLAY_ICON : PAUSE_ICON;
    }

    // Runtime reduced-motion: init state fra OS-preferansen.
    var mm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mm && mm.matches) applyPauseState(true);

    // OS-toggle mid-økt respekteres (ISSUE-003). Safari<14 mangler
    // addEventListener på MediaQueryList — fall tilbake til deprecated
    // addListener der.
    if (mm) {
      var onReduceChange = function (e) { applyPauseState(e.matches); };
      if (mm.addEventListener) {
        mm.addEventListener('change', onReduceChange);
      } else if (mm.addListener) {
        mm.addListener(onReduceChange);
      }
    }

    marqueePause.addEventListener('click', function () {
      applyPauseState(!marqueeEl.classList.contains('is-paused'));
    });
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
