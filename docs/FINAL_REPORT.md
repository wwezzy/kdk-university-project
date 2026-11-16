## KDK University

## Web Technologies · Final Project

Group SE-2515
Team: Kuat Allazhar, Dautbekov Yerkhan, Khafiz Akylzhan
Prepared: 16 November 2026

## Published final project

We built KDK University as a seven-page website for prospective students. Visitors can compare programs, explore campus life, prepare an application request and keep their details in a demo profile. KDK is a fictional university created for our Web Technologies project.

We published the site on GitHub Pages. We used HTML, CSS and JavaScript without a backend, so accounts and form entries stay in the browser rather than being sent to a university.

Stack: HTML, CSS and vanilla JavaScript. No backend or build process required. Public API: Open Library. Browser storage: localStorage.

## 1. Team responsibilities

## Kuat Allazhar

Home and About Us; shared design, navigation, responsive layout, theme persistence and Home public API.

## Dautbekov Yerkhan

Programs and Admissions; dynamic catalog/filtering, application flow and shared form validation.

## Khafiz Akylzhan

Campus Life and Contact; account/profile functionality and contact interaction.

We divided responsibility by page and feature, as listed above. We kept useful code and images from our earlier team work. We also used AI tools to help with final integration, cleanup and testing. The responsibility split describes our assigned areas, not exclusive authorship of every line of code.

## 2. Design and user journey

We chose navy, white and pale green for a consistent university style. We kept headings, spacing and buttons similar across the pages, and used the existing campus photos. CSS Grid and Flexbox let the layouts adjust to smaller screens. We added light and dark themes, simple hover effects and support for reduced motion.

We connected the pages through the same header and footer. A visitor can start on Home, choose a program, open Admissions and then create a demo account to view saved requests. Sign up and Log in open in a dialog instead of adding two more content pages. The dialog supports the keyboard and closes with Escape.

## 3. Technical organization

We kept the shared layout in css/yerkhan.css and final adjustments in css/final.css. The shared script, js/yerkhan.js, handles the theme, navigation, program catalog, forms, API requests and demo accounts. We store images in images/, test scripts in tests/ and test results in docs/.

## Page: Home

We made Home the starting point for the website. It introduces KDK and links to Programs and Admissions. We also added book suggestions from Open Library. Visitors choose a subject and load results with fetch and async/await. We show loading, empty and error states, provide a retry button and label cached results. The FAQ explains where to go next.

Our published website. Any account details shown are sample data.

## Page: About Us

We used About Us to explain the university concept and show its study spaces. The page combines short sections about learning with campus photos and team information. We kept the same headings and spacing as the other pages and clearly identified KDK as a fictional student project.

Our published website. Any account details shown are sample data.

## Page: Programs

We made the program catalog searchable by name, skills and description. Visitors can filter by subject, save programs and show only their shortlist. We store these choices in localStorage so they remain after a reload. Each program opens a details dialog and links to Admissions. If nothing matches, the page offers a way to clear the filters.

Our published website. Any account details shown are sample data.

## Page: Admissions

We organized Admissions around the application steps, a preparation checklist and sample tuition and scholarship information. The checklist keeps its state in localStorage. Our information-request form checks the required fields, email, phone, program, message and consent in JavaScript. Requests are saved locally and shown in the profile with the same email address.

Our published website. Any account details shown are sample data.

## Page: Campus Life

We built Campus Life around clubs, sports and shared study spaces. We used the team photos to make these sections feel connected to the rest of the site. Links lead to Contact, Programs and Admissions. We used simple expandable questions for extra information rather than adding unrelated widgets.

Our published website. Any account details shown are sample data.

## Page: Contact

We kept Contact focused on the form and useful links. JavaScript checks the name, email, phone number and message, with errors shown beside the fields. After a valid submission, we explain that the message was saved in this browser. The demo does not send an email.

Our published website. Any account details shown are sample data.

## Page: Profile

We added a demo account flow so visitors can open their own Profile page. Sign up stores the name, email, phone and a salted password derivation in localStorage. Log in checks the credentials before opening Profile. We handle incorrect passwords and duplicate accounts, show saved user details and matching requests, and clear the local session when the user logs out.

Our published website. Any account details shown are sample data.

## 4. Validation and demo limitations

We added novalidate to every form and wrote the checks in JavaScript. We do not rely on native required, pattern, length constraints or type=email validation. Our password check requires upper- and lowercase letters, a number and a symbol. We show errors next to the relevant fields and use labels and visible focus styles for keyboard navigation.

We treated authentication as a classroom simulation. We derive passwords with PBKDF2 and a unique salt, but localStorage is still controlled by the browser user and is not a replacement for server-side security. The site is intended for sample data and throwaway passwords. Clearing browser storage removes the accounts and saved requests.

## 5. Verification

We checked the published site with automated browser tests at widths of 1440, 768, 375 and 320 pixels in both themes. The final run passed without horizontal overflow, broken resources or uncaught JavaScript errors. We also tested the menu, filters, saved programs, checklist, forms, account flow and profile. The results are in docs/TEST_RESULTS.txt.

We ran a separate check of all 16 form instances across the seven pages, including the shared login and signup dialogs. Every form had novalidate, no prohibited constraint attributes and working inline errors for empty submissions. Our active script does not use checkValidity, reportValidity or native validity properties. We saved this check in docs/FORM_AUDIT.txt.

The real Open Library request returned three books during our browser test. We also used controlled responses to test failures, retries, empty results, invalid responses and caching. One early public run had a temporary image response failure; the image returned HTTP 200 on recheck and the full repeated run passed. We recorded this in docs/PUBLIC_VERIFICATION.txt.

## 6. Scope and next steps

We kept this project frontend-only, as required. A real admissions website would need a backend, server-side validation, secure accounts and a way to deliver messages. Our current version demonstrates the user interface and browser-side behavior without collecting real applications.

Repository: https://github.com/wwezzy/kdk-university-project
Live website: https://wwezzy.github.io/kdk-university-project/
