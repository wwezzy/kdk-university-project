# KDK University · Final project

A responsive, seven-page fictional university website for Web Technologies, SE-2515.

## Run locally

No build step or backend is required. In this directory run:

```sh
python -m http.server 8000
```

Open http://localhost:8000. Use localhost or HTTPS, not a double-clicked file URL, for browser cryptography and consistent storage behaviour.

## Pages

- `index.html`: introduction, campus photos, public Open Library API reading suggestions, FAQ.
- `about.html`: mission, values, study spaces, honest project/team description.
- `programs.html`: dynamic search, category filter, shortlist, details dialog and subject match.
- `admissions.html`: application steps, persistent checklist, fees, scholarships, validated information request.
- `campus-life.html`: clubs, activities, facilities and useful FAQ.
- `contact.html`: validated contact form and relevant navigation.
- `profile.html`: stored demo user details and matching saved information requests.

Sign up and log in are modal dialogs on every page. `login.html` and `signup.html` are small compatibility redirects, not extra content pages.

## Code map

- `css/yerkhan.css`: shared theme/layout plus original Programs/Admissions components.
- `css/final.css`: final integration, readable dialog and responsive refinements.
- `js/yerkhan.js`: shared theme, navigation, program data/filter, book API, JS validation, demo authentication and profile. Reuses and adapts Yerkhan's existing implementation.
- `images/`: existing team images; no remote image dependency.
- `tests/check_links.py`: local files, anchors, IDs, alt text, validation constraints.
- `tests/browser.cjs`: browser end-to-end and responsive tests.
- `docs/`: report draft, defense notes and current testing evidence.

## Important demo limitations

KDK is fictional. Programs, prices, scholarships and application process are demonstration content. Contact and admission forms save locally; they do NOT submit to a university. Authentication is an assignment simulation, NOT secure real authentication. Passwords are salted/derived with PBKDF2 before local storage, but browser storage is user-controlled and does not protect an actual account. Use fake personal details and a unique sample password only. Clearing browser data removes accounts, requests, filters and preferences.

## API

Open Library: `https://openlibrary.org/subjects/computer_science.json?limit=3` (subject chosen by the user). `fetch` with a 12-second timeout; visible loading, retry, empty and failure states. Cached API responses live in localStorage for 24 hours and are labelled when reused. No secret API key. Public network requests can fail, but the rest of the site remains usable.

## Tests

```sh
npm install
npx playwright install chromium
npm test
npm run test:forms
python tests/check_links.py
```

To use installed Edge, set `BROWSER_EXECUTABLE` to its executable path. Exact results are in `docs/TEST_RESULTS.txt`; live API observations are separate in `docs/BROWSER_API_RUN.txt`. Mocked API tests verify failure/retry behaviours, not external API uptime.

## Deployment / submission

The integrated website is published on GitHub Pages. Course submission is not performed by this project. Repository: https://github.com/wwezzy/kdk-university-project . Live website: https://wwezzy.github.io/kdk-university-project/ .

Each teammate must submit their own complete project ZIP, PDF report and links TXT. Responsibility areas follow the agreed team split; final integration was AI-assisted. Prepare to explain assigned functionality. Full test results and focused form audit are recorded in docs/.
