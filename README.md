# ðŸ§­ LPU Campus Navigator & Student Guide (Blocks 1â€“58 GPS Directory)

[![Live Demo](https://img.shields.io/badge/Live_Website-lpu--campus--navigator--hub.netlify.app-059669?style=for-the-badge&logo=netlify&logoColor=white)](https://iamaryaann.github.io/lpu-campus-navigator/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-iamaryaann-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/iamaryaann)
[![Tech Stack](https://img.shields.io/badge/Stack-Node.js_%7C_Express_%7C_Leaflet.js_%7C_ES6-2563EB?style=for-the-badge)](#technology-stack)
[![University](https://img.shields.io/badge/Lovely_Professional_University-B.Tech_AI_%26_DS-F59E0B?style=for-the-badge)](#author)

> **A full-stack interactive campus navigation system, timetable room-code decoder, and student utility platform built for Lovely Professional University (LPU), Phagwara â€” mapping all 58 Academic & Administrative Blocks across the 600+ acre campus.**

ðŸŒ **Live Production Website:** [https://iamaryaann.github.io/lpu-campus-navigator/](https://iamaryaann.github.io/lpu-campus-navigator/)

---

## âœ¨ Key Engineering Features

### 1. ðŸ§­ Interactive Campus GPS Map & Point-to-Point Route Calculator
- **49 Precision GPS-Mapped Pins** covering **all 58 LPU Blocks (`Block 1` to `Block 58`)**, **Main Gate 1**, **Law Gate (Gate 2)**, **North Gate 3**, **Unipolis**, **Uni Mall**, **Uni Hospital**, **Shanti Devi Mittal Auditorium**, **Indoor Sports Complex**, **RoboPark**, and **Hostels (`BH 1â€“8`, `GH 1â€“6`)**.
- **Haversine Geodesic Distance Engine:** Calculates exact straight-line and walking path distances in meters (`1.28x` campus walkway factor), estimated walking time (`80 m/min`), E-Rickshaw travel time (`230 m/min`, `â‚¹10` student fare), and intermediate campus landmarks.

### 2. ðŸ”¢ Smart LPU Timetable Room Code Decoder (`Block-Floor-Room`)
- Instant regex-powered room parser (`/^(\d{1,2})\s*[-â€“]\s*(\d)(\d{2}[A-Za-z]?)$/`) built into the top search bar.
- Typing any LPU timetable room code (e.g., **`32-405`** or **`14-202`**) automatically decodes:
  - **Block Number & Department Name** (e.g., *Block 32 â€” School of Computer Science & Engineering*)
  - **Exact Floor Level** (e.g., *4th Floor*)
  - **Room / Lab Number** (e.g., *Room 405*)
  - Automatically centers the GPS map and plots the walking route to that block.

### 3. ðŸ›ï¸ Complete Floor-Wise Directory (All 58 Blocks + Real Campus Photography)
- Verified official LPU infrastructure & school photography for every single block, entrance gate, auditorium, hospital, mall, and hostel.
- Floor-by-floor breakdown (`Ground Floor` to `6th Floor`) of classrooms, computer labs, HOD cabins, dean offices, and admission cells.

### 4. ðŸ• Campus Essentials, ðŸ¢ Hostels & ðŸ½ï¸ 7-Day Mess Menu
- **Campus Essentials (`12 Hubs`):** Food courts, Night Canteens (open till `1:30 AM`), 24Ã—7 Bank ATMs (`SBI`, `PNB`, `ICICI`, `HDFC`), Stationery/Print shops, and Amazon/Flipkart courier gates.
- **Hostel & Residential Directory:** `BH 1â€“8`, `GH 1â€“6`, and `Executive Studio Apartments` with nearest academic block walking times, warden contacts, curfews, and room configurations (`4-Seater AC/Non-AC`, `2-Seater AC`, `Studio Apartment`).
- **Live Mess Menu & Crowd Status:** 7-day (`Mondayâ€“Sunday`) Breakfast, Lunch, Evening Snacks, and Dinner timetable with real-time student reviews and crowd occupancy tracking.

### 5. ðŸ“ž 24Ã—7 Emergency & Administrative Helplines
- Direct 1-click calling (`tel:`) and GPS office locator for **Uni Hospital Emergency & Ambulance**, **Campus Security Control Room**, **Fire Safety**, **Anti-Ragging Cell**, **DSW**, **RMS Support**, and **Examination Division**.

---

## ðŸ› ï¸ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | Semantic HTML5, Modern CSS3 (Custom Properties, Responsive Grid/Flexbox, Light/Dark Theme Engine), Vanilla ES6+ JavaScript |
| **GIS & Mapping** | Leaflet.js (`1.9.4`), OpenStreetMap Tile Layers, Custom Labeled Campus Markers, Polyline Route Rendering, Haversine Formula |
| **Backend API** | Node.js, Express.js (`REST API` endpoints for `/api/data`, `/api/reviews`, `/api/messes/:id/crowd`, `/api/messes/:id/menu`) |
| **Deployment** | Netlify Cloud CDN + GitHub Pages Ready |

---

## ðŸ“‚ Project Architecture

```text
lpu-campus-navigator-hub/
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ index.html          # 6-Tab Single-Page Application (SPA) Architecture
â”‚   â”œâ”€â”€ styles.css          # White & Emerald University Theme + Dark Mode CSS
â”‚   â”œâ”€â”€ app.js              # Leaflet GPS Map, Haversine Router & Room Decoder (32-405)
â”‚   â””â”€â”€ data.js             # Complete 58-Blocks GPS Database, Photos, Hostels & Mess
â”œâ”€â”€ data/
â”‚   â””â”€â”€ db.json             # Persistent JSON Datastore for Express REST API
â”œâ”€â”€ server.js               # Node.js + Express Backend API Server (Port 3000)
â”œâ”€â”€ package.json            # Dependencies & NPM Scripts
â””â”€â”€ README.md               # Project Documentation
```

---

## ðŸš€ Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the Node.js + Express server
npm start

# 3. Open in browser
# http://localhost:3000
```

---

## ðŸ‘¨â€ðŸ’» Author

**Aryan Khan** (`@iamaryaann`)  
ðŸŽ“ **B.Tech in Computer Science & Engineering (Artificial Intelligence & Data Science)** â€” *1st Semester*  
ðŸ›ï¸ **Lovely Professional University (LPU), Punjab, India**  
- ðŸŒ **GitHub:** [github.com/iamaryaann](https://github.com/iamaryaann)
- ðŸš€ **Live App:** [lpu-campus-navigator-hub.netlify.app](https://iamaryaann.github.io/lpu-campus-navigator/)

