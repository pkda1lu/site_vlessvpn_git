(() => {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('overlay');

  const open = () => {
    sidebar.classList.add('sidebar--open');
    overlay.classList.add('overlay--show');
    hamburger?.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    sidebar.classList.remove('sidebar--open');
    overlay.classList.remove('overlay--show');
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', () => {
    if (sidebar.classList.contains('sidebar--open')) close(); else open();
  });
  overlay?.addEventListener('click', close);

  // Close sidebar on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

// Reviews: client-only (localStorage per browser)
(() => {
  const form = document.getElementById('reviewsForm');
  const list = document.getElementById('reviewsList');
  if (!form || !list) return;

  const STORAGE_KEY = 'vlessvpn_my_reviews_v1';

  function readReviews() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function writeReviews(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }
  function render() {
    const items = readReviews();
    list.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'img-note';
      empty.textContent = 'Пока нет ваших отзывов. Оставьте первый!';
      list.appendChild(empty);
      return;
    }
    items.forEach(({ author, text, date }) => {
      const block = document.createElement('blockquote');
      block.className = 'review';
      const p = document.createElement('p');
      p.textContent = text;
      const footer = document.createElement('footer');
      const d = new Date(date);
      footer.textContent = `— ${author} • ${d.toLocaleDateString()}`;
      block.appendChild(p);
      block.appendChild(footer);
      list.appendChild(block);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = /** @type {HTMLInputElement} */ (document.getElementById('reviewAuthor')).value.trim();
    const text = /** @type {HTMLTextAreaElement} */ (document.getElementById('reviewText')).value.trim();
    if (!author || !text) return;
    const items = readReviews();
    items.unshift({ author, text, date: Date.now() });
    writeReviews(items);
    (document.getElementById('reviewText')).value = '';
    render();
  });

  render();
})();


