# KDK University Website

A responsive multi-page university website created for the **Web Technologies 1** course. The project demonstrates the practical use of **HTML5**, **CSS3**, semantic page structure, responsive layouts, forms, tables, navigation, and collaborative Git/GitHub workflow.

## Live Website

**GitHub Pages:** https://wwezzy.github.io/kdk-university-project/

## Project Overview

KDK University is a fictional university website designed as a team project. The goal was to build a consistent, modern website without external UI frameworks and to demonstrate core frontend development skills using only HTML and CSS.

The website contains six connected pages with a shared navigation bar, common visual style, responsive sections, and a footer listing the project team.

## Pages

| Page | File | Description |
| --- | --- | --- |
| Home | `index.html` | Main landing page with hero section, introduction, feature cards, and call to action |
| About Us | `about.html` | University information, mission, vision, values, and team members |
| Programs | `programs.html` | Academic programs and study directions offered by KDK University |
| Admissions | `admissions.html` | Admission process, requirements, tuition table, and scholarships |
| Campus Life | `campus-life.html` | Student life, campus facilities, activities, and community information |
| Contact | `contact.html` | Contact information, contact form, and campus visit section |

## Main Features

- Multi-page website with consistent navigation
- Semantic HTML structure using `header`, `nav`, `main`, `section`, `article`, and `footer`
- Responsive layouts for desktop and smaller screens
- Shared external CSS styling
- Custom buttons, cards, banners, navigation states, and hover effects
- Ordered and unordered lists
- Admissions information table
- Contact form with text, email, select, textarea, and submit controls
- Images with descriptive `alt` text
- Team information section
- CSS Grid and Flexbox layouts
- Box model styling with margin, padding, borders, and border radius
- Responsive media queries
- GitHub collaboration with branches, commits, pull requests, and GitHub Pages deployment

## Technologies Used

- **HTML5** — page structure and semantic markup
- **CSS3** — layout, colors, typography, responsive design, Grid, Flexbox, hover and focus states
- **Git** — version control
- **GitHub** — team collaboration and repository management
- **GitHub Pages** — website deployment

No Bootstrap, Tailwind CSS, or other external UI frameworks were used.

## Project Structure

```text
kdk-university-project/
│
├── index.html
├── about.html
├── programs.html
├── admissions.html
├── campus-life.html
├── contact.html
├── README.md
│
├── css/
│   ├── style.css
│   └── allazhar.css
│
└── images/
    ├── kdk-campus-wide.png
    ├── kdk-campus.png
    ├── campus-life.png
    └── kdk-logo.svg
```

## Team Members

| Team Member | Responsibility |
| --- | --- |
| **Kuat Allazhar** | Home and About Us pages |
| **Dautbekov Yerkhan** | Programs and Admissions pages |
| **Khafiz Akylzhan** | Campus Life and Contact pages |

The team worked in separate Git branches and integrated changes into the shared repository through GitHub.

## How to Run Locally

Clone the repository:

```bash
git clone https://github.com/wwezzy/kdk-university-project.git
```

Open the project folder:

```bash
cd kdk-university-project
```

Then open `index.html` in a browser or run the project using a local development server such as the **Live Server** extension in VS Code.

## Git Workflow

Typical team workflow:

```bash
git pull origin main
git switch <your-branch>
git add <changed-files>
git commit -m "Describe your changes"
git push -u origin <your-branch>
```

After pushing, changes can be reviewed and merged into `main` through a Pull Request.

## Course

**Course:** Web Technologies 1  
**Project:** HTML & CSS Basics — Team Website  
**Year:** 2026

## Notes

This project was created for educational purposes. KDK University is a fictional university used only as the subject of the coursework.
