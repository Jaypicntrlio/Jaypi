// =============================================================
// THINGS I'M LEARNING — renders POSTS (from posts.js)
// learning.html          -> list of cards, newest first
// learning.html#some-post -> the full post
// =============================================================
(function () {
  var listView = document.getElementById('postList');
  var grid = document.getElementById('postGrid');
  var postView = document.getElementById('postView');
  var content = document.getElementById('postContent');
  var back = document.getElementById('postBack');
  if (!listView || !grid || !postView || !content || typeof POSTS === 'undefined') return;

  var PAGE_TITLE = document.title;

  // Small helper: create an element with a class and (optional) text
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // "Dark mode without the white flash" -> "dark-mode-without-the-white-flash"
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // '2026-10-28' -> 'Oct 28, 2026' (parsed as local time so the day never shifts)
  function formatDate(iso) {
    var parts = iso.split('-');
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function dateEl(iso) {
    var t = el('time', 'post-date', formatDate(iso));
    t.dateTime = iso;
    return t;
  }

  function tagsEl(tags) {
    var wrap = el('ul', 'post-tags');
    (tags || []).forEach(function (tag) { wrap.appendChild(el('li', 'project-tag', tag)); });
    return wrap;
  }

  // One paragraph of text; `backtick` parts become <code>. Built with
  // textContent only, so nothing in a post can inject HTML.
  function paragraph(text) {
    var p = el('p');
    text.split('`').forEach(function (part, i) {
      if (!part) return;
      p.appendChild(i % 2 ? el('code', null, part) : document.createTextNode(part));
    });
    return p;
  }

  // Newest first, each with its link name
  var posts = POSTS.map(function (p) {
    return Object.assign({ slug: p.slug || slugify(p.title) }, p);
  }).sort(function (a, b) { return b.date.localeCompare(a.date); });

  // --- List view ---
  posts.forEach(function (p) {
    var card = el('article', 'post-card');
    card.appendChild(dateEl(p.date));

    var h2 = el('h2', 'post-card-title');
    var link = el('a', 'post-card-link', p.title);
    link.href = '#' + p.slug;
    h2.appendChild(link);
    card.appendChild(h2);

    card.appendChild(el('p', 'post-card-summary', p.summary));
    card.appendChild(tagsEl(p.tags));
    grid.appendChild(card);
  });

  if (!posts.length) {
    grid.appendChild(el('p', 'learning-intro', 'No notes yet. Check back soon!'));
  }

  // --- Post view ---
  function showPost(slug) {
    var p = posts.filter(function (x) { return x.slug === slug; })[0];
    content.innerHTML = '';

    if (p) {
      var h1 = el('h1', 'post-title', p.title);
      h1.tabIndex = -1;
      content.appendChild(h1);

      var meta = el('div', 'post-meta');
      meta.appendChild(dateEl(p.date));
      meta.appendChild(tagsEl(p.tags));
      content.appendChild(meta);

      var body = el('div', 'post-body');
      p.body.split(/\n\s*\n/).forEach(function (para) {
        if (para.trim()) body.appendChild(paragraph(para.trim()));
      });
      content.appendChild(body);
      document.title = p.title + ' — Jaypi';
    } else {
      var missing = el('h1', 'post-title', 'Note not found');
      missing.tabIndex = -1;
      content.appendChild(missing);
      content.appendChild(el('p', 'post-body', 'This note may have been renamed or removed.'));
      document.title = 'Note not found — Jaypi';
    }

    listView.hidden = true;
    postView.hidden = false;
    window.scrollTo(0, 0);
    // Move focus to the heading so screen readers announce the new post
    content.querySelector('h1').focus({ preventScroll: true });
  }

  function showList() {
    postView.hidden = true;
    listView.hidden = false;
    document.title = PAGE_TITLE;
  }

  function route() {
    var slug = decodeURIComponent(location.hash.slice(1));
    if (slug) showPost(slug);
    else showList();
  }

  // "All notes" goes back to the list without reloading the page
  back.addEventListener('click', function (e) {
    e.preventDefault();
    history.pushState(null, '', location.pathname);
    route();
    var first = grid.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  });

  // Fires for card links and for the browser's back/forward buttons
  window.addEventListener('hashchange', route);
  route();
})();
