# LPU Campus Navigator

A student-built campus guide for Lovely Professional University (LPU), with a campus map, block and room lookup, and student resource sections.

**Live website:** [iamaryaann.github.io/lpu-campus-navigator](https://iamaryaann.github.io/lpu-campus-navigator/)

## Features

- **Google Maps HD Road & Satellite Hybrid Map**: Powered by Google Maps Road/Satellite tiles and real OSRM road/footpath routing across the 600-acre LPU Phagwara campus (Blocks 1 to 58, Main Gates 1A/1B/2, Uni Mall, Shanti Devi Mittal Auditorium, Baldev Raj Mittal UniPolis, and Hostels BH-1 to BH-8 / GH-1 to GH-6).
- **Turn-by-Turn Live Navigation HUD & Moving Blue GPS Dot**: Real-time walking ETA, e-rickshaw time, live GPS position tracking (`📡 Live GPS`), and interactive **`▶️ Start Live Walk`** road simulation.
- **🤖 LPU AI Campus Assistant**: Interactive campus chatbot answering natural-language queries about room numbers, CSE/AI blocks, night canteens, mess timings, and medical emergencies with 1-click route plotting.
- **🎤 Voice Search & Timetable Room Decoder**: Instant lookup for LPU timetable room codes such as `32-405` or `34-210` (decoding Block, Floor, Wing, and Lift/Staircase instructions).
- **4-Theme Surface System**: Switch seamlessly between **🔵 Royal Sapphire Blue**, **🟠 LPU Amber Orange**, **🟢 Emerald Campus**, and **🌙 Midnight Dark** modes.
- **Complete Student Utility Suite**: Academic blocks directory, campus food courts & essentials, hostel guides, daily mess menu tracker, and 1-tap emergency helplines.
- **Optional Express REST API**: Node.js + Express backend for serving campus data and accepting live student updates when run locally or on a server.

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
  <a href="https://www.instagram.com/iamaryaannn3" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-@iamaryaannn3-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
  <a href="https://github.com/iamaryaann" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-@iamaryaann-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="mailto:khanaryan1889@gmail.com">
    <img src="https://img.shields.io/badge/Email-khanaryan1889%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>

- 💼 **LinkedIn:** [linkedin.com/in/iamaryaann](https://www.linkedin.com/in/iamaryaann)
- 📸 **Instagram:** [instagram.com/iamaryaannn3](https://www.instagram.com/iamaryaannn3)
- 💻 **GitHub:** [@iamaryaann](https://github.com/iamaryaann)
- 📧 **Email:** [khanaryan1889@gmail.com](mailto:khanaryan1889@gmail.com)
- 🌐 **Live Project:** [LPU Campus Navigator](https://iamaryaann.github.io/lpu-campus-navigator/)


