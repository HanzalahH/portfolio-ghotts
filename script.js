(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ NAVBAR SCROLL + SCROLLSPY ============ */
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .section, .hero'));

  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    var scrollPos = window.scrollY + 120;
    sections.forEach(function (sec) {
      if (!sec.id) return;
      var top = sec.offsetTop, bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id); });
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ MOBILE MENU ============ */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', function () {
    var open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============ CUSTOM CURSOR ============ */
  var cursor = document.getElementById('scanCursor');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, input, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('active'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('active'); });
    });
  }

  /* ============ TERMINAL TYPE EFFECT ============ */
  var typedLine = document.getElementById('typedLine');
  var termOutput = document.getElementById('termOutput');
  var outputLines = [
    'Syed Hanzala Hussain',
    'Application Penetration Tester',
    'Access Level: Offensive Security',
    'Status: Available for engagements'
  ];

  function typeText(el, text, speed, cb) {
    var i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (cb) cb();
    })();
  }

  function runTerminal() {
    typeText(typedLine, 'whoami', reduceMotion ? 0 : 90, function () {
      setTimeout(function () {
        var idx = 0;
        function nextLine() {
          if (idx >= outputLines.length) return;
          var span = document.createElement('span');
          span.className = 'out-line' + (idx === outputLines.length - 1 ? ' access' : '');
          span.textContent = '> ' + outputLines[idx];
          termOutput.appendChild(span);
          idx++;
          setTimeout(nextLine, reduceMotion ? 0 : 380);
        }
        nextLine();
      }, 300);
    });
  }
  if (reduceMotion) {
    typedLine.textContent = 'whoami';
    outputLines.forEach(function (t, i) {
      var span = document.createElement('span');
      span.className = 'out-line' + (i === outputLines.length - 1 ? ' access' : '');
      span.style.opacity = '1';
      span.textContent = '> ' + t;
      termOutput.appendChild(span);
    });
  } else {
    runTerminal();
  }

  /* ============ MATRIX CANVAS BACKGROUND ============ */
  var canvas = document.getElementById('matrixCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var fontSize = 15;
    var columns, drops;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>/\\';

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(1);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function draw() {
      ctx.fillStyle = 'rgba(10,14,15,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.94 ? '#39ff14' : '#00fff2';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    setInterval(draw, 55);
  }

  /* ============ AMBIENT SECTION BACKGROUNDS (cursor spotlight + scroll parallax) ============ */
  var bgSections = Array.prototype.slice.call(document.querySelectorAll('main .section'));
  if (!reduceMotion && bgSections.length) {
    bgSections.forEach(function (sec) {
      sec.addEventListener('mousemove', function (e) {
        var rect = sec.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        sec.style.setProperty('--mx', mx + '%');
        sec.style.setProperty('--my', my + '%');
      });
    });

    var updateSectionParallax = function () {
      var vh = window.innerHeight;
      bgSections.forEach(function (sec) {
        var rect = sec.getBoundingClientRect();
        var progress = (vh - rect.top) / (vh + rect.height);
        var shift = (progress - 0.5) * 50;
        sec.style.setProperty('--parallax', shift.toFixed(1) + 'px');
      });
    };
    window.addEventListener('scroll', updateSectionParallax, { passive: true });
    window.addEventListener('resize', updateSectionParallax);
    updateSectionParallax();
  }

  /* ============ SCROLL REVEAL (IntersectionObserver) ============ */
  var revealEls = document.querySelectorAll('.reveal-up, .cert-card, .timeline-item, .honor-badge');
  revealEls.forEach(function (el) { el.classList.add('reveal-up'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal-up').forEach(function (el) { io.observe(el); });

  /* ============ DECRYPT / SCRAMBLE HEADING REVEAL ============ */
  var SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#$%01';
  function scrambleReveal(el) {
    var finalText = el.getAttribute('data-decrypt') || el.textContent;
    var length = finalText.length;
    var frame = 0;
    var maxFrames = reduceMotion ? 1 : 18;

    if (reduceMotion) { el.textContent = finalText; return; }

    var interval = setInterval(function () {
      var out = '';
      for (var i = 0; i < length; i++) {
        if (i < (frame / maxFrames) * length) {
          out += finalText[i];
        } else {
          out += finalText[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = out;
      frame++;
      if (frame > maxFrames) {
        el.textContent = finalText;
        clearInterval(interval);
      }
    }, 30);
  }

  var headings = document.querySelectorAll('[data-decrypt]');
  var headingIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        scrambleReveal(entry.target);
        headingIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  headings.forEach(function (h) { headingIO.observe(h); });

  /* ============ SKILL BARS ============ */
  var skillFills = document.querySelectorAll('.skill-fill');
  var skillIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.width = el.getAttribute('data-width') + '%';
        skillIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(function (el) { skillIO.observe(el); });

  /* ============ RADAR CHART (self-drawing SVG) ============ */
  var radarData = [
    { label: 'Web AppSec', value: 95 },
    { label: 'Cloud Sec', value: 85 },
    { label: 'Cloud PT', value: 85 },
    { label: 'Mobile Sec', value: 80 },
    { label: 'API Sec', value: 90 },
    { label: 'Biz Logic', value: 92 },
    { label: 'Enterprise', value: 88 }
  ];

  function buildRadar() {
    var svg = document.getElementById('radarChart');
    if (!svg) return;
    var size = 320, center = size / 2, maxR = 120;
    var n = radarData.length;
    var ns = 'http://www.w3.org/2000/svg';

    function pointFor(i, r) {
      var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
    }

    // grid rings
    [0.25, 0.5, 0.75, 1].forEach(function (frac) {
      var pts = [];
      for (var i = 0; i < n; i++) pts.push(pointFor(i, maxR * frac).join(','));
      var poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', 'rgba(0,255,242,0.15)');
      svg.appendChild(poly);
    });

    // spokes + labels
    for (var i = 0; i < n; i++) {
      var p = pointFor(i, maxR);
      var line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', center); line.setAttribute('y1', center);
      line.setAttribute('x2', p[0]); line.setAttribute('y2', p[1]);
      line.setAttribute('stroke', 'rgba(0,255,242,0.15)');
      svg.appendChild(line);

      var lp = pointFor(i, maxR + 22);
      var text = document.createElementNS(ns, 'text');
      text.setAttribute('x', lp[0]); text.setAttribute('y', lp[1]);
      text.setAttribute('fill', '#9db3b0');
      text.setAttribute('font-size', '9');
      text.setAttribute('font-family', 'JetBrains Mono, monospace');
      text.setAttribute('text-anchor', 'middle');
      text.textContent = radarData[i].label;
      svg.appendChild(text);
    }

    // data polygon (animated draw)
    var dataPoly = document.createElementNS(ns, 'polygon');
    dataPoly.setAttribute('fill', 'rgba(0,255,242,0.15)');
    dataPoly.setAttribute('stroke', '#00fff2');
    dataPoly.setAttribute('stroke-width', '2');
    dataPoly.style.transformOrigin = center + 'px ' + center + 'px';
    dataPoly.style.transform = 'scale(0)';
    dataPoly.style.transition = reduceMotion ? 'none' : 'transform 1s cubic-bezier(.16,1,.3,1)';
    var dataPts = [];
    for (var j = 0; j < n; j++) {
      var r = (radarData[j].value / 100) * maxR;
      dataPts.push(pointFor(j, r).join(','));
    }
    dataPoly.setAttribute('points', dataPts.join(' '));
    svg.appendChild(dataPoly);

    var radarIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          requestAnimationFrame(function () { dataPoly.style.transform = 'scale(1)'; });
          radarIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    radarIO.observe(svg);
  }
  buildRadar();

  /* ============ CONTACT FORM (AJAX Netlify Forms) ============ */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new URLSearchParams(new FormData(contactForm)).toString();
      formStatus.textContent = 'Transmitting...';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      }).then(function (res) {
        if (res.ok) {
          formStatus.textContent = '> Message sent. Standing by for response.';
          contactForm.reset();
        } else {
          formStatus.textContent = '> Transmission failed. Please email directly.';
        }
      }).catch(function () {
        formStatus.textContent = '> Transmission failed. Please email directly.';
      });
    });
  }

  /* ============ BACK TO TOP ============ */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============ FOOTER YEAR ============ */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ KONAMI CODE EASTER EGG ============ */
  var konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var konamiPos = 0;
  var toast = document.getElementById('konamiToast');
  window.addEventListener('keydown', function (e) {
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konamiSeq[konamiPos]) {
      konamiPos++;
      if (konamiPos === konamiSeq.length) {
        konamiPos = 0;
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 3200);
      }
    } else {
      konamiPos = (key === konamiSeq[0]) ? 1 : 0;
    }
  });

/* =============================================================
   GSAP CYBERPUNK ANIMATIONS
   ============================================================= */
(function () {
  // Bail out if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Register ScrollTrigger globally
  gsap.registerPlugin(ScrollTrigger);

  /* -------------------------------------------------
     1️⃣ SKILLS SECTION – neon bar fill + scanline + count‑up
     ------------------------------------------------- */
  function initSkills() {
    const bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;

    bars.forEach(bar => {
      const targetWidth = parseFloat(bar.getAttribute('data-width')) || 0;

      // Wrapper for scanline overlay
      const wrapper = bar.parentElement;
      if (!wrapper.classList.contains('skill-track')) {
        const track = document.createElement('div');
        track.className = 'skill-track';
        track.innerHTML = '<div class="skill-fill" data-width="' + targetWidth + '"></div><div class="scanline"></div>';
        wrapper.replaceChild(track, bar);
        // Re‑reference the new fill element
        const newFill = track.querySelector('.skill-fill');
        bar = newFill;
      }

      // Animate width with glow
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: targetWidth + '%',
          ease: 'power3.out',
          duration: 1.5,
          scrollTrigger: {
            trigger: bar,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            // optional: add a subtle neon glow while animating
            bar.classList.toggle('neon-glow', bar.style.width !== '0%');
          }
        }
      );

      // Scanline animation (pure CSS, just ensure element exists)
      const scan = wrapper.querySelector('.scanline');
      if (scan) scan.classList.add('scanline');
    });

    // Count‑up numbers (stats) – same logic as skill bars
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(num => {
      const target = parseFloat(num.textContent) || 0;
      num.textContent = '0';
      gsap.fromTo(
        num,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: num,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          snap: { innerText: 1 },
          onUpdate: function () {
            num.textContent = Math.round(this.target.innerText);
          }
        }
      );
    });
  }

  /* -------------------------------------------------
     2️⃣ CERTIFICATIONS SECTION – flip card + pulse glow + stagger
     ------------------------------------------------- */
  function initCertifications() {
    const cards = document.querySelectorAll('.cert-card');
    if (!cards.length) return;

    cards.forEach(card => {
      // Wrap inner content for flip effect
      const inner = card.querySelector('.cert-card-inner');
      if (!inner) return;

      // Build flip markup
      const front = inner.cloneNode(true);
      const back = document.createElement('div');
      back.className = 'cert-card-inner flip-card__back';
      back.innerHTML = `<div class="cert-badge-img"><div class="cert-fallback" aria-hidden="true">${card.dataset.backup || '??'}</div></div>
                        <h3 class="cert-name">${card.querySelector('.cert-name')?.textContent || ''}</h3>
                        <p class="cert-issuer">${card.querySelector('.cert-issuer')?.textContent || ''}</p>`;

      // Replace inner with flip container
      const flipWrapper = document.createElement('div');
      flipWrapper.className = 'flip-card';
      flipWrapper.appendChild(front);
      flipWrapper.appendChild(back);
      card.innerHTML = ''; // clear
      card.appendChild(flipWrapper);

      // Hover flip + pulse glow
      flipWrapper.addEventListener('mouseenter', () => {
        flipWrapper.classList.add('flipped');
        flipWrapper.classList.add('pulse-glow');
      });
      flipWrapper.addEventListener('mouseleave', () => {
        flipWrapper.classList.remove('flipped');
        flipWrapper.classList.remove('pulse-glow');
      });

      // Staggered pop‑in on scroll
      gsap.fromTo(
        flipWrapper,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: flipWrapper,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }

  /* -------------------------------------------------
     3️⃣ EXPERIENCE TIMELINE – line draw, alternate slide, pulse dots
     ------------------------------------------------- */
  function initExperience() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const line = timeline.querySelector('.timeline-line');
    if (line) {
      // Draw line from top to bottom on scroll
      gsap.fromTo(
        line,
        { height: '0%' },
        {
          height: '100%',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timeline,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          }
        }
      );
    }

    const items = timeline.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      const direction = i % 2 === 0 ? '-100%' : '100%'; // left/right alternate
      gsap.fromTo(
        item,
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Pulse the node (dot)
      const node = item.querySelector('.timeline-node');
      if (node) {
        node.classList.add('pulse-glow');
      }
    });
  }

  /* -------------------------------------------------
     4️⃣ ABOUT ME – typewriter, glitch words, count‑up stats, scan reveal
     ------------------------------------------------- */
  function initAbout() {
    const intro = document.querySelector('.hero-oneliner');
    if (intro) {
      const fullText = intro.textContent.trim();
      intro.textContent = '';
      const chars = [...fullText];

      gsap.to(chars, {
        duration: 0.05,
        stagger: 0.05,
        onUpdate: function () {
          intro.textContent = chars.slice(0, this.progress() * chars.length).join('');
        },
        onComplete: () => {
          intro.textContent = fullText;
        }
      });
    }

    // Glitch on keywords – wrap target words in <span class="glitch" data-text="WORD">WORD</span>
    const glossary = document.querySelectorAll('.about-copy .glitch');
    glossary.forEach(el => {
      el.setAttribute('data-text', el.textContent);
    });

    // Stats count‑up (reuse same logic as skills)
    const aboutStats = document.querySelectorAll('.about-stats .stat-number');
    aboutStats.forEach(num => {
      const target = parseFloat(num.textContent) || 0;
      num.textContent = '0';
      gsap.fromTo(
        num,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: num,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          snap: { innerText: 1 },
          onUpdate: function () {
            num.textContent = Math.round(this.target.innerText);
          }
        }
      );
    });

    // Scanning line that reveals text (simple linear gradient moving)
    const aboutCopy = document.querySelector('.about-copy');
    if (aboutCopy) {
      const scan = document.createElement('div');
      scan.className = 'scanline';
      scan.style.position = 'absolute';
      scan.style.inset = '0';
      scan.style.pointerEvents = 'none';
      scan.style.background = 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,255,255,.2) 2px, rgba(0,255,255,.2) 4px';
      scan.style.backgroundSize = '200% 100%';
      scan.style.animation = 'scanMove 4s linear infinite';
      aboutCopy.style.position = 'relative';
      aboutCopy.appendChild(scan);
    }
  }

  /* -------------------------------------------------
     5️⃣ CLIENTS / BOUNTY LOGOS – shimmer on scroll, hover glow/scale, optional 3D tilt
     ------------------------------------------------- */
  function initLogos() {
    const logos = document.querySelectorAll('.logo-badge img, .logo-badge.logo-fallback');
    if (!logos.length) return;

    logos.forEach(img => {
      const wrapper = img.parentElement;

      // Shimmer on scroll
      gsap.fromTo(
        wrapper,
        { opacity: 0.4, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Hover glow + scale
      wrapper.addEventListener('mouseenter', () => {
        wrapper.classList.add('neon-glow');
        gsap.to(wrapper, { scale: 1.05, duration: 0.3 });
      });
      wrapper.addEventListener('mouseleave', () => {
        wrapper.classList.remove('neon-glow');
        gsap.to(wrapper, { scale: 1, duration: 0.3 });
      });

      // Optional 3D tilt – uncomment if you want it
      /*
      wrapper.addEventListener('mousemove', e => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (y / rect.height) * 10;
        const ry = (x / rect.width) * -10;
        gsap.to(wrapper, { rotationX: rx, rotationY: ry, duration: 0.4 });
      });
      wrapper.addEventListener('mouseleave', () => {
        gsap.to(wrapper, { rotationX: 0, rotationY: 0, duration: 0.4 });
      });
      */
    });
  }

  /* -------------------------------------------------
     6️⃣ CONTACT FORM – focus glow, submit pulse, glitch on success
     ------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(el => {
      el.addEventListener('focus', () => {
        el.classList.add('neon-glow');
      });
      el.addEventListener('blur', () => {
        el.classList.remove('neon-glow');
      });
    });

    const status = document.getElementById('formStatus');
    if (status) {
      // Show a quick “transmission” pulse on submit success
      const originalHandler = form.onsubmit;
      form.onsubmit = function (e) {
        e.preventDefault();
        // Simulate submit (your original AJAX stays)
        const data = new URLSearchParams(new FormData(form));
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: data
        })
          .then(r => {
            if (r.ok) {
              status.textContent = '> Message sent. Standing by for response.';
              // Pulse animation
              gsap.fromTo(status, { scale: 1, opacity: 1 }, {
                scale: 1.3,
                opacity: 0.8,
                duration: 0.6,
                yoyo: true,
                repeat: 1,
                ease: 'power1.out',
                onComplete: () => {
                  gsap.to(status, { scale: 1, opacity: 1, duration: 0.3 });
                }
              });
              // Optional glitch flash
              status.classList.add('glitch');
              setTimeout(() => status.classList.remove('glitch'), 300);
              form.reset();
            } else {
              status.textContent = '> Transmission failed. Please email directly.';
            }
          })
          .catch(() => {
            status.textContent = '> Transmission failed. Please email directly.';
          });
      };
    }
  }

  /* -------------------------------------------------
     INITIALISE ALL SECTIONS
     ------------------------------------------------- */
  function initAll() {
    initSkills();
    initCertifications();
    initExperience();
    initAbout();
    initLogos();
    initContactForm();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
