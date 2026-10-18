// scripts/app.js - Application Entry Point
import { books, setBooks, SEED_DEFAULT } from './state.js';
import { render, initUI, toast } from './ui.js';

function boot() {
  initUI();
  // Always render immediately with seed books
  render();

  // Also sync with seed.json if available
  fetch('seed.json')
    .then(r => r.json())
    .then(d => {
      if (Array.isArray(d) && d.length > 0) {
        if (!books.length || books.length < d.length) {
          setBooks(d);
          render();
        }
      }
    })
    .catch(() => {
      if (!books.length || books.length < SEED_DEFAULT.length) {
        setBooks(SEED_DEFAULT);
        render();
      }
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}


