(() => {
  const WHATSAPP_NUMBER = "94755716581"; // +94 75 571 6581, no + or spaces

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('siteNav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.classList.remove('open');
  }));

  /* ---------- Hero parallax botanicals + product tilt ---------- */
  const heroParallax = document.getElementById('heroParallax');
  const heroProductImg = document.querySelector('.hero__product-img');
  const hero = document.querySelector('.hero');

  if (window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w) - 0.5;
      const y = (e.clientY / h) - 0.5;

      heroParallax.querySelectorAll('.doodle').forEach(d => {
        const speed = parseFloat(d.dataset.speed) || 20;
        d.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });

      if (heroProductImg) {
        heroProductImg.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.about__grid, .shop__intro, .product-card, .process__step, .scrapbook__item, .postcard, .garden, .cta__inner'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('about__grid')) {
          const media = entry.target.querySelector('.about__media');
          if (media) setTimeout(() => media.classList.add('grown'), 300);
        }
      }
    });
  }, { threshold: 0.18 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- Product cards: click-to-flip on touch, hover on desktop (css handles hover) ---------- */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // only toggle flip if not the buy button
      if (e.target.closest('.product-card__buy')) return;
      if (window.matchMedia('(pointer: coarse)').matches) {
        card.classList.toggle('flipped');
      }
    });

    // subtle 3D tilt on desktop hover
    const front = card.querySelector('.product-card__face--front');
    card.addEventListener('mousemove', (e) => {
      if (!window.matchMedia('(pointer: fine)').matches) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tiltX', `${py * -6}deg`);
      card.style.setProperty('--tiltY', `${px * 6}deg`);
      card.style.transform = `rotate(${px * 1.5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Add to bag -> WhatsApp ---------- */
  let bagCount = 0;
  const bagCountEl = document.getElementById('bagCount');
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  document.querySelectorAll('.product-card__buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const name = card.dataset.name;
      const price = card.dataset.price;

      bagCount += 1;
      bagCountEl.textContent = bagCount;
      bagCountEl.classList.add('show');

      showToast(`✿ ${name} added — opening WhatsApp…`);

      const message = `Hi Velora! ✿ I'd love to order the ${name} (LKR ${price}). Could you help me with the details?`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      setTimeout(() => {
        window.open(url, '_blank', 'noopener');
      }, 500);
    });
  });

  /* ---------- Ingredient garden ---------- */
  const ingredientCard = document.getElementById('ingredientCard');
  const ingredientTitle = document.getElementById('ingredientCardTitle');
  const ingredientDesc = document.getElementById('ingredientCardDesc');
  const ingredientClose = document.getElementById('ingredientClose');
  const garden = document.getElementById('garden');

  const gardenObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) garden.classList.add('in-view');
    });
  }, { threshold: 0.2 });
  if (garden) gardenObserver.observe(garden);

  document.querySelectorAll('.ingredient').forEach(btn => {
    btn.addEventListener('click', () => {
      ingredientTitle.textContent = btn.dataset.title;
      ingredientDesc.textContent = btn.dataset.desc;
      ingredientCard.classList.add('show');
    });
  });
  if (ingredientClose) {
    ingredientClose.addEventListener('click', () => ingredientCard.classList.remove('show'));
  }

  /* ---------- Sparkle trail (desktop only, lightweight) ---------- */
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas && window.matchMedia('(pointer: fine)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let lastSpawn = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSpawn < 60) return; // throttle spawn rate
      lastSpawn = now;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        size: 3 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 0.6,
        color: Math.random() > 0.5 ? '232,200,121' : '227,165,174'
      });
      if (particles.length > 40) particles.shift();
    });

    function drawStar(x, y, size, opacity, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = `rgba(${color},1)`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(size * 0.2, size * 0.2, size, 0);
        ctx.quadraticCurveTo(size * 0.2, -size * 0.2, 0, 0);
      }
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.life -= 0.02;
        p.y -= 0.4;
        p.x += p.drift;
        if (p.life > 0) drawStar(p.x, p.y, p.size * p.life * 2, p.life, p.color);
      });
      particles = particles.filter(p => p.life > 0);
      requestAnimationFrame(tick);
    }
    tick();
  }
})();
