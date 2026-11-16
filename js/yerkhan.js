/* KDK University final project · Dautbekov Yerkhan.
 * No backend: accounts, requests and preferences stay in this browser.
 * Shared code is scoped to avoid collisions with the team's older scripts.
 */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const KEYS = {
    theme: 'kdk.final.theme', users: 'kdk.final.users', session: 'kdk.final.session',
    saved: 'kdk.final.saved', filters: 'kdk.final.filters', checklist: 'kdk.final.checklist',
    requests: 'kdk.final.requests', submissions: 'kdk.final.submissions'
  };
  const storage = {
    get(key, fallback) {
      try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      // Callers catch write failures so the UI never reports an unsaved action as saved.
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) { localStorage.removeItem(key); }
  };
  const arrayValue = key => { const value = storage.get(key, []); return Array.isArray(value) ? value : []; };
  let toastTimer;
  function toast(message) {
    const element = $('#yk-toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('is-visible'), 4000);
  }
  const storageFailure = 'Your browser could not save this. Allow local storage and try again.';
  function activeUser() {
    const session = storage.get(KEYS.session, null);
    if (!session || typeof session.email !== 'string') return null;
    return arrayValue(KEYS.users).find(user => user && user.email === session.email) || null;
  }


  // Native dialog supplies focus trapping and Escape support without a UI framework.
  function openAuth(kind = 'login') {
    const dialog = $('#auth-dialog');
    $$('[data-auth-panel]').forEach(panel => { panel.hidden = panel.dataset.authPanel !== kind; });
    if (!dialog.open) dialog.showModal();
    const first = $('input', $(`[data-auth-panel="${kind}"]`));
    first?.focus();
  }
  function initAuthDialog() {
    document.body.insertAdjacentHTML('beforeend', "<dialog id=\"auth-dialog\" class=\"kdk-auth-dialog\" aria-labelledby=\"auth-heading\"><button type=\"button\" class=\"kdk-dialog-close\" data-auth-close aria-label=\"Close account dialog\">&#215;</button><h2 id=\"auth-heading\">Your KDK account</h2><p class=\"yk-muted\">Classroom demo. Use fictitious details and a sample password, never a real password. Data stays in this browser.</p><section data-auth-panel=\"login\" hidden><h3>Log in</h3><form data-form=\"login\" id=\"login-form\" novalidate=\"\">\n      <div class=\"yk-field\">\n       <label for=\"login-email\">\n        Email address\n       </label>\n       <input aria-describedby=\"login-email-hint login-email-error\" autocomplete=\"username\" data-rule=\"required email\" id=\"login-email\" inputmode=\"email\" name=\"login-email\" type=\"text\"/>\n       <small class=\"yk-muted\" id=\"login-email-hint\">\n       </small>\n       <p class=\"yk-error\" id=\"login-email-error\">\n       </p>\n      </div>\n      <div class=\"yk-field\">\n       <label for=\"login-password\">\n        Password\n       </label>\n       <input aria-describedby=\"login-password-hint login-password-error\" autocomplete=\"current-password\" data-rule=\"required password\" id=\"login-password\" name=\"login-password\" type=\"password\"/>\n       <small class=\"yk-muted\" id=\"login-password-hint\">\n        Use the password you created for this demo account.\n       </small>\n       <p class=\"yk-error\" id=\"login-password-error\">\n       </p>\n      </div>\n      <button aria-pressed=\"false\" class=\"yk-text-button yk-password-toggle\" data-password-toggle=\"login-password\" type=\"button\">\n       Show password\n      </button>\n      <button class=\"yk-button yk-button-full\" type=\"submit\">\n       Log in \u2192\n      </button>\n      <p aria-live=\"polite\" class=\"yk-status\" data-form-status=\"\" role=\"status\">\n      </p>\n     </form><p><button type=\"button\" class=\"yk-text-button\" data-open-auth=\"signup\">New here? Create an account</button></p></section><section data-auth-panel=\"signup\" hidden><h3>Create account</h3><form data-form=\"signup\" id=\"signup-form\" novalidate=\"\">\n      <div class=\"yk-field\">\n       <label for=\"signup-name\">\n        Full name\n       </label>\n       <input aria-describedby=\"signup-name-hint signup-name-error\" autocomplete=\"name\" data-rule=\"required name\" id=\"signup-name\" name=\"signup-name\" type=\"text\"/>\n       <small class=\"yk-muted\" id=\"signup-name-hint\">\n       </small>\n       <p class=\"yk-error\" id=\"signup-name-error\">\n       </p>\n      </div>\n      <div class=\"yk-field\">\n       <label for=\"signup-email\">\n        Email address\n       </label>\n       <input aria-describedby=\"signup-email-hint signup-email-error\" autocomplete=\"email\" data-rule=\"required email\" id=\"signup-email\" inputmode=\"email\" name=\"signup-email\" type=\"text\"/>\n       <small class=\"yk-muted\" id=\"signup-email-hint\">\n       </small>\n       <p class=\"yk-error\" id=\"signup-email-error\">\n       </p>\n      </div>\n      <div class=\"yk-field\">\n       <label for=\"signup-phone\">\n        Phone number\n       </label>\n       <input aria-describedby=\"signup-phone-hint signup-phone-error\" autocomplete=\"tel\" data-rule=\"required phone\" id=\"signup-phone\" name=\"signup-phone\" type=\"tel\"/>\n       <small class=\"yk-muted\" id=\"signup-phone-hint\">\n        10\u201315 digits, for example +7 700 123 45 67\n       </small>\n       <p class=\"yk-error\" id=\"signup-phone-error\">\n       </p>\n      </div>\n      <div class=\"yk-field\">\n       <label for=\"signup-password\">\n        Password\n       </label>\n       <input aria-describedby=\"signup-password-hint signup-password-error\" autocomplete=\"new-password\" data-rule=\"required password\" id=\"signup-password\" name=\"signup-password\" type=\"password\"/>\n       <small class=\"yk-muted\" id=\"signup-password-hint\">\n        At least 8 characters, with uppercase, lowercase, a number and a symbol.\n       </small>\n       <p class=\"yk-error\" id=\"signup-password-error\">\n       </p>\n      </div>\n      <div class=\"yk-field\">\n       <label for=\"signup-confirm\">\n        Confirm password\n       </label>\n       <input aria-describedby=\"signup-confirm-hint signup-confirm-error\" autocomplete=\"new-password\" data-rule=\"required confirm\" id=\"signup-confirm\" name=\"signup-confirm\" type=\"password\"/>\n       <small class=\"yk-muted\" id=\"signup-confirm-hint\">\n       </small>\n       <p class=\"yk-error\" id=\"signup-confirm-error\">\n       </p>\n      </div>\n      <button aria-pressed=\"false\" class=\"yk-text-button yk-password-toggle\" data-password-toggle=\"signup-password signup-confirm\" type=\"button\">\n       Show passwords\n      </button>\n      <button class=\"yk-button yk-button-full\" type=\"submit\">\n       Create account \u2192\n      </button>\n      <p aria-live=\"polite\" class=\"yk-status\" data-form-status=\"\" role=\"status\">\n      </p>\n     </form><p><button type=\"button\" class=\"yk-text-button\" data-open-auth=\"login\">Already registered? Log in</button></p></section></dialog>");
    const dialog = $('#auth-dialog');
    $('[data-auth-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
    document.addEventListener('click', event => {
      const opener = event.target.closest('[data-open-auth]');
      if (!opener) return;
      event.preventDefault(); openAuth(opener.dataset.openAuth);
    });
    const kind = new URLSearchParams(location.search).get('auth');
    if (kind === 'signup' || kind === 'login') openAuth(kind);
  }

  function initTheme() {
    const saved = storage.get(KEYS.theme, null);
    let mode = ['light', 'dark'].includes(saved) ? saved : 'light';
    function render() {
      document.documentElement.dataset.theme = mode;
      document.documentElement.style.colorScheme = mode;
      // Keep old team CSS overrides from competing with this shared theme.
      document.body.classList.remove('dark-mode', 'a5-night-mode');
      document.body.style.backgroundColor = '';
      $$('[data-theme-toggle], #theme-toggle').forEach(button => {
        button.setAttribute('aria-pressed', String(mode === 'dark'));
        button.setAttribute('aria-label', `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`);
        const label = $('[data-theme-label]', button);
        if (label) label.textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
        else button.textContent = mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      });
    }
    render();
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-theme-toggle], #theme-toggle');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      mode = mode === 'dark' ? 'light' : 'dark';
      render();
      try { storage.set(KEYS.theme, mode); } catch { toast(storageFailure); }
    }, true);
    window.addEventListener('storage', event => {
      if (event.key === KEYS.theme) {
        const next = storage.get(KEYS.theme, 'light');
        mode = next === 'dark' ? 'dark' : 'light'; render();
      }
    });
  }

  function initNavigation() {
    const toggle = $('.yk-menu-toggle');
    const menu = $('.yk-navigation');
    if (toggle && menu) {
      const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
      toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) { close(); toggle.focus(); }
      });
      document.addEventListener('click', event => {
        if (!event.target.closest('.yk-header')) close();
      });
      const links = $$('a', menu);
      links.forEach((link, index) => link.addEventListener('keydown', event => {
        let next;
        switch (event.key) {
          case 'ArrowRight': next = (index + 1) % links.length; break;
          case 'ArrowLeft': next = (index - 1 + links.length) % links.length; break;
          case 'Home': next = 0; break;
          case 'End': next = links.length - 1; break;
          default: return;
        }
        event.preventDefault(); links[next].focus();
      }));
    }
    if (activeUser()) $$('[data-account-link]').forEach(link => { link.href = 'profile.html'; link.removeAttribute('data-open-auth'); link.textContent = 'My profile →'; });
  }

  const PROGRAMS = [
  {
    "id": "software",
    "title": "Software Engineering",
    "category": "technology",
    "icon": "⌘",
    "image": "soft_eng.jpg",
    "desc": "Design, build and maintain software that people rely on.",
    "skills": [
      "Web Development",
      "Databases",
      "Algorithms & Data Structures"
    ],
    "careers": "Software developer, full-stack engineer, QA engineer",
    "fee": 2600000
  },
  {
    "id": "computer",
    "title": "Computer Science",
    "category": "technology",
    "icon": "◈",
    "image": "com_sci.jpg",
    "desc": "Understand the ideas behind computing and intelligent systems.",
    "skills": [
      "Programming Fundamentals",
      "Operating Systems",
      "Artificial Intelligence"
    ],
    "careers": "Software engineer, AI developer, systems analyst",
    "fee": 2500000
  },
  {
    "id": "cyber",
    "title": "Cybersecurity",
    "category": "technology",
    "icon": "◇",
    "image": "research-lab.jpg",
    "desc": "Protect networks, applications and digital information.",
    "skills": [
      "Network Security",
      "Cryptography",
      "Digital Forensics"
    ],
    "careers": "Security analyst, penetration tester, security engineer",
    "fee": 2700000
  },
  {
    "id": "data",
    "title": "Data Science",
    "category": "technology",
    "icon": "∑",
    "image": "team_study.jpg",
    "desc": "Turn data into useful insights with statistics and machine learning.",
    "skills": [
      "Python Programming",
      "Machine Learning",
      "Data Visualization"
    ],
    "careers": "Data scientist, machine learning engineer, data analyst",
    "fee": 2700000
  },
  {
    "id": "business",
    "title": "Business Analytics",
    "category": "business",
    "icon": "→",
    "image": "gallery2.jpg",
    "desc": "Connect business decisions with data and digital strategy.",
    "skills": [
      "Business Intelligence",
      "Data Analytics",
      "Project Management"
    ],
    "careers": "Business analyst, BI specialist, product analyst",
    "fee": 2400000
  },
  {
    "id": "design",
    "title": "Digital Media & Design",
    "category": "creative",
    "icon": "✳",
    "image": "dig_media.jpg",
    "desc": "Combine creativity and technology to shape digital experiences.",
    "skills": [
      "UI/UX Design",
      "Web Design",
      "Digital Media"
    ],
    "careers": "UX designer, digital designer, creative technologist",
    "fee": 2300000
  }
];
  const programById = id => PROGRAMS.find(program => program.id === id);
  const money = value => `${new Intl.NumberFormat('en-US').format(value)} ₸`;
  const savedIds = () => arrayValue(KEYS.saved).filter(id => programById(id));
  function initPrograms() {
    if (!$('#program-results')) return;
    const search = $('#program-search');
    const category = $('#program-category');
    const onlySaved = $('#saved-only');
    const filters = storage.get(KEYS.filters, {});
    if (filters && typeof filters === 'object') {
      search.value = typeof filters.query === 'string' ? filters.query : '';
      category.value = ['all', 'technology', 'business', 'creative'].includes(filters.category) ? filters.category : 'all';
      onlySaved.checked = filters.saved === true;
    }
    if (new URLSearchParams(location.search).get('saved') === '1') onlySaved.checked = true;
    let saved = new Set(savedIds());
    let writeWarning = false;
    function render() {
      const query = search.value.trim().toLowerCase();
      const matches = PROGRAMS.filter(program => {
        const text = [program.title, program.desc, program.careers, ...program.skills].join(' ').toLowerCase();
        return text.includes(query) && (category.value === 'all' || program.category === category.value) && (!onlySaved.checked || saved.has(program.id));
      });
      $$('.yk-program-card').forEach(card => { card.hidden = !matches.some(program => program.id === card.dataset.program); });
      $$('[data-save]').forEach(button => {
        const isSaved = saved.has(button.dataset.save);
        button.setAttribute('aria-pressed', String(isSaved));
        button.setAttribute('aria-label', `${isSaved ? 'Unsave' : 'Save'} ${programById(button.dataset.save).title}`);
        button.textContent = isSaved ? '♥ Saved' : '♡ Save';
      });
      $('#program-count').textContent = `${matches.length} of ${PROGRAMS.length} programs shown`;
      $('#saved-count').textContent = `(${saved.size})`;
      $('#program-empty').hidden = matches.length > 0;
      try { storage.set(KEYS.filters, { query: search.value, category: category.value, saved: onlySaved.checked }); }
      catch { if (!writeWarning) { toast('Filters work, but cannot be saved in this browser.'); writeWarning = true; } }
    }
    search.addEventListener('input', render);
    category.addEventListener('change', render);
    onlySaved.addEventListener('change', render);
    const reset = () => { search.value = ''; category.value = 'all'; onlySaved.checked = false; render(); };
    $('#reset-filters').addEventListener('click', reset);
    $$('[data-reset-filters]').forEach(button => button.addEventListener('click', () => { reset(); search.focus(); }));
    $$('[data-save]').forEach(button => button.addEventListener('click', () => {
      const next = new Set(saved);
      if (next.has(button.dataset.save)) next.delete(button.dataset.save); else next.add(button.dataset.save);
      try {
        storage.set(KEYS.saved, [...next]); saved = next; render();
        toast(saved.has(button.dataset.save) ? 'Program saved to this browser.' : 'Program removed from your saved list.');
      } catch { toast(storageFailure); }
    }));
    const dialog = $('#program-dialog');
    $$('[data-details]').forEach(button => button.addEventListener('click', () => openDetails(button.dataset.details)));
    function openDetails(id) {
      const program = programById(id);
      if (!program) return;
      $('#program-dialog-title').textContent = program.title;
      const content = $('#program-dialog-content');
      content.replaceChildren();
      const paragraph = text => { const element = document.createElement('p'); element.textContent = text; content.append(element); };
      paragraph(program.desc);
      paragraph(`Bachelor’s degree · 4 years · English · ${money(program.fee)} per year (illustrative)`);
      const title = document.createElement('h3'); title.textContent = 'What you will explore'; content.append(title);
      const list = document.createElement('ul');
      program.skills.forEach(skill => { const item = document.createElement('li'); item.textContent = skill; list.append(item); }); content.append(list);
      paragraph(`Career directions: ${program.careers}.`);
      const link = document.createElement('a'); link.className = 'yk-button'; link.href = `admissions.html?program=${program.id}#information-request`; link.textContent = 'Ask about this program →'; content.append(link);
      dialog.showModal();
    }
    $('[data-close-dialog]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    } });
    $('#find-match').addEventListener('click', () => {
      const program = programById($('#match-interest').value);
      const result = $('#match-result'); result.replaceChildren();
      if (!program) { result.textContent = 'Choose an interest to see a suggested direction.'; $('#match-interest').focus(); return; }
      const text = document.createElement('span'); text.textContent = `Start by exploring ${program.title}. ${program.desc} `;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'yk-text-button'; button.textContent = 'View program →'; button.addEventListener('click', () => openDetails(program.id));
      result.append(text, button);
    });
    render();
  }

  function initChecklist() {
    const checks = $$('[data-checklist]');
    if (!checks.length) return;
    const stored = arrayValue(KEYS.checklist);
    checks.forEach((check, index) => { check.checked = stored[index] === true; });
    const render = () => {
      const count = checks.filter(check => check.checked).length;
      $('#checklist-progress').value = count;
      $('#checklist-status').textContent = `${count} of ${checks.length} steps completed (${Math.round(count / checks.length * 100)}%)`;
    };
    const save = () => { render(); try { storage.set(KEYS.checklist, checks.map(check => check.checked)); } catch { toast(storageFailure); } };
    checks.forEach(check => check.addEventListener('change', save));
    $('#reset-checklist').addEventListener('click', () => { checks.forEach(check => { check.checked = false; }); save(); });
    render();
  }

  function initReading() {
    const load = $('#load-reading');
    if (!load) return;
    const select = $('#reading-subject');
    const status = $('#reading-status');
    const results = $('#reading-results');
    const retry = $('#reading-retry');
    let busy = false;
    function renderBooks(books) {
      results.replaceChildren();
      books.slice(0, 3).forEach(book => {
        const article = document.createElement('article'); article.className = 'yk-book';
        const icon = document.createElement('div'); icon.className = 'yk-book-icon'; icon.textContent = '▤'; icon.setAttribute('aria-hidden', 'true');
        const heading = document.createElement('h3'); heading.textContent = book.title;
        const author = document.createElement('p'); author.textContent = book.authors || 'Author not listed';
        const year = document.createElement('p'); year.textContent = book.year ? `First published: ${book.year}` : 'Publication date unavailable';
        const link = document.createElement('a'); link.href = `https://openlibrary.org${book.key}`; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'View on Open Library →';
        article.append(icon, heading, author, year, link); results.append(article);
      });
    }
    async function fetchBooks() {
      if (busy) return;
      busy = true; load.disabled = true; select.disabled = true; retry.hidden = true;
      results.setAttribute('aria-busy', 'true'); results.replaceChildren();
      status.textContent = 'Loading books from Open Library…';
      const topic = select.value;
      const key = `kdk.final.books.${topic}`;
      const cached = storage.get(key, null);
      const validBooks = books => Array.isArray(books) && books.every(book => book && typeof book.title === 'string' && /^\/works\/OL\d+W$/.test(book.key));
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        // Reuse real API results for 24 hours to limit unnecessary requests.
        if (cached && validBooks(cached.books) && cached.books.length && Date.now() - cached.time < 86400000) {
          renderBooks(cached.books); status.textContent = 'Open Library results · Saved in this browser within the last 24 hours.';
        } else {
          const response = await fetch(`https://openlibrary.org/subjects/${encodeURIComponent(topic)}.json?limit=3`, { signal: controller.signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!Array.isArray(data.works)) throw new Error('Invalid API response');
          const books = data.works.filter(book => book && typeof book.title === 'string' && /^\/works\/OL\d+W$/.test(book.key)).map(book => ({
            key: book.key, title: book.title,
            authors: Array.isArray(book.authors) ? book.authors.map(author => author.name).filter(Boolean).join(', ') : '',
            year: typeof book.first_publish_year === 'number' ? book.first_publish_year : null
          }));
          renderBooks(books);
          status.textContent = books.length ? 'Live results from Open Library. Book availability is managed by Open Library.' : 'No books were found for this topic. Try another subject.';
          try { storage.set(key, { time: Date.now(), books }); } catch { /* A cache is optional; live results still work. */ }
        }
      } catch {
        if (cached && validBooks(cached.books) && cached.books.length) {
          renderBooks(cached.books); status.textContent = 'Open Library is unavailable. Showing previously saved results; these may be out of date.';
        } else {
          status.textContent = 'We could not load books. Check your connection and try again. You can still explore all programs.';
        }
        retry.hidden = false;
      } finally {
        clearTimeout(timeout); busy = false; load.disabled = false; select.disabled = false; results.setAttribute('aria-busy', 'false');
      }
    }
    load.addEventListener('click', fetchBooks); retry.addEventListener('click', fetchBooks);
    select.addEventListener('change', () => { results.replaceChildren(); retry.hidden = true; status.textContent = 'Select “Discover books” to load this topic.'; });
  }

  function setError(field, message) {
    let error = document.getElementById(`${field.id}-error`);
    if (!error) {
      error = document.createElement('p'); error.id = `${field.id}-error`; error.className = 'yk-error'; field.insertAdjacentElement('afterend', error);
      const describedBy = field.getAttribute('aria-describedby') || '';
      field.setAttribute('aria-describedby', `${describedBy} ${error.id}`.trim());
    }
    error.textContent = message; field.setAttribute('aria-invalid', String(Boolean(message)));
  }
  function validateField(field, form) {
    const rules = (field.dataset.rule || '').split(' ');
    const value = field.value.trim();
    let error = '';
    if (rules.includes('consent') && !field.checked) error = 'Please agree to save your request in this browser.';
    else if (rules.includes('required') && !value) error = 'Please complete this field.';
    else if (value && rules.includes('name') && (value.length < 2 || value.length > 100)) error = 'Use a name between 2 and 100 characters.';
    else if (value && rules.includes('email') && (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || value.includes('..') || value.length > 254)) error = 'Enter a valid email, for example name@example.com.';
    else if (value && rules.includes('phone') && (!/^\+?[\d\s()-]+$/.test(value) || !/^\d{10,15}$/.test(value.replace(/\D/g, '')))) error = 'Use 10–15 digits, optionally with +, spaces or brackets.';
    else if (value && rules.includes('password') && (field.value.length < 8 || field.value.length > 128 || !/[A-Z]/.test(field.value) || !/[a-z]/.test(field.value) || !/\d/.test(field.value) || !/[^\w\s]/.test(field.value))) error = 'Use 8–128 characters with uppercase, lowercase, a number and a symbol.';
    else if (rules.includes('confirm') && field.value !== $('[data-rule~="password"]', form)?.value) error = 'Passwords must match.';
    else if (value && rules.includes('message') && (value.length < 10 || value.length > 2000)) error = 'Use 10–2000 characters to describe your question.';
    setError(field, error); return !error;
  }
  function validateForm(form, scope = form) {
    const fields = $$('[data-rule]', scope);
    let valid = true;
    fields.forEach(field => { if (!validateField(field, form)) valid = false; });
    if (!valid) $('[aria-invalid="true"]', scope)?.focus();
    return valid;
  }
  function formStatus(form) {
    let status = $('[data-form-status]', form);
    if (!status) { status = document.createElement('p'); status.dataset.formStatus = ''; status.className = 'yk-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); form.append(status); }
    return status;
  }
  async function passwordDigest(password, salt) {
    if (!crypto.subtle) throw new Error('secure-context');
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
    return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  function authReturn() {
    // Only allow a fixed local destination; never trust a redirect URL from the query string.
    const next = new URLSearchParams(location.search).get('next');
    return next === 'admissions' ? 'admissions.html#information-request' : 'profile.html';
  }
  async function handleSubmission(form) {
    const status = formStatus(form);
    status.classList.remove('yk-success', 'yk-error');
    if (!validateForm(form)) { status.textContent = 'Please correct the highlighted fields.'; status.classList.add('yk-error'); return; }
    const submit = $('[type="submit"]', form);
    const previous = submit?.innerHTML;
    if (submit) { submit.disabled = true; submit.innerHTML = '<span class="yk-spinner" aria-hidden="true"></span> Saving…'; }
    form.setAttribute('aria-busy', 'true'); status.textContent = '';
    try {
      // Yield one frame so the loading state is visible before local work begins.
      await new Promise(resolve => requestAnimationFrame(resolve));
      const kind = form.dataset.form;
      if (kind === 'signup') {
        const prefix = form.id === 'registrationForm' ? 'register' : 'signup-';
        const get = part => prefix === 'register' ? $(`#register${part[0].toUpperCase()}${part.slice(1)}`, form).value.trim() : $(`#signup-${part}`, form).value.trim();
        const email = get('email').toLowerCase();
        const users = arrayValue(KEYS.users).filter(user => user && typeof user.email === 'string');
        if (users.some(user => user.email === email)) { status.textContent = 'An account with this email already exists. Log in instead.'; return; }
        const salt = crypto.randomUUID();
        const password = $('[data-rule~="password"]', form).value;
        const user = { name: get('name'), email, phone: get('phone'), password: await passwordDigest(password, salt), salt, created: new Date().toISOString() };
        storage.set(KEYS.users, [...users, user]);
        // Sign-up and login are separate actions so the login check can be demonstrated.
        form.reset(); openAuth('login'); $('#login-email').value = email; formStatus($('#login-form')).textContent = 'Account created. Log in to open your profile.';
      } else if (kind === 'login') {
        const email = $('#login-email').value.trim().toLowerCase();
        const user = arrayValue(KEYS.users).find(user => user && user.email === email);
        const password = $('#login-password').value;
        if (!user || typeof user.salt !== 'string' || await passwordDigest(password, user.salt) !== user.password) {
          status.textContent = 'Email or password is incorrect. Check your details or create an account in this browser.'; return;
        }
        storage.set(KEYS.session, { email: user.email });
        form.reset(); location.href = authReturn();
      } else if (kind === 'request') {
        const program = programById($('#request-program').value);
        if (!program) { setError($('#request-program'), 'Choose one of the listed programs.'); return; }
        const request = { id: crypto.randomUUID(), name: $('#request-name').value.trim(), email: $('#request-email').value.trim().toLowerCase(), phone: $('#request-phone').value.trim(), program: program.id, message: $('#request-message').value.trim(), created: new Date().toISOString() };
        storage.set(KEYS.requests, [...arrayValue(KEYS.requests), request]);
        status.textContent = `Your ${program.title} information request is saved in this browser. Log in with ${request.email} to see it in your profile. No message has been sent.`;
        status.classList.add('yk-success');
        form.reset();
        const link = document.createElement('a'); link.href = activeUser()?.email === request.email ? 'profile.html' : 'profile.html?auth=login'; link.textContent = ' Open applicant profile →'; status.append(link);
      } else {
        const record = { id: crypto.randomUUID(), form: form.id, created: new Date().toISOString() };
        $$('input,textarea,select', form).forEach(field => {
          if (field.type !== 'password' && field.type !== 'checkbox' && field.id) record[field.id] = field.value.trim();
        });
        storage.set(KEYS.submissions, [...arrayValue(KEYS.submissions), record]);
        status.textContent = form.id === 'subscriptionForm' ? 'Your update preference is saved in this browser. No email subscription has been sent.' : 'Your message is saved in this browser. This demo does not send messages.';
        status.classList.add('yk-success'); form.reset();
      }
    } catch (error) {
      status.textContent = error.message === 'secure-context' ? 'Open the site using localhost or HTTPS to create an account.' : storageFailure;
      status.classList.add('yk-error');
    } finally {
      form.removeAttribute('aria-busy');
      if (submit) { submit.disabled = false; submit.innerHTML = previous; }
    }
  }
  function initForms() {
    const chosen = new URLSearchParams(location.search).get('program');
    if (programById(chosen) && $('#request-program')) $('#request-program').value = chosen;
    const user = activeUser();
    if (user && $('#information-form')) {
      $('#request-name').value = user.name; $('#request-email').value = user.email; $('#request-phone').value = user.phone;
    }
    // Capture submissions first to replace obsolete assignment-only handlers consistently.
    document.addEventListener('submit', event => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.id === 'a5VisitForm') {
        if (!validateForm(form)) { event.preventDefault(); event.stopImmediatePropagation(); }
        return;
      }
      event.preventDefault(); event.stopImmediatePropagation();
      if (form.getAttribute('aria-busy') !== 'true') handleSubmission(form);
    }, true);
    document.addEventListener('focusout', event => {
      const field = event.target;
      if (field.matches('[data-rule]') && field.closest('form')) validateField(field, field.closest('form'));
    });
    document.addEventListener('input', event => {
      if (event.target.matches('[data-rule][aria-invalid="true"]')) validateField(event.target, event.target.closest('form'));
    });
    // The existing visit planner keeps its step logic, with the same validation as other forms.
    document.addEventListener('click', event => {
      if (event.target.closest('#a5Next')) {
        const form = $('#a5VisitForm'); const step = $('.a5-step:not([hidden])', form);
        if (!validateForm(form, step)) { event.preventDefault(); event.stopImmediatePropagation(); }
      }
    }, true);
    $$('[data-password-toggle]').forEach(button => button.addEventListener('click', () => {
      const show = button.getAttribute('aria-pressed') !== 'true';
      button.dataset.passwordToggle.split(' ').forEach(id => { document.getElementById(id).type = show ? 'text' : 'password'; });
      button.setAttribute('aria-pressed', String(show)); button.textContent = show ? 'Hide password' : 'Show password';
    }));
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === '1' && $('#login-form')) formStatus($('#login-form')).textContent = 'Account created. Log in to open your applicant profile.';
    if (params.get('next') === 'admissions') $$('[data-auth-switch]').forEach(link => { link.href += '?next=admissions'; });
  }
  function initProfile() {
    if (!$('#profile-content')) return;
    const user = activeUser();
    if (!user) return;
    $('#profile-guest').hidden = true; $('#profile-content').hidden = false;
    const set = (id, value) => { $(id).textContent = value || 'Not provided'; };
    set('#profile-name', user.name.split(' ')[0]); set('#profile-fullname', user.name); set('#profile-email', user.email); set('#profile-phone', user.phone);
    set('#profile-created', new Date(user.created).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }));
    $('#logout').addEventListener('click', () => {
      try { storage.remove(KEYS.session); location.replace('profile.html?auth=login'); } catch { toast(storageFailure); }
    });
    const requests = arrayValue(KEYS.requests).filter(request => request && request.email === user.email && programById(request.program));
    const container = $('#profile-requests');
    if (!requests.length) { const text = document.createElement('p'); text.textContent = 'No requests saved yet. Start from the Admissions page.'; container.append(text); }
    requests.slice().reverse().forEach(request => {
      const card = document.createElement('article'); card.className = 'yk-panel yk-request-card';
      const title = document.createElement('h3'); title.textContent = programById(request.program).title;
      const date = document.createElement('p'); date.className = 'yk-small yk-muted'; date.textContent = `Saved ${new Date(request.created).toLocaleDateString('en-GB')}`;
      const message = document.createElement('p'); message.textContent = request.message;
      const state = document.createElement('p'); state.className = 'yk-small yk-success'; state.textContent = 'Saved locally · Not submitted';
      card.append(title, date, message, state); container.append(card);
    });
  }
  initAuthDialog(); initTheme(); initNavigation(); initPrograms(); initChecklist(); initReading(); initForms(); initProfile();
})();
