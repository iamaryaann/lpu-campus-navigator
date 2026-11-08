# LPU Campus Navigator

A student-built campus guide for Lovely Professional University (LPU), with a campus map, block and room lookup, and student resource sections.

**Live website:** [iamaryaann.github.io/lpu-campus-navigator](https://iamaryaann.github.io/lpu-campus-navigator/)

## Features

- Leaflet-based campus map and location search
- Timetable room-code lookup, such as `32-405`
- Block, campus essentials, hostel, mess-menu, and helpline sections
- Light and dark themes
- Optional Express API for serving campus data and accepting updates when run with Node.js

## Technology

- HTML, CSS, and vanilla JavaScript
- Leaflet.js for maps
- Node.js and Express for the optional API
- JSON files for campus data

## Run locally

Install Node.js, then run:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Hosting notes

The GitHub Pages site uses the frontend files at the repository root and the bundled campus-data fallback. GitHub Pages does not run the Express server. API-backed changes such as reviews or crowd updates require the Express API to be hosted separately.

The `public/` directory contains the frontend copy served by Express. Keep it in sync with the root frontend files when making frontend changes.

## Project layout

```text
index.html, styles.css, app.js, data.js   GitHub Pages frontend
public/                                   Frontend served by Express
server.js                                 Optional Express API and static server
data/db.json                              Starter data for the API
package.json                              Node.js scripts and dependencies
```

## Author & Social Handles

**Aryan Khan** (`@iamaryaann`) — First-semester B.Tech CSE student in Artificial Intelligence & Data Science at Lovely Professional University (LPU).

<p align="left">
  <a href="https://www.linkedin.com/in/iamaryaann" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-@iamaryaann-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://www.instagram.com/iamaryaann" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-@iamaryaann-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
  <a href="https://github.com/iamaryaann" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-@iamaryaann-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="mailto:khanaryan1889@gmail.com">
    <img src="https://img.shields.io/badge/Email-khanaryan1889%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>

- 💼 **LinkedIn:** [linkedin.com/in/iamaryaann](https://www.linkedin.com/in/iamaryaann)
- 📸 **Instagram:** [instagram.com/iamaryaann](https://www.instagram.com/iamaryaann)
- 💻 **GitHub:** [@iamaryaann](https://github.com/iamaryaann)
- 📧 **Email:** [khanaryan1889@gmail.com](mailto:khanaryan1889@gmail.com)
- 🌐 **Live Project:** [LPU Campus Navigator](https://iamaryaann.github.io/lpu-campus-navigator/)

