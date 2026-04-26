/* ============================================================
   MARCOS BK — PORTFÓLIO SISTEMA
   Script Principal — Premium 2026
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {


  // ==========================================================
  // 1. NEURAL NETWORK CANVAS — AMBIENT INTELLIGENCE
  // ==========================================================

  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let pulses = [];
  let canvasW, canvasH;
  let animFrameId = null;
  let mouseX = -1000, mouseY = -1000;

  function initCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;

    const density = canvasW < 768 ? 28 : canvasW < 1200 ? 45 : 55;
    particles = [];

    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.5,
        baseOpacity: Math.random() * 0.2 + 0.04
      });
    }

    pulses = [];
  }

  function spawnPulse() {
    const maxDist = 150;
    for (let attempts = 0; attempts < 20; attempts++) {
      const a = Math.floor(Math.random() * particles.length);
      const b = Math.floor(Math.random() * particles.length);
      if (a === b) continue;

      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist && dist > 40) {
        pulses.push({
          from: a,
          to: b,
          progress: 0,
          speed: 0.006 + Math.random() * 0.006
        });
        break;
      }
    }
  }

  // Accent: #3B82F6 → rgb(59, 130, 246)
  const accentR = 59, accentG = 130, accentB = 246;

  function drawNetwork() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    const maxDist = 130;

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.05;
          ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${opacity})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion — gentle push
      const dmx = p.x - mouseX;
      const dmy = p.y - mouseY;
      const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
      if (mouseDist < 100 && mouseDist > 0) {
        const force = (1 - mouseDist / 100) * 0.3;
        p.vx += (dmx / mouseDist) * force;
        p.vy += (dmy / mouseDist) * force;
      }

      // Apply friction
      p.vx *= 0.996;
      p.vy *= 0.996;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.baseOpacity})`;
      ctx.fill();

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Soft wrap
      if (p.x < -20) p.x = canvasW + 20;
      if (p.x > canvasW + 20) p.x = -20;
      if (p.y < -20) p.y = canvasH + 20;
      if (p.y > canvasH + 20) p.y = -20;
    }

    // Data pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1) {
        pulses.splice(i, 1);
        continue;
      }

      const from = particles[pulse.from];
      const to = particles[pulse.to];
      const x = from.x + (to.x - from.x) * pulse.progress;
      const y = from.y + (to.y - from.y) * pulse.progress;
      const fade = Math.sin(pulse.progress * Math.PI);

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${0.06 * fade})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${0.4 * fade})`;
      ctx.fill();
    }

    // Spawn pulses naturally
    if (pulses.length < 3 && Math.random() < 0.004) {
      spawnPulse();
    }

    animFrameId = requestAnimationFrame(drawNetwork);
  }

  // Canvas lifecycle
  function startCanvas() {
    if (!animFrameId) drawNetwork();
  }
  function stopCanvas() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  initCanvas();
  startCanvas();

  // Mouse interactivity on hero
  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  heroSection.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Resize with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCanvas, 250);
  });

  // Pause when hero is offscreen
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.isIntersecting ? startCanvas() : stopCanvas();
    });
  }, { threshold: 0.02 });
  heroObserver.observe(heroSection);


  // ==========================================================
  // 2. SCROLL REVEAL — STAGGERED ENTRANCE
  // ==========================================================

  const allRevealElements = document.querySelectorAll('.reveal');
  const heroRevealSet = new Set(document.querySelectorAll('.hero-content .reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [];
        const index = Array.from(siblings).indexOf(entry.target);
        const delay = index >= 0 ? index * 0.12 : 0;

        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  // Observe only NON-hero reveals (hero has its own cinematic sequence)
  allRevealElements.forEach(el => {
    if (!heroRevealSet.has(el)) {
      revealObserver.observe(el);
    }
  });


  // ==========================================================
  // 3. MOUSE-FOLLOWING CARD GLOW
  // ==========================================================

  const glowCards = document.querySelectorAll('.system-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });


  // ==========================================================
  // 4. NAV — SCROLL STATE
  // ==========================================================

  const floatingNav = document.getElementById('floatingNav');
  let ticking = false;

  function onNavScroll() {
    if (window.scrollY > 60) {
      floatingNav.classList.add('scrolled');
    } else {
      floatingNav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onNavScroll);
      ticking = true;
    }
  });


  // ==========================================================
  // 5. NAV — SCROLL SPY
  // ==========================================================

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let spyTicking = false;

  function updateActiveNav() {
    const scrollY = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });

    spyTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!spyTicking) {
      requestAnimationFrame(updateActiveNav);
      spyTicking = true;
    }
  });

  updateActiveNav();


  // ==========================================================
  // 6. MOBILE MENU
  // ==========================================================

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    const opening = !mobileOverlay.classList.contains('active');
    mobileOverlay.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    document.body.style.overflow = opening ? 'hidden' : '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // ==========================================================
  // 7. HERO — CINEMATIC ENTRANCE SEQUENCE
  // ==========================================================

  const heroReveals = document.querySelectorAll('.hero-content .reveal');

  // Text reveals first, then photo fades in last
  setTimeout(() => {
    heroReveals.forEach((el, i) => {
      el.style.transitionDelay = `${0.4 + i * 0.18}s`;
      el.classList.add('visible');
    });
  }, 150);


});