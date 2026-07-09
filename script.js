'use strict';

/* ===== DOCUMENT READY INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveals();
  initScrollProgress();
  initSimulatorSwitcher();
  initReportWizard();
  initMapTracker();
  initRewardsDashboard();
  initAuthorityDashboard();
  initImpactCounters();
  initBentoHover();
});

/* ===== SCROLL PROGRESS BAR ===== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });
}

/* ===== BENTO CARD CURSOR GLOW ===== */
function initBentoHover() {
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}


/* ===== NAVBAR SCRIPTS ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Active link highlighter on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          links.forEach(l => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  });
}

/* ===== SCROLL REVEAL ANIMATIONS ===== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* ===== SIMULATOR SWITCHER ===== */
function initSimulatorSwitcher() {
  const navButtons = document.querySelectorAll('.sim-nav-btn');
  const screens = document.querySelectorAll('.sim-screen');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons and screens
      navButtons.forEach(b => b.classList.remove('active'));
      screens.forEach(s => s.classList.remove('active'));

      // Set active
      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const targetScreen = document.getElementById(`screen-${targetId}`);
      if (targetScreen) {
        targetScreen.classList.add('active');
      }

      // Leaflet needs a size refresh when its container becomes visible
      if (targetId === 'map-tracker') {
        setTimeout(() => {
          if (leafletMap) {
            leafletMap.invalidateSize();
          } else {
            // Lazy init if it wasn't ready at DOMContentLoaded
            initMapTracker();
          }
        }, 50);
      }
    });
  });
}

/* ===== GLOBAL SIMULATOR STATES ===== */
const simulatorState = {
  selectedCategory: '',
  capturedPhotoURL: '',
  gpsAddress: '',
  totalPoints: 120,
  currentRank: 'Bronze', // Bronze (0-300), Silver (301-800), Gold (801-2000), Diamond (2000+)
  issuesCount: 124580,
  resolvedCount: 42,
  pendingCount: 8,
  recentReports: [
    { cat: '💡', title: 'Streetlight Broken', loc: 'Dwarka Sec-6', status: 'Pending' },
    { cat: '🗑️', title: 'Garbage Dumped', loc: 'Saket Ward 3', status: 'Resolved' }
  ]
};

/* ===== SIMULATOR 1: REPORT WIZARD ===== */
function initReportWizard() {
  // Step navigation buttons
  const catCards = document.querySelectorAll('.wizard-cat-card');
  const next1 = document.getElementById('wizard-next-1');
  
  const step1 = document.getElementById('wizard-step-1');
  const step2 = document.getElementById('wizard-step-2');
  const step4 = document.getElementById('wizard-step-4');

  const prev2 = document.getElementById('wizard-prev-2');
  const submitBtn = document.getElementById('wizard-submit-report');
  
  const cameraTrigger = document.getElementById('wizard-camera-trigger');
  const cameraImg = document.getElementById('wizard-camera-img');
  const cameraFlash = document.getElementById('camera-flash');
  
  const restartBtn = document.getElementById('wizard-restart-btn');

  // Step 1: Category Select
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      catCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      simulatorState.selectedCategory = card.dataset.category;
      next1.removeAttribute('disabled');
    });
  });

  next1.addEventListener('click', () => {
    step1.classList.remove('active');
    step2.classList.add('active');
  });

  // Step 2: Camera Capture
  cameraTrigger.addEventListener('click', () => {
    // Flash Animation
    cameraFlash.classList.add('active');
    setTimeout(() => {
      cameraFlash.classList.remove('active');
    }, 500);

    // Use user-uploaded images for real category representations
    let photoURL = '';
    const category = simulatorState.selectedCategory;
    if (category === 'Pothole') {
      photoURL = 'assets/potholes_dirt_road.jpg';
    } else if (category === 'Garbage') {
      photoURL = 'assets/muddy_trench_close.jpg';
    } else if (category === 'Streetlight') {
      photoURL = 'assets/city_nds.jpg';
    } else if (category === 'Water Leakage') {
      photoURL = 'assets/muddy_trench.jpg';
    } else {
      photoURL = generateMockPhoto(category);
    }
    simulatorState.capturedPhotoURL = photoURL;

    cameraImg.src = photoURL;
    cameraImg.style.display = 'block';
    
    // Hide placeholder text
    const placeholder = cameraTrigger.querySelector('.wizard-camera-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    submitBtn.removeAttribute('disabled');
  });

  prev2.addEventListener('click', () => {
    step2.classList.remove('active');
    step1.classList.add('active');
  });

  // GPS Address Mocker (Auto generated on submit)
  const indianAddresses = [
    "Connaught Circus, Block E, New Delhi, Delhi 110001",
    "Indiranagar 100 Feet Rd, Bengaluru, Karnataka 560038",
    "Linking Road, Santacruz West, Mumbai, Maharashtra 400054",
    "Marine Drive Flyover, Netaji Subhash Chandra Bose Rd, Mumbai 400020",
    "Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    "Anna Salai Road, Teynampet, Chennai, Tamil Nadu 600018"
  ];

  // Submit Final Report
  submitBtn.addEventListener('click', () => {
    step2.classList.remove('active');
    step4.classList.add('active');

    // Auto-detect a random address since location step is bypassed
    const randomAddr = indianAddresses[Math.floor(Math.random() * indianAddresses.length)];
    simulatorState.gpsAddress = randomAddr;

    // Trigger state changes & integrations
    // Increment global counters
    simulatorState.totalPoints += 20;
    simulatorState.issuesCount += 1;
    simulatorState.pendingCount += 1;

    // Update displays
    updateRewardsDisplay();
    updateImpactCountersDisplay();
    updateAuthorityDashboardDisplay();

    // Map Tracker Update: Place a new pin at a random location on the map tracker
    const mapSimViewport = document.getElementById('map-viewport-sim');
    if (mapSimViewport) {
      const topPct = 20 + Math.random() * 60;
      const leftPct = 20 + Math.random() * 60;
      createMapPin(topPct, leftPct, simulatorState.selectedCategory, simulatorState.gpsAddress);
    }

    // Add to recent feed
    const categoryEmojis = { 'Pothole': '🕳️', 'Garbage': '🗑️', 'Streetlight': '💡', 'Water Leakage': '💧' };
    const emoji = categoryEmojis[simulatorState.selectedCategory] || '📍';
    const recentFeed = document.getElementById('recent-reports-list');
    if (recentFeed) {
      const row = document.createElement('div');
      row.className = 'recent-report-row';
      row.innerHTML = `
        <div class="recent-report-left">
          <span>${emoji}</span>
          <strong>${simulatorState.selectedCategory}</strong> · ${simulatorState.gpsAddress.split(',')[0]}
        </div>
        <span class="recent-report-status" style="background: rgba(245,158,11,0.15); color: var(--amber);">Pending</span>
      `;
      recentFeed.insertBefore(row, recentFeed.firstChild);
    }
  });

  // Restart wizard
  restartBtn.addEventListener('click', () => {
    // Reset wizard states
    simulatorState.selectedCategory = '';
    simulatorState.capturedPhotoURL = '';
    simulatorState.gpsAddress = '';

    // Clear UI inputs
    catCards.forEach(c => c.classList.remove('selected'));
    next1.setAttribute('disabled', 'true');

    cameraImg.src = '';
    cameraImg.style.display = 'none';
    const placeholder = cameraTrigger.querySelector('.wizard-camera-placeholder');
    if (placeholder) placeholder.style.display = 'flex';
    submitBtn.setAttribute('disabled', 'true');

    // Go back to step 1
    step4.classList.remove('active');
    step1.classList.add('active');
  });
}

// Draw dynamic illustration helper to output custom mock base64 canvas URL
function generateMockPhoto(category) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 300, 180);
  bgGrad.addColorStop(0, '#1f2937');
  bgGrad.addColorStop(1, '#111827');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 300, 180);

  // Grid/road pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 300; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 180);
    ctx.stroke();
  }
  for (let j = 0; j < 180; j += 30) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(300, j);
    ctx.stroke();
  }

  // Draw customized vector graphic based on categories
  if (category === 'Pothole') {
    // Road asphalt grey
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.ellipse(150, 90, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crack inner circle
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.ellipse(150, 95, 60, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cracks lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(70, 90); ctx.lineTo(40, 85);
    ctx.moveTo(230, 90); ctx.lineTo(260, 95);
    ctx.moveTo(150, 45); ctx.lineTo(150, 20);
    ctx.stroke();
  } else if (category === 'Garbage') {
    // Green organic heap
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.moveTo(60, 140);
    ctx.quadraticCurveTo(150, 40, 240, 140);
    ctx.fill();

    // Box outlines representing trash boxes
    ctx.fillStyle = '#b45309';
    ctx.fillRect(100, 100, 40, 35);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(160, 110, 30, 25);

    ctx.fillStyle = '#ef4444'; // red can
    ctx.beginPath();
    ctx.arc(80, 130, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (category === 'Streetlight') {
    // Yellow light beam
    const lightGrad = ctx.createRadialGradient(150, 30, 5, 150, 90, 80);
    lightGrad.addColorStop(0, 'rgba(253, 224, 71, 0.6)');
    lightGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(150, 30);
    ctx.lineTo(90, 150);
    ctx.lineTo(210, 150);
    ctx.closePath();
    ctx.fill();

    // Bulb post pole
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(146, 0, 8, 30);
    
    // Bulb fixture head
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(150, 30, 12, 0, Math.PI, true);
    ctx.fill();
  } else {
    // Water Leak ripples
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(150, 90, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(150, 90, 45, 0, Math.PI * 2);
    ctx.stroke();

    // Droplet
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(150, 40);
    ctx.bezierCurveTo(135, 75, 165, 75, 150, 40);
    ctx.fill();
  }

  return canvas.toDataURL();
}

/* ===== SIMULATOR 2: MAP TRACKER (Leaflet + OpenStreetMap) ===== */
let leafletMap = null; // Global reference so createMapPin can use it

function initMapTracker() {
  // Wait for the map screen to be visible before initialising Leaflet
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer || typeof L === 'undefined') return;

  // Dark OpenStreetMap tile URL
  const darkTile = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      maxZoom: 19
    }
  );

  // Initialise the map centered on Bengaluru
  leafletMap = L.map('leaflet-map', {
    center: [12.9716, 77.5946],
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: false   // prevent scroll hijack inside page
  });

  darkTile.addTo(leafletMap);

  // ---- Helper: build a custom glowing DivIcon ----
  function makeIcon(color, emoji) {
    return L.divIcon({
      className: '',
      html: `
        <div style="
          position: relative;
          display: flex; align-items: center; justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 36px; height: 36px; border-radius: 50%;
            background: ${color}33;
            animation: pingGlow 2s infinite ease-out;
          "></div>
          <div style="
            width: 20px; height: 20px; border-radius: 50%;
            background: ${color};
            border: 2px solid #fff;
            box-shadow: 0 0 12px ${color}cc;
            display: flex; align-items: center; justify-content: center;
            font-size: 9px;
            position: relative; z-index: 1;
          ">${emoji}</div>
        </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -22]
    });
  }

  // Popup HTML builder
  function makePopup(emoji, category, area, status) {
    const badge = status === 'Resolved'
      ? `<span style="background:rgba(16,185,129,.15);color:#10b981;font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;text-transform:uppercase;">${status}</span>`
      : `<span style="background:rgba(245,158,11,.15);color:#f59e0b;font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;text-transform:uppercase;">${status}</span>`;
    return `<div style="font-family:'Inter',sans-serif;min-width:160px;">
      <strong style="font-size:0.8rem;color:#f1f5f9;">${emoji} ${category}</strong><br>
      <span style="font-size:0.7rem;color:#94a3b8;">${area}</span><br>
      <div style="margin-top:6px;">${badge}</div>
    </div>`;
  }

  // ---- Pre-seeded Bengaluru civic issue markers ----
  const seeds = [
    { lat: 12.9352, lng: 77.6245, cat: 'Pothole',       area: 'Koramangala 6th Block', status: 'Pending',  color: '#f59e0b', emoji: '🕳️' },
    { lat: 12.9698, lng: 77.7499, cat: 'Garbage',        area: 'Whitefield Main Rd',    status: 'Resolved', color: '#10b981', emoji: '🗑️' },
    { lat: 12.9784, lng: 77.6408, cat: 'Streetlight',   area: 'Indiranagar 100ft Rd',  status: 'Pending',  color: '#f59e0b', emoji: '💡' },
    { lat: 12.9757, lng: 77.6011, cat: 'Water Leakage', area: 'MG Road Junction',       status: 'Resolved', color: '#10b981', emoji: '💧' },
    { lat: 12.8399, lng: 77.6770, cat: 'Pothole',       area: 'Electronic City Phase 1',status: 'Pending',  color: '#ef4444', emoji: '🕳️' },
  ];

  seeds.forEach(({ lat, lng, cat, area, status, color, emoji }) => {
    L.marker([lat, lng], { icon: makeIcon(color, emoji) })
      .addTo(leafletMap)
      .bindPopup(makePopup(emoji, cat, area, status), {
        className: 'spottix-popup',
        maxWidth: 220
      });
  });

  // ---- Click anywhere → drop a new issue pin ----
  const mockCategories = [
    { cat: 'Pothole',       emoji: '🕳️', color: '#f59e0b' },
    { cat: 'Garbage',       emoji: '🗑️', color: '#ef4444' },
    { cat: 'Streetlight',   emoji: '💡', color: '#8b5cf6' },
    { cat: 'Water Leakage', emoji: '💧', color: '#06b6d4' }
  ];
  const mockAreas = [
    'Jayanagar 4th Block', 'Basavanagudi', 'Rajajinagar', 'Yeshwanthpur',
    'Hebbal', 'HSR Layout Sector 2', 'BTM Layout', 'Malleswaram'
  ];

  leafletMap.on('click', (e) => {
    const pick = mockCategories[Math.floor(Math.random() * mockCategories.length)];
    const area = mockAreas[Math.floor(Math.random() * mockAreas.length)];

    L.marker([e.latlng.lat, e.latlng.lng], { icon: makeIcon(pick.color, pick.emoji) })
      .addTo(leafletMap)
      .bindPopup(makePopup(pick.emoji, pick.cat, area, 'Pending'), {
        className: 'spottix-popup',
        maxWidth: 220
      })
      .openPopup();

    // Add to recent feed
    addToRecentFeed(pick.emoji, pick.cat, area);

    // Update global state & rewards
    simulatorState.totalPoints += 15;
    simulatorState.issuesCount += 1;
    simulatorState.pendingCount += 1;
    updateRewardsDisplay();
    updateImpactCountersDisplay();
    updateAuthorityDashboardDisplay();
  });
}

// Called by report wizard submit to drop a pin at a random Bengaluru coord
function createMapPin(top, left, category, address) {
  if (!leafletMap) return;

  const categoryMeta = {
    'Pothole':       { emoji: '🕳️', color: '#f59e0b' },
    'Garbage':       { emoji: '🗑️', color: '#ef4444' },
    'Streetlight':   { emoji: '💡', color: '#8b5cf6' },
    'Water Leakage': { emoji: '💧', color: '#06b6d4' }
  };
  const meta = categoryMeta[category] || { emoji: '📍', color: '#10b981' };

  // Convert percent coords to a rough lat/lng offset inside Bengaluru bounding box
  const bounds = leafletMap.getBounds();
  const lat = bounds.getSouth() + (1 - top / 100) * (bounds.getNorth() - bounds.getSouth());
  const lng = bounds.getWest()  + (left / 100)   * (bounds.getEast()  - bounds.getWest());

  const icon = L.divIcon({
    className: '',
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:${meta.color}33;animation:pingGlow 2s infinite ease-out;"></div>
      <div style="width:20px;height:20px;border-radius:50%;background:${meta.color};border:2px solid #fff;box-shadow:0 0 12px ${meta.color}cc;display:flex;align-items:center;justify-content:center;font-size:9px;position:relative;z-index:1;">${meta.emoji}</div>
    </div>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -22]
  });

  const area = address ? address.split(',')[0] : 'Bengaluru';
  const badge = `<span style="background:rgba(245,158,11,.15);color:#f59e0b;font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;text-transform:uppercase;">Pending</span>`;
  const popup = `<div style="font-family:'Inter',sans-serif;min-width:160px;">
    <strong style="font-size:0.8rem;color:#f1f5f9;">${meta.emoji} ${category}</strong><br>
    <span style="font-size:0.7rem;color:#94a3b8;">${area}</span><br>
    <div style="margin-top:6px;">${badge}</div>
  </div>`;

  L.marker([lat, lng], { icon })
    .addTo(leafletMap)
    .bindPopup(popup, { className: 'spottix-popup', maxWidth: 220 })
    .openPopup();

  leafletMap.panTo([lat, lng]);
}

function addToRecentFeed(emoji, category, area) {
  const recentFeed = document.getElementById('recent-reports-list');
  if (!recentFeed) return;
  const row = document.createElement('div');
  row.className = 'recent-report-row';
  row.innerHTML = `
    <div class="recent-report-left">
      <span>${emoji}</span>
      <strong>${category}</strong> · ${area}
    </div>
    <span class="recent-report-status" style="background:rgba(245,158,11,0.15);color:var(--amber);">Pending</span>
  `;
  recentFeed.insertBefore(row, recentFeed.firstChild);
}

/* ===== SIMULATOR 3: REWARDS & GAMIFICATION ===== */
function initRewardsDashboard() {
  const claimPointsBtn = document.getElementById('btn-claim-mock-points');
  const closeLevelUpBtn = document.getElementById('rank-levelup-close');

  claimPointsBtn.addEventListener('click', () => {
    simulatorState.totalPoints += 40;
    updateRewardsDisplay();
  });

  closeLevelUpBtn.addEventListener('click', () => {
    const levelUpOverlay = document.getElementById('rank-levelup-overlay');
    levelUpOverlay.classList.remove('active');
  });
}

function updateRewardsDisplay() {
  const totalPtsEl = document.getElementById('reward-total-points');
  const userRankEl = document.getElementById('reward-current-rank');
  const rankProgressTxt = document.getElementById('rank-progress-txt');
  const progressFill = document.getElementById('rank-progress-fill');
  const leaderboardPts = document.getElementById('leaderboard-user-pts');

  const pts = simulatorState.totalPoints;
  totalPtsEl.textContent = pts.toLocaleString();
  leaderboardPts.textContent = `${pts} pts`;

  // Rank categorization
  let rank = 'Bronze';
  let minXP = 0;
  let maxXP = 300;
  let medal = '🥉';

  if (pts > 2000) {
    rank = 'Diamond';
    minXP = 2000;
    maxXP = 5000;
    medal = '💎';
  } else if (pts > 800) {
    rank = 'Gold';
    minXP = 801;
    maxXP = 2000;
    medal = '🥇';
  } else if (pts > 300) {
    rank = 'Silver';
    minXP = 301;
    maxXP = 800;
    medal = '🥈';
  }

  // Trigger level up triggers if rank changed
  if (simulatorState.currentRank !== rank) {
    simulatorState.currentRank = rank;
    triggerLevelUpModal(rank, medal);
  }

  userRankEl.textContent = rank;
  
  // Calculate percentage progression
  const diffTotal = maxXP - minXP;
  const progressCurrent = pts - minXP;
  const pct = Math.min((progressCurrent / diffTotal) * 100, 100);

  rankProgressTxt.textContent = `${pts} / ${maxXP} XP`;
  progressFill.style.width = `${pct}%`;
}

function triggerLevelUpModal(rank, medal) {
  const overlay = document.getElementById('rank-levelup-overlay');
  const medalEl = document.getElementById('rank-popup-medal');
  const descEl = document.getElementById('rank-popup-desc');

  medalEl.textContent = medal;
  descEl.textContent = `Congratulations! You have been promoted to ${rank} Rank for your outstanding civic reporting contributions.`;
  
  overlay.classList.add('active');
}

/* ===== SIMULATOR 4: AUTHORITY DASHBOARD ===== */
function initAuthorityDashboard() {
  const filters = document.querySelectorAll('.db-filter-btn');
  const issues = document.querySelectorAll('.db-issue-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      issues.forEach(issue => {
        const status = issue.dataset.status;
        if (filterVal === 'all' || status === filterVal) {
          issue.style.display = 'flex';
        } else {
          issue.style.display = 'none';
        }
      });
    });
  });

  updateAuthorityDashboardDisplay();
}

// Window global helper to resolve issue simulated click
window.resolveIssueSim = function(cardId) {
  const card = document.getElementById(`db-card-${cardId}`);
  if (card && card.dataset.status !== 'resolved') {
    card.dataset.status = 'resolved';
    
    // Change action button to Resolved badge
    const actions = card.querySelector('.db-issue-actions');
    actions.innerHTML = '<span class="db-status-pill resolved">Resolved</span>';

    // Update metrics
    simulatorState.resolvedCount += 1;
    if (simulatorState.pendingCount > 0) {
      simulatorState.pendingCount -= 1;
    }

    updateAuthorityDashboardDisplay();
    updateImpactCountersDisplay();

    // Trigger visual bars redraw animation
    animateDashboardBars();
  }
};

function updateAuthorityDashboardDisplay() {
  const resolvedCountEl = document.getElementById('db-resolved-count');
  const pendingCountEl = document.getElementById('db-pending-count');
  const completionRateEl = document.getElementById('db-completion-rate');

  const resolved = simulatorState.resolvedCount;
  const pending = simulatorState.pendingCount;
  const total = resolved + pending;
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  resolvedCountEl.textContent = resolved;
  pendingCountEl.textContent = pending;
  completionRateEl.textContent = `${rate}%`;
}

function animateDashboardBars() {
  const bars = document.querySelectorAll('.db-chart-bar');
  bars.forEach(bar => {
    const finalHeight = bar.style.height;
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.height = finalHeight;
    }, 100);
  });
}

/* ===== IMPACT COUNTERS COUNT-UP ANIMATION ===== */
function initImpactCounters() {
  const countersSection = document.getElementById('impact');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  if (countersSection) {
    observer.observe(countersSection);
  }
  
  updateImpactCountersDisplay();
}

function animateCounters() {
  const elements = document.querySelectorAll('.impact-val[data-target]');
  const duration = 2000; // 2 seconds animation

  elements.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (cubic ease out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeProgress * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(update);
  });
}

function updateImpactCountersDisplay() {
  // Update targets of counters based on real-time state additions
  const counterIssues = document.querySelector('.impact-val[data-target="124580"]');
  if (counterIssues) {
    counterIssues.dataset.target = simulatorState.issuesCount;
    // If counters already ran, update display directly
    if (counterIssues.textContent !== '0') {
      counterIssues.textContent = simulatorState.issuesCount.toLocaleString();
    }
  }

  const counterPoints = document.querySelector('.impact-val[data-target="248900"]');
  if (counterPoints) {
    const addedPoints = (simulatorState.totalPoints - 120) * 10; // scale mock action points additions
    const totalPointsTarget = 248900 + addedPoints;
    counterPoints.dataset.target = totalPointsTarget;
    if (counterPoints.textContent !== '0') {
      counterPoints.textContent = totalPointsTarget.toLocaleString();
    }
  }
}
