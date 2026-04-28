/**
 * GOKUL JEWELLERS — main.js
 * Custom cursor · Preloader · Page transitions · Hero slider
 * Sticky navbar · Counter animation · Gallery filter + Lightbox
 * FAQ accordion · Contact form · Scroll-to-top · Mobile nav
 */

/* ── On DOM Ready ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initPreloader();
  initNavbar();
  initMobileNav();
  initPageTransitions();
  initHeroSlider();
  initCounters();
  initScrollTop();
  initGallery();
  initFAQ();
  initContactForm();
  initAOS();
});

/* ── Custom Cursor ──────────────────────────────────────────── */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const animate = () => {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  };
  animate();

  // Hover effect on interactive elements
  const interactives = 'a, button, .col-card, .product-card, .gallery-item, .partner-card, .faq-question';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });

  // Hide cursor on touch devices
  document.documentElement.addEventListener('touchstart', () => {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }, { once: true });
}

/* ── Preloader ──────────────────────────────────────────────── */
function initPreloader() {
  const pl = document.getElementById('preloader');
  if (!pl) return;
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    pl.classList.add('done');
    document.body.style.overflow = '';
    // Trigger page reveal animation
    const overlay = document.getElementById('page-overlay');
    if (overlay) { overlay.classList.add('leaving'); setTimeout(() => overlay.classList.remove('leaving'), 600); }
  }, 2000);
}

/* ── Navbar ─────────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Active link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
}

/* ── Mobile Nav ─────────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn  = document.querySelector('.mobile-close');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const closeMob = () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; };
  if (closeBtn) closeBtn.addEventListener('click', closeMob);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));
}

/* ── Page Transitions ───────────────────────────────────────── */
function initPageTransitions() {
  const overlay = document.getElementById('page-overlay');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') || link.target) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.remove('leaving');
      overlay.classList.add('entering');
      setTimeout(() => window.location.href = href, 550);
    });
  });
}

/* ── Hero Slider ────────────────────────────────────────────── */
function initHeroSlider() {
  const slides    = document.querySelectorAll('.hero-slide');
  const dots      = document.querySelectorAll('.slider-dot');
  const prevBtn   = document.querySelector('.slider-prev');
  const nextBtn   = document.querySelector('.slider-next');
  const counterEl = document.querySelector('.counter-current');
  if (!slides.length) return;

  let current = 0;
  let timer;

  const go = (idx) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0');
  };

  const autoPlay = () => { timer = setInterval(() => go(current + 1), 5500); };
  const resetAuto = () => { clearInterval(timer); autoPlay(); };

  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); resetAuto(); }));
  prevBtn?.addEventListener('click', () => { go(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { go(current + 1); resetAuto(); });

  // Touch swipe
  let tsX = 0;
  const hero = document.querySelector('.hero-section');
  hero?.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const diff = tsX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? go(current + 1) : go(current - 1); resetAuto(); }
  });

  autoPlay();
}

/* ── Counter Animation ──────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count);
      const sfx = el.dataset.suffix || '';
      const pfx = el.dataset.prefix || '';
      let val = 0;
      const step = Math.max(1, Math.ceil(end / 70));
      const tick = setInterval(() => {
        val = Math.min(val + step, end);
        el.textContent = pfx + val.toLocaleString() + sfx;
        if (val >= end) clearInterval(tick);
      }, 22);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
}

/* ── Scroll to Top ──────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Gallery Filter + Lightbox ──────────────────────────────── */
function initGallery() {
  /* Filter */
  const filterBtns = document.querySelectorAll('.gf-btn');
  const items      = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        if (show) {
          item.classList.remove('hidden');
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => item.classList.add('hidden'), 350);
        }
      });
    });
  });

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbImg     = lightbox.querySelector('.lightbox-img');
  const lbCap     = lightbox.querySelector('.lightbox-caption');
  const lbClose   = lightbox.querySelector('.lightbox-close');
  const lbPrev    = lightbox.querySelector('.lightbox-prev');
  const lbNext    = lightbox.querySelector('.lightbox-next');

  let current = 0;
  const visible = () => [...document.querySelectorAll('.gallery-item:not(.hidden)')];

  const open = idx => {
    current = idx;
    const list = visible();
    const item = list[idx];
    if (!item) return;
    lbImg.src = item.querySelector('img').src;
    lbCap.textContent = item.dataset.cap || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const close = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
  const nav   = d  => { const l = visible(); current = (current + d + l.length) % l.length; open(current); };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const list = visible();
      const idx  = list.indexOf(item);
      open(idx >= 0 ? idx : 0);
    });
  });

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  lbPrev?.addEventListener('click', () => nav(-1));
  lbNext?.addEventListener('click', () => nav(1));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });
}

/* ── FAQ Accordion ──────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Contact Form ───────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Sending…';
    btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      const s = document.querySelector('.form-success');
      if (s) s.style.display = 'block';
    }, 1600);
  });
}

/* ── AOS Init ───────────────────────────────────────────────── */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 850, easing: 'ease-out-cubic', once: true, offset: 50, delay: 0 });
  }
}
