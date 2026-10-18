// scripts/search.js - Safe Regex Search & Highlighting (~18 lines)
export function escapeHtml(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function compileRegex(query, caseInsensitive = true) {
  try {
    return query ? new RegExp(query, caseInsensitive ? 'i' : '') : null;
  } catch {
    return null;
  }
}

export function highlight(text, regex) {
  const safe = escapeHtml(text);
  if (!regex || !text) return safe;
  try {
    const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
    return safe.replace(new RegExp(regex.source, flags), m => `<mark>${m}</mark>`);
  } catch {
    return safe;
  }
}

