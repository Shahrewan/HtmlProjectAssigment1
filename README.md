# Personal Portfolio Website — Revised Starter

A responsive static portfolio built with **semantic HTML, CSS and vanilla JavaScript**, with no frameworks, external fonts, or build dependencies.

## Files

- `index.html` — home, six project illustrations, an about section and a contact-draft form
- `project-details.html` — actual internal destination for each of the six project cards, with transparent notes about the illustrative concepts
- `styles.css` — layout, responsive breakpoints, color themes, accessibility styles and CSS mockups
- `details.js` — keeps the concept-notes page in the saved light/dark theme
- `script.js` — progressive enhancement: navigation, theme preference, project filters, reveal effects, role animation and contact drafts

## What was fixed

1. Narrow-screen overflow: project illustrations no longer force the page wider than a small phone viewport.
2. No-JavaScript fallback: page content and the mobile navigation remain visible and usable; interactive-only controls are hidden until JavaScript starts.
3. Legibility: secondary text colors have stronger contrast, and many labels, form fields and body descriptions have larger font sizes.
4. Project links: the six visual cards now open working internal concept-note anchors in `project-details.html`, **not** an unrelated contact section. No nonexistent demo URLs are suggested.
5. Generic placeholders: the site now uses neutral, truthful portfolio-starter language instead of a fictional personal identity or a fake recipient address. The form honestly prepares a copyable message until you configure a real email address.
6. Reduced motion remains supported.

## Personalize before publishing (required)

This is still a **template**, not your completed professional profile. We cannot supply your actual name, biography, skills, projects, or email without information from you. To publish your own portfolio:

1. In `index.html` **and** `project-details.html`, change the `portfolio.` brand, `P` logo, page titles, and generic starter text to your real identity or preferred public name.
2. Replace the six illustrative projects and the details in `project-details.html` with truthful examples of your own work. Point your project cards to **real** deployed demos or repositories, or retain useful internal case studies. Do not claim these mockups are completed client work.
3. In `script.js`, set **one** configuration line near the top: `const emailAddress = "you@yourdomain.com";`. Only add a real email you control. Once configured, the address and copy button appear and the contact form prepares an email using `mailto:`.
4. Update the About section with your actual background, skills and experience; update `<meta name="description">` and `<title>` in both HTML files.
5. Test on a real phone and desktop device, and verify every link and contact destination.

## Contact form behavior

There is **no form backend** and no automatic delivery. With `emailAddress = ""` (the starter default), the form creates a visible message draft and attempts to copy it. If clipboard access is unavailable, visitors can copy the text manually. If you set a valid email address, form submission opens a prefilled draft in the visitor's email application; the visitor must send it. Without JavaScript, the page shows a static explanation instead of a nonfunctional form.

## Local preview

Open `index.html` directly in a modern browser, or host the directory with any static server. The project-detail page must stay alongside the other files. No installation or build step is required.

## Publish on GitHub Pages

1. Create a repository and upload **both HTML files**, `styles.css`, `script.js`, `details.js`, and optionally this README to the root.
2. In the repository's **Settings → Pages**, deploy from the `main` branch and the root folder.
3. Open the actual published URL reported by GitHub Pages and verify the project links, menus, filters, contact flow, and theme on small and large screens.

You can host the same files with most other static hosting providers.
