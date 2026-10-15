// Deterministic client-state tests; no packages, network or real YouTube playback.
// Run: node tools/test-apex-playback.js
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/blog.js'), 'utf8');
const template = fs.readFileSync(path.join(__dirname, '../templates/apex-card.html'), 'utf8');

function fixture({ apiReady = true, coarse = false } = {}) {
  let document;
  class Element {
    constructor(tag, classes = '') {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.attributes = {};
      this.events = {};
      this.hidden = false;
      this.disabled = false;
      this.clientWidth = 640;
      this.textContent = '';
      const names = new Set(classes.split(' ').filter(Boolean));
      this.classList = {
        add: name => names.add(name), remove: name => names.delete(name),
        contains: name => names.has(name),
        toggle: (name, on) => on ? names.add(name) : names.delete(name)
      };
      this.style = { setProperty() {} };
    }
    appendChild(child) { child.remove(); this.children.push(child); child.parentElement = this; return child; }
    remove() {
      if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(child => child !== this);
      this.parentElement = null;
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
    addEventListener(name, listener) { (this.events[name] ||= []).push(listener); }
    fire(name, event = {}) { (this.events[name] || []).forEach(listener => listener(event)); }
    focus() { document.activeElement = this; }
    click() { if (!this.disabled) { this.focus(); this.fire('click'); } }
    querySelector(selector) {
      for (const child of this.children) {
        if (selector[0] === '.' && child.classList.contains(selector.slice(1))) return child;
        const found = child.querySelector(selector);
        if (found) return found;
      }
      return null;
    }
    closest(selector) {
      return this.classList.contains(selector.slice(1)) ? this : this.parentElement?.closest(selector);
    }
  }

  const card = new Element('aside', 'affiliate-feature');
  const toggle = card.appendChild(new Element('button', 'apex-expand'));
  toggle.setAttribute('aria-expanded', 'false');
  const details = card.appendChild(new Element('div'));
  details.hidden = true;
  const stage = details.appendChild(new Element('div', 'apex-video'));
  const cover = stage.appendChild(new Element('button', 'apex-video-cover'));
  const label = cover.appendChild(new Element('span', 'apex-video-label'));
  const feedback = details.appendChild(new Element('p', 'apex-video-feedback'));
  const message = feedback.appendChild(new Element('span'));
  const external = feedback.appendChild(new Element('a'));
  feedback.hidden = external.hidden = true;
  for (const element of [label, message]) {
    element.appendChild(new Element('span', 'l-no'));
    element.appendChild(new Element('span', 'l-en'));
  }
  const langBtns = ['no', 'en'].map(lang => {
    const button = new Element('button');
    button.setAttribute('data-lang-btn', lang);
    return button;
  });
  const selectors = {
    '[data-apex-video-open]': cover, '.apex-expand': toggle,
    '[data-apex-video-feedback]': feedback, '[data-apex-video-status]': message,
    '[data-apex-video-external]': external
  };
  document = {
    head: new Element('head'), body: new Element('body'), documentElement: new Element('html'),
    activeElement: null, createElement: tag => new Element(tag),
    querySelector: selector => selectors[selector] || null,
    querySelectorAll: selector => selector === '[data-lang-btn]' ? langBtns : [],
    getElementById: id => id === 'apex-details' ? details : null
  };
  let time = 0;
  let serial = 0;
  const timers = new Map();
  const window = {
    location: { protocol: 'https:', origin: 'https://nextelite.no' },
    addEventListener() {}, scrollTo() {},
    matchMedia: () => ({ matches: coarse }),
    setTimeout: (callback, delay) => { const id = ++serial; timers.set(id, { at: time + delay, callback }); return id; },
    clearTimeout: id => timers.delete(id)
  };
  const instances = [];
  const YT = {
    PlayerState: { PLAYING: 1, PAUSED: 2, BUFFERING: 3, ENDED: 0, CUED: 5 },
    Player: function (frame, options) {
      const instance = {
        frame, options, playCalls: 0, muteCalls: 0, stops: 0, destroys: 0,
        playVideo() { this.playCalls++; }, mute() { this.muteCalls++; },
        stopVideo() { this.stops++; this.state(0); },
        destroy() { this.destroys++; frame.remove(); },
        ready() { options.events.onReady({ target: instance }); },
        state(data) { options.events.onStateChange({ target: instance, data }); },
        blocked() { options.events.onAutoplayBlocked({ target: instance }); },
        error(data) { options.events.onError({ target: instance, data }); }
      };
      instances.push(instance);
      return instance;
    }
  };
  if (apiReady) window.YT = YT;
  vm.runInNewContext(source, {
    window, document, Promise,
    IntersectionObserver: function () { this.observe = this.unobserve = () => {}; }
  });
  return {
    window, document, card, toggle, details, stage, cover, label, feedback, message, external, instances, langBtns,
    state: () => stage.getAttribute('data-apex-playback'),
    close: () => card.children.find(child => child.className === 'apex-video-close'),
    pendingTimers: () => timers.size,
    loadAPI() { window.YT = YT; window.onYouTubeIframeAPIReady(); },
    tick(delay) {
      const until = time + delay;
      while (true) {
        const next = [...timers].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        time = next[1].at;
        timers.delete(next[0]);
        next[1].callback();
      }
      time = until;
    }
  };
}

async function settle() { for (let i = 0; i < 5; i++) await Promise.resolve(); }
async function open(options) { const f = fixture(options); f.toggle.click(); await settle(); return f; }
const tests = [];
function test(name, run) { tests.push({ name, run }); }

test('nothing loads until activation; ready/cued/buffering retain the preview until PLAYING', async () => {
  const f = fixture();
  assert.equal(f.instances.length, 0);
  assert.equal(f.document.head.children.length, 0);
  f.toggle.click();
  await settle();
  const p = f.instances[0];
  assert.equal(f.details.hidden, false);
  assert.equal(f.state(), 'loading');
  assert.equal(f.cover.hidden, false);
  assert.equal(p.frame.referrerPolicy, 'strict-origin-when-cross-origin');
  assert.match(p.frame.src, /enablejsapi=1&playsinline=1&start=28&origin=https%3A%2F%2Fnextelite.no/);
  assert.match(p.frame.allow, /autoplay/);
  p.ready();
  assert.equal(p.playCalls, 1);
  p.state(-1); p.state(5); p.state(3);
  assert.equal(f.cover.hidden, false);
  assert.equal(p.frame.getAttribute('aria-hidden'), 'true');
  p.state(1);
  assert.equal(f.cover.hidden, true);
  assert.equal(f.state(), 'playing');
  assert.equal(f.feedback.hidden, true);
  assert.equal(p.frame.getAttribute('aria-hidden'), null);
  assert.equal(p.frame.getAttribute('tabindex'), '0');
  assert.equal(f.pendingTimers(), 0);
  p.state(2); p.state(3); p.state(0);
  assert.equal(f.state(), 'ended');
  assert.equal(f.cover.hidden, true, 'native controls stay exposed after pause/end');
  p.blocked();
  assert.equal(f.cover.hidden, true, 'a stale blocked event cannot cover active/native playback');
});

test('blocked playback keeps the cover and retries the same ready player directly on click', async () => {
  const f = await open();
  const p = f.instances[0];
  p.ready(); p.blocked();
  assert.equal(f.state(), 'blocked');
  assert.equal(f.cover.hidden, false);
  assert.equal(f.cover.disabled, false);
  assert.equal(f.feedback.hidden, false);
  assert.equal(f.external.hidden, false);
  assert.match(f.message.querySelector('.l-no').textContent, /Trykk/);
  assert.match(f.message.querySelector('.l-en').textContent, /Select/);
  f.cover.click();
  assert.equal(p.playCalls, 2, 'retry is synchronous in the user gesture');
  assert.equal(f.instances.length, 1);
  p.state(1);
  assert.equal(f.document.activeElement, p.frame);
  assert.equal(f.cover.hidden, true);
});

test('a paused initial player becomes retryable while coarse-pointer playback requests mute', async () => {
  const f = await open({ coarse: true });
  const p = f.instances[0];
  assert.match(p.frame.src, /&mute=1$/);
  p.ready();
  assert.equal(p.muteCalls, 1);
  p.state(2);
  assert.equal(f.state(), 'blocked');
  assert.equal(f.cover.hidden, false);
});

test('all player errors restore the cover, destroy the player, and permit a fresh retry', async () => {
  for (const errorCode of [2, 5, 100, 101, 150, 153]) {
    const f = await open();
    const p = f.instances[0];
    p.ready(); p.state(1); p.error(errorCode);
    assert.equal(f.state(), 'error');
    assert.equal(f.cover.hidden, false);
    assert.equal(p.stops, 1);
    assert.equal(p.destroys, 1);
    assert.equal(f.stage.children.length, 1);
    f.cover.click(); await settle();
    assert.equal(f.instances.length, 2);
    assert.match(f.instances[1].frame.src, /start=28/);
    p.state(1);
    assert.equal(f.cover.hidden, false, 'stale events from the destroyed player are ignored');
  }
});

test('a ready player that never plays times out into a clean preview fallback', async () => {
  const f = await open();
  const p = f.instances[0];
  p.ready(); p.state(3);
  f.tick(15000);
  assert.equal(f.state(), 'error');
  assert.equal(f.cover.hidden, false);
  assert.equal(f.cover.disabled, false);
  assert.equal(p.destroys, 1);
  assert.equal(f.pendingTimers(), 0);
});

test('API script failure and timeout can each be retried', async () => {
  for (const failure of ['error', 'timeout']) {
    const f = await open({ apiReady: false });
    const script = f.document.head.children[0];
    if (failure === 'error') script.onerror(); else f.tick(10000);
    await settle();
    assert.equal(f.state(), 'error');
    assert.equal(f.document.head.children.length, 0);
    assert.equal(f.pendingTimers(), 0);
    f.cover.click();
    assert.equal(f.document.head.children.length, 1);
    f.loadAPI(); await settle();
    assert.equal(f.instances.length, 1);
    f.instances[0].ready(); f.instances[0].state(1);
    assert.equal(f.cover.hidden, true);
  }
});

test('close before API load cancels timers/listeners and stale callbacks cannot start playback', async () => {
  const f = await open({ apiReady: false });
  const staleReady = f.window.onYouTubeIframeAPIReady;
  f.close().click();
  assert.equal(f.details.hidden, true);
  assert.equal(f.state(), 'idle');
  assert.equal(f.toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(f.document.activeElement, f.toggle);
  assert.equal(f.document.head.children.length, 0);
  assert.equal(f.pendingTimers(), 0);
  assert.equal(f.window.onYouTubeIframeAPIReady, undefined);
  staleReady(); await settle();
  assert.equal(f.instances.length, 0);
  f.toggle.click();
  f.loadAPI(); await settle();
  assert.equal(f.instances.length, 1);
});

test('close before player readiness, Escape, and repeated open/close stop and destroy each session', async () => {
  const f = await open();
  const first = f.instances[0];
  f.close().click();
  first.ready(); first.state(1);
  assert.equal(first.playCalls, 0);
  assert.equal(first.stops, 1);
  assert.equal(first.destroys, 1);
  assert.equal(f.cover.hidden, false);
  assert.equal(f.pendingTimers(), 0);
  for (let i = 0; i < 3; i++) {
    f.toggle.click(); await settle();
    const p = f.instances.at(-1);
    p.ready(); p.state(1);
    f.card.fire('keydown', { key: 'Escape' });
    assert.equal(p.stops, 1);
    assert.equal(p.destroys, 1);
    assert.equal(f.stage.children.length, 1);
    assert.equal(f.cover.hidden, false);
    assert.equal(f.details.hidden, true);
    assert.equal(f.document.activeElement, f.toggle);
    assert.equal(f.pendingTimers(), 0);
  }
});

test('language switching still updates the page; recovery copy and controls retain both languages', async () => {
  const f = await open();
  f.instances[0].ready(); f.instances[0].blocked();
  f.langBtns[1].click();
  assert.equal(f.document.body.getAttribute('data-lang'), 'en');
  assert.equal(f.document.documentElement.lang, 'en');
  assert.equal(f.langBtns[1].classList.contains('active'), true);
  assert.equal(f.message.querySelector('.l-en').textContent, 'Playback did not start. Select the image to try again.');
  f.langBtns[0].click();
  assert.equal(f.document.body.getAttribute('data-lang'), 'no');
  assert.match(template, /<button class="apex-video-cover" type="button"/);
  assert.match(template, /<button class="apex-expand" type="button"/);
  assert.match(template, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(template, /watch\?v=gMKWIcmWru0&amp;t=28s/);
  assert.match(template, /7516856c25c7465d9803f74c4ad4f589/);
});

(async () => {
  for (const { name, run } of tests) {
    await run();
    console.log('PASS ' + name);
  }
  console.log(`${tests.length} deterministic state tests passed. Real browser/YouTube playback is not covered.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
