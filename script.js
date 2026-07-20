// ===== SPOTTIX - PREMIUM CLIENT JAVASCRIPT =====
// Production-ready implementation with all 16 requirements
import { getWardData } from './wardData.js';

// ============================================================
// 1. NAVBAR SCROLL & NAVIGATION
// ============================================================

const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function handleScroll() {
  // Navbar scrolled state detection
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Active nav link highlighting
  let currentActive = '';
  const scrollPosition = window.scrollY + 120;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentActive = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active');
    }
  });
}

let scrollTimer = null;
window.addEventListener('scroll', () => {
  if (scrollTimer) window.cancelAnimationFrame(scrollTimer);
  scrollTimer = window.requestAnimationFrame(handleScroll);
}, { passive: true });

// ============================================================
// 13. MOBILE MENU
// ============================================================

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu() {
  const isOpen = hamburger.classList.contains('active');
  hamburger.classList.toggle('active', !isOpen);
  mobileMenu.classList.toggle('active', !isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  mobileMenu.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
  document.body.classList.toggle('menu-open', !isOpen);
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

hamburger.addEventListener('click', toggleMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});

// ============================================================
// 1. SMOOTH SCROLL TO SECTIONS
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      closeMobileMenu();
      
      const offset = 84;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================================
// 2. ANIMATIONS - FADE-UP WITH STAGGER
// ============================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    fadeObserver.observe(el);
  });
});

// ============================================================
// 3. IMPACT COUNTERS
// ============================================================

function animateCounter(element, target, suffix = '', duration = 2000) {
  if (prefersReducedMotion) {
    element.textContent = target.toLocaleString() + suffix;
    return;
  }
  
  let startTime = null;
  const startValue = 0;
  
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const progressEase = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    const value = Math.floor(progressEase * (target - startValue) + startValue);
    element.textContent = value.toLocaleString() + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target.toLocaleString() + suffix;
    }
  }
  
  window.requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      let target = parseInt(element.getAttribute('data-target')) || 0;
      const suffix = element.getAttribute('data-suffix') || '';
      
      if (suffix.includes('K') && target >= 1000) {
        target = target / 1000;
      }
      
      animateCounter(element, target, suffix, 2000);
      statObserver.unobserve(element);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.impact-counter').forEach(el => statObserver.observe(el));
});

// ============================================================
// 4. FEATURE TABS (Report, Track, Map, Ranks, Account)
// ============================================================

const tabPills = document.querySelectorAll('.app-tab-pill');
const tabPanels = document.querySelectorAll('.app-tab-panel');
let currentTabIdx = 0;
let tabInterval = null;
let tabRotationPaused = false;

function showTab(idx) {
  tabPills.forEach((pill, i) => {
    const active = i === idx;
    pill.classList.toggle('active', active);
    pill.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  tabPanels.forEach((panel, i) => {
    if (i === idx) {
      panel.classList.add('active');
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    } else {
      panel.classList.remove('active');
    }
  });
  currentTabIdx = idx;
}

function startTabRotation() {
  if (tabInterval) clearInterval(tabInterval);
  tabInterval = setInterval(() => {
    if (!tabRotationPaused) {
      const nextIdx = (currentTabIdx + 1) % tabPills.length;
      showTab(nextIdx);
    }
  }, 5000);
}

tabPills.forEach((pill, idx) => {
  pill.addEventListener('click', () => {
    showTab(idx);
    startTabRotation();
  });
});

const showcaseSection = document.getElementById('in-action');
if (showcaseSection) {
  showcaseSection.addEventListener('mouseenter', () => tabRotationPaused = true);
  showcaseSection.addEventListener('mouseleave', () => tabRotationPaused = false);
}

document.addEventListener('DOMContentLoaded', () => {
  startTabRotation();
});

// ============================================================
// 5. FAQ ACCORDION
// ============================================================

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question-btn');
  const panel = item.querySelector('.faq-answer-panel');
  
  if (btn && panel) {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Close other questions
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });
      
      // Toggle current question
      item.classList.toggle('active', !isExpanded);
      btn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      panel.style.maxHeight = !isExpanded ? panel.scrollHeight + 'px' : null;
    });
  }
});

// ============================================================
// 6. BEFORE/AFTER SLIDER
// ============================================================

function initComparisonSlider() {
  const slider = document.getElementById('comparisonSlider');
  const handle = document.getElementById('sliderHandle');
  const overlay = document.getElementById('beforeOverlay');
  
  if (!slider || !handle || !overlay) return;
  
  let isDragging = false;
  
  function updateSlider(clientX) {
    const rect = slider.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    
    overlay.style.width = percentage + '%';
    handle.style.left = percentage + '%';
    handle.setAttribute('aria-valuenow', Math.round(percentage));
  }
  
  // Mouse events
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) updateSlider(e.clientX);
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Touch events
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });
  
  slider.addEventListener('touchmove', (e) => {
    if (isDragging) updateSlider(e.touches[0].clientX);
  }, { passive: true });
  
  slider.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  // Keyboard events
  handle.addEventListener('keydown', (e) => {
    const currentValue = parseInt(handle.getAttribute('aria-valuenow') || '50');
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const newVal = Math.max(0, currentValue - 5);
      updateSlider((newVal / 100) * slider.offsetWidth + slider.getBoundingClientRect().left);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const newVal = Math.min(100, currentValue + 5);
      updateSlider((newVal / 100) * slider.offsetWidth + slider.getBoundingClientRect().left);
    }
  });
  
  // ARIA setup
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Before and after comparison slider');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');
  handle.setAttribute('tabindex', '0');
}

document.addEventListener('DOMContentLoaded', initComparisonSlider);

// ============================================================
// 12. BEFORE/AFTER PAIR SELECTOR
// ============================================================

window.setPair = function(type) {
  const beforeImg = document.getElementById('beforeImg');
  const afterImg = document.getElementById('afterImg');
  const pairGarbage = document.getElementById('pairGarbage');
  const pairLight = document.getElementById('pairLight');
  const cards = document.querySelectorAll('.slider-info-card');
  
  if (!beforeImg || !afterImg || !pairGarbage || !pairLight) return;
  
  if (type === 'garbage') {
    beforeImg.src = './assets/before_garbage_pile.png';
    afterImg.src = './assets/after_clean_road.png';
    
    pairGarbage.style.background = 'var(--accent-green-light)';
    pairGarbage.style.borderColor = 'var(--accent-green)';
    pairGarbage.style.color = 'var(--accent-green-dark)';
    
    pairLight.style.background = 'var(--bg-secondary)';
    pairLight.style.borderColor = 'var(--card-border)';
    pairLight.style.color = 'var(--text-body)';
    
    if (cards.length >= 2) {
      cards[0].innerHTML = `
        <h4>🗑 Before</h4>
        <ul>
          <li>Uncleared garbage for 3 days</li>
          <li>Health hazard for residents</li>
          <li>No response from authorities</li>
        </ul>
      `;
      cards[1].innerHTML = `
        <h4>✅ After Spottix</h4>
        <ul>
          <li>Reported via Spottix app</li>
          <li>Cleared within 18 hours</li>
          <li>Citizen earned 50 points</li>
        </ul>
      `;
    }
  } else if (type === 'light') {
    beforeImg.src = './assets/before_broken_streetlight.png';
    afterImg.src = './assets/after_working_streetlight.png';
    
    pairLight.style.background = 'var(--accent-green-light)';
    pairLight.style.borderColor = 'var(--accent-green)';
    pairLight.style.color = 'var(--accent-green-dark)';
    
    pairGarbage.style.background = 'var(--bg-secondary)';
    pairGarbage.style.borderColor = 'var(--card-border)';
    pairGarbage.style.color = 'var(--text-body)';
    
    if (cards.length >= 2) {
      cards[0].innerHTML = `
        <h4>💡 Before</h4>
        <ul>
          <li>Broken streetlight for 2 weeks</li>
          <li>Unsafe dark road at night</li>
          <li>Increased safety concerns</li>
        </ul>
      `;
      cards[1].innerHTML = `
        <h4>✅ After Spottix</h4>
        <ul>
          <li>Reported via Spottix app</li>
          <li>Replaced within 24 hours</li>
          <li>Citizen earned 30 points</li>
        </ul>
      `;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.setPair('garbage');
});

// ============================================================
// 7. LEADERBOARD TABS
// ============================================================

const lbTabs = document.querySelectorAll('.leaderboard-section .tab-btn');
const lbPanels = document.querySelectorAll('.leaderboard-section .tab-content');

lbTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.getAttribute('data-tab');
    lbTabs.forEach(t => t.classList.remove('active'));
    lbPanels.forEach(p => p.classList.remove('active'));
    
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
});

// ============================================================
// 8. MARQUEE ANIMATION
// ============================================================

const marqueeTrack = document.getElementById('marqueeTrack');
if (marqueeTrack) {
  const marqueeContainer = marqueeTrack.parentElement;
  marqueeContainer.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeContainer.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ============================================================
// 9. ROADMAP PROGRESS LINE
// ============================================================

const roadmapSection = document.getElementById('how-it-works');
const progressLine = document.getElementById('roadmapProgressLine');
const roadmapSteps = document.querySelectorAll('.roadmap-step');

function updateRoadmapProgress() {
  if (!roadmapSection || !progressLine) return;
  
  const rect = roadmapSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  const totalHeight = rect.height;
  const scrolled = windowHeight * 0.8 - rect.top;
  const percentage = Math.max(0, Math.min(100, (scrolled / totalHeight) * 100));
  
  progressLine.style.width = percentage + '%';
  
  roadmapSteps.forEach((step, idx) => {
    const stepRect = step.getBoundingClientRect();
    if (stepRect.top < windowHeight * 0.65) {
      step.classList.add('active');
    } else {
      if (idx > 0) step.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateRoadmapProgress);
}, { passive: true });

// ============================================================
// 10 & 11. LEAFLET MAP
// ============================================================

let map = null;
let geoJsonLayer = null;

function showWardDetails(properties, data) {
  const mapOverview = document.getElementById('mapOverview');
  const wardDetail = document.getElementById('wardDetail');
  
  if (mapOverview && wardDetail) {
    mapOverview.style.display = 'none';
    wardDetail.style.display = 'block';
    
    document.getElementById('wardName').textContent = properties.KGISWardName || 'Unknown Ward';
    document.getElementById('wardNum').textContent = properties.KGISWardNo || 'N/A';
    document.getElementById('wardReports').textContent = (data.resolvedIssues + data.activeIssues).toLocaleString();
    document.getElementById('wardOpen').textContent = data.activeIssues.toLocaleString();
    document.getElementById('wardResolved').textContent = data.resolvedIssues.toLocaleString();
    document.getElementById('wardRate').textContent = data.resolutionRate + '%';
    
    const issues = ['Garbage Dumping', 'Sewage Overflow', 'Broken Streetlights', 'Road Potholes'];
    let hash = 0;
    const name = properties.KGISWardName || '';
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
    }
    const topIssue = issues[hash % issues.length];
    document.getElementById('wardTopIssue').textContent = topIssue;
  }
}

function renderFallbackMarkers() {
  if (!map) return;
  
  const fallbackWards = [
    { name: 'Koramangala (Ward 150)', lat: 12.9352, lng: 77.6245, resolved: 76, active: 28, total: 323 },
    { name: 'Indiranagar (Ward 81)', lat: 12.9716, lng: 77.6412, resolved: 88, active: 9, total: 437 },
    { name: 'Whitefield (Ward 84)', lat: 12.9698, lng: 77.7499, resolved: 52, active: 78, total: 272 },
    { name: 'Jayanagar (Ward 167)', lat: 12.9250, lng: 77.5838, resolved: 83, active: 21, total: 333 },
    { name: 'HSR Layout (Ward 151)', lat: 12.9121, lng: 77.6446, resolved: 92, active: 14, total: 356 },
    { name: 'Malleswaram (Ward 10)', lat: 13.0031, lng: 77.5703, resolved: 91, active: 11, total: 326 },
    { name: 'Yelahanka (Ward 5)', lat: 13.1008, lng: 77.5946, resolved: 85, active: 16, total: 226 }
  ];
  
  fallbackWards.forEach(ward => {
    const rate = ward.resolved;
    const color = rate >= 80 ? '#22c55e' : (rate >= 60 ? '#f59e0b' : '#ef4444');
    
    const marker = L.circleMarker([ward.lat, ward.lng], {
      radius: 12,
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.7
    }).addTo(map);
    
    marker.on('click', () => {
      showWardDetails({ KGISWardName: ward.name.split(' (')[0], KGISWardNo: ward.name.match(/\d+/)[0] }, {
        resolvedIssues: ward.total - ward.active,
        activeIssues: ward.active,
        resolutionRate: ward.resolved
      });
      map.setView([ward.lat, ward.lng], 13);
    });
    
    marker.bindTooltip(ward.name + ` (${rate}% resolved)`, { sticky: true });
  });
}

function initMap() {
  const mapElement = document.getElementById('bengaluru-map');
  if (!mapElement || map) return;
  
  const center = [12.9716, 77.5946];
  const bounds = L.latLngBounds(
    [12.7343, 77.3792],
    [13.1737, 77.8470]
  );
  
  map = L.map('bengaluru-map', {
    center: center,
    zoom: 11,
    minZoom: 10,
    maxZoom: 16,
    maxBounds: bounds,
    maxBoundsViscosity: 0.9,
    zoomControl: true,
    attributionControl: false
  });
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd'
  }).addTo(map);
  
  map.fitBounds(bounds);
  
  fetch('./assets/bbmp-wards.geojson')
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(geojson => {
      geoJsonLayer = L.geoJSON(geojson, {
        style: (feature) => {
          const wardName = feature.properties.KGISWardName;
          const data = getWardData(wardName);
          const rate = data.resolutionRate;
          
          let color = '#22c55e';
          if (rate < 60) {
            color = '#ef4444';
          } else if (rate < 80) {
            color = '#f59e0b';
          }
          
          return {
            fillColor: color,
            weight: 1.5,
            opacity: 0.6,
            color: '#ffffff',
            fillOpacity: 0.25
          };
        },
        onEachFeature: (feature, layer) => {
          const wardName = feature.properties.KGISWardName;
          const data = getWardData(wardName);
          
          layer.on('mouseover', () => {
            layer.setStyle({
              fillOpacity: 0.5,
              weight: 2.5,
              color: '#1a1f36'
            });
          });
          
          layer.on('mouseout', () => {
            geoJsonLayer.resetStyle(layer);
          });
          
          layer.on('click', () => {
            showWardDetails(feature.properties, data);
            
            geoJsonLayer.resetStyle();
            layer.setStyle({
              fillOpacity: 0.65,
              weight: 3,
              color: '#16a34a'
            });
            
            map.fitBounds(layer.getBounds(), { padding: [20, 20] });
          });
          
          const tooltipContent = `
            <div style="font-family:'Inter', sans-serif; padding: 4px;">
              <strong style="font-size:13px; color:#1a1f36; display:block; margin-bottom:4px;">${wardName}</strong>
              <span style="font-size:11px; color:#4a5568; display:block;">Ward No: ${feature.properties.KGISWardNo || 'N/A'}</span>
              <span style="font-size:11px; font-weight:700; color:#16a34a; display:block; margin-top:2px;">Resolution: ${data.resolutionRate}%</span>
            </div>
          `;
          layer.bindTooltip(tooltipContent, { sticky: true });
        }
      }).addTo(map);
    })
    .catch(err => {
      console.warn('Map GeoJSON loading failed, using fallback markers:', err);
      renderFallbackMarkers();
    });
}

const mapSection = document.getElementById('live-map');
if (mapSection) {
  const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initMap();
        mapObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  mapObserver.observe(mapSection);
}

// ============================================================
// 11. MAP DETAIL VIEW
// ============================================================

const mapBackBtn = document.getElementById('mapBackBtn');
if (mapBackBtn) {
  mapBackBtn.addEventListener('click', () => {
    const mapOverview = document.getElementById('mapOverview');
    const wardDetail = document.getElementById('wardDetail');
    if (mapOverview && wardDetail) {
      mapOverview.style.display = 'block';
      wardDetail.style.display = 'none';
      
      if (map) {
        const bounds = L.latLngBounds(
          [12.7343, 77.3792],
          [13.1737, 77.8470]
        );
        map.fitBounds(bounds);
        if (geoJsonLayer) {
          geoJsonLayer.resetStyle();
        }
      }
    }
  });
}

// ============================================================
// 14. PERFORMANCE - LAZY LOADING & OPTIMIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year
  const footerCopyright = document.querySelector('.footer-copyright');
  const year = new Date().getFullYear();
  if (footerCopyright && year > 2026) {
    footerCopyright.innerHTML = footerCopyright.innerHTML.replace('2026', year);
  }
  
  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
  });
});

// ============================================================
// 15. ACCESSIBILITY
// ============================================================

// Focus management for modal-like states
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// Ensure all interactive elements are keyboard accessible
document.querySelectorAll('button, a[href], input').forEach(el => {
  if (!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
    el.setAttribute('tabindex', '0');
  }
});
