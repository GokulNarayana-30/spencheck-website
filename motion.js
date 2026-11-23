/* =========================================================
   SPENCHECK MOTION ENGINE — motion.js
   Zero-dependency, 60fps reactive choreography for AngularJS views.
   ========================================================= */
(function (global) {
  'use strict';

  var prefersReduced = function () {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  var isCoarsePointer = function () {
    return global.matchMedia && global.matchMedia('(pointer: coarse)').matches;
  };

  var state = {
    globalInit: false,
    revealObserver: null,
    counterObserver: null,
    failsafeTimers: [],
    rafScrollPending: false,
    heroCanvasCleanup: null,
    storyCleanup: null
  };

  // ── Theme Persistence ────────────────────────────────────
  function getSavedTheme() {
    try {
      var saved = global.localStorage.getItem('spencheck_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    return 'dark';
  }

  function applyTheme(theme) {
    var resolved = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', resolved);
    try {
      global.localStorage.setItem('spencheck_theme', resolved);
    } catch (_) {}
    return resolved;
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    return applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── Global Scroll Progress & Navbar Glass ────────────────
  function updateScrollChrome() {
    state.rafScrollPending = false;
    var scrollTop = global.scrollY || document.documentElement.scrollTop || 0;
    var docHeight = Math.max(
      document.documentElement.scrollHeight - global.innerHeight,
      1
    );
    var pct = Math.min(1, Math.max(0, scrollTop / docHeight));

    var progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
      progressEl.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
    }

    var navbar = document.querySelector('.navbar');
    if (navbar) {
      if (scrollTop > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  function onScroll() {
    if (!state.rafScrollPending) {
      state.rafScrollPending = true;
      global.requestAnimationFrame(updateScrollChrome);
    }
  }

  function initAmbientParallax() {
    if (prefersReduced() || isCoarsePointer()) return;
    var rafPending = false;
    var targetX = 0;
    var targetY = 0;

    global.addEventListener(
      'pointermove',
      function (e) {
        targetX = (e.clientX / Math.max(global.innerWidth, 1) - 0.5) * 28;
        targetY = (e.clientY / Math.max(global.innerHeight, 1) - 0.5) * 28;
        if (!rafPending) {
          rafPending = true;
          global.requestAnimationFrame(function () {
            rafPending = false;
            document.documentElement.style.setProperty('--aurora-px', targetX.toFixed(1) + 'px');
            document.documentElement.style.setProperty('--aurora-py', targetY.toFixed(1) + 'px');
          });
        }
      },
      { passive: true }
    );
  }

  function initGlobal() {
    if (state.globalInit) return;
    state.globalInit = true;
    applyTheme(getSavedTheme());
    global.addEventListener('scroll', onScroll, { passive: true });
    global.addEventListener('resize', onScroll, { passive: true });
    updateScrollChrome();
    initAmbientParallax();
  }

  // ── Animated Number Counters ─────────────────────────────
  function animateCounter(el) {
    if (el.getAttribute('data-counted') === '1') return;
    el.setAttribute('data-counted', '1');

    var target = parseFloat(el.getAttribute('data-target') || '0');
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var useIndian = el.getAttribute('data-format') === 'in';

    function formatVal(val) {
      var fixed = decimals > 0 ? Number(val.toFixed(decimals)) : Math.round(val);
      var str = useIndian ? fixed.toLocaleString('en-IN') : String(fixed);
      return prefix + str + suffix;
    }

    if (prefersReduced() || target === 0) {
      el.textContent = formatVal(target);
      return;
    }

    var duration = 1150;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var t = Math.min(1, elapsed / duration);
      // easeOutExpo
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = formatVal(target * eased);
      if (t < 1) {
        global.requestAnimationFrame(step);
      } else {
        el.textContent = formatVal(target);
      }
    }
    global.requestAnimationFrame(step);
  }

  // ── Cursor Spotlight Cards ───────────────────────────────
  function bindSpotlights(root) {
    if (isCoarsePointer()) return;
    var cards = root.querySelectorAll('.spotlight-card');
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        if (card.getAttribute('data-spot-bound') === '1') return;
        card.setAttribute('data-spot-bound', '1');
        card.addEventListener(
          'pointermove',
          function (e) {
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px');
            card.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px');
          },
          { passive: true }
        );
      })(cards[i]);
    }
  }

  // ── 3D Perspective Phone & Card Tilt ─────────────────────
  function bindPhoneTilt(root) {
    if (prefersReduced() || isCoarsePointer()) return;
    var phones = root.querySelectorAll('.tilt-phone, .tilt-card');
    for (var i = 0; i < phones.length; i++) {
      (function (el) {
        if (el.getAttribute('data-tilt-bound') === '1') return;
        el.setAttribute('data-tilt-bound', '1');
        var raf = 0;
        var rx = 0;
        var ry = 0;
        var gx = 50;
        var gy = 50;

        el.addEventListener(
          'pointermove',
          function (e) {
            var rect = el.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            var nx = (e.clientX - rect.left) / rect.width - 0.5;
            var ny = (e.clientY - rect.top) / rect.height - 0.5;
            ry = nx * 13;
            rx = -ny * 13;
            gx = (nx + 0.5) * 100;
            gy = (ny + 0.5) * 100;
            if (!raf) {
              raf = global.requestAnimationFrame(function () {
                raf = 0;
                el.style.transform =
                  'perspective(1000px) rotateX(' +
                  rx.toFixed(2) +
                  'deg) rotateY(' +
                  ry.toFixed(2) +
                  'deg) translateZ(8px)';
                el.style.setProperty('--gx', gx.toFixed(1) + '%');
                el.style.setProperty('--gy', gy.toFixed(1) + '%');
              });
            }
          },
          { passive: true }
        );

        el.addEventListener('pointerleave', function () {
          el.style.transform = '';
          el.style.setProperty('--gx', '50%');
          el.style.setProperty('--gy', '50%');
        });
      })(phones[i]);
    }
  }

  // ── Magnetic Buttons ─────────────────────────────────────
  function bindMagneticButtons(root) {
    if (prefersReduced() || isCoarsePointer()) return;
    var btns = root.querySelectorAll('.btn-magnetic');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        if (btn.getAttribute('data-mag-bound') === '1') return;
        btn.setAttribute('data-mag-bound', '1');
        btn.addEventListener(
          'pointermove',
          function (e) {
            var rect = btn.getBoundingClientRect();
            var dx = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            var dy = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
            btn.style.transform = 'translate(' + dx.toFixed(1) + 'px, ' + (dy - 2).toFixed(1) + 'px)';
          },
          { passive: true }
        );
        btn.addEventListener('pointerleave', function () {
          btn.style.transform = '';
        });
      })(btns[i]);
    }
  }

  // ── Hero Ambient Particle & Filament Canvas ──────────────
  function destroyHeroCanvas() {
    if (typeof state.heroCanvasCleanup === 'function') {
      state.heroCanvasCleanup();
      state.heroCanvasCleanup = null;
    }
  }

  function initHeroCanvas() {
    destroyHeroCanvas();
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || !canvas.getContext) return;
    if (prefersReduced()) return;

    var ctx = canvas.getContext('2d');
    var rafId = 0;
    var width = 0;
    var height = 0;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var pointer = { x: -9999, y: -9999, active: false };
    var nodes = [];
    var nodeCount = global.innerWidth < 768 ? 24 : 44;

    function resize() {
      var rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : canvas.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 420);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedNodes() {
      nodes = [];
      var palette = ['139, 155, 255', '44, 92, 224', '18, 183, 106', '158, 119, 237'];
      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          r: 1.4 + Math.random() * 2.0,
          rgb: palette[i % palette.length],
          alpha: 0.35 + Math.random() * 0.45
        });
      }
    }

    function onMove(e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }

    function onLeave() {
      pointer.active = false;
    }

    function step() {
      if (document.hidden) {
        rafId = global.requestAnimationFrame(step);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      var lineAlphaScale = isLight ? 0.14 : 0.22;

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (pointer.active) {
          var dx = n.x - pointer.x;
          var dy = n.y - pointer.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 1) {
            var push = (140 - dist) / 140 * 0.35;
            n.x += (dx / dist) * push;
            n.y += (dy / dist) * push;
          }
        }

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var lx = n.x - m.x;
          var ly = n.y - m.y;
          var d2 = lx * lx + ly * ly;
          if (d2 < 19600) {
            var a = (1 - Math.sqrt(d2) / 140) * lineAlphaScale;
            ctx.strokeStyle = 'rgba(' + n.rgb + ', ' + a.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = 'rgba(' + n.rgb + ', ' + (isLight ? n.alpha * 0.7 : n.alpha).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = global.requestAnimationFrame(step);
    }

    resize();
    seedNodes();
    rafId = global.requestAnimationFrame(step);

    var parent = canvas.parentElement || canvas;
    global.addEventListener('resize', resize, { passive: true });
    parent.addEventListener('pointermove', onMove, { passive: true });
    parent.addEventListener('pointerleave', onLeave, { passive: true });

    state.heroCanvasCleanup = function () {
      global.cancelAnimationFrame(rafId);
      global.removeEventListener('resize', resize);
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
    };
  }

  // ── Scroll Story: pinned phone + scrolling steps ─────────
  // The step crossing the "probe" line is active; its screen, callout
  // and text get .is-active, earlier ones .is-past. --story-progress
  // (0–1) drives the rail and glow. Probe sits mid-screen on desktop and
  // lower on phones, where the pinned phone covers the top of the screen.
  function initStory(root) {
    var story = root.querySelector('.story');
    if (!story) return;
    var steps = story.querySelectorAll('.story-step');
    var screens = story.querySelectorAll('.story-screen');
    var callouts = story.querySelectorAll('.story-callout');
    var stepsWrap = story.querySelector('.story-steps');
    if (!steps.length || !screens.length || !stepsWrap) return;

    var active = -1;
    var raf = 0;

    function setActive(idx) {
      if (idx === active) return;
      active = idx;
      var lists = [steps, screens, callouts];
      for (var l = 0; l < lists.length; l++) {
        for (var i = 0; i < lists[l].length; i++) {
          var el = lists[l][i];
          var n = Number(el.getAttribute('data-step') || el.getAttribute('data-scene') || i);
          el.classList.toggle('is-active', n === idx);
          el.classList.toggle('is-past', n < idx);
        }
      }
    }

    function update() {
      raf = 0;
      var narrow = global.innerWidth <= 900;
      var probe = global.innerHeight * (narrow ? 0.72 : 0.5);
      var idx = 0;
      for (var i = 0; i < steps.length; i++) {
        var r = steps[i].getBoundingClientRect();
        // Desktop: switch when the step's text (centred in its block)
        // reaches just below mid-screen, so words and phone change together.
        var edge = narrow ? r.top : r.top + r.height / 2 - global.innerHeight * 0.12;
        if (edge <= probe) idx = i;
      }
      setActive(idx);
      var box = stepsWrap.getBoundingClientRect();
      var p = (probe - box.top) / Math.max(1, box.height);
      story.style.setProperty('--story-progress', Math.min(1, Math.max(0, p)).toFixed(3));
    }

    function onScrollStory() {
      if (!raf) raf = global.requestAnimationFrame(update);
    }

    global.addEventListener('scroll', onScrollStory, { passive: true });
    global.addEventListener('resize', onScrollStory, { passive: true });
    update();

    state.storyCleanup = function () {
      global.removeEventListener('scroll', onScrollStory);
      global.removeEventListener('resize', onScrollStory);
      if (raf) global.cancelAnimationFrame(raf);
    };
  }

  // ── View Cleanup & Init ──────────────────────────────────
  function cleanupView() {
    destroyHeroCanvas();
    if (state.storyCleanup) {
      state.storyCleanup();
      state.storyCleanup = null;
    }
    if (state.revealObserver) {
      state.revealObserver.disconnect();
      state.revealObserver = null;
    }
    if (state.counterObserver) {
      state.counterObserver.disconnect();
      state.counterObserver = null;
    }
    while (state.failsafeTimers.length) {
      global.clearTimeout(state.failsafeTimers.pop());
    }
  }

  function revealImmediately(el) {
    el.classList.add('is-visible');
  }

  function initView() {
    initGlobal();
    cleanupView();
    updateScrollChrome();

    var root = document.querySelector('main') || document;
    var reveals = root.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    var counters = root.querySelectorAll('.count-up[data-target]');

    if (prefersReduced() || typeof global.IntersectionObserver !== 'function') {
      for (var i = 0; i < reveals.length; i++) revealImmediately(reveals[i]);
      for (var j = 0; j < counters.length; j++) animateCounter(counters[j]);
    } else {
      state.revealObserver = new global.IntersectionObserver(
        function (entries) {
          for (var k = 0; k < entries.length; k++) {
            if (entries[k].isIntersecting) {
              revealImmediately(entries[k].target);
              state.revealObserver.unobserve(entries[k].target);
            }
          }
        },
        { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
      );

      for (var r = 0; r < reveals.length; r++) {
        var el = reveals[r];
        var rect = el.getBoundingClientRect();
        if (rect.top < global.innerHeight * 0.96) {
          revealImmediately(el);
        } else {
          state.revealObserver.observe(el);
        }
      }

      // Fail-safe so nothing near or above the viewport ever stays invisible
      state.failsafeTimers.push(
        global.setTimeout(function () {
          for (var idx = 0; idx < reveals.length; idx++) {
            var item = reveals[idx];
            if (!item.classList.contains('is-visible')) {
              var b = item.getBoundingClientRect();
              if (b.top < global.innerHeight * 1.15) {
                revealImmediately(item);
              }
            }
          }
        }, 900)
      );

      state.counterObserver = new global.IntersectionObserver(
        function (entries) {
          for (var m = 0; m < entries.length; m++) {
            if (entries[m].isIntersecting) {
              animateCounter(entries[m].target);
              state.counterObserver.unobserve(entries[m].target);
            }
          }
        },
        { threshold: 0.15 }
      );

      for (var c = 0; c < counters.length; c++) {
        var cel = counters[c];
        if (cel.getBoundingClientRect().top < global.innerHeight * 0.96) {
          animateCounter(cel);
        } else {
          state.counterObserver.observe(cel);
        }
      }
    }

    bindSpotlights(root);
    bindPhoneTilt(root);
    bindMagneticButtons(root);
    initHeroCanvas();
    initStory(root);
  }

  // Refresh scroll reveals after dynamic Angular filter changes (e.g. tabs/search)
  function refreshReveals() {
    var root = document.querySelector('main') || document;
    var hidden = root.querySelectorAll('.reveal:not(.is-visible), .reveal-up:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible), .reveal-scale:not(.is-visible)');
    for (var i = 0; i < hidden.length; i++) {
      var rect = hidden[i].getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.top < global.innerHeight * 1.05) {
        revealImmediately(hidden[i]);
      }
    }
    bindSpotlights(root);
    bindPhoneTilt(root);
  }

  global.SpencheckMotion = {
    initGlobal: initGlobal,
    initView: initView,
    refreshReveals: refreshReveals,
    toggleTheme: toggleTheme,
    applyTheme: applyTheme,
    getTheme: getSavedTheme
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobal);
  } else {
    initGlobal();
  }
})(window);

