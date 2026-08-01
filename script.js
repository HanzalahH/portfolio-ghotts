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
})();
