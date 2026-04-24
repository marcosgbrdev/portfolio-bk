/* ============================================================
   MARCOS BK — PORTFÓLIO SISTEMA
   Script Principal — 2026
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {


  // ==========================================================
  // 1. NEURAL NETWORK CANVAS ANIMATION
  // ==========================================================

  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let pulses = [];
  let canvasW, canvasH;
  let animFrameId;

  function initCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;

    const count = canvasW < 768 ? 35 : 65;
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.8,
        baseOpacity: Math.random() * 0.35 + 0.1
      });
    }

    pulses = [];
  }

  function spawnPulse() {
    const maxDist = 180;
    for (let attempts = 0; attempts < 15; attempts++) {
      const a = Math.floor(Math.random() * particles.length);
      const b = Math.floor(Math.random() * particles.length);
      if (a === b) continue;

      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        pulses.push({
          from: a,
          to: b,
          progress: 0,
          speed: 0.012 + Math.random() * 0.01
        });
        break;
      }
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    const maxDist = 150;
    const accentR = 100, accentG = 130, accentB = 255;

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.1;
          ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.baseOpacity})`;
      ctx.fill();

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = canvasW + 10;
      if (p.x > canvasW + 10) p.x = -10;
      if (p.y < -10) p.y = canvasH + 10;
      if (p.y > canvasH + 10) p.y = -10;
    }

    // Draw data pulses
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
      const fade = 1 - pulse.progress;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${0.15 * fade})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${0.7 * fade})`;
      ctx.fill();
    }

    // Spawn pulses randomly
    if (pulses.length < 4 && Math.random() < 0.008) {
      spawnPulse();
    }

    animFrameId = requestAnimationFrame(drawNetwork);
  }

  // Only run canvas when hero is in viewport
  let heroVisible = true;
  function startCanvas() {
    if (!animFrameId) {
      drawNetwork();
    }
  }
  function stopCanvas() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  initCanvas();
  startCanvas();

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initCanvas();
    }, 200);
  });

  // Pause canvas when hero is not visible (performance)
  const heroSection = document.getElementById('hero');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroVisible = true;
        startCanvas();
      } else {
        heroVisible = false;
        stopCanvas();
      }
    });
  }, { threshold: 0.05 });
  heroObserver.observe(heroSection);


  // ==========================================================
  // 2. SCROLL REVEAL ANIMATION
  // ==========================================================

  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Calculate stagger delay based on siblings
        const parent = entry.target.parentElement;
        const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [];
        const index = Array.from(siblings).indexOf(entry.target);
        const delay = index >= 0 ? index * 0.1 : 0;

        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================================
  // 3. MOUSE-FOLLOWING CARD GLOW
  // ==========================================================

  const systemCards = document.querySelectorAll('.system-card');

  systemCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // ==========================================================
  // 4. FLOATING NAV — SCROLL BEHAVIOR
  // ==========================================================

  const floatingNav = document.getElementById('floatingNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      floatingNav.classList.add('scrolled');
    } else {
      floatingNav.classList.remove('scrolled');
    }
  });


  // ==========================================================
  // 5. NAV — SCROLL SPY
  // ==========================================================

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 150;

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
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();


  // ==========================================================
  // 6. MOBILE MENU
  // ==========================================================

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    const isActive = mobileOverlay.classList.contains('active');

    if (isActive) {
      mobileOverlay.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      mobileOverlay.classList.add('active');
      mobileMenuBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
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
  // 7. HERO — INITIAL REVEAL SEQUENCE
  // ==========================================================

  const heroReveals = document.querySelectorAll('.hero-content .reveal');

  // Force hero reveals to happen immediately with stagger
  setTimeout(() => {
    heroReveals.forEach((el, i) => {
      el.style.transitionDelay = `${0.3 + i * 0.15}s`;
      el.classList.add('visible');
    });
  }, 100);


});