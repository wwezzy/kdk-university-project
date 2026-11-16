/* Browser acceptance checks. Run from the repository root with: npm test
   Optional: BROWSER_EXECUTABLE=/path/to/chrome-headless-shell npm test */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const artifacts = path.join(root, 'docs', 'screenshots');
fs.mkdirSync(artifacts, { recursive: true });
const checks = [];
const ok = message => { checks.push(`PASS ${message}`); console.log(`PASS ${message}`); };
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = path.resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, bytes) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(bytes);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = process.env.PUBLIC_BASE || `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}), args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
    const go = slug => page.goto(`${base}/${slug}.html`);
    // Every page, two themes and three device sizes. Also force lazy images into view.
    for (const theme of ['light', 'dark']) {
      await go('programs');
      const current = await page.locator('html').getAttribute('data-theme');
      if (current !== theme) await page.locator('[data-theme-toggle]').click();
      for (const width of [1440, 768, 375, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const slug of ['index', 'about', 'programs', 'admissions', 'campus-life', 'contact', 'profile']) {
          await go(slug);
          assert.equal(await page.locator('html').getAttribute('data-theme'), theme, `${slug}: theme persistence`);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${slug} horizontal overflow at ${width}`);
          for (const image of await page.locator('img:visible').all()) {
            await image.scrollIntoViewIfNeeded();
          }
          await page.waitForFunction(() => [...document.images].every(image => !image.getAttribute('src') || image.complete));
          const broken = await page.locator('img:visible').evaluateAll(images => images.filter(image => !image.naturalWidth).map(image => image.getAttribute('src') || image.dataset.src));
          assert.deepEqual(broken, [], `${slug}: broken images`);
          const banned = await page.locator('form [required], form [pattern], form [minlength], form [maxlength], form [min], form [max], form input[type=email], form:not([novalidate])').count();
          assert.equal(banned, 0, `${slug}: native validation`);
          await page.evaluate(() => scrollTo(0, 0));
          if (width === 1440 && theme === 'light') await page.screenshot({ path: path.join(artifacts, `${slug}-desktop.png`), fullPage: true });
          if (width === 375 || theme === 'dark' && width === 1440) {
            await page.screenshot({ path: path.join(artifacts, `${slug}-${theme}-${width}.png`), fullPage: true });
          }
        }
        ok(`7 pages: ${theme}, ${width}px, no overflow, loaded images, JS-only forms`);
      }
    }
    assert.deepEqual(errors, [], 'Uncaught browser errors'); assert.deepEqual(missing, [], 'Missing local resources');
    ok('No uncaught JS errors or local HTTP 404s');
    await page.setViewportSize({ width: 375, height: 850 }); await go('programs');
    await page.getByRole('button', { name: /Menu/ }).click();
    assert.equal(await page.locator('.yk-navigation').isVisible(), true);
    await page.keyboard.press('Escape'); assert.equal(await page.locator('.yk-navigation').isVisible(), false);
    ok('Mobile menu opens, Escape closes');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#program-search').fill('Python');
    assert.equal(await page.locator('.yk-program-card:visible').count(), 1);
    await page.reload(); assert.equal(await page.locator('#program-search').inputValue(), 'Python');
    await page.locator('#reset-filters').click();
    await page.locator('#program-category').selectOption('creative');
    assert.equal(await page.locator('.yk-program-card:visible').count(), 1);
    await page.locator('[data-save="design"]').click(); await page.locator('#saved-only').check();
    await page.reload(); assert.equal(await page.locator('[data-save="design"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#reset-filters').click();
    await page.locator('#program-search').fill('nothing-to-find-xyz'); assert.equal(await page.locator('#program-empty').isVisible(), true);
    await page.locator('[data-reset-filters]').click();
    await page.locator('[data-details="software"]').click(); assert.equal(await page.locator('#program-dialog').isVisible(), true);
    await page.keyboard.press('Escape'); assert.equal(await page.locator('#program-dialog').isVisible(), false);
    await page.locator('#match-interest').selectOption('cyber'); await page.locator('#find-match').click(); assert.match(await page.locator('#match-result').innerText(), /Cybersecurity/);
    ok('Search, category, empty state, save persistence, program dialog and recommendation');
    // Real API response, then deterministic HTTP failure / invalid response / empty results.
    await page.locator('#load-reading').click();
    await page.waitForFunction(() => document.querySelector('#reading-results').getAttribute('aria-busy') === 'false');
    const liveStatus = await page.locator('#reading-status').innerText();
    const bookCount = await page.locator('.yk-book').count();
    fs.writeFileSync(path.join(root, 'docs', 'BROWSER_API_RUN.txt'), `${new Date().toISOString()}\nReal browser request: ${liveStatus}\nDisplayed books: ${bookCount}\n`);
    if (bookCount) {
      ok('Real Open Library request rendered books');
      await page.locator('#reading-resources').screenshot({ path: path.join(artifacts, 'api-live.png') });
    } else ok('Real API unavailable in test environment; error state displayed');
    await page.route('https://openlibrary.org/subjects/**', route => route.fulfill({ status: 503, body: 'Unavailable' }));
    await page.locator('#reading-subject').selectOption('computer_security'); await page.locator('#load-reading').click();
    await page.waitForFunction(() => document.querySelector('#reading-results').getAttribute('aria-busy') === 'false');
    assert.match(await page.locator('#reading-status').innerText(), /could not load/); assert.equal(await page.locator('#reading-retry').isVisible(), true);
    await page.unroute('https://openlibrary.org/subjects/**');
    await page.route('https://openlibrary.org/subjects/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ works: [{ key: '/works/OL123W', title: 'Computer Science Introduction', authors: [{ name: 'Sample Author' }], first_publish_year: 2024 }] }) }));
    await page.locator('#reading-retry').click();
    await page.waitForFunction(() => document.querySelector('#reading-results').getAttribute('aria-busy') === 'false');
    assert.equal(await page.locator('.yk-book').count(), 1);
    await page.locator('#load-reading').click(); assert.match(await page.locator('#reading-status').innerText(), /Saved in this browser/);
    await page.unroute('https://openlibrary.org/subjects/**');
    ok('API HTTP error, retry, successful rendering and cache');
    await go('admissions'); await page.locator('[data-checklist="0"]').check(); await page.locator('[data-checklist="1"]').check(); await page.reload();
    assert.equal(await page.locator('#checklist-progress').getAttribute('value'), '2');
    await page.locator('#reset-checklist').click(); assert.equal(await page.locator('#checklist-progress').getAttribute('value'), '0');
    await page.locator('.yk-faq summary').first().click(); assert.equal(await page.locator('.yk-faq details').first().getAttribute('open'), '');
    ok('Checklist persists and resets; admissions FAQ opens');
    await go('profile'); await page.locator('#profile-guest [data-open-auth=signup]').click();
    await page.locator('#signup-form [type=submit]').click(); assert.equal(await page.locator('#signup-name').getAttribute('aria-invalid'), 'true');
    await page.locator('#signup-name').fill('Yerkhan Demo'); await page.locator('#signup-email').fill('bad-email'); await page.locator('#signup-phone').fill('123'); await page.locator('#signup-password').fill('weak'); await page.locator('#signup-confirm').fill('different');
    await page.locator('#signup-form [type=submit]').click();
    for (const id of ['email','phone','password','confirm']) assert.equal(await page.locator('#signup-'+id).getAttribute('aria-invalid'), 'true');
    await page.locator('#signup-email').fill('yerkhan.demo@example.com'); await page.locator('#signup-phone').fill('+7 700 123 45 67'); await page.locator('#signup-password').fill('DemoPass1!'); await page.locator('#signup-confirm').fill('DemoPass1!');
    await page.locator('#signup-form [type=submit]').click(); await page.waitForFunction(() => !document.querySelector('[data-auth-panel=login]').hidden);
    await page.locator('#login-email').fill('yerkhan.demo@example.com'); await page.locator('#login-password').fill('WrongPass1!'); await page.locator('#login-form [type=submit]').click();
    await page.waitForFunction(() => document.querySelector('[data-form-status]').textContent.includes('incorrect'));
    await page.locator('#login-password').fill('DemoPass1!'); await page.locator('#login-form [type=submit]').click(); await page.waitForFunction(() => document.querySelector('#profile-fullname')?.textContent.trim() === 'Yerkhan Demo');
    assert.equal(await page.locator('#profile-fullname').innerText(), 'Yerkhan Demo'); assert.equal(await page.locator('#profile-email').innerText(), 'yerkhan.demo@example.com');
    ok('Required/email/phone/password/confirmation validation; signup, wrong password and login redirect');
    await go('admissions'); assert.equal(await page.locator('#request-email').inputValue(), 'yerkhan.demo@example.com');
    await page.locator('#request-program').selectOption('software'); await page.locator('#request-message').fill('Please tell me more about the Software Engineering program.'); await page.locator('#request-consent').check(); await page.locator('#information-form [type=submit]').click();
    await page.waitForFunction(() => document.querySelector('[data-form-status]').textContent.includes('request is saved'));
    await go('profile'); assert.match(await page.locator('#profile-requests').innerText(), /Software Engineering/);
    await page.screenshot({ path: path.join(artifacts, 'profile-signed-in.png'), fullPage: true });
    await page.locator('#logout').click(); await page.waitForURL('**/profile.html?auth=login'); await go('profile'); assert.equal(await page.locator('#profile-guest').isVisible(), true);
    ok('Request form prefills, saves and appears in matching profile; logout blocks profile');
    // Other team forms use the final shared JS validation, not native constraints or alerts.
    await go('contact'); await page.locator('#contact-form [type=submit]').click(); assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
    await page.locator('#name').fill('Campus Visitor'); await page.locator('#email').fill('visitor@example.com'); await page.locator('#contact-phone').fill('+7 701 234 56 78'); await page.locator('#message').fill('I would like to learn about visiting campus.'); await page.locator('#contact-form [type=submit]').click();
    await page.waitForFunction(() => document.querySelector('[data-form-status]').textContent.includes('message is saved'));
    ok('Contact form validates and saves locally');
    await go('index');
    await page.route('https://openlibrary.org/subjects/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ works: [{ key: '/works/OL123W', title: 'Home Book Test', authors: [{ name: 'Example Author' }], first_publish_year: 2024 }] }) }));
    await page.evaluate(() => Object.keys(localStorage).filter(k=>k.startsWith('kdk.final.books.')).forEach(k=>localStorage.removeItem(k)));
    await page.locator('#load-reading').click();
    await page.waitForFunction(() => document.querySelector('#reading-results').getAttribute('aria-busy') === 'false');
    assert.equal(await page.locator('.yk-book').count(),1);
    ok('Home page public API section renders response');
    await page.locator('[data-account-link]').click();
    assert.equal(await page.locator('#auth-dialog').isVisible(),true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#auth-dialog').isVisible(),false);
    await page.setViewportSize({width:375,height:812});
    await page.locator('[data-account-link]').click();
    await page.locator('[data-open-auth=signup]').last().click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await page.screenshot({path:path.join(artifacts,'account-mobile.png')});
    ok('Account dialogs open/switch/close with Escape and fit mobile');
    await page.locator('#signup-name').fill('Duplicate Demo');
    await page.locator('#signup-email').fill('yerkhan.demo@example.com');
    await page.locator('#signup-phone').fill('+7 700 123 45 67');
    await page.locator('#signup-password').fill('DemoPass1!');
    await page.locator('#signup-confirm').fill('DemoPass1!');
    await page.locator('#signup-form [type=submit]').click();
    await page.waitForFunction(() => document.querySelector('#signup-form [data-form-status]').textContent.includes('already exists'));
    ok('Duplicate accounts rejected with inline explanation');
    await page.keyboard.press('Escape');
    await page.unroute('https://openlibrary.org/subjects/**');
    await page.route('https://openlibrary.org/subjects/**', route => route.fulfill({contentType:'application/json',body:JSON.stringify({works:[]})}));
    await page.locator('#reading-subject').selectOption('business');
    await page.locator('#load-reading').click();
    await page.waitForFunction(()=>document.querySelector('#reading-results').getAttribute('aria-busy')==='false');
    assert.match(await page.locator('#reading-status').innerText(),/No books/);
    await page.unroute('https://openlibrary.org/subjects/**');
    await page.route('https://openlibrary.org/subjects/**', route => route.fulfill({contentType:'application/json',body:'{}'}));
    await page.locator('#reading-subject').selectOption('graphic_design');
    await page.locator('#load-reading').click();
    await page.waitForFunction(()=>document.querySelector('#reading-results').getAttribute('aria-busy')==='false');
    assert.match(await page.locator('#reading-status').innerText(),/could not load/);
    ok('API empty and malformed responses handled without breaking page');
    assert.deepEqual(errors, [], 'Uncaught browser errors after interactions');
    await context.close();
    fs.writeFileSync(path.join(root, 'docs', 'TEST_RESULTS.txt'), `Browser acceptance checks\n${new Date().toISOString()}\nBrowser ${browser.version()}\nBase ${base}\n\n${checks.join('\n')}\n`);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
