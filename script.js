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

      // Sync the button label with whatever the <head> script set before paint
      applyTheme(isDark() ? 'dark' : 'light');

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
        localStorage.setItem('theme', newTheme);
      });
    })();

    // --- Photo Fallback ---
    (function () {
      var img = document.querySelector('.hero-photo');
      if (!img) return;
      img.onerror = function () {
        img.setAttribute('data-failed', 'true');
      };
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

    // --- Scroll Reveal ---
    (function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var reveals = document.querySelectorAll('.reveal');
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