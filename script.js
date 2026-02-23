// === Try Intera - suggestion tags populate input ===
document.querySelectorAll('.try-intera-tag').forEach(btn => {
  btn.addEventListener('click', function() {
    const input = document.querySelector('.try-intera-input');
    if (input) input.value = this.textContent.trim();
  });
});

// Try Intera submit → scroll down to early access
(function() {
  const submitBtn = document.querySelector('.try-intera-submit');
  const cta = document.getElementById('cta');
  submitBtn?.addEventListener('click', function() {
    if (cta) cta.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// Bring your own data card → scroll to early access and pre-fill "Tell us more" with Enterprise
(function() {
  const link = document.getElementById('credibilityTrustCta');
  const tellUsMore = document.querySelector('select[name="tell_us_more"]');
  if (!link) return;
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const ctaEl = document.getElementById('cta');
    if (ctaEl) ctaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (tellUsMore) {
      tellUsMore.value = 'enterprise';
    }
  });
})();

// === Nav reveal ===
(function(){
  const nav = document.querySelector('nav');
  const opener = document.getElementById('opener');
  if (!nav) return;
  
  if (!opener) {
    nav.classList.add('nav-visible');
    return;
  }
  
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        nav.classList.remove('nav-visible');
      } else {
        nav.classList.add('nav-visible');
      }
    });
  }, {threshold: 0.15});
  navObs.observe(opener);
})();

// === Scroll animations (optional reveal — content visible by default) ===
const fiEls = document.querySelectorAll('.fi');
fiEls.forEach(el => el.classList.add('v'));
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('v');
  });
}, {threshold: 0.05, rootMargin: '0px 0px -20px 0px'});
fiEls.forEach(el => obs.observe(el));

// === Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({behavior: 'smooth'});
  });
});

// === Opener scroll arrow ===
const scrollArrow = document.getElementById('openerArrow');
if (scrollArrow) {
  scrollArrow.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.getElementById('hero-anchor');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// === Persona image upload ===
(function() {
  const btn = document.querySelector('.persona-upload-btn');
  const panel = document.getElementById('personaUploadPanel');
  const dropZone = document.getElementById('personaDropZone');
  const fileInput = document.getElementById('personaFileInput');
  const closeBtn = document.getElementById('personaUploadClose');
  const persons = document.querySelectorAll('.person[data-slot]');

  if (!btn || !panel || !dropZone || !fileInput) return;

  function openPanel() {
    panel.hidden = false;
  }
  function closePanel() {
    panel.hidden = true;
  }

  function assignImages(files) {
    const imgs = Array.from(files).filter(f => f.type.startsWith('image/'));
    imgs.slice(0, 17).forEach((file, i) => {
      const el = document.querySelector(`.person[data-slot="${i}"]`);
      if (el) {
        el.src = URL.createObjectURL(file);
        el.style.display = '';
      }
    });
  }

  btn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) assignImages(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) assignImages(fileInput.files);
    fileInput.value = '';
  });
})();

// === Accuracy KFF card → expand article panel ===
(function() {
  const panel = document.getElementById('accuracyArticlePanel');
  const kffCard = document.querySelector('.accuracy-card-expandable[data-backtest="kff"]');
  const closeBtn = document.querySelector('.accuracy-article-close');
  const backBtn = document.querySelector('.accuracy-article-back');
  const backdrop = document.querySelector('.accuracy-article-backdrop');

  if (!panel || !kffCard) return;

  let scrollY = 0;

  function openPanel() {
    scrollY = window.scrollY;
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
  }

  kffCard.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  backBtn?.addEventListener('click', closePanel);
  backdrop?.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
      closePanel();
    }
  });
})();

// === Platform carousel (one screen at a time) ===
(function() {
  const navBtns = document.querySelectorAll('.platform-nav-btn');
  const slides = document.querySelectorAll('.platform-slide');
  if (!navBtns.length || !slides.length) return;
  navBtns.forEach((btn, i) => {
    btn.addEventListener('click', function() {
      navBtns.forEach(b => b.classList.remove('is-active'));
      slides.forEach(s => s.classList.remove('is-active'));
      this.classList.add('is-active');
      if (slides[i]) slides[i].classList.add('is-active');
    });
  });
  slides[0]?.classList.add('is-active');
})();

// === Population viz: horizontal bar, 1,200 dots pack in, 4 segments, detail card ===
(function() {
  const bar = document.getElementById('populationBar');
  const dotsEl = document.getElementById('populationBarDots');
  const labelsEl = document.getElementById('populationSegmentLabels');
  const detailCard = document.getElementById('populationDetailCard');
  if (!bar || !dotsEl) return;

  const COLS = 50;
  const SEGMENTS = [
    { n: 340, style: 'energy' },
    { n: 285, style: 'teal' },
    { n: 310, style: 'smoothie' },
    { n: 265, style: 'switcher' }
  ];
  const TOTAL = 1200;
  const styleClasses = { energy: 'pop-bar-dot--energy', teal: 'pop-bar-dot--teal', smoothie: 'pop-bar-dot--smoothie', switcher: 'pop-bar-dot--switcher' };

  function createDots() {
    const fragment = document.createDocumentFragment();
    let idx = 0;
    SEGMENTS.forEach(function(seg) {
      for (let i = 0; i < seg.n && idx < TOTAL; i++, idx++) {
        const dot = document.createElement('span');
        dot.className = 'pop-bar-dot ' + styleClasses[seg.style];
        const col = (idx % COLS) + 1;
        const row = Math.floor(idx / COLS) + 1;
        dot.style.gridColumn = col;
        dot.style.gridRow = row;
        const rx = (Math.random() - 0.5) * 160;
        const ry = (Math.random() - 0.5) * 80;
        dot.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        fragment.appendChild(dot);
      }
    });
    dotsEl.appendChild(fragment);
    return dotsEl.querySelectorAll('.pop-bar-dot');
  }

  function runAnimation() {
    const dots = dotsEl.querySelectorAll('.pop-bar-dot');
    if (dots.length === 0) return;
    requestAnimationFrame(function() {
      dotsEl.classList.add('is-packed');
      dots.forEach(function(d) {
        d.style.transform = 'translate(0,0)';
      });
    });
    setTimeout(function() {
      if (labelsEl) labelsEl.classList.add('is-visible');
      if (detailCard) detailCard.classList.add('is-visible');
    }, 1600);
  }

  if (labelsEl) {
    labelsEl.querySelectorAll('.population-segment-label').forEach(function(lab) {
      lab.addEventListener('click', function() {
        labelsEl.querySelectorAll('.population-segment-label').forEach(function(l) { l.classList.remove('population-segment-label--selected'); });
        lab.classList.add('population-segment-label--selected');
        var title = detailCard && detailCard.querySelector('.population-detail-title');
        if (title) {
          var t = lab.textContent.trim();
          title.textContent = t.replace(/\s*·\s*\d+\s*people\.?$/, '') + ' · Sample profiles';
        }
      });
    });
  }

  let started = false;
  const obs = new IntersectionObserver(function(entries) {
    if (started || !entries[0].isIntersecting) return;
    started = true;
    createDots();
    requestAnimationFrame(runAnimation);
  }, { threshold: 0.2 });
  obs.observe(bar);
})();

// === Predictions viz: stimulus → bars → why (scroll-triggered, three beats) ===
(function() {
  const stimulus = document.getElementById('predictionsStimulus');
  const barsWrap = document.getElementById('predictionsBarsWrap');
  const why = document.getElementById('predictionsWhy');
  const barEnrollment = document.getElementById('predictionsBarEnrollment');
  const barRetention = document.getElementById('predictionsBarRetention');
  const barConfidence = document.getElementById('predictionsBarConfidence');
  const valEnrollment = document.getElementById('predictionsValEnrollment');
  const valRetention = document.getElementById('predictionsValRetention');
  const valConfidence = document.getElementById('predictionsValConfidence');
  if (!stimulus || !barsWrap || !why) return;

  const TARGETS = { enrollment: 34, retention: 12, confidence: 79 };
  const DURATION = 1000;
  const START_DELAY = 400;

  function countUp(el, to, duration, startTime) {
    const start = startTime || performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 2);
      const n = Math.round(ease * to);
      if (el) el.textContent = n + '%';
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function runSequence() {
    stimulus.classList.add('is-visible');
    setTimeout(function() {
      barsWrap.classList.add('is-visible');
      if (barEnrollment) barEnrollment.style.width = TARGETS.enrollment + '%';
      if (barRetention) barRetention.style.width = TARGETS.retention + '%';
      if (barConfidence) barConfidence.style.width = TARGETS.confidence + '%';
      countUp(valEnrollment, TARGETS.enrollment, DURATION);
      countUp(valRetention, TARGETS.retention, DURATION);
      countUp(valConfidence, TARGETS.confidence, DURATION);
    }, START_DELAY);
    setTimeout(function() {
      why.classList.add('is-visible');
    }, START_DELAY + DURATION + 200);
  }

  let started = false;
  const obs = new IntersectionObserver(function(entries) {
    if (started || !entries[0].isIntersecting) return;
    started = true;
    runSequence();
  }, { threshold: 0.2 });
  obs.observe(stimulus);
})();

// === Say vs. Do carousel (Hume-style, auto-advance + manual) ===
(function() {
  const section = document.querySelector('.say-do-section');
  const track = document.querySelector('.say-do-track');
  const dots = document.querySelectorAll('.say-do-dot');
  const prevArrow = document.querySelector('.say-do-arrow-prev');
  const nextArrow = document.querySelector('.say-do-arrow-next');
  const cards = document.querySelectorAll('.say-do-card');
  const total = cards.length;
  const CARD_WIDTH = 560;
  const CARD_GAP = 28;
  const CARD_STEP = CARD_WIDTH + CARD_GAP;
  const AUTO_ADVANCE_MS = 6500;

  if (!section || !track || cards.length === 0) return;

  let index = 0;
  let autoTimer = null;

  function goTo(i) {
    if (i < 0 || i >= total) return;
    cards[index].classList.remove('is-active');
    cards[i].classList.add('is-active');
    index = i;
    const offset = index * CARD_STEP;
    track.style.setProperty('--say-do-offset', offset + 'px');
    dots.forEach((d, j) => d.classList.toggle('is-active', j === index));
    if (prevArrow) prevArrow.disabled = index === 0;
    if (nextArrow) nextArrow.disabled = index === total - 1;
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(index < total - 1 ? index + 1 : 0), AUTO_ADVANCE_MS);
  }

  dots.forEach((d, j) => d.addEventListener('click', () => goTo(j)));
  if (prevArrow) prevArrow.addEventListener('click', (e) => { e.preventDefault(); goTo(index - 1); });
  if (nextArrow) nextArrow.addEventListener('click', (e) => { e.preventDefault(); goTo(index + 1); });

  section?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  track.style.setProperty('--say-do-offset', '0px');
  if (prevArrow) prevArrow.disabled = index === 0;
  if (nextArrow) nextArrow.disabled = index === total - 1;
  dots[0]?.classList.add('is-active');

  autoTimer = setInterval(() => goTo(index < total - 1 ? index + 1 : 0), AUTO_ADVANCE_MS);
})();
