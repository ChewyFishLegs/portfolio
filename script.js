/* ═══════════════════════════════════════════════
   PORTFOLIO — script.js
   Features:
     • Custom cursor
     • Dark / light mode (persisted to localStorage)
     • Mobile nav toggle
     • Scroll-based nav highlight & shrink
     • Scroll reveal animations
     • Hero canvas particle effect
     • Counter animation
     • GitHub API fetch
     • Contact form validation + success state
═══════════════════════════════════════════════ */

/* ── THEME ────────────────────────────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☽' : '☀';
  localStorage.setItem('portfolio-theme', theme);
}

(function initTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || preferred);
})();

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* ── CUSTOM CURSOR ────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card, .repo-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  });
});

/* ── MOBILE NAV ───────────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  burger.classList.toggle('open', menuOpen);
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── NAV SCROLL EFFECTS ─────────────────────────── */
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
  // Sticky shrink
  nav.classList.toggle('scrolled', window.scrollY > 50);

  // Active section highlighting
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── CANVAS STAR FIELD + PIXEL PLANETS ───────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [], shootingStars = [];
  const STAR_COUNT = 180;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const STAR_COLORS = [
    'rgba(77,159,255,',
    'rgba(155,109,255,',
    'rgba(220,225,255,',
    'rgba(130,191,255,',
  ];

  class Star {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x      = Math.random() * W;
      this.y      = initial ? Math.random() * H : Math.random() * H * 0.7;
      this.r      = Math.random() * 1.8 + 0.3;
      this.color  = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      this.baseA  = Math.random() * 0.6 + 0.2;
      this.a      = this.baseA;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDir   = Math.random() > 0.5 ? 1 : -1;
      this.vy     = Math.random() * 0.05 + 0.01;
    }
    update() {
      this.a += this.twinkleSpeed * this.twinkleDir;
      if (this.a > this.baseA + 0.3 || this.a < this.baseA - 0.2) this.twinkleDir *= -1;
      this.a = Math.max(0.05, Math.min(0.95, this.a));
      this.y += this.vy;
      if (this.y > H) this.reset(false);
    }
    draw() {
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grd.addColorStop(0, this.color + this.a + ')');
      grd.addColorStop(1, this.color + '0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.a + ')';
      ctx.fill();
    }
  }

  class ShootingStar {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W * 0.7;
      this.y     = Math.random() * H * 0.4;
      this.len   = Math.random() * 120 + 60;
      this.speed = Math.random() * 6 + 4;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      this.a     = 1;
      this.active = false;
      this.timer  = Math.random() * 400 + 200;
    }
    update() {
      if (!this.active) { this.timer--; if (this.timer <= 0) this.active = true; return; }
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.a -= 0.025;
      if (this.a <= 0) this.reset();
    }
    draw() {
      if (!this.active) return;
      const tx = this.x - Math.cos(this.angle) * this.len;
      const ty = this.y - Math.sin(this.angle) * this.len;
      const grd = ctx.createLinearGradient(tx, ty, this.x, this.y);
      grd.addColorStop(0, `rgba(255,255,255,0)`);
      grd.addColorStop(1, `rgba(180,210,255,${this.a})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // ── PIXEL ART PLANETS ──────────────────────────
  const PIXEL = 4; // pixel size

  function drawPixelCircle(cx, cy, radius, colorFn) {
    for (let py = -radius; py <= radius; py++) {
      for (let px = -radius; px <= radius; px++) {
        const dist = Math.sqrt(px * px + py * py);
        if (dist <= radius) {
          const color = colorFn(px, py, dist, radius);
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(
              Math.round(cx + px * PIXEL),
              Math.round(cy + py * PIXEL),
              PIXEL, PIXEL
            );
          }
        }
      }
    }
  }

 // ── PLANETS ────────────────────────────────────
  const planets = [
    {
      getX: () => W * 0.12,
      getY: () => H * 0.18,
      radius: 45,
      draw(cx, cy) {
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(77,159,255,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    {
      // With ring
      getX: () => W * 0.88,
      getY: () => H * 0.22,
      radius: 55,
      draw(cx, cy) {
        // Ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.25);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 1.7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(155,109,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        // Planet
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(155,109,255,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    {
      getX: () => W * 0.07,
      getY: () => H * 0.75,
      radius: 28,
      draw(cx, cy) {
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(40,200,220,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  ];

  for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
  for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Draw planets first (behind stars)
    planets.forEach(p => p.draw(p.getX(), p.getY()));
    stars.forEach(s => { s.update(); s.draw(); });
    shootingStars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── FADE-UP ON LOAD ──────────────────────────── */
window.addEventListener('load', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), delay + 200);
  });
});

/* ── SCROLL REVEAL ────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Also reveal children if any
      entry.target.querySelectorAll('.reveal-child').forEach(child => {
        child.classList.add('visible');
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── COUNTER ANIMATION ────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-strip').forEach(el => counterObserver.observe(el));

/* ── GITHUB API ───────────────────────────────── */
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572a5',
  PHP:        '#4f5d95',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Vue:        '#41b883',
  Java:       '#b07219',
  C:          '#555555',
  'C++':      '#f34b7d',
  Go:         '#00add8',
  Rust:       '#dea584',
  Ruby:       '#701516',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#8b949e';
}

function repoCardHTML(repo, index) {
  const desc  = repo.description || 'No description provided.';
  const lang  = repo.language || '';
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const color = getLangColor(lang);

  return `
    <a href="${repo.html_url}" target="_blank" rel="noopener" 
       class="repo-card" style="animation-delay: ${index * 60}ms; text-decoration: none;">
      <div class="repo-header">
        <span class="repo-name">${repo.name}</span>
        <span class="repo-icon">📦</span>
      </div>
      <p class="repo-desc">${desc}</p>
      <div class="repo-meta">
        ${lang ? `
          <span class="repo-lang">
            <span class="lang-dot" style="background:${color}"></span>
            ${lang}
          </span>` : ''}
        <span class="repo-stars">★ ${stars}</span>
        <span class="repo-forks">⑂ ${forks}</span>
      </div>
    </a>`;
}

async function fetchRepos(username) {
  const grid = document.getElementById('reposGrid');
  grid.innerHTML = `
    <div class="repos-placeholder">
      <div class="loader-dots"><span></span><span></span><span></span></div>
      <p>Fetching @${username}'s repos…</p>
    </div>`;

  try {
    const res  = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`
    );

    if (res.status === 404) {
      throw new Error(`User "${username}" not found on GitHub.`);
    }
    if (res.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Try again in a minute.');
    }
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json();
    if (!repos.length) {
      grid.innerHTML = `<div class="repos-error">No public repositories found for @${username}.</div>`;
      return;
    }

    // Sort by stars, then updated
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    grid.innerHTML = repos.map((r, i) => repoCardHTML(r, i)).join('');

    // Re-register hover listeners for cursor
    grid.querySelectorAll('.repo-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      card.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

  } catch (err) {
    grid.innerHTML = `<div class="repos-error">⚠ ${err.message}</div>`;
  }
}

// Auto-fetch on page load
fetchRepos(document.getElementById('ghUsername').value.trim());

document.getElementById('ghFetch').addEventListener('click', () => {
  const username = document.getElementById('ghUsername').value.trim();
  if (username) fetchRepos(username);
});

document.getElementById('ghUsername').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const username = e.target.value.trim();
    if (username) fetchRepos(username);
  }
});

/* ── CONTACT FORM ─────────────────────────────── */
const form       = document.getElementById('contactForm');
const nameEl     = document.getElementById('name');
const emailEl    = document.getElementById('email');
const messageEl  = document.getElementById('message');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

function setError(inputEl, errorElId, msg) {
  const errEl = document.getElementById(errorElId);
  if (msg) {
    inputEl.classList.add('error');
    errEl.textContent = msg;
  } else {
    inputEl.classList.remove('error');
    errEl.textContent = '';
  }
}

function validateField(input) {
  const val = input.value.trim();
  if (input.id === 'name') {
    setError(input, 'nameError', val.length < 2 ? 'Name must be at least 2 characters.' : '');
    return val.length >= 2;
  }
  if (input.id === 'email') {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setError(input, 'emailError', !valid ? 'Please enter a valid email address.' : '');
    return valid;
  }
  if (input.id === 'message') {
    setError(input, 'messageError', val.length < 10 ? 'Message must be at least 10 characters.' : '');
    return val.length >= 10;
  }
  return true;
}

// Live validation on blur
[nameEl, emailEl, messageEl].forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) validateField(input);
  });
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  const nameOk    = validateField(nameEl);
  const emailOk   = validateField(emailEl);
  const messageOk = validateField(messageEl);

  if (!nameOk || !emailOk || !messageOk) return;

  // Simulate sending
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  submitBtn.querySelector('.btn-text').textContent = 'Sending';

  await new Promise(r => setTimeout(r, 1400));

  submitBtn.disabled = false;
  submitBtn.classList.remove('loading');
  submitBtn.querySelector('.btn-text').textContent = 'Send Message';

  form.reset();
  [nameEl, emailEl, messageEl].forEach(el => el.classList.remove('error'));

  successMsg.classList.add('show');
  setTimeout(() => successMsg.classList.remove('show'), 5000);
});

/* ── SMOOTH SCROLL ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});