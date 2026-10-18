// scripts/ui.js - DOM Rendering, Events & Dialog (~95 lines)
import { books, query, caseIns, sortField, sortAsc, setQuery, setCase, setSort, addBook, updateBook, deleteBook, setBooks, getFilteredBooks, getStats, SEED_DEFAULT } from './state.js';
import { compileRegex, highlight } from './search.js';
import { exportJSON, importJSON } from './storage.js';
import { PATTERNS, findDuplicateWord } from './validators.js';

export function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 2500);
}

function toLocalDateStr(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function render() {
  const re = compileRegex(query, caseIns);
  const filtered = getFilteredBooks(re);
  const stats = getStats();

  const tbody = document.getElementById('books-tbody');
  if (tbody) tbody.innerHTML = filtered.map(b => `
    <tr><td><b>${highlight(b.title, re)}</b><br><small style="color:var(--muted)">${highlight(b.notes, re)}</small></td>
    <td>${highlight(b.author, re)}</td><td>${highlight(b.pages, re)}</td><td><span class="tag-pill">#${highlight(b.tag, re)}</span></td><td>${highlight(b.date, re)}</td>
    <td><button type="button" class="btn-edit" data-id="${b.id}" style="color:var(--sky);background:none;border:none;cursor:pointer;margin-right:8px;">Edit</button>
    <button type="button" class="btn-del" data-id="${b.id}" style="color:var(--rose);background:none;border:none;cursor:pointer;">Delete</button></td></tr>
  `).join('') || `<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--muted)">No books found.</td></tr>`;

  const mCards = document.getElementById('mobile-cards');
  if (mCards) mCards.innerHTML = filtered.map(b => `<div class="m-card"><h3>${highlight(b.title, re)}</h3><p style="color:var(--muted);font-size:0.85rem;margin:4px 0 8px;">by ${highlight(b.author, re)} • ${highlight(b.pages, re)}p • <span class="tag-pill">#${highlight(b.tag, re)}</span></p><div style="margin-top:6px;"><button type="button" class="btn-edit" data-id="${b.id}" style="color:var(--sky);background:none;border:none;cursor:pointer;margin-right:12px;">Edit</button><button type="button" class="btn-del" data-id="${b.id}" style="color:var(--rose);background:none;border:none;cursor:pointer;">Delete</button></div></div>`).join('');
  
  const sc = document.getElementById('search-count');
  if (sc) sc.textContent = (query && !re) ? 'Invalid regex syntax' : `${filtered.length} of ${books.length} books found`;

  const unit = document.getElementById('pref-unit')?.value || 'pages';
  const displayPages = unit === 'hours' ? (stats.totalPages / 40).toFixed(1) + ' hrs' : unit === 'minutes' ? Math.round(stats.totalPages * 1.5) + ' mins' : stats.totalPages.toLocaleString() + ' p.';
  document.getElementById('stat-total').textContent = stats.totalBooks;
  document.getElementById('stat-pages').textContent = displayPages;
  document.getElementById('stat-tag').textContent = stats.topTag;

  const cap = Number(document.getElementById('pref-cap')?.value) || 3500;
  const prog = document.getElementById('goal-progress'), live = document.getElementById('cap-live');
  if (prog) { prog.max = cap; prog.value = Math.min(cap, stats.totalPages); }
  if (live) {
    const over = stats.totalPages >= cap;
    live.textContent = over ? `Target reached! ${stats.totalPages.toLocaleString()} / ${cap.toLocaleString()} pages completed!` : `${stats.totalPages.toLocaleString()} of ${cap.toLocaleString()} pages read (${(cap - stats.totalPages).toLocaleString()} pages remaining).`;
    live.setAttribute('aria-live', over ? 'assertive' : 'polite');
    live.style.color = over ? 'var(--mint)' : 'var(--muted)';
  }

  const tChart = document.getElementById('trend-chart');
  if (tChart) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); const ds = toLocalDateStr(d);
      last7.push({ lbl: days[d.getDay()], p: books.filter(b => b.date === ds).reduce((s, b) => s + (Number(b.pages) || 0), 0) });
    }
    const max = Math.max(1, ...last7.map(x => x.p));
    tChart.innerHTML = last7.map(x => `<div class="bar-col" title="${x.lbl}: ${x.p}p"><div class="bar-fill" style="height:${Math.max(4, Math.round((x.p / max) * 100))}%;"></div><span class="bar-lbl">${x.lbl}</span></div>`).join('');
  }
}

export function initUI() {
  document.getElementById('search-input')?.addEventListener('input', e => { setQuery(e.target.value); render(); });
  document.getElementById('case-toggle')?.addEventListener('change', e => { setCase(e.target.checked); render(); });
  document.querySelectorAll('[data-sort]').forEach(btn => btn.addEventListener('click', () => { setSort(btn.getAttribute('data-sort')); render(); }));

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const p = chip.getAttribute('data-regex');
      const input = document.getElementById('search-input');
      if (input) input.value = p;
      setQuery(p);
      render();
    });
  });

  document.getElementById('btn-quick-sync')?.addEventListener('click', () => {
    fetch('seed.json')
      .then(r => r.json())
      .then(d => { setBooks(d); render(); toast('Loaded all 13 seed textbooks!'); })
      .catch(() => { setBooks(SEED_DEFAULT); render(); toast('Loaded 13 default textbooks!'); });
  });

  const modal = document.getElementById('modal-form'), form = document.getElementById('book-form');
  const errTitle = document.getElementById('err-title'), errAuthor = document.getElementById('err-author');

  document.getElementById('btn-open-add')?.addEventListener('click', () => {
    form.reset(); document.getElementById('entry-id').value = '';
    if (errTitle) errTitle.textContent = '';
    if (errAuthor) errAuthor.textContent = '';
    document.getElementById('inp-date').value = toLocalDateStr(new Date());
    modal.showModal();
  });
  document.getElementById('btn-close-modal')?.addEventListener('click', () => modal.close());

  document.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('btn-del') && confirm('Delete this book?')) {
      deleteBook(id); render(); toast('Deleted book.');
    } else if (e.target.classList.contains('btn-edit')) {
      const b = books.find(x => x.id === id);
      if (b && modal) {
        document.getElementById('entry-id').value = b.id;
        document.getElementById('inp-title').value = b.title || '';
        document.getElementById('inp-author').value = b.author || '';
        document.getElementById('inp-pages').value = b.pages || '';
        document.getElementById('inp-date').value = b.date || '';
        document.getElementById('inp-tag').value = b.tag || '';
        document.getElementById('inp-notes').value = b.notes || '';
        if (errTitle) errTitle.textContent = '';
        if (errAuthor) errAuthor.textContent = '';
        modal.showModal();
      }
    }
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('entry-id').value || 'b_' + Date.now();
    const title = document.getElementById('inp-title').value.trim();
    const author = document.getElementById('inp-author').value.trim();
    const notes = document.getElementById('inp-notes').value.trim();

    if (errTitle) errTitle.textContent = PATTERNS.title.test(title) ? '' : 'Title cannot have leading/trailing spaces.';
    if (errAuthor) errAuthor.textContent = PATTERNS.author.test(author) ? '' : 'Invalid author name format.';
    if (!PATTERNS.title.test(title) || !PATTERNS.author.test(author)) return;

    const dup = findDuplicateWord(`${title} ${notes}`);
    if (dup && !confirm(`Duplicate word "${dup}" detected. Save anyway?`)) return;

    const data = {
      id, title, author,
      pages: Number(document.getElementById('inp-pages').value),
      date: document.getElementById('inp-date').value,
      tag: document.getElementById('inp-tag').value.trim(), notes
    };
    if (document.getElementById('entry-id').value) updateBook(id, data); else addBook(data);
    render(); modal.close(); toast('Book saved.');
  });

  document.getElementById('pref-cap')?.addEventListener('input', render);
  document.getElementById('pref-unit')?.addEventListener('change', render);
  document.getElementById('btn-export')?.addEventListener('click', () => { exportJSON(books); toast('Exported JSON backup.'); });
  document.getElementById('input-import')?.addEventListener('change', e => {
    if (e.target.files && e.target.files[0]) {
      importJSON(e.target.files[0], d => { setBooks(d); render(); toast('Imported books successfully!'); });
    }
  });
  document.getElementById('btn-reset-seed')?.addEventListener('click', () => {
    fetch('seed.json')
      .then(r => r.json())
      .then(d => { setBooks(d); render(); toast('Reset vault to seed books.'); })
      .catch(() => { setBooks(SEED_DEFAULT); render(); toast('Reset vault to default seed.'); });
  });
}
