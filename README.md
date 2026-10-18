# BookNotes — Reading Log & Study Notes Vault

**Student Developer:** Vanessa Kampiire | **Institution:** African Leadership University (ALU) — Sept 2026  
**Course:** Frontend Web Development (Summative: Responsive UI)  
**Live Application:** 
**Demo Video (2–3 min):** 
**sketch:**<img width="759" height="1080" alt="demo sketch" src="https://github.com/user-attachments/assets/b505a49c-c927-4685-92c9-b5877541df00" />


---

## 📌 1. Overview & Architecture
**BookNotes** is a fast, responsive study log for university students to track textbooks, notes, and semester reading targets. Built from scratch with zero framework dependencies:
* **HTML5:** Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<dialog>`, `<table>`) with ARIA live regions.
* **CSS3:** Mobile-first dark graphite theme (`styles/main.css`) using CSS Grid, Flexbox, and media queries.
* **Modular ES JavaScript:** Separated into `app.js` (bootstrap), `state.js` (reactive store), `storage.js` (LocalStorage/JSON), `validators.js` (regex), `search.js` (safe regex/XSS sanitization), and `ui.js` (DOM & events).

---

## ⚙️ 2. Setup Guide
1. **Clone & Navigate:**
   ```bash
   git clone https:https://github.com/vkampiire-cloud/Books-and-notes-vault-.git
2. **Run Locally:** Start any local web server (needed for ES modules):
   ```bash
   python -m http.server 8000
   ```
3. **Open:** Navigate to `http://localhost:8000/` in any modern browser.

---

## 🚀 3. Features List
* **Dashboard & Goals:** Live book/page counts, top tag, progress bar with dynamic ARIA alerts, and 7-day activity bar chart.
* **Live Regex Search:** Real-time filter across all fields with case-insensitive toggle (`/i`), error-safe compiler, and `<mark>` highlights.
* **Catalog:** Sortable table (desktop) that automatically shifts to touch cards on mobile (<768px).
* **Validation Modal:** Native `<dialog>` modal with inline error alerts and duplicate-word detection.
* **Persistence & Backups:** Automatic LocalStorage saves, JSON export/import with schema checks, and a "Reset to Seed" button.

---

## 🔍 4. Regular Expression (Regex) Catalog

| # | Field / Rule | Pattern | Purpose & Test Cases |
|---|---|---|---|
| **1** | **Title** | `/^\S(?:.*\S)?$/` | Rejects leading/trailing spaces. <br>✅ `"Clean Code"` \| ❌ `" Clean "` |
| **2** | **Author** | `/^[A-Za-z]+(?:[ .'-]+[A-Za-z]+)*\.?$/` | Letters, dots, spaces, hyphens only. No numbers.<br>✅ `"Robert C. Martin"` \| ❌ `"Martin 2nd"` |
| **3** | **Pages** | `/^[1-9]\d*$/` | Positive whole integers only. Rejects 0 and negatives.<br>✅ `"464"` \| ❌ `"0"`, `"-20"`, `"12.5"` |
| **4** | **Date** | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | Strict ISO `YYYY-MM-DD` calendar format.<br>✅ `"2026-10-01"` \| ❌ `"14/10/2026"` |
| **5** | **Subject Tag** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Alphanumeric subject tags with spaces/hyphens.<br>✅ `"Software-Engineering"` \| ❌ `"Tag #1!"` |
| **6** | **Duplicate Words** | `/\b(\w+)\s+\1\b/i` | **Advanced back-reference:** Flags repeated words in notes.<br>⚠️ Catches `"repeated repeated"` \| ✅ Allows `"unique words"` |
| **7** | **Safe Compiler** | `new RegExp(q, ci ? 'i' : '')` | `try/catch` wrapper; handles syntax errors (e.g. `[a-z`) safely without crashing. |

---

## ⌨️ 5. Keyboard Navigation Map
* **`Tab` / `Shift + Tab`:** Cycles sequentially through all interactive elements with visible focus rings.
* **`Skip to main content`:** First focusable link on page load; jumps straight to `#main`.
* **`Alt + A`:** Opens the Add Book modal dialog with trapped focus on the first input.
* **`Alt + S`:** Jumps cursor focus directly into the search bar.
* **`Escape (Esc)`:** Closes active modal dialog and restores focus to trigger button.
* **`Enter` / `Space`:** Triggers table sorting headers, buttons, and form submission.

---

## ♿ 6. Accessibility Notes
* **Semantic Landmark Roles:** Full use of `<header role="banner">`, `<nav>`, `<main>`, `<section>`, and `<footer role="contentinfo">`.
* **ARIA Live Regions:**
  * `#cap-live` (`role="status"`): `aria-live="polite"` while on track; `aria-live="assertive"` when target is reached.
  * `#search-count` (`role="status" aria-live="polite"`): Announces live filter match counts to screen readers.
* **Contrast & Inputs:** High contrast on dark background (`#0f1217`), explicit `<label for="...">` on all inputs, and XSS sanitization (`escapeHtml`) on all user-rendered text.

---

## 🧪 7. Testing Instructions
1. Run local server: `python -m http.server 8000`
2. Open **`http://localhost:8000/tests.html`** in your browser.
3. **What is verified:** Automatically runs 12 live assertions directly against `scripts/validators.js` and `scripts/search.js` testing all 7 regex rules, duplicate word detection, safe compiler recovery, XSS escaping, and JSON schema import validation.

---

## 📁 8. File Structure & Deployment

```
vanessa-store-50lines/
├── index.html        # Semantic HTML structure & modal dialog
├── tests.html        # Automated in-browser unit test suite
├── seed.json         # 13 default textbook & study notes records
├── README.md         # Project documentation & grading reference
├── styles/main.css   # Responsive layout, dark theme & mobile cards
└── scripts/          # app.js, state.js, storage.js, validators.js, search.js, ui.js
```


