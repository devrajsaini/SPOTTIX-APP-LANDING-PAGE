// ===== SPOTTIX - MAIN JAVASCRIPT =====

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Update active nav link
  updateActiveNavLink();
});

// Update Active Navigation Link
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      if (navLink) {
        navLink.classList.add('active');
      }
    }
  });
}

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Animated Counter
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  return num.toString();
}

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      
      // Animate counters
      if (entry.target.classList.contains('stat-value') || 
          entry.target.classList.contains('impact-value')) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        if (target) {
          animateCounter(entry.target, target);
        }
      }
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all fade-up elements
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => {
    observer.observe(el);
  });
  
  // Observe counter elements
  const statValues = document.querySelectorAll('.stat-value, .impact-value');
  statValues.forEach(el => {
    observer.observe(el);
  });
});

// Leaderboard Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    // Remove active class from all tabs
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab
    btn.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answerPanel = item.querySelector('.faq-answer');
  
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all FAQ items
    faqItems.forEach(faq => {
      faq.classList.remove('active');
      const panel = faq.querySelector('.faq-answer');
      if (panel) {
        panel.style.maxHeight = null;
      }
      const qBtn = faq.querySelector('.faq-question');
      if (qBtn) {
        qBtn.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
      if (answerPanel) {
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
      }
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// Bengaluru Map with Leaflet
let map;
let markers = [];

function initMap() {
  // Bengaluru center coordinates
  const bengaluruCenter = [12.9716, 77.5946];
  
  // Bengaluru bounds (Southwest and Northeast corners)
  const bengaluruBounds = L.latLngBounds(
    [12.7343, 77.3792], // Southwest
    [13.1737, 77.8470]  // Northeast
  );
  
  // Initialize map centered on Bengaluru with bounds restriction
  map = L.map('bengaluruMap', {
    center: bengaluruCenter,
    zoom: 11,
    minZoom: 11,
    maxZoom: 17,
    maxBounds: bengaluruBounds,
    maxBoundsViscosity: 1.0,
    zoomControl: true,
    attributionControl: false
  });
  
  // Dark themed tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
    noWrap: true
  }).addTo(map);
  
  // Fit map to Bengaluru bounds
  map.fitBounds(bengaluruBounds);
  map.setMaxBounds(bengaluruBounds);
  
  // Sample ward data with resolution rates
  const wardData = [
    { name: 'Koramangala (Ward 186)', lat: 12.9352, lng: 77.6245, resolved: 98, active: 8, total: 432 },
    { name: 'Indiranagar (Ward 154)', lat: 12.9716, lng: 77.6412, resolved: 96, active: 12, total: 398 },
    { name: 'Whitefield (Ward 92)', lat: 12.9698, lng: 77.7499, resolved: 92, active: 18, total: 356 },
    { name: 'Jayanagar (Ward 78)', lat: 12.9250, lng: 77.5838, resolved: 94, active: 15, total: 375 },
    { name: 'HSR Layout (Ward 110)', lat: 12.9121, lng: 77.6446, resolved: 91, active: 20, total: 341 },
    { name: 'HSR - Singasandra (Ward 159)', lat: 12.9108, lng: 77.6289, resolved: 65, active: 14, total: 223 },
    { name: 'Malleswaram (Ward 67)', lat: 13.0031, lng: 77.5703, resolved: 88, active: 22, total: 312 },
    { name: 'Electronic City (Ward 195)', lat: 12.8456, lng: 77.6603, resolved: 85, active: 28, total: 298 }
  ];
  
  // Filter out red markers (resolution rate below 60%)
  const visibleReports = wardData.filter(ward => {
    return ward.resolved >= 60;
  });
  
  // Add markers only for visible reports (green and yellow)
  visibleReports.forEach(ward => {
    const color = getMarkerColor(ward.resolved);
    const marker = L.circleMarker([ward.lat, ward.lng], {
      radius: 10,
      fillColor: color,
      color: color,
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.6
    }).addTo(map);
    
    marker.on('click', () => {
      updateWardStatistics(ward);
    });
    
    marker.bindPopup(`
      <div style="color: #fff; padding: 6px; font-family: 'Inter', sans-serif;">
        <strong style="font-size: 13px; display: block; margin-bottom: 4px;">${ward.name}</strong>
        <span style="color: ${color}; font-weight: 700; display: block; margin-bottom: 2px;">Resolution Rate: ${ward.resolved}%</span>
        <span style="display: block; opacity: 0.9;">Active Issues: ${ward.active}</span>
        <span style="display: block; opacity: 0.9;">Total Reports: ${ward.total}</span>
      </div>
    `);
    
    markers.push({ marker, data: ward });
  });
}

function getMarkerColor(resolved) {
  if (resolved >= 80) return '#22c55e'; // Green
  if (resolved >= 60) return '#f59e0b'; // Amber/Yellow
  return null; // No marker for red (below 60%)
}

function getStatusBadgeClass(resolved) {
  if (resolved >= 80) return 'green';
  if (resolved >= 60) return 'amber';
  return 'amber'; // Default to amber instead of red
}

function getStatusText(resolved) {
  if (resolved >= 80) return 'Green (Excellent)';
  if (resolved >= 60) return 'Amber (Good)';
  return 'Amber (Good)'; // Default to amber instead of red
}

function updateWardStatistics(ward) {
  const wardStats = document.getElementById('wardStats');
  const statusBadge = wardStats.querySelector('.status-badge');
  const wardName = wardStats.querySelector('.ward-name');
  const wardLocation = wardStats.querySelector('.ward-location');
  const progressValue = wardStats.querySelector('.progress-value');
  const progressFill = wardStats.querySelector('.progress-fill');
  const activeIssues = wardStats.querySelectorAll('.stat-value')[0];
  const resolvedIssues = wardStats.querySelectorAll('.stat-value')[1];
  const totalReports = wardStats.querySelectorAll('.stat-value')[2];
  const avgTime = wardStats.querySelectorAll('.stat-value')[3];
  
  // Update status badge
  const statusClass = getStatusBadgeClass(ward.resolved);
  const statusText = getStatusText(ward.resolved);
  statusBadge.className = `status-badge ${statusClass}`;
  statusBadge.textContent = statusText;
  
  // Update ward info
  wardName.textContent = ward.name;
  wardLocation.textContent = 'Bengaluru';
  
  // Update resolution rate
  progressValue.textContent = `${ward.resolved}%`;
  progressFill.style.width = `${ward.resolved}%`;
  
  // Update statistics
  activeIssues.textContent = ward.active;
  activeIssues.className = 'stat-value red';
  
  const resolvedCount = Math.floor((ward.total * ward.resolved) / 100);
  resolvedIssues.textContent = resolvedCount;
  resolvedIssues.className = 'stat-value green';
  
  totalReports.textContent = ward.total;
  totalReports.className = 'stat-value';
  
  const avgDays = (2 + Math.random() * 2).toFixed(1);
  avgTime.textContent = `${avgDays} Days`;
  avgTime.className = 'stat-value';
}

// Back to Overview Button
const backToOverviewBtn = document.getElementById('backToOverview');
if (backToOverviewBtn) {
  backToOverviewBtn.addEventListener('click', () => {
    if (map) {
      const bengaluruCenter = [12.9716, 77.5946];
      map.setView(bengaluruCenter, 11);
    }
  });
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('bengaluruMap');
  if (mapElement) {
    initMap();
  }
});

// Horizontal Showcase Slider for Mobile
const showcaseTrack = document.getElementById('showcaseTrack');

if (showcaseTrack && window.innerWidth <= 768) {
  let isDown = false;
  let startX;
  let scrollLeft;
  
  showcaseTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - showcaseTrack.offsetLeft;
    scrollLeft = showcaseTrack.scrollLeft;
  });
  
  showcaseTrack.addEventListener('mouseleave', () => {
    isDown = false;
  });
  
  showcaseTrack.addEventListener('mouseup', () => {
    isDown = false;
  });
  
  showcaseTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - showcaseTrack.offsetLeft;
    const walk = (x - startX) * 2;
    showcaseTrack.scrollLeft = scrollLeft - walk;
  });
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchScrollLeft = 0;
  
  showcaseTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX - showcaseTrack.offsetLeft;
    touchScrollLeft = showcaseTrack.scrollLeft;
  });
  
  showcaseTrack.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - showcaseTrack.offsetLeft;
    const walk = (x - touchStartX) * 2;
    showcaseTrack.scrollLeft = touchScrollLeft - walk;
  });
}

// Lazy Loading Images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Prevent horizontal overflow
function preventOverflow() {
  const body = document.body;
  const html = document.documentElement;
  
  if (body.scrollWidth > window.innerWidth) {
    console.warn('Horizontal overflow detected');
  }
}

window.addEventListener('load', preventOverflow);
window.addEventListener('resize', preventOverflow);

// Console Welcome Message
console.log('%cSpottix', 'color: #22c55e; font-size: 24px; font-weight: bold;');
console.log('%cReport. Track. Transform.', 'color: #94a3b8; font-size: 14px;');
console.log('%c© 2026 Spottix — Designed & Developed by Himalya NextGen', 'color: #64748b; font-size: 12px;');

// Accessibility: Keyboard Navigation
document.addEventListener('keydown', (e) => {
  // ESC key closes mobile menu
  if (e.key === 'Escape') {
    if (mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  }
});

// Add focus visible styles
document.addEventListener('mousedown', () => {
  document.body.classList.add('using-mouse');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.remove('using-mouse');
  }
});

// Performance: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  
  scrollTimeout = window.requestAnimationFrame(() => {
    // Additional scroll-based logic can go here
  });
}, { passive: true });

// Error Handling for Map
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Leaflet')) {
    console.error('Map initialization error. Please check Leaflet library.');
  }
});

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.querySelectorAll('.fade-up, .phone-mockup, .cta-phone').forEach(el => {
    el.style.animation = 'none';
  });
}

// Update copyright year dynamically
const copyrightYear = new Date().getFullYear();
const footerBottomText = document.querySelector('.footer-bottom p');
if (footerBottomText && copyrightYear > 2026) {
  footerBottomText.textContent = footerBottomText.textContent.replace('2026', copyrightYear);
}

// Analytics Ready Event
document.addEventListener('DOMContentLoaded', () => {
  console.log('Spottix landing page loaded successfully');
  
  // Track page load time for performance monitoring
  if (window.performance) {
    const loadTime = performance.now();
    console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
  }
});

// Service Worker Registration (if available)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('Service Worker registered'))
    //   .catch(err => console.log('Service Worker registration failed'));
  });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    animateCounter,
    formatNumber,
    getMarkerColor,
    updateWardStatistics
  };
}
