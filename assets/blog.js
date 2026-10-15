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

// Expand the community card and request playback on the visitor’s click.
// The local preview stays visible until YouTube reports PLAYING, not just ready.
(function () {
  'use strict';

  var opener = document.querySelector('[data-apex-video-open]');
  var toggle = document.querySelector('.apex-expand');
  if (!opener || !toggle) return;
  var card = opener.closest('.affiliate-feature');
  var details = document.getElementById('apex-details');
  var container = opener.parentElement;
  var feedback = document.querySelector('[data-apex-video-feedback]');
  var message = document.querySelector('[data-apex-video-status]');
  var externalLink = document.querySelector('[data-apex-video-external]');
  var label = opener.querySelector('.apex-video-label');
  var player = null;
  var frame = null;
  var ready = false;
  var hasPlayed = false;
  var generation = 0;
  var playbackTimer = null;
  var apiLoad = null;
  var state = 'idle';
  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'apex-video-close';
  close.innerHTML = '<span class="l-no">Lukk video ×</span><span class="l-en" lang="en">Close video ×</span>';

  function bilingual(element, no, en) {
    element.querySelector('.l-no').textContent = no;
    element.querySelector('.l-en').textContent = en;
  }

  function setState(next) {
    state = next;
    container.setAttribute('data-apex-playback', next);
    container.setAttribute('aria-busy', next === 'loading' ? 'true' : 'false');
    // Keep the native button focusable while ignoring duplicate loading clicks.
    opener.setAttribute('aria-disabled', next === 'loading' ? 'true' : 'false');
  }

  function clearPlaybackTimer() {
    window.clearTimeout(playbackTimer);
    playbackTimer = null;
  }

  function destroyPlayer() {
    // Invalidate queued ready/state events before stopping or removing the frame.
    generation += 1;
    clearPlaybackTimer();
    if (apiLoad) apiLoad.cancel();
    var previous = player;
    player = null;
    ready = false;
    hasPlayed = false;
    if (previous) {
      try { previous.stopVideo(); } catch (error) { /* It may not be ready yet. */ }
      try { previous.destroy(); } catch (error) { /* Still remove its frame below. */ }
    }
    if (frame) frame.remove();
    frame = null;
  }

  function showPreview() {
    opener.hidden = false;
    if (frame) {
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
    }
  }

  function recover(kind, keepPlayer) {
    var restoreFocus = frame && document.activeElement === frame;
    clearPlaybackTimer();
    if (!keepPlayer) destroyPlayer();
    showPreview();
    setState(kind);
    bilingual(label, 'Prøv å spille av igjen', 'Try playing again');
    bilingual(message,
      kind === 'blocked' ? 'Avspillingen startet ikke. Trykk på bildet for å prøve igjen.' : 'Videoen kunne ikke lastes. Prøv igjen, eller åpne den på YouTube.',
      kind === 'blocked' ? 'Playback did not start. Select the image to try again.' : 'The video could not load. Try again, or open it on YouTube.');
    feedback.hidden = false;
    externalLink.hidden = false;
    if (restoreFocus) opener.focus({ preventScroll: true });
  }

  function waitForPlayback() {
    clearPlaybackTimer();
    var current = generation;
    playbackTimer = window.setTimeout(function () {
      if (generation === current && !details.hidden) recover('error', false);
    }, 15000);
  }

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (apiLoad) return apiLoad.promise;
    var loading = {};
    apiLoad = loading;
    loading.promise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      var previousReady = window.onYouTubeIframeAPIReady;
      var settled = false;
      var timer;
      function finish(error) {
        if (settled) return;
        settled = true;
        if (apiLoad === loading) apiLoad = null;
        window.clearTimeout(timer);
        script.onerror = null;
        if (window.onYouTubeIframeAPIReady === onAPIReady) window.onYouTubeIframeAPIReady = previousReady;
        if (error) {
          script.remove();
          reject(error);
        } else {
          resolve(window.YT);
        }
      }
      function onAPIReady() {
        try {
          if (typeof previousReady === 'function') previousReady();
        } finally {
          finish(window.YT && window.YT.Player ? null : new Error('YouTube API unavailable'));
        }
      }
      window.onYouTubeIframeAPIReady = onAPIReady;
      loading.cancel = function () { finish(new Error('YouTube API cancelled')); };
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = function () { finish(new Error('YouTube API failed to load')); };
      timer = window.setTimeout(function () { finish(new Error('YouTube API timed out')); }, 10000);
      document.head.appendChild(script);
    });
    return loading.promise;
  }

  function collapse() {
    destroyPlayer();
    showPreview();
    setState('idle');
    bilingual(label, 'Spill av video', 'Play the video');
    feedback.hidden = true;
    details.hidden = true;
    card.classList.remove('is-playing');
    toggle.setAttribute('aria-expanded', 'false');
    close.remove();
    toggle.focus();
  }

  function playVideo() {
    if (details.hidden || state === 'loading') return;
    setState('loading');
    bilingual(label, 'Laster video', 'Loading video');
    bilingual(message, 'Laster video …', 'Loading video …');
    feedback.hidden = false;
    externalLink.hidden = true;
    waitForPlayback();

    // Keep a blocked, ready player: this call runs directly in the retry gesture.
    if (player && ready) {
      try { player.playVideo(); } catch (error) { recover('error', false); }
      return;
    }

    var current = generation;
    loadYouTubeAPI().then(function (YT) {
      if (generation !== current || details.hidden) return;
      var startMuted = window.matchMedia && window.matchMedia('(max-width: 1100px), (pointer: coarse)').matches;
      frame = document.createElement('iframe');
      var origin = /^https?:$/.test(window.location.protocol) ? '&origin=' + encodeURIComponent(window.location.origin) : '';
      frame.src = 'https://www.youtube-nocookie.com/embed/gMKWIcmWru0?enablejsapi=1&playsinline=1&start=28' + origin + (startMuted ? '&mute=1' : '');
      frame.title = 'Apex Crypto livestream';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
      container.appendChild(frame);
      player = new YT.Player(frame, {
        events: {
          onReady: function (event) {
            if (generation !== current || details.hidden) return;
            ready = true;
            try {
              if (startMuted) event.target.mute();
              event.target.playVideo();
            } catch (error) { recover('error', false); }
          },
          onStateChange: function (event) {
            if (generation !== current || details.hidden) return;
            if (event.data === YT.PlayerState.PLAYING) {
              clearPlaybackTimer();
              hasPlayed = true;
              setState('playing');
              // Nothing covers YouTube's controls or advertising during playback.
              opener.hidden = true;
              frame.removeAttribute('aria-hidden');
              frame.setAttribute('tabindex', '0');
              feedback.hidden = true;
              if (document.activeElement === opener) frame.focus({ preventScroll: true });
            } else if (!hasPlayed && event.data === YT.PlayerState.PAUSED) {
              recover('blocked', true);
            } else if (hasPlayed) {
              setState(event.data === YT.PlayerState.BUFFERING ? 'buffering' : event.data === YT.PlayerState.ENDED ? 'ended' : 'paused');
            }
          },
          onAutoplayBlocked: function () {
            if (generation === current && !details.hidden && !hasPlayed) recover('blocked', true);
          },
          onError: function () {
            if (generation === current && !details.hidden) recover('error', false);
          }
        }
      });
    }).catch(function () {
      if (generation === current && !details.hidden) recover('error', false);
    });
  }

  toggle.addEventListener('click', function () {
    if (toggle.getAttribute('aria-expanded') === 'true') { collapse(); return; }
    card.style.setProperty('--apex-cta-width', (card.clientWidth - 32) + 'px');
    details.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    card.classList.add('is-playing');
    card.appendChild(close);
    close.focus({ preventScroll: true });
    playVideo();
  });
  close.addEventListener('click', collapse);
  card.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !details.hidden) collapse();
  });
  opener.addEventListener('click', playVideo);
})();
