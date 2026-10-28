    // --- Contact form endpoint ---
    // Your Formspree form URL (formspree.io → your form → Integration).
    // Messages sent through the contact form are delivered to your Gmail.
    var FORMSPREE_ENDPOINT = 'https://formspree.io/f/meaakboa';

    // --- Projects data ---
    // To add a project, add one object to this list. Leave github or demo as ''
    // to hide that button. Screenshots go in the /projects folder (16:9 works
    // best); until the file exists, the card shows a placeholder instead.
    var PROJECTS = [
      {
        title: 'Inventory Management System',
        description: 'A Python-based system to track and manage items, quantities, and inventory data. ' +
          'Full write-up coming soon.',
        image: 'projects/inventory.png',
        tags: ['Python'],
        github: '',
        demo: ''
      },
      {
        title: 'Personal Portfolio',
        description: 'I needed one place to show my school work and freelance edits. ' +
          'I built this single-page site with plain HTML, CSS and JavaScript, with a light/dark theme, ' +
          'a mobile menu and an animated intro. Along the way I learned responsive layout and how to deploy on Vercel.',
        image: 'projects/portfolio.png',
        tags: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
        github: 'https://github.com/Jaypicntrlio/Jaypi',
        demo: 'https://jaypi.vercel.app'
      }
    ];

    // --- Sample work (Experience section) ---
    // Add 2–3 videos here to show the "Sample work" row; while the list is
    // empty the row stays hidden. YouTube links get their thumbnail
    // automatically; for other sites, set thumbnail to an image path
    // (e.g. '/experience/promo-1.jpg') or leave it '' for a plain placeholder.
    var SAMPLE_VIDEOS = [
      // { title: 'Shop promo', url: 'https://youtu.be/VIDEO_ID', thumbnail: '' },
    ];

    // --- Stats strip: "Projects built" counts the PROJECTS list ---
    (function () {
      var stat = document.getElementById('statProjects');
      if (stat) stat.textContent = PROJECTS.length + '+';
    })();

    // --- Projects rendering ---
    (function () {
      var grid = document.getElementById('projectsGrid');
      if (!grid) return;

      // Small helper: create an element with a class and (optional) text
      function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
      }

      function initials(title) {
        return title.split(/\s+/).filter(function (w) { return /^[A-Za-z]/.test(w); })
          .slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
      }

      // Text + sliding arrow, like the other buttons on the site
      function button(label, href, ghost) {
        var a = el('a', 'project-btn' + (ghost ? ' project-btn--ghost' : ''), label);
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        var arrow = el('span', 'btn-arrow', '→');
        arrow.setAttribute('aria-hidden', 'true');
        a.appendChild(arrow);
        return a;
      }

      PROJECTS.forEach(function (p, i) {
        var card = el('article', 'project-card reveal-item');
        // Stagger cards in the same row (up to 3 per row on desktop)
        card.style.setProperty('--reveal-delay', (i % 3) * 0.08 + 's');

        // Screenshot (16:9). The placeholder sits underneath and shows through
        // until the image loads, or for good if the file is missing.
        var media = el('div', 'project-media');
        media.appendChild(el('span', 'project-media-fallback', initials(p.title)));
        if (p.image) {
          var img = el('img', 'project-img');
          img.src = p.image;
          img.alt = 'Screenshot of ' + p.title;
          img.loading = 'lazy';
          img.decoding = 'async';
          img.width = 640;
          img.height = 360;
          img.onerror = function () { img.remove(); };
          media.appendChild(img);
        }
        card.appendChild(media);

        var body = el('div', 'project-body');
        body.appendChild(el('h3', 'project-title', p.title));
        body.appendChild(el('p', 'project-desc', p.description));

        var tags = el('div', 'project-tags');
        (p.tags || []).forEach(function (t) { tags.appendChild(el('span', 'project-tag', t)); });
        body.appendChild(tags);

        // Buttons: only render the ones that have a link
        if (p.github || p.demo) {
          var actions = el('div', 'project-actions');
          if (p.demo) actions.appendChild(button('Live Demo', p.demo, false));
          if (p.github) actions.appendChild(button('View Code', p.github, true));
          body.appendChild(actions);
        }

        card.appendChild(body);
        grid.appendChild(card);
      });
    })();

    // --- Sample work rendering ---
    (function () {
      var wrap = document.getElementById('sampleWork');
      var row = document.getElementById('sampleWorkRow');
      if (!wrap || !row || !SAMPLE_VIDEOS.length) return;

      // Pull the video ID out of youtube.com/watch?v=, youtu.be/ and /shorts/ links
      function youtubeThumb(url) {
        var m = url.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/);
        return m ? 'https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg' : '';
      }

      SAMPLE_VIDEOS.forEach(function (v) {
        var a = document.createElement('a');
        a.className = 'sample-thumb';
        a.href = v.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', 'Watch ' + (v.title || 'sample video') + ' (opens in a new tab)');

        var src = v.thumbnail || youtubeThumb(v.url);
        if (src) {
          var img = document.createElement('img');
          img.src = src;
          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';
          img.onerror = function () { img.remove(); };
          a.appendChild(img);
        }

        // Play badge, drawn over the thumbnail (or the plain placeholder)
        var play = document.createElement('span');
        play.className = 'sample-play';
        play.setAttribute('aria-hidden', 'true');
        a.appendChild(play);

        row.appendChild(a);
      });

      wrap.hidden = false;
    })();

    // --- Intro Animation cleanup ---
    (function () {
      var intro = document.getElementById('intro');
      if (!intro) return;
      // Reduced-motion users never see the intro (CSS hides it) — nothing to clean up
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var body = document.body;
      body.classList.add('intro-active'); // lock scroll while the intro plays

      // The wipe finishes at ~3.0s (2.2s delay + 0.8s); remove the overlay after that
      setTimeout(function () {
        intro.remove();
        body.classList.remove('intro-active');
      }, 3300);
    })();

    // --- Theme Toggle ---
    (function () {
      var toggleBtn = document.getElementById('themeToggle');
      var html = document.documentElement;

      // isDark: dark is the default, so no attribute on <html> = dark
      function isDark() {
        return html.getAttribute('data-theme') !== 'light';
      }

      function applyTheme(theme) {
        if (theme === 'light') {
          html.setAttribute('data-theme', 'light');
          toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        } else {
          html.removeAttribute('data-theme');
          toggleBtn.setAttribute('aria-label', 'Switch to light theme');
        }
      }

      // localStorage can throw (private mode, blocked site data) — never let that break the toggle
      function getSaved() {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
      }

      function save(theme) {
        try { localStorage.setItem('theme', theme); } catch (e) { /* not saved; still works this visit */ }
      }

      // Sync the button label with whatever the <head> script set before paint
      applyTheme(isDark() ? 'dark' : 'light');

      // Until the visitor picks a theme, follow system changes live
      // (e.g. their phone switching to dark mode at sunset)
      var systemLight = window.matchMedia('(prefers-color-scheme: light)');
      systemLight.addEventListener('change', function (e) {
        if (!getSaved()) applyTheme(e.matches ? 'light' : 'dark');
      });

      toggleBtn.addEventListener('click', function () {
        var newTheme = isDark() ? 'light' : 'dark';

        // Small spin animation on every toggle
        toggleBtn.classList.remove('spinning');
        void toggleBtn.offsetWidth; // restart the animation
        toggleBtn.classList.add('spinning');
        toggleBtn.addEventListener('animationend', function onEnd() {
          toggleBtn.classList.remove('spinning');
          toggleBtn.removeEventListener('animationend', onEnd);
        });

        applyTheme(newTheme);
        save(newTheme);
      });
    })();

    // --- Mobile Menu ---
    (function () {
      var nav = document.querySelector('nav');
      var menuBtn = document.getElementById('menuToggle');
      var links = document.getElementById('navLinks');
      if (!nav || !menuBtn || !links) return;

      function setOpen(open) {
        nav.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }

      menuBtn.addEventListener('click', function () {
        setOpen(!nav.classList.contains('menu-open'));
      });

      // Close after picking a section, so the page scrolls into view uncovered
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });

      // Close on Escape, and hand focus back to the menu button
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('menu-open')) {
          setOpen(false);
          menuBtn.focus();
        }
      });

      // Close when tapping anywhere outside the nav
      document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) setOpen(false);
      });

      // Close if the window grows back to desktop width
      window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) {
        if (e.matches) setOpen(false);
      });
    })();

    // --- Copy Email ---
    (function () {
      var btn = document.getElementById('copyEmail');
      var toast = document.getElementById('copyToast');
      if (!btn || !toast) return;

      var timeout;

      btn.addEventListener('click', function () {
        navigator.clipboard.writeText('johnpaullaurio0295@gmail.com').then(function () {
          toast.classList.add('show');
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            toast.classList.remove('show');
          }, 2000);
        });
      });
    })();

    // --- Contact Form (Formspree) ---
    (function () {
      var form = document.getElementById('contactForm');
      var btn = document.getElementById('contactSubmit');
      var status = document.getElementById('contactStatus');
      if (!form || !btn || !status) return;

      var btnText = btn.querySelector('.form-submit-text');
      var replyTo = document.getElementById('cf-replyto');

      function setStatus(message, type) {
        status.textContent = message;
        status.className = 'form-status' + (type ? ' is-' + type : '');
      }

      function setLoading(loading) {
        btn.disabled = loading;
        btn.classList.toggle('is-loading', loading);
        btn.setAttribute('aria-busy', loading ? 'true' : 'false');
        btnText.textContent = loading ? 'Sending…' : 'Send message';
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reply in Gmail goes straight to the visitor
        if (replyTo) replyTo.value = form.elements.email.value.trim();

        setLoading(true);
        setStatus('');

        fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Formspree returned ' + res.status);
            form.reset();
            setStatus('Message sent! I\'ll get back to you soon.', 'success');
          })
          .catch(function () {
            setStatus('Something went wrong. Please email me at johnpaullaurio0295@gmail.com.', 'error');
          })
          .then(function () {
            setLoading(false);
          });
      });
    })();

    // --- Scroll Reveal ---
    (function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var reveals = document.querySelectorAll('.reveal, .reveal-item');
      if (!reveals.length) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    })();
    // --- Active Nav Link ---
    // Highlights the navbar link whose section crosses the middle of the screen
    (function () {
      var links = document.querySelectorAll('.nav-links a[href^="#"]');
      var byId = {};
      var sections = [];
      links.forEach(function (a) {
        var section = document.getElementById(a.getAttribute('href').slice(1));
        if (section) {
          byId[section.id] = a;
          sections.push(section);
        }
      });
      if (!sections.length) return;

      function setActive(id) {
        links.forEach(function (a) {
          var on = byId[id] === a;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }

      // A thin band across the middle of the viewport: whichever section
      // is inside it is the one being read
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-45% 0px -54% 0px' });

      sections.forEach(function (s) { observer.observe(s); });

      // The hero has no nav link: clear the highlight when back at the top
      var hero = document.getElementById('hero');
      if (hero) {
        new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) setActive(null);
        }, { rootMargin: '-45% 0px -54% 0px' }).observe(hero);
      }

      // The last section may never reach the middle on tall screens, so
      // highlight it once the footer comes fully into view
      var footer = document.querySelector('footer');
      var last = sections[sections.length - 1];
      if (footer) {
        new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) setActive(last.id);
        }, { threshold: 1 }).observe(footer);
      }
    })();

    // --- Back to Top ---
    (function () {
      var btn = document.getElementById('backToTop');
      if (!btn) return;

      var ticking = false;
      function update() {
        btn.classList.toggle('show', window.scrollY > 400);
        ticking = false;
      }

      // Check at most once per frame while scrolling
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      }, { passive: true });
      update();

      btn.addEventListener('click', function () {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        // Move keyboard focus back to the top of the page too
        var brand = document.querySelector('.nav-brand');
        if (brand) brand.focus({ preventScroll: true });
      });
    })();

    // --- GitHub Activity: latest repos ---
    (function () {
      // If the chart service is down, hide the chart box instead of showing a broken image
      // (the image is lazy-loaded below the fold, so it can't have failed before this runs)
      var chart = document.querySelector('.gh-chart');
      var chartImg = chart && chart.querySelector('img');
      if (chartImg) {
        chartImg.addEventListener('error', function () { chart.hidden = true; });
        // On narrow screens the chart scrolls: start at the newest weeks (right end)
        chartImg.addEventListener('load', function () { chart.scrollLeft = chart.scrollWidth; });
      }

      var list = document.getElementById('ghRepos');
      if (!list) return;

      var USER = 'Jaypicntrlio';
      var API = 'https://api.github.com/users/' + USER + '/repos?sort=updated&per_page=10';
      var CACHE_KEY = 'ghRepos';
      // The API allows 60 requests an hour per visitor, so reuse results for 10 minutes
      var CACHE_MS = 10 * 60 * 1000;

      function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
      }

      function render(repos) {
        list.innerHTML = '';
        repos.forEach(function (r) {
          var li = el('li');
          var a = el('a', 'gh-repo');
          a.href = r.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';

          a.appendChild(el('span', 'gh-repo-name', r.name));
          a.appendChild(el('span', 'gh-repo-desc', r.description || 'No description yet.'));
          if (r.language) {
            var lang = el('span', 'gh-repo-lang', r.language);
            a.appendChild(lang);
          }
          li.appendChild(a);
          list.appendChild(li);
        });
      }

      function fail() {
        list.innerHTML = '';
        var li = el('li', 'gh-repo gh-repo--error');
        li.appendChild(document.createTextNode('Couldn\'t load my repositories right now. '));
        var a = el('a', null, 'See them on GitHub →');
        a.href = 'https://github.com/' + USER + '?tab=repositories';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        li.appendChild(a);
        list.appendChild(li);
      }

      // Session cache (wrapped in try/catch: storage can be blocked)
      try {
        var cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.time < CACHE_MS) {
          render(cached.repos);
          return;
        }
      } catch (e) { /* no cache, fetch instead */ }

      fetch(API, { headers: { 'Accept': 'application/vnd.github+json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('GitHub API ' + res.status);
          return res.json();
        })
        .then(function (data) {
          // Own repos only (skip forks), newest first, top 3
          var repos = data.filter(function (r) { return !r.fork; }).slice(0, 3).map(function (r) {
            return { name: r.name, description: r.description, language: r.language, url: r.html_url };
          });
          if (!repos.length) throw new Error('No public repos');
          render(repos);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), repos: repos }));
          } catch (e) { /* not cached; fine */ }
        })
        .catch(fail);
    })();

    // --- Hero Portrait: photo drawn as 0/1 "ASCII" on a canvas ---
    // Brightness is sampled on a ~60-column grid; bright areas get brighter
    // characters, dark areas faint or empty ones. A few random cells change
    // every 100ms. Hover shows the real photo in a spotlight; click/tap/Enter
    // reveals it fully.
    (function () {
      var frame = document.getElementById('portrait');
      if (!frame) return;
      var canvas = frame.querySelector('.portrait-ascii');
      var photo = frame.querySelector('.portrait-photo');
      var ctx = canvas.getContext('2d');

      var COLS = 60;
      var CELL_ASPECT = 1.55;     // cell height / width (mono characters are tall)
      var EMPTY_BELOW = 0.14;     // darker than this = no character
      var ACCENT_CHANCE = 0.05;   // share of bright cells drawn in the accent colour
      var FLICKER_MS = 100;
      var FLICKER_SHARE = 0.015;  // share of cells that change per tick
      // false: bright areas (like a white photo background) get the brightest
      // characters. true: flip it, so the subject is bright on an empty field.
      var INVERT = false;

      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      var img = new Image();
      var imgOk = false;
      var cells = [];
      var g = { cols: 0, rows: 0, cw: 0, chh: 0 };
      var colors = { ink: '#f2f2f2', accent: '#c9a227' };
      var timer = null;
      var onScreen = true;
      var revealed = false;

      function readColors() {
        var cs = getComputedStyle(frame);
        colors.ink = cs.getPropertyValue('--text-primary').trim() || colors.ink;
        colors.accent = cs.getPropertyValue('--accent').trim() || colors.accent;
      }

      function randomChar() {
        return Math.random() < 0.5 ? '0' : '1';
      }

      // Sample the photo: a square crop from the top (where the face is),
      // scaled down to one pixel per cell
      function sample(cols, rows) {
        var off = document.createElement('canvas');
        off.width = cols;
        off.height = rows;
        var o = off.getContext('2d', { willReadFrequently: true });
        var data = null;
        if (imgOk) {
          var s = Math.min(img.naturalWidth, img.naturalHeight);
          var sx = (img.naturalWidth - s) / 2;
          o.drawImage(img, sx, 0, s, s, 0, 0, cols, rows);
          // Browsers block reading pixels when the page is opened straight
          // from a file (file://); fall back to the plain field below
          try { data = o.getImageData(0, 0, cols, rows).data; } catch (e) { data = null; }
        }
        if (data) {
          var lum = [];
          for (var i = 0; i < cols * rows; i++) {
            lum.push((0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255);
          }
          // Stretch the photo's own range (5th-95th percentile) to 0-1 so
          // face, hair and clothes separate more clearly
          var sorted = lum.slice().sort(function (a, b) { return a - b; });
          var lo = sorted[Math.floor(sorted.length * 0.05)];
          var hi = sorted[Math.floor(sorted.length * 0.95)];
          var range = Math.max(hi - lo, 0.01);
          return lum.map(function (v) {
            var b = Math.min(1, Math.max(0, (v - lo) / range));
            if (INVERT) b = 1 - b;
            return Math.pow(b, 1.3);
          });
        }
        // Photo missing or unreadable: an even, faint field so the frame still looks intentional
        var field = [];
        for (var j = 0; j < cols * rows; j++) field.push(0.2 + Math.random() * 0.3);
        return field;
      }

      function drawCell(c) {
        var x = c.col * g.cw;
        var y = c.row * g.chh;
        ctx.clearRect(x, y, g.cw, g.chh);
        if (c.b < EMPTY_BELOW) return;
        ctx.globalAlpha = c.accent ? 0.95 : 0.1 + 0.7 * c.b;
        ctx.fillStyle = c.accent ? colors.accent : colors.ink;
        ctx.fillText(c.ch, x + g.cw / 2, y + g.chh / 2);
      }

      function drawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < cells.length; i++) drawCell(cells[i]);
      }

      // Size the canvas for the frame and the screen's pixel density, then draw
      function build() {
        var w = frame.clientWidth;   // inside the 1px border
        var h = frame.clientHeight;
        if (w <= 0 || h <= 0) return;
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        g.cols = COLS;
        g.cw = w / COLS;
        g.rows = Math.floor(h / (g.cw * CELL_ASPECT));
        g.chh = h / g.rows;
        ctx.font = '500 ' + (g.cw * 1.25).toFixed(2) + 'px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        var bright = sample(g.cols, g.rows);
        cells = bright.map(function (b, i) {
          return {
            col: i % g.cols,
            row: Math.floor(i / g.cols),
            b: b,
            ch: randomChar(),
            accent: b > 0.45 && Math.random() < ACCENT_CHANCE
          };
        });
        readColors();
        drawAll();
      }

      // Flicker: change a few random cells each tick
      function tick() {
        var n = Math.max(1, Math.round(cells.length * FLICKER_SHARE));
        for (var k = 0; k < n; k++) {
          var c = cells[(Math.random() * cells.length) | 0];
          if (!c) continue;
          c.ch = randomChar();
          c.accent = c.b > 0.45 && Math.random() < ACCENT_CHANCE;
          drawCell(c);
        }
      }

      // Run only when it can be seen: tab visible, on screen, not revealed,
      // and the visitor hasn't asked for reduced motion
      function updateTimer() {
        var run = !document.hidden && onScreen && !revealed && !reduceMotion.matches && cells.length > 0;
        if (run && !timer) timer = setInterval(tick, FLICKER_MS);
        if (!run && timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      var imgReady = new Promise(function (resolve) {
        img.onload = function () { imgOk = true; resolve(); };
        img.onerror = function () { resolve(); };
      });
      img.src = photo.getAttribute('src');
      var fontReady = document.fonts && document.fonts.load
        ? document.fonts.load('500 16px "JetBrains Mono"').catch(function () {})
        : Promise.resolve();
      Promise.all([imgReady, fontReady]).then(function () {
        build();
        updateTimer();
      });

      // Redraw on resize (frame size, or devicePixelRatio after browser zoom)
      var raf = null;
      function scheduleBuild() {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          raf = null;
          build();
          updateTimer();
        });
      }
      if (window.ResizeObserver) new ResizeObserver(scheduleBuild).observe(frame);
      window.addEventListener('resize', scheduleBuild);

      // Theme switch: recolour the characters
      new MutationObserver(function () {
        readColors();
        drawAll();
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      document.addEventListener('visibilitychange', updateTimer);
      reduceMotion.addEventListener('change', updateTimer);
      if (window.IntersectionObserver) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          updateTimer();
        }).observe(frame);
      }

      // --- Interaction ---
      // Mouse/pen: a 90px spotlight follows the cursor and shows the real photo
      frame.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch' || revealed) return;
        var r = frame.getBoundingClientRect();
        frame.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        frame.style.setProperty('--my', (e.clientY - r.top) + 'px');
        frame.classList.add('is-spotlight');
      });
      frame.addEventListener('pointerleave', function () {
        frame.classList.remove('is-spotlight');
      });

      // Click, tap, Enter or Space: fade fully to the photo, and back again
      function toggle() {
        revealed = !revealed;
        frame.classList.toggle('is-revealed', revealed);
        frame.classList.remove('is-spotlight');
        frame.setAttribute('aria-pressed', revealed ? 'true' : 'false');
        updateTimer();
      }
      frame.addEventListener('click', toggle);
      frame.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    })();

    // --- AI Chat: floating button + panel, talks to /api/chat (api/chat.js) ---
    (function () {
      var fab = document.getElementById('chatOpen');
      var panel = document.getElementById('chatPanel');
      if (!fab || !panel) return;

      var closeBtn = document.getElementById('chatClose');
      var log = document.getElementById('chatLog');
      var form = document.getElementById('chatForm');
      var input = document.getElementById('chatInput');
      var sendBtn = document.getElementById('chatSend');
      var count = document.getElementById('chatCount');
      var suggest = document.getElementById('chatSuggest');

      var MAX_CHARS = 500;
      var UNAVAILABLE = 'The assistant is unavailable right now. Please try again later, or email johnpaullaurio0295@gmail.com.';
      var history = [];   // recent turns sent along for context
      var busy = false;

      function isOpen() {
        return !panel.hidden;
      }

      function open() {
        panel.hidden = false;
        fab.setAttribute('aria-expanded', 'true');
        document.body.classList.add('chat-open');
        input.focus();
      }

      function close() {
        panel.hidden = true;
        fab.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('chat-open');
        fab.focus();
      }

      fab.addEventListener('click', function () {
        if (isOpen()) close();
        else open();
      });
      closeBtn.addEventListener('click', close);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) close();
      });

      // Messages are added with textContent, so replies can't inject HTML
      function addMessage(text, kind) {
        var p = document.createElement('p');
        p.className = 'chat-msg chat-msg--' + kind;
        p.textContent = text;
        log.appendChild(p);
        log.scrollTop = log.scrollHeight;
        return p;
      }

      function showTyping() {
        var t = document.createElement('p');
        t.className = 'chat-msg chat-msg--bot chat-typing';
        t.setAttribute('aria-label', 'Assistant is typing');
        t.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(t);
        log.scrollTop = log.scrollHeight;
        return t;
      }

      function updateCount() {
        count.textContent = input.value.length;
      }
      input.addEventListener('input', updateCount);

      function setBusy(state) {
        busy = state;
        sendBtn.disabled = state;
        input.setAttribute('aria-busy', state ? 'true' : 'false');
      }

      function ask(text) {
        text = text.trim();
        if (!text || busy) return;
        if (text.length > MAX_CHARS) {
          addMessage('Please keep questions under ' + MAX_CHARS + ' characters.', 'error');
          return;
        }

        addMessage(text, 'user');
        suggest.hidden = true;
        input.value = '';
        updateCount();
        setBusy(true);
        var typing = showTyping();

        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: history.slice(-8) })
        })
          .then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
              if (!res.ok || !data.reply) {
                var err = new Error(data.error || UNAVAILABLE);
                err.fromServer = true;
                throw err;
              }
              return data.reply;
            });
          })
          .then(function (reply) {
            typing.remove();
            addMessage(reply, 'bot');
            history.push({ role: 'user', text: text }, { role: 'assistant', text: reply });
          })
          .catch(function (err) {
            typing.remove();
            // Show our own server's messages (limit reached, too long...).
            // Network errors ("Failed to fetch") get friendly text instead;
            // a page opened straight from a file has no /api/chat at all.
            var text = err && err.fromServer ? err.message
              : location.protocol === 'file:' ? 'The chat only works on the live site (jaypi.vercel.app).'
              : UNAVAILABLE;
            addMessage(text, 'error');
          })
          .then(function () {
            setBusy(false);
            input.focus();
          });
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        ask(input.value);
      });

      suggest.addEventListener('click', function (e) {
        var chip = e.target.closest('.chat-chip');
        if (chip) ask(chip.textContent);
      });
    })();
