# KDK University

We built a seven-page website for a fictional university as our Web Technologies final project, group SE-2515.

**Our team:** Kuat Allazhar, Dautbekov Yerkhan and Khafiz Akylzhan.

- Website: https://wwezzy.github.io/kdk-university-project/
- Repository: https://github.com/wwezzy/kdk-university-project

## What we built

- Home: campus introduction, Open Library book suggestions and FAQ.
- About Us: the university concept, campus photos and team information.
- Programs: search, category filters, saved programs and details dialogs.
- Admissions: application steps, a saved checklist and an information-request form.
- Campus Life: clubs, activities, facilities and useful questions.
- Contact: a form with inline JavaScript validation.
- Profile: demo user details and matching saved requests.

We share the header, footer, light/dark theme and account dialogs across the pages. Login and signup open as modals; their old URLs redirect to Profile and open the relevant dialog.

## Run locally

The site uses HTML, CSS and JavaScript with no backend or build step.

```sh
python -m http.server 8000
```

Open http://localhost:8000. Use localhost or HTTPS rather than opening an HTML file directly, because the demo account flow uses browser cryptography.

## Code structure

- `css/yerkhan.css`: shared layout and components retained from the existing project.
- `css/final.css`: final styling adjustments and the account dialog.
- `js/yerkhan.js`: theme, navigation, programs, API requests, validation and demo accounts.
- `images/`: our existing team images.
- `tests/`: static checks and browser tests.
- `docs/`: report text and recorded test results.

## API and browser storage

We use the Open Library subject API for book suggestions. Requests have a loading state, a 12-second timeout, error messages and a retry action. We cache results for 24 hours and label them when reused.

We also use localStorage for the selected theme, program filters, shortlist, checklist, demo accounts and requests. Clearing browser data removes those records.

## Demo limits

KDK is fictional. The program information, fees and application process are examples. Contact and admissions forms save locally and do not send messages.

We derive demo passwords with PBKDF2 and a unique salt, but localStorage is not production authentication. Please use sample details and a throwaway password. A real version would need a backend, server-side validation and protected sessions.

## Checks

```sh
npm install
npx playwright install chromium
npm test
npm run test:forms
python tests/check_links.py
```

Set `BROWSER_EXECUTABLE` to use an installed browser. Set `PUBLIC_BASE=https://wwezzy.github.io/kdk-university-project` to run the browser checks against the published site.

Our recorded results are in `docs/TEST_RESULTS.txt`, `docs/FORM_AUDIT.txt`, `docs/BROWSER_API_RUN.txt` and `docs/PUBLIC_VERIFICATION.txt`. The public run passed at four viewport widths in both themes. We tested the real API as well as controlled failure and empty responses.

## Team work and AI assistance

We divided responsibility between Home/About and shared design (Allazhar), Programs/Admissions and validation (Yerkhan), and Campus/Contact and the account flow (Akylzhan). We retained useful earlier team code and images. We used AI tools to help with final integration, cleanup and testing. These responsibility areas do not imply exclusive authorship of every line.
