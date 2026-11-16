# KDK University — Final Project Report Draft

**Course:** Web Technologies  
**Group:** SE-2515  
**Team:** Kuat Allazhar, Dautbekov Yerkhan, Khafiz Akylzhan  
**Project type:** Multi-page responsive website  
**Status:** Draft for team review. Replace screenshot placeholders and verify final links before exporting to PDF.

## 1. Goal and audience

KDK University is a fictional university concept. The website helps prospective students discover programs, explore campus life, understand the demonstration admissions process and keep a local applicant profile. It is a frontend educational project, not an operating university or real admissions service.

## 2. Pages and connected user journey

1. **Home:** campus introduction, links to programs and admissions, public book discovery API and practical FAQ.
2. **About Us:** university concept, learning values, campus imagery and transparent student-project/team information.
3. **Programs:** searchable/filterable program catalog, program details and locally saved selections.
4. **Admissions:** application guidance and a validated demonstration application form.
5. **Campus Life:** student activities and campus facilities.
6. **Contact:** contact information and validated demonstration feedback form.
7. **Profile:** locally stored applicant details and available saved information after demo login.

Signup and login are shared modal dialogs rather than separate required content pages. The common header and footer link the pages. A typical journey is Home → Programs → Admissions → signup/login → Profile.

## 3. Responsibility and honest attribution

The following is the **agreed responsibility split**, not a claim that every line was independently written by the named student:

| Team member | Assigned responsibility |
|---|---|
| Kuat Allazhar | Home, About Us, shared design/navigation, responsive layout, persisted theme, Home public API section |
| Dautbekov Yerkhan | Programs, Admissions, program search/filter persistence, shared validation |
| Khafiz Akylzhan | Campus Life, Contact, demo authentication and Profile |

Existing team work and provided images were retained where useful. Final integration and revisions were AI-assisted. Each teammate must review, understand and test their assigned functionality before presenting. Adjust this section to describe actual completed work after the final team review. Do not present planned responsibilities as verified personal authorship.

## 4. Functional implementation

### Theme and navigation

A shared script switches light/dark mode and stores the selected mode in localStorage. Each page applies the preference, keeping the experience consistent between navigation steps. The shared responsive navigation includes a mobile menu and current-page indication.

### Forms and validation

Forms use `novalidate`; JavaScript performs required-field, email-format, phone-format and password checks as applicable to each form. Errors appear alongside inputs instead of relying only on alert boxes or native browser validation. Successful demo submissions remain local. A contact/application confirmation does not mean a real message was delivered.

### Authentication simulation

Signup, login, logout and profile are frontend demonstrations using localStorage. They are not secure production authentication. Browser storage can be inspected or changed by the user, and a local session is not a server-authorized identity. Use fictional data and a unique throwaway password, never real credentials. A production version would require a backend, secure password hashing, server-side authorization, protected sessions and suitable data handling.

### Search and filtering

The Programs catalog updates visible results dynamically. Selected filter preferences are stored locally for continuity across visits. Empty results should give users a clear next step such as clearing filters.

### Public API

The Home book section calls the Open Library subject API using `fetch()` and async JavaScript. Topic choices map to subject identifiers, for example `computer_science`. The interface shows loading, successful results, an empty result state and recoverable errors with a retry action. Results may be cached in localStorage to reduce repeated requests. Cached or stale data must be identified honestly rather than called live data. Open Library book suggestions are not an official course reading list. No API secret is required.

## 5. Design choices

- A consistent university-oriented visual system across all seven pages.
- Readable typography, sufficient contrast, clear spacing and a limited accent palette.
- Existing campus, library and activity imagery gives the project a consistent identity.
- Responsive grids collapse at smaller widths instead of relying on fixed desktop layouts.
- Clear primary actions guide visitors from exploration to application.
- Hover and focus transitions support feedback without heavy decorative animation.
- Honest fictional-university notices prevent demonstration content being mistaken for real admissions information.

## 6. Technology and organization

Static HTML, CSS and JavaScript; no production backend is required. Shared assets are organized under `css/`, `js/`, `images/` . Shared behavior is reused across pages rather than independently duplicated. Test scripts and verification evidence belong in `tests/` and `docs/`.

## 7. Verification — update after final test run

The integrated version passed a new local browser acceptance run on 16 November 2026. See TEST_RESULTS.txt and BROWSER_API_RUN.txt. Public deployment remains unverified.

| Check | Final evidence/status |
|---|---|
| Seven connected pages and local links/images | Passed static and browser checks |
| Desktop, tablet and phone layout; no horizontal overflow | Passed at 1440, 768, 375 and 320 pixels, both themes |
| Both themes and persistence across pages | Passed local acceptance checks |
| Signup, duplicate account, login, incorrect credentials, logout, profile | Passed local acceptance checks |
| All form validation and inline errors | Passed local acceptance checks |
| Program search, filtering, no-result state, persistence | Passed local acceptance checks |
| API success, loading, failure/retry, cached result | Real Open Library response rendered 3 books; controlled mock tests verified error/retry/cache |
| Console errors and broken local resources | Passed local acceptance checks |
| Hosted build and deep links | Not verified; deployment not claimed |

Distinguish mocked API responses used for predictable UI tests from a live public API request. Record any environment-related network limitation explicitly.

## 8. Screenshots to insert

1. `[Insert Home desktop, light theme screenshot]`
2. `[Insert Home phone screenshot]`
3. `[Insert About Us screenshot]`
4. `[Insert Programs with filtered results screenshot]`
5. `[Insert Admissions inline validation screenshot]`
6. `[Insert Campus Life and Contact screenshots]`
7. `[Insert signup/login modal and Profile screenshots using fictional data]`
8. `[Insert dark theme screenshot]`
9. `[Insert API results and error-state screenshots]`

## 9. Submission checklist

- ZIP containing the complete final project, not only one teammate's pages.
- This report reviewed, illustrated and exported as PDF.
- TXT file containing the verified repository URL and verified hosted URL.
- Each teammate submits the required package individually.
- Keep a local demo and screenshots/video as presentation backup.
- Check course submission deadline and required format against the official instructions.

**Repository:** https://github.com/wwezzy/kdk-university-project  
**Live URL:** [Insert and verify the final deployment URL. Do not assume an older deployment contains this version.]
