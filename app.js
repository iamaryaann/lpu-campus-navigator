let campusData = {
  campusLocations: [],
  quickHelpFinder: [],
  campusEssentials: [],
  campusHelplines: [],
  messes: [],
  roomTemplates: [],
  hostels: []
};

let activeTab = 'navigator';
let selectedLocationId = 'block-32';
let mapCategoryFilter = 'all';
let blockDirCategory = 'all';
let essentialsCategory = 'all';
let helplineFilter = 'all';
let hostelFilter = 'all';
let selectedMessId = null;
let selectedDay = 'Monday';

// Leaflet Map Instances
let map = null;
let streetTileLayer = null;
let satTileLayer = null;
let markersMap = {};
let routeLineLayer = null;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Complete mapping of ALL LPU Block numbers (1 to 58) to exact location IDs
const BLOCK_NUMBER_MAP = {
  '1': 'block-1-2',
  '2': 'block-1-2',
  '3': 'block-3',
  '4': 'block-4-5',
  '5': 'block-4-5',
  '6': 'block-6',
  '7': 'block-7-8',
  '8': 'block-7-8',
  '9': 'block-9-10',
  '10': 'block-9-10',
  '11': 'block-11-12',
  '12': 'block-11-12',
  '13': 'block-13',
  '14': 'block-14',
  '15': 'block-15',
  '16': 'block-16-17',
  '17': 'block-16-17',
  '18': 'block-18-19',
  '19': 'block-18-19',
  '20': 'block-20-21',
  '21': 'block-20-21',
  '22': 'block-22-24',
  '23': 'block-22-24',
  '24': 'block-22-24',
  '25': 'block-25',
  '26': 'block-26',
  '27': 'block-27',
  '28': 'block-28',
  '29': 'block-29',
  '30': 'block-30',
  '31': 'block-31',
  '32': 'block-32',
  '33': 'block-33',
  '34': 'block-34',
  '35': 'block-35',
  '36': 'block-36',
  '37': 'block-37',
  '38': 'block-38',
  '39': 'block-39-40',
  '40': 'block-39-40',
  '41': 'block-41-bh1',
  '42': 'block-42-bh2',
  '43': 'block-43-bh3',
  '44': 'block-44-bh4',
  '45': 'block-45-46-apt',
  '46': 'block-45-46-apt',
  '47': 'block-47-48-bh5-6',
  '48': 'block-47-48-bh5-6',
  '49': 'block-49-50-bh7-8',
  '50': 'block-49-50-bh7-8',
  '51': 'block-51-sports',
  '52': 'block-52-robopark',
  '53': 'block-53-54',
  '54': 'block-53-54',
  '55': 'block-55',
  '56': 'block-56',
  '57': 'block-57-58',
  '58': 'block-57-58'
};

document.addEventListener('DOMContentLoaded', async () => {
  initThemeToggle();
  const todayIdx = new Date().getDay();
  selectedDay = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];

  await loadAllCampusData();
});

// ===================================================================
// 1. SEPARATE TAB SWITCHING
// ===================================================================
function openTab(tabName) {
  activeTab = tabName;

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-page').forEach((sec) => {
    sec.classList.toggle('active', sec.id === `page-${tabName}`);
  });

  if (tabName === 'navigator' && map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================================================
// 2. MULTI-THEME SWITCHER (ROYAL BLUE / LPU ORANGE / EMERALD / DARK)
// ===================================================================
const THEME_ORDER = ['blue', 'orange', 'green', 'dark'];
const THEME_META = {
  blue: { icon: '🔵', label: 'Theme: Blue' },
  orange: { icon: '🟠', label: 'Theme: LPU Orange' },
  green: { icon: '🟢', label: 'Theme: Emerald' },
  dark: { icon: '🌙', label: 'Theme: Dark' }
};

function initThemeToggle() {
  const html = document.documentElement;
  let saved = localStorage.getItem('lpu_nav_theme') || 'blue';
  if (!THEME_META[saved]) saved = 'blue';
  html.setAttribute('data-theme', saved);
  syncThemeButton(saved);

  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'blue';
    const idx = THEME_ORDER.indexOf(current);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    html.setAttribute('data-theme', next);
    localStorage.setItem('lpu_nav_theme', next);
    syncThemeButton(next);
  });
}

function syncThemeButton(theme) {
  const meta = THEME_META[theme] || THEME_META.blue;
  document.getElementById('themeIcon').textContent = meta.icon;
  document.getElementById('themeLabel').textContent = meta.label;
}

// ===================================================================
// 3. LOAD DATA & INITIALIZE MODULES (WORKS WITH SERVER OR STANDALONE)
// ===================================================================
async function loadAllCampusData() {
  try {
    if (window.location.protocol !== 'file:') {
      const res = await fetch('/api/data');
      if (res.ok) {
        campusData = await res.json();
      } else if (window.PERMANENT_CAMPUS_DATA) {
        campusData = window.PERMANENT_CAMPUS_DATA;
      }
    } else if (window.PERMANENT_CAMPUS_DATA) {
      campusData = window.PERMANENT_CAMPUS_DATA;
    }
  } catch (err) {
    if (window.PERMANENT_CAMPUS_DATA) {
      campusData = window.PERMANENT_CAMPUS_DATA;
    }
  }

  if (campusData.messes && campusData.messes.length > 0) {
    selectedMessId = campusData.messes[0].id;
  }

  initRouteSelectors();
  renderQuickHelpPills();
  initCampusMap();
  selectCampusLocation('block-32', false);
  calculateCampusRoute();

  renderBlocksDirectory();
  renderEssentialsSection();
  renderHostelsSection();
  renderMessSection();
  renderHelplinesSection();
}

// ===================================================================
// 4. TAB 1: CAMPUS NAVIGATOR, ROOM CODE DECODER & ROUTE CALCULATOR
// ===================================================================
function initRouteSelectors() {
  const fromSel = document.getElementById('routeFromSelect');
  const toSel = document.getElementById('routeToSelect');

  const optionsHtml = campusData.campusLocations
    .map((loc) => `<option value="${loc.id}">${loc.code} — ${loc.name}</option>`)
    .join('');

  fromSel.innerHTML = optionsHtml;
  toSel.innerHTML = optionsHtml;

  fromSel.value = 'gate-1';
  toSel.value = 'block-32';
}

function swapRoutePoints() {
  const fromSel = document.getElementById('routeFromSelect');
  const toSel = document.getElementById('routeToSelect');
  const temp = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = temp;
  calculateCampusRoute();
}

function renderQuickHelpPills() {
  const container = document.getElementById('quickHelpPills');
  if (!campusData.quickHelpFinder) return;

  container.innerHTML = campusData.quickHelpFinder
    .map(
      (item) => `
      <button class="help-chip" onclick="jumpToDestination('${item.locationId}')">
        ${item.task} → <strong>${item.blockCode}</strong>
      </button>
    `
    )
    .join('');
}

function jumpToDestination(locationId) {
  openTab('navigator');
  const toSel = document.getElementById('routeToSelect');
  if (toSel) {
    toSel.value = locationId;
  }
  selectCampusLocation(locationId, true);
  calculateCampusRoute();
}

function handleQuickMapSearch(query) {
  const dropdown = document.getElementById('quickSearchDropdown');
  const raw = (query || '').trim();
  const q = raw.toLowerCase();

  if (!q) {
    dropdown.classList.add('hidden');
    return;
  }

  let html = '';

  // 1. Check if user typed an LPU Timetable Room Code like "32-405", "14-202", "55-103"
  const roomMatch = raw.match(/^(?:block\s*)?(\d{1,2})\s*[-/\s]\s*(\d{3})$/i);
  if (roomMatch) {
    const blockNum = roomMatch[1];
    const roomPart = roomMatch[2];
    const floorDigit = roomPart.charAt(0);
    const roomNo = roomPart.slice(1);
    const floorText =
      floorDigit === '0'
        ? 'Ground Floor'
        : floorDigit === '1'
        ? '1st Floor'
        : floorDigit === '2'
        ? '2nd Floor'
        : floorDigit === '3'
        ? '3rd Floor'
        : `${floorDigit}th Floor`;

    const locId = BLOCK_NUMBER_MAP[blockNum];
    const loc = campusData.campusLocations.find((l) => l.id === locId);

    if (loc) {
      html += `
        <div class="search-result-item" style="background:var(--emerald-tint)" onclick="selectSearchResult('${loc.id}')">
          <div>
            <strong>🎓 Room ${blockNum}-${roomPart} Decoded → ${loc.code} (${floorText}, Room #${roomNo})</strong>
            <div style="font-size:0.78rem;color:var(--text-muted)">📍 ${loc.name} • ${loc.landmark}</div>
          </div>
          <span>Show Route →</span>
        </div>
      `;
    }
  }

  // 2. Check if user typed a bare block number like "32" or "Block 56"
  const bareBlockMatch = raw.match(/^(?:block\s*)?(\d{1,2})$/i);
  if (bareBlockMatch && BLOCK_NUMBER_MAP[bareBlockMatch[1]]) {
    const locId = BLOCK_NUMBER_MAP[bareBlockMatch[1]];
    const exactLoc = campusData.campusLocations.find((l) => l.id === locId);
    if (exactLoc) {
      html += `
        <div class="search-result-item" onclick="selectSearchResult('${exactLoc.id}')">
          <div>
            <strong>${exactLoc.code} — ${exactLoc.name}</strong>
            <div style="font-size:0.77rem;color:var(--text-muted)">📍 ${exactLoc.landmark}</div>
          </div>
          <span>Show Route →</span>
        </div>
      `;
    }
  }

  // 3. Standard keyword search across all 49 locations
  const matches = campusData.campusLocations.filter(
    (loc) =>
      loc.code.toLowerCase().includes(q) ||
      loc.name.toLowerCase().includes(q) ||
      loc.landmark.toLowerCase().includes(q) ||
      loc.inside.some((line) => line.toLowerCase().includes(q))
  );

  html += matches
    .slice(0, 8)
    .map(
      (loc) => `
      <div class="search-result-item" onclick="selectSearchResult('${loc.id}')">
        <div>
          <strong>${loc.code} — ${loc.name}</strong>
          <div style="font-size:0.77rem;color:var(--text-muted)">📍 ${loc.landmark}</div>
        </div>
        <span>Show Route →</span>
      </div>
    `
    )
    .join('');

  if (!html) {
    dropdown.innerHTML = `<div class="search-result-item"><span>No matching block found. Try "32-405", "Block 32", "Admission", "CSE", or "Hospital".</span></div>`;
    dropdown.classList.remove('hidden');
    return;
  }

  dropdown.innerHTML = html;
  dropdown.classList.remove('hidden');
}

function selectSearchResult(locationId) {
  document.getElementById('quickSearchDropdown').classList.add('hidden');
  document.getElementById('quickMapSearch').value = '';
  jumpToDestination(locationId);
}

// Haversine distance in meters
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.25);
}

function getShortPinCode(loc) {
  const c = loc.code || '';
  if (c.startsWith('Block ')) return 'B' + c.replace('Block ', '').replace(/\s+/g, '');
  if (c.includes('Main Gate 1')) return 'Gate 1';
  if (c.includes('Law Gate')) return 'Gate 2';
  if (c.includes('North Gate')) return 'Gate 3';
  if (c.includes('BH-1')) return 'BH 1-4';
  if (c.includes('BH-5')) return 'BH 5-8';
  if (c.includes('GH-1')) return 'GH 1-4';
  if (c.includes('GH-5')) return 'GH 5-6';
  if (c.includes('Apartments')) return 'Studio Apt';
  return c.length > 10 ? c.slice(0, 9) : c;
}

function buildCampusSpineWaypoints(fromLoc, toLoc, distMeters) {
  if (fromLoc.id === toLoc.id || distMeters < 180) {
    return [
      [fromLoc.lat, fromLoc.lng],
      [toLoc.lat, toLoc.lng]
    ];
  }
  // Route smoothly along LPU's Central Academic Spine (longitude ~75.7048)
  const spineLng = 75.7048;
  const midLat1 = fromLoc.lat + (toLoc.lat - fromLoc.lat) * 0.33;
  const midLat2 = fromLoc.lat + (toLoc.lat - fromLoc.lat) * 0.68;
  return [
    [fromLoc.lat, fromLoc.lng],
    [midLat1, (fromLoc.lng + spineLng) / 2],
    [midLat2, (toLoc.lng + spineLng) / 2],
    [toLoc.lat, toLoc.lng]
  ];
}

function calculateCampusRoute() {
  const fromId = document.getElementById('routeFromSelect').value;
  const toId = document.getElementById('routeToSelect').value;

  const fromLoc = campusData.campusLocations.find((l) => l.id === fromId);
  const toLoc = campusData.campusLocations.find((l) => l.id === toId);
  if (!fromLoc || !toLoc) return;

  selectCampusLocation(toLoc.id, false);

  const distMeters = fromLoc.id === toLoc.id ? 0 : getDistanceMeters(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng);
  const walkMins = distMeters === 0 ? 0 : Math.max(1, Math.round(distMeters / 75));
  const erickshawMins = distMeters === 0 ? 0 : Math.max(1, Math.round(distMeters / 220));

  const waypoints = buildCampusSpineWaypoints(fromLoc, toLoc, distMeters);
  const stepGuide =
    fromLoc.id === toLoc.id
      ? `You are already at <strong>${toLoc.code} — ${toLoc.name}</strong> (${toLoc.landmark}).`
      : `1. Start at <strong>🟢 ${fromLoc.code}</strong> → 2. Follow LPU Central Spine toward <strong>${toLoc.zone}</strong> (${toLoc.landmark}) → 3. Arrive at <strong>🏁 ${toLoc.code} — ${toLoc.name}</strong>`;

  const banner = document.getElementById('routeResultBanner');
  banner.innerHTML = `
    <div class="route-main-info">
      <div class="route-title-line">
        <h3>🧭 Route: ${fromLoc.code} ➔ ${toLoc.code}</h3>
        <span class="route-badge">🚶 ${walkMins} mins walk (${distMeters} m)</span>
        <span class="route-badge amber">🛺 ${erickshawMins} mins by E-Rickshaw (₹10)</span>
      </div>
      <p class="route-steps-text">${stepGuide}</p>
    </div>
    <div>
      <a
        href="https://www.google.com/maps/dir/?api=1&origin=${fromLoc.lat},${fromLoc.lng}&destination=${toLoc.lat},${toLoc.lng}&travelmode=walking"
        target="_blank"
        rel="noopener"
        class="btn-primary"
        style="text-decoration:none;display:inline-block"
      >
        Open Live Walking GPS ↗
      </a>
    </div>
  `;

  if (map) {
    if (routeLineLayer) {
      map.removeLayer(routeLineLayer);
    }

    const outerLine = L.polyline(waypoints, {
      color: '#ffffff',
      weight: 9,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    });

    const innerLine = L.polyline(waypoints, {
      color: '#2563eb',
      weight: 5,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round'
    });

    const dashLine = L.polyline(waypoints, {
      color: '#93c5fd',
      weight: 2,
      opacity: 0.95,
      dashArray: '6, 10'
    });

    const startBadge = L.marker([fromLoc.lat, fromLoc.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div class="route-endpoint-badge start-badge">🟢 START: ${getShortPinCode(fromLoc)}</div>`
      }),
      zIndexOffset: 1000
    });

    const endBadge = L.marker([toLoc.lat, toLoc.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div class="route-endpoint-badge end-badge">🏁 TO: ${getShortPinCode(toLoc)}</div>`
      }),
      zIndexOffset: 1001
    });

    routeLineLayer = L.layerGroup([outerLine, innerLine, dashLine, startBadge, endBadge]).addTo(map);

    map.fitBounds(L.latLngBounds(waypoints), { padding: [65, 65], maxZoom: 17 });
  }
}

function initCampusMap() {
  const mapEl = document.getElementById('campusMap');
  if (!mapEl) return;

  map = L.map('campusMap', {
    center: [31.2552, 75.7048],
    zoom: 16,
    zoomControl: true
  });

  // High-definition Google Maps Road Layer (shows real LPU buildings, internal roads & block labels)
  streetTileLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps • LPU Campus Navigator'
  }).addTo(map);

  // High-definition Google Satellite Hybrid Layer (Satellite imagery + real building labels)
  satTileLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Satellite HD • LPU Campus Navigator'
  });

  renderMapPinsAndSidebar();
}

function resetCampusMapView() {
  if (!map || !campusData.campusLocations.length) return;
  const coords = campusData.campusLocations.map((l) => [l.lat, l.lng]);
  map.fitBounds(L.latLngBounds(coords), { padding: [35, 35], maxZoom: 16 });
}

function setMapLayer(mode) {
  if (!map) return;
  document.getElementById('btnStreet').classList.toggle('active', mode === 'street');
  document.getElementById('btnSat').classList.toggle('active', mode === 'sat');

  if (mode === 'sat') {
    map.removeLayer(streetTileLayer);
    satTileLayer.addTo(map);
  } else {
    map.removeLayer(satTileLayer);
    streetTileLayer.addTo(map);
  }
}

function filterMapMarkers(category, btnEl) {
  mapCategoryFilter = category;
  document.querySelectorAll('#mapCategoryPills .cat-pill').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderMapPinsAndSidebar();
}

function renderMapPinsAndSidebar() {
  if (!map) return;

  Object.values(markersMap).forEach((m) => map.removeLayer(m));
  markersMap = {};

  const filtered = campusData.campusLocations.filter(
    (loc) => mapCategoryFilter === 'all' || loc.category === mapCategoryFilter
  );

  document.getElementById('mapListCount').textContent = `${filtered.length} Locations`;

  filtered.forEach((loc) => {
    let catClass = 'cat-Academic';
    if (loc.category === 'Hostels') catClass = 'cat-Hostels';
    else if (loc.category === 'Admin & Support') catClass = 'cat-Admin';
    else if (loc.category === 'Gates & Transit') catClass = 'cat-Gates';
    else if (loc.category === 'Facilities & Mall') catClass = 'cat-Mall';

    const isSelected = loc.id === selectedLocationId ? 'active-pin' : '';
    const shortCode = getShortPinCode(loc);

    const icon = L.divIcon({
      className: '',
      html: `<div class="lpu-map-pin ${catClass} ${isSelected}" title="${loc.code} — ${loc.name}">${shortCode}</div>`
    });

    const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

    const popupHtml = `
      <div class="lpu-popup-card">
        <img src="${loc.photo}" alt="${loc.name}" />
        <div class="lpu-popup-body">
          <span class="lpu-popup-tag">${loc.code} • ${loc.zone}</span>
          <strong>${loc.name}</strong>
          <p>📍 ${loc.landmark}</p>
          <button onclick="document.getElementById('routeToSelect').value='${loc.id}';calculateCampusRoute();">
            🧭 Route to ${loc.code} →
          </button>
        </div>
      </div>
    `;
    marker.bindPopup(popupHtml, { maxWidth: 250, offset: [0, -10] });

    marker.on('click', () => {
      document.getElementById('routeToSelect').value = loc.id;
      selectCampusLocation(loc.id, false);
      calculateCampusRoute();
      marker.openPopup();
    });

    markersMap[loc.id] = marker;
  });

  const listEl = document.getElementById('mapLocationsList');
  listEl.innerHTML = filtered
    .map(
      (loc) => `
      <div class="map-loc-item ${loc.id === selectedLocationId ? 'active' : ''}" onclick="jumpToDestination('${loc.id}')">
        <div>
          <strong>${loc.name}</strong>
          <small>📍 ${loc.landmark}</small>
        </div>
        <span class="loc-code-pill">${loc.code}</span>
      </div>
    `
    )
    .join('');
}

function selectCampusLocation(locationId, panMap = true) {
  const loc = campusData.campusLocations.find((l) => l.id === locationId) || campusData.campusLocations[0];
  if (!loc) return;

  selectedLocationId = loc.id;

  const card = document.getElementById('selectedBlockCard');
  card.innerHTML = `
    <div class="selected-block-banner">
      <img src="${loc.photo}" alt="${loc.name}" />
      <div class="selected-block-overlay">
        <span class="selected-block-code">${loc.code} • ${loc.zone}</span>
        <h3>${loc.name}</h3>
      </div>
    </div>
    <div class="selected-block-body">
      <div class="nav-quick-facts">
        <div class="fact-row">
          <strong>📍 Landmark:</strong>
          <span>${loc.landmark}</span>
        </div>
        <div class="fact-row">
          <strong>🚶 From Gate 1:</strong>
          <span>${loc.walkFromGate}</span>
        </div>
        <div class="fact-row">
          <strong>🛺 E-Rickshaw:</strong>
          <span>${loc.erickshaw}</span>
        </div>
      </div>

      <div class="inside-floors-box">
        <h4>What's Inside This Block (Floors & Offices):</h4>
        <ul class="inside-list">
          ${loc.inside.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div class="inspector-actions">
        <button class="btn-outline-emerald" onclick="setAsRouteStart('${loc.id}')">
          📍 Set as Starting Point
        </button>
        <a
          href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}"
          target="_blank"
          rel="noopener"
          class="btn-primary"
        >
          Google Maps GPS ↗
        </a>
      </div>
    </div>
  `;

  renderMapPinsAndSidebar();

  if (panMap && map) {
    map.flyTo([loc.lat, loc.lng], 17, { duration: 0.7 });
  }
}

function setAsRouteStart(locationId) {
  document.getElementById('routeFromSelect').value = locationId;
  calculateCampusRoute();
}

// ===================================================================
// 5. TAB 2: COMPLETE BLOCK & DEPARTMENT DIRECTORY (ALL BLOCKS 1–58)
// ===================================================================
function setBlockDirCategory(cat, btnEl) {
  blockDirCategory = cat;
  document.querySelectorAll('#blockCategoryBar .pill-btn').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderBlocksDirectory();
}

function renderBlocksDirectory() {
  const searchVal = (document.getElementById('blockDirectorySearch')?.value || '').trim().toLowerCase();
  const grid = document.getElementById('blocksDirectoryGrid');

  const filtered = campusData.campusLocations.filter((loc) => {
    const matchCat = blockDirCategory === 'all' || loc.category === blockDirCategory;
    const matchSearch =
      !searchVal ||
      loc.code.toLowerCase().includes(searchVal) ||
      loc.name.toLowerCase().includes(searchVal) ||
      loc.landmark.toLowerCase().includes(searchVal) ||
      loc.description.toLowerCase().includes(searchVal) ||
      loc.inside.some((line) => line.toLowerCase().includes(searchVal));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;color:var(--text-muted);padding:20px 0;">No blocks matched your search. Try searching "Block 32", "CSE", "Admission", "Library", or "Hospital".</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (loc) => `
      <article class="dir-block-card">
        <div class="dir-block-img">
          <img src="${loc.photo}" alt="${loc.name}" loading="lazy" />
          <span class="dir-code-tag">${loc.code}</span>
          <span class="dir-zone-tag">${loc.zone}</span>
        </div>
        <div class="dir-block-body">
          <h3>${loc.name}</h3>
          <div class="dir-landmark">📍 ${loc.landmark}</div>
          <div class="dir-walk">🚶 ${loc.walkFromGate} • 🛺 ${loc.erickshaw}</div>
          <ul class="dir-floors">
            ${loc.inside.map((f) => `<li>${f}</li>`).join('')}
          </ul>
          <div class="dir-card-actions">
            <button class="btn-primary" onclick="jumpToDestination('${loc.id}')">
              🧭 Show Route on Map
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

// ===================================================================
// 6. TAB 3: CAMPUS ESSENTIALS (FOOD COURTS, NIGHT CANTEENS, ATMs, PRINTOUT)
// ===================================================================
function setEssentialsCategory(cat, btnEl) {
  essentialsCategory = cat;
  document.querySelectorAll('#essentialsCategoryBar .pill-btn').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderEssentialsSection();
}

function renderEssentialsSection() {
  const grid = document.getElementById('essentialsGrid');
  if (!grid || !campusData.campusEssentials) return;

  const q = (document.getElementById('essentialsSearchInput')?.value || '').trim().toLowerCase();

  const filtered = campusData.campusEssentials.filter((item) => {
    const matchCat = essentialsCategory === 'all' || item.category === essentialsCategory;
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.blockCode.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.highlights.some((h) => h.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  grid.innerHTML = filtered
    .map(
      (item) => `
      <article class="dir-block-card">
        <div class="dir-block-img">
          <img src="${item.photo}" alt="${item.name}" loading="lazy" />
          <span class="dir-code-tag">${item.blockCode}</span>
          <span class="dir-zone-tag">${item.category}</span>
        </div>
        <div class="dir-block-body">
          <h3>${item.name}</h3>
          <div class="dir-landmark">🕒 ${item.timings}</div>
          <div class="dir-walk">💳 ${item.priceRange}</div>
          <ul class="dir-floors">
            ${item.highlights.map((h) => `<li>✓ ${h}</li>`).join('')}
          </ul>
          <div class="dir-card-actions">
            <button class="btn-primary" onclick="jumpToDestination('${item.locationId}')">
              🧭 Locate on Campus Map
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

// ===================================================================
// 7. TAB 4: HOSTELS, NEAREST BLOCKS & ROOM INTERIORS
// ===================================================================
function setHostelFilter(filter, btnEl) {
  hostelFilter = filter;
  document.querySelectorAll('#hostelFilterGroup .pill-btn').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderHostelsSection();
}

function renderHostelsSection() {
  const hostelsGrid = document.getElementById('hostelsGrid');
  const filtered = campusData.hostels.filter((h) => hostelFilter === 'all' || h.type === hostelFilter);

  hostelsGrid.innerHTML = filtered
    .map(
      (h) => `
      <div class="hostel-card">
        <div>
          <span class="hostel-badge">${h.type} Residential Zone</span>
          <h3>${h.name}</h3>
          <div class="hostel-meta-rows">
            <div><span>Nearest Academic Blocks</span><strong>${h.nearestBlocks}</strong></div>
            <div><span>Attached Mess</span><strong>${h.mess}</strong></div>
            <div><span>Annual Fee Range</span><strong>${h.feeRange}</strong></div>
            <div><span>Entry Curfew</span><strong>${h.curfew}</strong></div>
            <div><span>Warden Helpline</span><strong>${h.warden}</strong></div>
          </div>
          <div class="tag-row">
            ${h.facilities.map((f) => `<span class="tag-chip">${f}</span>`).join('')}
          </div>
        </div>
        <button class="btn-outline-emerald" style="width:100%;padding:10px;border-radius:8px;font-weight:700;cursor:pointer" onclick="jumpToDestination('${h.locationId}')">
          📍 Locate This Hostel Zone on Map
        </button>
      </div>
    `
    )
    .join('');

  const roomsGrid = document.getElementById('roomsGrid');
  roomsGrid.innerHTML = campusData.roomTemplates
    .map(
      (r) => `
      <div class="room-card">
        <img src="${r.image}" alt="${r.title}" loading="lazy" />
        <div class="room-body">
          <div class="room-price">${r.price} • ${r.size}</div>
          <h3 style="margin-bottom:10px;font-size:1.05rem">${r.title}</h3>
          <div class="tag-row">
            ${r.features.map((f) => `<span class="tag-chip">✓ ${f}</span>`).join('')}
          </div>
        </div>
      </div>
    `
    )
    .join('');
}

// ===================================================================
// 8. TAB 5: MESS & DAILY MENU
// ===================================================================
function renderMessSection() {
  const mess = campusData.messes.find((m) => m.id === selectedMessId) || campusData.messes[0];
  if (!mess) return;

  document.getElementById('messSelectorPills').innerHTML = campusData.messes
    .map(
      (m) => `
      <button class="pill-btn ${m.id === mess.id ? 'active' : ''}" onclick="selectMess('${m.id}')">
        ${m.name}
      </button>
    `
    )
    .join('');

  document.getElementById('messSummaryBar').innerHTML = `
    <div>
      <h2 style="font-size:1.25rem;font-weight:800">${mess.name}</h2>
      <p style="font-size:0.86rem;color:var(--text-muted)">📍 ${mess.zone} • ${mess.type}</p>
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      <span class="route-badge">★ ${mess.rating} Rating</span>
      <span class="route-badge amber">Live Crowd: ${mess.crowdStatus} (${mess.crowdPercent}%)</span>
    </div>
  `;

  document.getElementById('dayTabs').innerHTML = DAYS.map(
    (day) => `
      <button class="day-tab ${day === selectedDay ? 'active' : ''}" onclick="selectMessDay('${day}')">
        ${day}
      </button>
    `
  ).join('');

  const dayMenu = mess.weeklyMenu[selectedDay] || mess.weeklyMenu.Monday;
  const meals = [
    { title: '🌅 Breakfast', time: mess.timings.breakfast, items: dayMenu.breakfast },
    { title: '☀️ Lunch', time: mess.timings.lunch, items: dayMenu.lunch },
    { title: '☕ Evening Snacks', time: mess.timings.snacks, items: dayMenu.snacks },
    { title: '🌙 Dinner', time: mess.timings.dinner, items: dayMenu.dinner }
  ];

  document.getElementById('mealsGrid').innerHTML = meals
    .map(
      (meal) => `
      <div class="meal-card">
        <span class="meal-time">${meal.time}</span>
        <h3>${meal.title}</h3>
        <p>${meal.items}</p>
      </div>
    `
    )
    .join('');

  document.getElementById('dishesGrid').innerHTML = (mess.signatureDishes || [])
    .map(
      (d) => `
      <div class="dish-card">
        <img src="${d.image}" alt="${d.name}" loading="lazy" />
        <div class="dish-body">
          <div class="room-price">${d.meal} • ${d.calories}</div>
          <h3 style="font-size:1rem;margin-bottom:6px">${d.name}</h3>
          <span class="tag-chip">👍 ${d.votes} Student Votes</span>
        </div>
      </div>
    `
    )
    .join('');
}

function selectMess(id) {
  selectedMessId = id;
  renderMessSection();
}

function selectMessDay(day) {
  selectedDay = day;
  renderMessSection();
}

// ===================================================================
// 9. TAB 6: 24x7 EMERGENCY & STUDENT HELPLINES DIRECTORY
// ===================================================================
function setHelplineFilter(filter, btnEl) {
  helplineFilter = filter;
  document.querySelectorAll('#helplineFilterGroup .pill-btn').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderHelplinesSection();
}

function renderHelplinesSection() {
  const grid = document.getElementById('helplinesGrid');
  if (!grid || !campusData.campusHelplines) return;

  const filtered = campusData.campusHelplines.filter(
    (h) => helplineFilter === 'all' || h.category === helplineFilter
  );

  grid.innerHTML = filtered
    .map(
      (h) => `
      <div class="hostel-card">
        <div>
          <span class="hostel-badge">${h.category} • ${h.availability}</span>
          <h3>${h.title}</h3>
          <p style="font-size:0.83rem;color:var(--text-muted);margin-bottom:12px">${h.description}</p>
          <div class="hostel-meta-rows">
            <div><span>Primary Helpline</span><strong style="color:var(--primary)">${h.phone}</strong></div>
            <div><span>Alternate / Email</span><strong>${h.altPhone}</strong></div>
            <div><span>Campus Office</span><strong>${h.officeBlock}</strong></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <a href="tel:${h.phone}" class="btn-primary" style="flex:1;text-align:center;text-decoration:none;padding:10px;border-radius:8px">
            📞 Call ${h.phone}
          </a>
          <button class="btn-outline-emerald" style="flex:1;padding:10px;border-radius:8px;font-weight:700;cursor:pointer" onclick="jumpToDestination('${h.locationId}')">
            🧭 Locate Office
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

// ===================================================================
// 10. LPU AI CAMPUS ASSISTANT, VOICE SEARCH, LIVE GPS & PROJECT MODAL
// ===================================================================
function toggleAiAssistant() {
  const panel = document.getElementById('aiAssistantPanel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    const inp = document.getElementById('aiQueryInput');
    if (inp) inp.focus();
  }
}

function toggleProjectModal() {
  const modal = document.getElementById('projectModalBackdrop');
  if (!modal) return;
  modal.classList.toggle('hidden');
}

function handleAiFormSubmit(e) {
  e.preventDefault();
  const inp = document.getElementById('aiQueryInput');
  if (!inp || !inp.value.trim()) return;
  const q = inp.value.trim();
  inp.value = '';
  askLpuAi(q);
}

function askLpuAi(question) {
  const box = document.getElementById('aiMessagesBox');
  const panel = document.getElementById('aiAssistantPanel');
  if (panel && panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
  }
  if (!box) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'ai-msg ai-msg-user';
  userDiv.textContent = question;
  box.appendChild(userDiv);

  const replyHtml = generateLpuAiAnswer(question);
  const botDiv = document.createElement('div');
  botDiv.className = 'ai-msg ai-msg-bot';
  botDiv.innerHTML = replyHtml;
  box.appendChild(botDiv);
  box.scrollTop = box.scrollHeight;
}

function generateLpuAiAnswer(rawQuery) {
  const q = rawQuery.trim().toLowerCase();

  // 1. Check for Room Code (e.g. 32-405 or 14-202)
  const roomMatch = rawQuery.match(/(\d{1,2})\s*[-–]\s*(\d)(\d{2}[A-Za-z]?)/);
  if (roomMatch) {
    const decoded = decodeRoomQuery(roomMatch[0]);
    if (decoded && decoded.location) {
      const loc = decoded.location;
      return `
        <strong>🔢 Decoded Timetable Room: <code>${decoded.rawCode}</code></strong><br/>
        • <strong>Block:</strong> ${loc.code} — ${loc.name}<br/>
        • <strong>Floor:</strong> ${decoded.floorLabel}<br/>
        • <strong>Room / Lab:</strong> Room ${decoded.roomNumber}<br/>
        • <strong>Nearest Gate:</strong> ${loc.nearestGate}<br/>
        <button class="btn-primary" style="margin-top:8px;padding:6px 12px;font-size:0.76rem;border-radius:6px" onclick="applyDecodedRoom('${loc.id}', '${decoded.rawCode}', '${decoded.floorLabel}', '${decoded.roomNumber}')">
          🧭 Plot Route to ${decoded.rawCode} on Map →
        </button>
      `;
    }
  }

  // 2. Check for specific Block number (e.g., "block 32" or "34")
  const blockNumMatch = q.match(/block\s*(\d{1,2})|\b(\d{1,2})\b/);
  if (blockNumMatch) {
    const num = Number(blockNumMatch[1] || blockNumMatch[2]);
    if (num >= 1 && num <= 58 && BLOCK_NUMBER_MAP[num]) {
      const locId = BLOCK_NUMBER_MAP[num];
      const loc = (campusData.campusLocations || []).find((l) => l.id === locId);
      if (loc) {
        return `
          <strong>🏛️ Block ${num} — ${loc.name}</strong><br/>
          ${loc.summary}<br/>
          • <strong>Key Facilities:</strong> ${(loc.departments || []).slice(0, 3).join(', ')}<br/>
          • <strong>Nearest Gate:</strong> ${loc.nearestGate}<br/>
          <button class="btn-primary" style="margin-top:8px;padding:6px 12px;font-size:0.76rem;border-radius:6px" onclick="jumpToDestination('${loc.id}')">
            📍 Show Block ${num} on GPS Map →
          </button>
        `;
      }
    }
  }

  // 3. CSE / AI & Data Science / Coding Blocks
  if (q.includes('cse') || q.includes('computer') || q.includes('ai') || q.includes('data science') || q.includes('coding')) {
    return `
      <strong>💻 CSE, AI &amp; Data Science Blocks at LPU:</strong><br/>
      • <strong>Block 32:</strong> Main School of CSE, AI/ML Labs &amp; Programming Labs.<br/>
      • <strong>Block 33 &amp; 34:</strong> Software Engineering, Data Science, Cloud Computing &amp; Dean CSE.<br/>
      • <strong>Block 36–38:</strong> Computer Applications (BCA/MCA) &amp; Central Server Labs.<br/>
      <button class="btn-primary" style="margin-top:8px;padding:6px 12px;font-size:0.76rem;border-radius:6px" onclick="jumpToDestination('block-32')">
        🧭 Navigate to Block 32 (CSE &amp; AI Hub) →
      </button>
    `;
  }

  // 4. Hospital / Medical / Emergency
  if (q.includes('hospital') || q.includes('medical') || q.includes('emergency') || q.includes('ambulance') || q.includes('doctor')) {
    return `
      <strong>🚑 24×7 Uni Hospital &amp; Medical Emergency:</strong><br/>
      • <strong>Location:</strong> Block 4 / Uni Hospital (Near Main Entrance Zone)<br/>
      • <strong>Emergency Helpline:</strong> <code>01824-517000</code> / <code>01824-444079</code><br/>
      • <strong>Facilities:</strong> 24×7 Emergency Ward, Ambulance, Pharmacy &amp; Diagnostics.<br/>
      <button class="btn-primary" style="margin-top:8px;padding:6px 12px;font-size:0.76rem;border-radius:6px" onclick="jumpToDestination('uni-hospital')">
        🚑 Plot Emergency Route to Uni Hospital →
      </button>
    `;
  }

  // 5. Night Canteens / Food
  if (q.includes('night') || q.includes('food') || q.includes('eat') || q.includes('canteen') || q.includes('cafe')) {
    return `
      <strong>🍕 Food Courts &amp; Night Canteens (Open till 1:30 AM):</strong><br/>
      • <strong>Uni Mall Food Court (Block 13):</strong> Domino's, Subway, Cafes &amp; 30+ Outlets.<br/>
      • <strong>BH-1 to BH-6 Night Canteens:</strong> Open <code>9:00 PM – 1:30 AM</code> (Parathas, Maggi, Burgers, Shakes).<br/>
      • <strong>Block 34 Kiosk Strip:</strong> Quick rolls, coffee &amp; snacks between CSE lectures.<br/>
      <button class="btn-primary" style="margin-top:8px;padding:6px 12px;font-size:0.76rem;border-radius:6px" onclick="openTab('essentials')">
        🍕 Open Food, ATMs &amp; Shops Directory →
      </button>
    `;
  }

  // 6. Mess Menu
  if (q.includes('mess') || q.includes('breakfast') || q.includes('lunch') || q.includes('dinner') || q.includes('menu')) {
    const mess = (campusData.messes || [])[0];
    const dayMenu = mess && mess.weeklyMenu ? mess.weeklyMenu[selectedDay] : null;
    return `
      <strong>🍽️ Today's LPU Hostel Mess Menu (${selectedDay}):</strong><br/>
      • <strong>Breakfast:</strong> ${dayMenu ? dayMenu.breakfast : 'Aloo Paratha, Curd, Tea & Fruit'}<br/>
      • <strong>Lunch:</strong> ${dayMenu ? dayMenu.lunch : 'Rajma Masala, Jeera Rice, Roti & Salad'}<br/>
      • <strong>Dinner:</strong> ${dayMenu ? dayMenu.dinner : 'Paneer Butter Masala, Dal Makhani & Gulab Jamun'}<br/>
      <button class="btn-primary" style="margin-top:8px;padding:6px 12px;font-size:0.76rem;border-radius:6px" onclick="openTab('mess')">
        🍽️ View Full 7-Day Mess Timetable →
      </button>
    `;
  }

  // Default smart search fallback across all 49 campus locations
  const match = (campusData.campusLocations || []).find(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      (l.departments || []).some((d) => d.toLowerCase().includes(q))
  );

  if (match) {
    return `
      <strong>📍 Found: ${match.code} — ${match.name}</strong><br/>
      ${match.summary}<br/>
      • <strong>Nearest Gate:</strong> ${match.nearestGate}<br/>
      <button class="btn-primary" style="margin-top:8px;padding:6px 12px;font-size:0.76rem;border-radius:6px" onclick="jumpToDestination('${match.id}')">
        🧭 Show ${match.code} on Map &amp; Route →
      </button>
    `;
  }

  return `
    I can help you locate all <strong>58 LPU Blocks</strong>, decode timetable room numbers like <code>32-405</code> or <code>14-202</code>, or check Hostels, Night Canteens, Mess Menus, and Helplines! Try asking: <em>"Where is 32-405?"</em> or <em>"CSE blocks"</em>.
  `;
}

// Voice Search using Web Speech API
function startVoiceCampusSearch() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = document.getElementById('voiceSearchBtn');
  const inp = document.getElementById('quickMapSearch');

  if (!SpeechRec) {
    alert('Voice recognition is supported in Google Chrome and Microsoft Edge. Try typing "32-405" or "Block 32"!');
    return;
  }

  const recognition = new SpeechRec();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  if (btn) {
    btn.classList.add('listening');
    btn.textContent = '🔴 Listening...';
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    if (inp) {
      inp.value = transcript;
      handleQuickMapSearch(transcript);
    }
  };

  recognition.onerror = () => {
    if (btn) {
      btn.classList.remove('listening');
      btn.textContent = '🎤 Voice';
    }
  };

  recognition.onend = () => {
    if (btn) {
      btn.classList.remove('listening');
      btn.textContent = '🎤 Voice';
    }
  };

  recognition.start();
}

// Live GPS Nearest-Block Finder
function locateNearestCampusBlock() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      findAndHighlightNearestBlock(userLat, userLng);
    },
    () => {
      // Fallback demo coordinate inside LPU Academic Spine near Block 32
      findAndHighlightNearestBlock(31.2549, 75.7052);
    },
    { enableHighAccuracy: true, timeout: 5000 }
  );
}

function findAndHighlightNearestBlock(lat, lng) {
  const locs = campusData.campusLocations || [];
  if (!locs.length) return;

  let nearest = locs[0];
  let minMeters = Infinity;

  locs.forEach((loc) => {
    const d = haversineMeters(lat, lng, loc.lat, loc.lng);
    if (d < minMeters) {
      minMeters = d;
      nearest = loc;
    }
  });

  // If user is outside Phagwara (> 15 km away), show LPU Main Gate 1 -> Block 32 live demo
  if (minMeters > 15000) {
    selectCampusLocation('block-32', true);
    askLpuAi('Where is room 32-405 and how far from Main Gate?');
    return;
  }

  selectCampusLocation(nearest.id, true);
}
