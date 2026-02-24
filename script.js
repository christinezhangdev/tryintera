// === Neural Network Background ===
(function() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animationId;
  let lastFlashTime = 0;
  let flashingNodes = [];
  let hasScrolledAway = false;
  let isFadingOut = false;
  
  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    initNodes();
  }
  
  function initNodes() {
    nodes = [];
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const isMobile = width < 768;
    
    // Fewer nodes on mobile for performance, more on desktop
    const density = isMobile ? 15000 : 8000;
    const numNodes = Math.floor((width * height) / density);
    
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
        radius: Math.random() * (isMobile ? 2.5 : 3) + (isMobile ? 2 : 2.5),
        baseColor: getNodeColor(),
        flash: 0,
        flashDecay: 0.02 + Math.random() * 0.03
      });
    }
  }
  
  function getNodeColor() {
    const colors = [
      {r: 65, g: 195, b: 210, a: 1},     // Teal
      {r: 100, g: 200, b: 220, a: 0.95}, // Light teal
      {r: 140, g: 210, b: 230, a: 1},    // Pale cyan
      {r: 80, g: 180, b: 200, a: 0.9},   // Deep teal
      {r: 160, g: 220, b: 240, a: 0.85}, // Light blue
      {r: 120, g: 190, b: 215, a: 0.9},  // Sky teal
      {r: 45, g: 170, b: 190, a: 1},     // Strong teal
      {r: 180, g: 230, b: 245, a: 0.85}, // Very light blue
      {r: 70, g: 100, b: 160, a: 0.9},   // Dark blue accent
      {r: 130, g: 120, b: 190, a: 0.85}, // Soft purple accent
      {r: 50, g: 80, b: 140, a: 0.8}     // Deep navy accent
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function triggerFlash() {
    // Flash 3-8 random nodes
    const numToFlash = 3 + Math.floor(Math.random() * 6);
    for (let i = 0; i < numToFlash; i++) {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      if (randomNode) {
        randomNode.flash = 1;
      }
    }
  }
  
  function drawNode(node) {
    const c = node.baseColor;
    let r = c.r, g = c.g, b = c.b, a = c.a;
    let radius = node.radius;
    let glowSize = 2;
    
    // Apply flash effect
    if (node.flash > 0) {
      // Brighten towards white
      r = Math.min(255, r + (255 - r) * node.flash);
      g = Math.min(255, g + (255 - g) * node.flash);
      b = Math.min(255, b + (255 - b) * node.flash);
      a = Math.min(1, a + 0.3 * node.flash);
      radius = node.radius * (1 + node.flash * 0.8);
      glowSize = 2 + node.flash * 15;
      
      // Decay flash
      node.flash -= node.flashDecay;
      if (node.flash < 0) node.flash = 0;
    }
    
    // Glow effect (bigger when flashing)
    if (node.flash > 0.1) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + glowSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${node.flash * 0.4})`;
      ctx.fill();
    }
    
    // Main node
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fill();
    
    // Inner glow
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
    ctx.fill();
  }
  
  function drawConnections() {
    const isMobile = canvas.offsetWidth < 768;
    const maxDist = isMobile ? 100 : 150; // Shorter on mobile
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDist) {
          let opacity = (1 - dist / maxDist) * 0.6; // More visible
          
          // Brighten connection if either node is flashing
          if (nodes[i].flash > 0 || nodes[j].flash > 0) {
            opacity += Math.max(nodes[i].flash, nodes[j].flash) * 0.6;
          }
          
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(100, 190, 210, ${opacity})`; // Teal lines
          ctx.lineWidth = 1 + Math.max(nodes[i].flash, nodes[j].flash) * 2; // Thicker lines
          ctx.stroke();
        }
      }
    }
  }
  
  function updateNodes() {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      
      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(height, node.y));
    });
  }
  
  // Throttle animation on mobile for better performance
  const isMobile = window.innerWidth < 768;
  const targetFPS = isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;
  let lastFrameTime = 0;
  
  function animate(timestamp) {
    animationId = requestAnimationFrame(animate);
    
    // Throttle frame rate on mobile
    const elapsed = timestamp - lastFrameTime;
    if (elapsed < frameInterval) return;
    lastFrameTime = timestamp - (elapsed % frameInterval);
    
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // Trigger random flashes every 1-3 seconds
    if (timestamp - lastFlashTime > 1000 + Math.random() * 2000) {
      triggerFlash();
      lastFlashTime = timestamp;
    }
    
    drawConnections();
    nodes.forEach(drawNode);
    updateNodes();
  }
  
  // Handle visibility changes to pause animation when tab is hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else if (!hasScrolledAway) {
      lastFrameTime = 0;
      requestAnimationFrame(animate);
    }
  });
  
  // Fade out and hide entire opener section when scrolling (only once)
  const isMobileDevice = window.innerWidth < 768;
  
  function handleScroll() {
    if (hasScrolledAway) return;
    
    const opener = document.querySelector('.opener');
    if (!opener) return;
    
    const openerBottom = opener.offsetHeight;
    const scrollY = window.scrollY;
    
    // Start fading when scrolled 20% into the opener
    if (scrollY > openerBottom * 0.2 && !isFadingOut) {
      isFadingOut = true;
      hasScrolledAway = true;
      
      // On mobile, just hide immediately to avoid scroll issues
      if (isMobileDevice) {
        cancelAnimationFrame(animationId);
        opener.style.transition = 'opacity 0.4s ease-out';
        opener.style.opacity = '0';
        setTimeout(() => {
          opener.style.display = 'none';
          window.scrollTo(0, 0);
        }, 400);
        window.removeEventListener('scroll', handleScroll);
        return;
      }
      
      // Desktop: Animate the collapse
      const openerHeight = opener.offsetHeight;
      
      // Fade out the entire opener section and collapse height
      opener.style.transition = 'opacity 0.6s ease-out, height 0.6s ease-out, min-height 0.6s ease-out';
      opener.style.opacity = '0';
      opener.style.height = openerHeight + 'px';
      opener.style.minHeight = '0';
      opener.style.overflow = 'hidden';
      
      // Trigger reflow then collapse
      requestAnimationFrame(() => {
        opener.style.height = '0';
        
        // Smoothly adjust scroll position to compensate
        const startScroll = window.scrollY;
        const startTime = performance.now();
        const duration = 600;
        
        function smoothScroll(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          // Scroll up as the opener collapses
          const scrollOffset = openerHeight * easeOut;
          window.scrollTo(0, Math.max(0, startScroll - scrollOffset));
          
          if (progress < 1) {
            requestAnimationFrame(smoothScroll);
          }
        }
        
        requestAnimationFrame(smoothScroll);
      });
      
      // Stop animation after collapse
      setTimeout(() => {
        cancelAnimationFrame(animationId);
        opener.style.display = 'none';
      }, 650);
      
      // Remove scroll listener since we're done
      window.removeEventListener('scroll', handleScroll);
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();

// === Nav reveal ===
(function(){
  const nav = document.querySelector('nav');
  const opener = document.getElementById('opener');
  if (!nav || !opener) return;
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

// === Scroll animations ===
const fiEls=document.querySelectorAll('.fi');
fiEls.forEach(el=>el.classList.add('pre'));
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('v')});},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
fiEls.forEach(el=>obs.observe(el));

// === MAE Bar Chart Animation ===
(function() {
  const diffCombined = document.querySelector('.diff-combined');
  if (!diffCombined) return;
  
  const barFills = diffCombined.querySelectorAll('.mae-bar-fill');
  let animated = false;
  
  const maeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !animated) {
        animated = true;
        // Animate bars with a slight delay
        barFills.forEach((fill, index) => {
          setTimeout(() => {
            fill.style.transition = 'transform 1.2s cubic-bezier(.22,1,.36,1)';
            fill.style.transform = 'scaleY(1)';
          }, index * 200);
        });
      }
    });
  }, {threshold: 0.2});
  
  // Initialize bars as hidden
  barFills.forEach(fill => {
    fill.style.transform = 'scaleY(0)';
    fill.style.transformOrigin = 'bottom';
  });
  
  maeObs.observe(diffCombined);
})();

// === Parallax on scroll ===
(function(){
  const heroViz = document.querySelector('.hero-viz');
  const heroText = document.querySelector('.hero-text');
  let ticking = false;
  
  // Disable parallax on mobile for better performance
  const isMobile = window.innerWidth < 768;
  
  window.addEventListener('scroll', function() {
    if (!ticking && !isMobile) {
      requestAnimationFrame(function() {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        
        // Hero parallax — viz moves slower than text for depth (desktop only)
        if (heroViz && scrollY < vh * 1.5) {
          heroViz.style.transform = 'translateY(' + (scrollY * 0.04) + 'px)';
        }
        if (heroText && scrollY < vh * 1.5) {
          heroText.style.transform = 'translateY(' + (scrollY * -0.02) + 'px)';
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// (scroll progress removed)

// === Card 1: Counterfactual Toggle ===
(function(){
  const factors = document.querySelectorAll('.cf-factor');
  const scoreEl = document.getElementById('cfScore');
  const deltaEl = document.getElementById('cfDelta');
  const barEl = document.getElementById('cfBar');
  const savingsEl = document.getElementById('cfSavings');
  const timelineEl = document.getElementById('cfTimeline');
  const countEl = document.getElementById('cfCount');
  if (!factors.length || !scoreEl) return;
  const BASE = 83.4; // max possible completion

  function update() {
    let totalImpact = 0;
    let activeCount = 0;
    factors.forEach(f => {
      if (f.classList.contains('active')) {
        totalImpact += parseFloat(f.dataset.impact);
        activeCount++;
      }
    });
    const score = (BASE - totalImpact).toFixed(1);
    const delta = BASE - totalImpact - 71;
    scoreEl.textContent = Math.round(score) + '%';
    if (delta > 0.1) {
      deltaEl.textContent = '+' + delta.toFixed(1) + 'pts';
      deltaEl.style.color = 'rgba(16,150,110,.65)';
      scoreEl.style.color = '#5a9a82';
      barEl.style.background = 'linear-gradient(90deg,#06d6a0,#059669)';
    } else {
      deltaEl.textContent = '';
      scoreEl.style.color = '#dff0f6';
      barEl.style.background = 'linear-gradient(90deg,#9c8df9,#41c3e3)';
    }
    barEl.style.width = score + '%';
    const removed = 5 - activeCount;
    const savings = (removed * 0.64).toFixed(1);
    savingsEl.textContent = removed > 0 ? '$' + savings + 'M' : '$0';
    timelineEl.textContent = removed > 0 ? '−' + (removed * 0.48).toFixed(1) + ' mo' : '+0 mo';
    countEl.textContent = activeCount;
    countEl.style.color = activeCount > 3 ? 'rgba(200,50,50,.65)' : activeCount > 1 ? 'rgba(245,158,11,.7)' : 'rgba(16,150,110,.65)';
  }

  factors.forEach(f => {
    f.addEventListener('click', () => {
      f.classList.toggle('active');
      update();
    });
  });
  update();
})();

// === Card 2: Patient Detail Expand ===
(function(){
  const rows = document.querySelectorAll('.pr-row');
  const detail = document.getElementById('prDetail');
  const detailText = document.getElementById('prDetailText');
  if (!rows.length || !detail) return;
  let selected = null;

  rows.forEach(row => {
    row.addEventListener('click', () => {
      if (selected === row) {
        row.classList.remove('selected');
        detail.classList.remove('open');
        selected = null;
        return;
      }
      if (selected) selected.classList.remove('selected');
      row.classList.add('selected');
      const factors = row.dataset.detail.split(' · ');
      detailText.innerHTML = factors.map(f => '<span style="display:inline-block;padding:0.1rem 0.3rem;margin:0.1rem;border-radius:3px;background:rgba(65,195,227,.06);border:1px solid rgba(65,195,227,.08);">' + f + '</span>').join('');
      detail.classList.add('open');
      selected = row;
    });
  });
})();
document.getElementById('contactForm').addEventListener('submit',function(e){
  e.preventDefault();
  const form = this;
  const btn = form.querySelector('.submit');
  const n = document.getElementById('name').value;
  const o = document.getElementById('org').value;
  const em = document.getElementById('email').value;
  const r = document.getElementById('role').value;
  const m = document.getElementById('message').value;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Build confirmation details
  const detail = document.getElementById('successDetail');
  detail.innerHTML = '<div style="display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;">'
    + '<span style="color:var(--text-muted);">Name</span><span style="color:var(--text);">' + n + '</span>'
    + (o ? '<span style="color:var(--text-muted);">Organization</span><span style="color:var(--text);">' + o + '</span>' : '')
    + '<span style="color:var(--text-muted);">Email</span><span style="color:var(--text);">' + em + '</span>'
    + (r ? '<span style="color:var(--text-muted);">Role</span><span style="color:var(--text);">' + r + '</span>' : '')
    + (m ? '<span style="color:var(--text-muted);">Message</span><span style="color:var(--text);">' + m + '</span>' : '')
    + '</div>';

  // Send via Web3Forms
  const data = new FormData(form);
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json','Accept': 'application/json'},
    body: JSON.stringify(Object.fromEntries(data))
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) {
      form.style.display = 'none';
      document.getElementById('success').style.display = 'block';
    } else {
      btn.textContent = 'Something went wrong — try again';
      btn.disabled = false;
    }
  })
  .catch(() => {
    btn.textContent = 'Network error — try again';
    btn.disabled = false;
  });
});
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',function(e){e.preventDefault();document.querySelector(this.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})});});


// === Animated Retention Chart ===
(function(){
  const canvas = document.getElementById('retentionChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = 130;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  // Data points (x: 0-1, y: 0-1 where 0=top/100%, 1=bottom/0%)
  const popPts = [{x:0,y:0},{x:.11,y:.02},{x:.25,y:.06},{x:.39,y:.14},{x:.52,y:.22},{x:.66,y:.27},{x:.80,y:.33},{x:.95,y:.40}];
  const ptPts  = [{x:0,y:0},{x:.11,y:.03},{x:.25,y:.10},{x:.39,y:.27},{x:.52,y:.45},{x:.66,y:.60},{x:.80,y:.73},{x:.95,y:.85}];
  const riskCliffIdx = 3; // Wk8 — the divergence point

  const labels = ['Wk2','Wk4','Wk8','Wk12','Wk16'];
  const labelX = [.11,.25,.43,.66,.90];
  const yLabels = ['100%','75%','50%','25%'];

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getY(pts, x, t) {
    // Find segment
    for (let i = 0; i < pts.length - 1; i++) {
      if (x >= pts[i].x && x <= pts[i+1].x) {
        const seg = (x - pts[i].x) / (pts[i+1].x - pts[i].x);
        const baseY = lerp(pts[i].y, pts[i+1].y, seg);
        // Add subtle wave
        const wave = Math.sin(t * 1.5 + x * 12) * 0.004 + Math.sin(t * 0.8 + x * 6) * 0.003;
        return baseY + wave;
      }
    }
    return pts[pts.length-1].y;
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const pad = {l: 30, r: 10, t: 8, b: 20};
    const cw = w - pad.l - pad.r;
    const ch = h - pad.t - pad.b;

    // Grid lines
    for (let i = 0; i < 4; i++) {
      const y = pad.t + (ch * i / 3);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Y-axis labels
    ctx.font = '500 7px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(110,110,130,0.5)';
    yLabels.forEach((l, i) => {
      ctx.fillText(l, pad.l - 5, pad.t + (ch * i / 3) + 3);
    });

    // X-axis labels
    ctx.textAlign = 'center';
    labels.forEach((l, i) => {
      ctx.fillText(l, pad.l + labelX[i] * cw, h - 4);
    });

    // Draw a line with glow
    function drawLine(pts, color, width, glowAlpha) {
      // Glow pass
      ctx.beginPath();
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const x01 = i / steps;
        const y01 = getY(pts, x01, t);
        const px = pad.l + x01 * cw;
        const py = pad.t + y01 * ch;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = color.replace('1)', glowAlpha + ')').replace('rgb', 'rgba');
      ctx.lineWidth = width + 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Main line
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x01 = i / steps;
        const y01 = getY(pts, x01, t);
        const px = pad.l + x01 * cw;
        const py = pad.t + y01 * ch;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();

      // Dots
      pts.forEach((p, idx) => {
        if (idx === 0) return;
        const py = pad.t + getY(pts, p.x, t) * ch;
        const px = pad.l + p.x * cw;
        // Pulse on dots
        const pulse = 1 + Math.sin(t * 2 + idx) * 0.15;
        const r = 2.5 * pulse;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }

    // Population line (green)
    drawLine(popPts, 'rgba(90,154,130,0.7)', 1.8, 0.15);
    // Patient line (purple)
    drawLine(ptPts, 'rgba(65,195,227,0.85)', 2, 0.2);

    // Risk cliff marker — pulsing ring
    const rcPt = ptPts[riskCliffIdx];
    const rcx = pad.l + rcPt.x * cw;
    const rcy = pad.t + getY(ptPts, rcPt.x, t) * ch;
    const ringPulse = 1 + Math.sin(t * 1.2) * 0.2;
    ctx.beginPath();
    ctx.arc(rcx, rcy, 6 * ringPulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(196,122,110,' + (0.5 + Math.sin(t * 1.2) * 0.2) + ')';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Flowing particle along patient line
    const particlePos = (t * 0.06) % 1;
    const ppx = pad.l + particlePos * cw;
    const ppy = pad.t + getY(ptPts, particlePos, t) * ch;
    const pg = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 8);
    pg.addColorStop(0, 'rgba(65,195,227,0.4)');
    pg.addColorStop(1, 'rgba(65,195,227,0)');
    ctx.beginPath();
    ctx.arc(ppx, ppy, 8, 0, Math.PI * 2);
    ctx.fillStyle = pg;
    ctx.fill();

    requestAnimationFrame(() => draw(performance.now() * 0.001));
  }

  resize();
  window.addEventListener('resize', resize);
  draw(0);
})();

