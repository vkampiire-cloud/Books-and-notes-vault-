// scripts/storage.js - LocalStorage & JSON handling (~20 lines)
const KEY = 'booknotes:data';

export function load(fallback = []) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (Array.isArray(parsed) && parsed.length > 0) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
export const save = data => localStorage.setItem(KEY, JSON.stringify(data));

export function exportJSON(data) {
  const a = document.createElement('a');
  a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  a.download = 'booknotes_backup.json';
  a.click();
}

export function importJSON(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed) && parsed.every(b => b && b.title && b.author)) callback(parsed);
      else alert('Invalid JSON: expected an array of books with title and author.');
    } catch { alert('Could not parse JSON file.'); }
  };
  reader.readAsText(file);
}
