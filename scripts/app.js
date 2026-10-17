// Application Entry
import { books, setBooks } from './state.js';
import { render, initUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initUI();

  if (!books.length) {
    fetch('seed.json')
      .then((r) => r.json())
      .then((d) => {
        setBooks(d);
        render();
      })
      .catch(() => {});
  } else {
    render();
  }
});