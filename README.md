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

## Author

Aryan Khan — first-semester B.Tech student in Artificial Intelligence and Data Science at Lovely Professional University.

- GitHub: [@iamaryaann](https://github.com/iamaryaann)
- Live project: [LPU Campus Navigator](https://iamaryaann.github.io/lpu-campus-navigator/)

