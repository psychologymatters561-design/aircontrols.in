/* ============================================================
   animations.js — Air Control · AC-themed animation layer
   ============================================================ */
(function(){
  'use strict';

  const isTouch   = () => window.matchMedia('(hover:none)').matches;
  const reduced   = () => window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const raf       = window.requestAnimationFrame;

  /* ============================================================
     READ PROGRESS BAR
     ============================================================ */
  function initReadProgress(){
    const bar = document.createElement('div');
    bar.id = 'read-progress';
    document.body.prepend(bar);
    window.addEventListener('scroll', ()=>{
      const s = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (s/h)*100) : 0) + '%';
    }, {passive:true});
  }

  /* ============================================================
     CURSOR GLOW (desktop, cold blue)
     ============================================================ */
  function initCursorGlow(){
    if(isTouch()) return;
    const el = document.createElement('div');
    el.id = 'cursor-glow';
    document.body.appendChild(el);
    let mx=0, my=0, cx=0, cy=0;
    window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; }, {passive:true});
    (function loop(){
      cx += (mx-cx)*0.10;
      cy += (my-cy)*0.10;
      el.style.left = cx+'px';
      el.style.top  = cy+'px';
      raf(loop);
    })();
  }

  /* ============================================================
     SCROLL-TO-TOP BUTTON
     ============================================================ */
  function initScrollTop(){
    const btn = document.createElement('button');
    btn.id = 'scroll-top';
    btn.innerHTML = '&#8679;';
    btn.setAttribute('aria-label','Scroll to top');
    document.body.appendChild(btn);
    window.addEventListener('scroll', ()=>{
      btn.classList.toggle('show', window.scrollY > 500);
    }, {passive:true});
    btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  }

  /* ============================================================
     SNOWFLAKE PARTICLE FIELD (CSS + JS)
     ============================================================ */
  function initSnowflakes(){
    const field = document.getElementById('snowField');
    if(!field) return;

    const FLAKES  = 28;
    const SYMBOLS = ['❄','❅','❆','*','·'];
    const SIZES   = [10,12,14,16,18,20,22];

    for(let i = 0; i < FLAKES; i++){
      const el = document.createElement('span');
      el.className = 'snow-p';
      const sym  = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const size = SIZES[Math.floor(Math.random() * SIZES.length)];
      const left = Math.random() * 100;
      const dur  = 8 + Math.random() * 14;   // 8–22s
      const del  = Math.random() * -20;       // stagger from start
      const drift= (Math.random() - 0.5) * 80; // -40 to +40px horizontal drift

      el.textContent = sym;
      el.style.cssText = [
        `left:${left}%`,
        `font-size:${size}px`,
        `--drift:${drift}px`,
        `animation-duration:${dur}s`,
        `animation-delay:${del}s`,
        `opacity:${0.3 + Math.random()*0.45}`
      ].join(';');
      field.appendChild(el);
    }
  }

  /* ============================================================
     COOL AIR CANVAS (hero cold-particle overlay)
     Separate from the existing heroCanvas gold-particle canvas.
     ============================================================ */
  function initCoolAirCanvas(){
    const hero = document.querySelector('.hero');
    if(!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'coolAirCanvas';
    // Insert after snowField (before content wrap)
    const contentWrap = hero.querySelector('.hero-content-wrap');
    if(contentWrap) hero.insertBefore(canvas, contentWrap);
    else hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H;

    const PALETTE = [
      'rgba(122,185,232,',   // sky blue
      'rgba(160,210,240,',   // ice
      'rgba(200,230,245,',   // pale frost
      'rgba(74,144,217,',    // royal blue
      'rgba(255,255,255,',   // white
    ];

    function resize(){
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, {passive:true});

    // Create particles
    const TOTAL = 55;
    const pts = [];
    for(let i = 0; i < TOTAL; i++){
      const big = Math.random() < 0.15; // 15% are snowflake-sized
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: big ? (2 + Math.random()*2.5) : (0.6 + Math.random()*1.4),
        // cool drift: mostly downward (vy > 0) with gentle horizontal sine
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        freq:  0.008 + Math.random() * 0.012,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        a:     0.25 + Math.random() * 0.55,
        big:   big
      });
    }

    let tick = 0;
    function draw(){
      tick++;
      ctx.clearRect(0, 0, W, H);

      pts.forEach(p=>{
        // Horizontal sine drift (breeze effect)
        const sway = Math.sin(p.phase + tick * p.freq) * 0.6;
        p.x += p.vx + sway;
        p.y += p.vy;

        // Wrap around
        if(p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
        if(p.x > W + 10)  p.x = -10;
        if(p.x < -10)     p.x = W + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.a + ')';
        ctx.fill();

        // For bigger particles add a subtle glow ring
        if(p.big){
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (p.a * 0.2) + ')';
          ctx.fill();
        }
      });

      // Subtle connecting lines between close cool particles (max 5px apart, air flow feel)
      for(let i = 0; i < pts.length; i++){
        for(let j = i+1; j < pts.length; j++){
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if(d < 70){
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(122,185,232,${(1-d/70)*0.07})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf(draw);
    }
    draw();
  }

  /* ============================================================
     COOL BREEZE WAVE STRIPS
     ============================================================ */
  function initBreezeWaves(){
    const hero = document.querySelector('.hero');
    if(!hero) return;
    const STRIPS = 3;
    const tops   = [25, 48, 70]; // % from top of hero
    const delays = [0, 2.2, 4.1];
    const widths = ['60%', '45%', '55%'];

    for(let i = 0; i < STRIPS; i++){
      const b = document.createElement('div');
      b.className = 'hero-breeze';
      b.style.cssText = [
        `top:${tops[i]}%`,
        `width:${widths[i]}`,
        `animation-delay:${delays[i]}s`,
        `animation-duration:${5 + i*1.1}s`,
        `opacity:${0.45 - i*0.1}`
      ].join(';');
      hero.appendChild(b);
    }
  }

  /* ============================================================
     FLOATING ORBS in hero
     ============================================================ */
  function initOrbs(){
    const hero = document.querySelector('.hero');
    if(!hero) return;
    ['orb-1 orb','orb-2 orb','orb-3 orb','orb-4 orb'].forEach(cls=>{
      const el = document.createElement('div');
      el.className = cls;
      hero.appendChild(el);
    });
  }

  /* ============================================================
     TRUST STRIP MARQUEE — duplicate items for seamless scroll
     ============================================================ */
  function initMarquee(){
    const inner = document.querySelector('.trust-strip-inner');
    if(!inner || inner.dataset.duped) return;
    inner.dataset.duped = '1';
    const items = Array.from(inner.children);
    items.forEach(item=>{
      const cl = item.cloneNode(true);
      cl.setAttribute('aria-hidden','true');
      inner.appendChild(cl);
    });
  }

  /* ============================================================
     STAGGER GRID CHILDREN
     ============================================================ */
  function initStagger(){
    const grids = [
      '.pillars-grid','.services-grid','.reviews-grid',
      '.industries-grid','.guarantee-grid','.principles-grid',
      '.safety-list','.ind-grid'
    ];
    grids.forEach(sel=>{
      const grid = document.querySelector(sel);
      if(!grid) return;
      Array.from(grid.children).forEach((c,i)=>{
        c.classList.add('stagger-child');
        c.style.transitionDelay = (i*0.08) + 's';
      });
    });
  }

  /* ============================================================
     INTERSECTION OBSERVER
     ============================================================ */
  function initObserver(){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});

    document.querySelectorAll('.stagger-child').forEach(el=> obs.observe(el));
    document.querySelectorAll('.gold-rule').forEach(el=> obs.observe(el));
    document.querySelectorAll('.section-label').forEach(el=> obs.observe(el));
    document.querySelectorAll('.promise-item').forEach(el=> obs.observe(el));
  }

  /* ============================================================
     3D CARD TILT (desktop only)
     ============================================================ */
  function initTilt(){
    if(isTouch()) return;
    const SEL = '.pillar-card,.srv-card,.ind-card,.rev-card,.principle-card,.safety-card,.cib-card,.guar-card';
    const INT = 7;
    document.querySelectorAll(SEL).forEach(card=>{
      card.addEventListener('mousemove', e=>{
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x*INT}deg) rotateX(${-y*INT}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', ()=> card.style.transform = '');
    });
  }

  /* ============================================================
     RIPPLE ON CLICK
     ============================================================ */
  function initRipple(){
    const SEL = '.btn,.nav-cta-btn,.mob-cta,.cta-btn,.cta-primary,.cta-secondary';
    document.addEventListener('click', e=>{
      const btn = e.target.closest(SEL);
      if(!btn) return;
      const r    = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.6;
      const span = document.createElement('span');
      span.className = 'ripple-wave';
      span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      btn.appendChild(span);
      span.addEventListener('animationend', ()=> span.remove());
    });
  }

  /* ============================================================
     HERO PARALLAX (subtle, desktop)
     ============================================================ */
  function initParallax(){
    if(isTouch()) return;
    const hero = document.querySelector('.hero');
    if(!hero) return;
    const acScene = hero.querySelector('.hero-ac-scene');
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(y > window.innerHeight) return;
      if(acScene) acScene.style.transform = `translateY(calc(-48% + ${y * 0.12}px))`;
    }, {passive:true});
  }

  /* ============================================================
     PROMISE BAR ITEMS
     ============================================================ */
  function initPromiseBar(){
    document.querySelectorAll('.promise-bar > *, .prom-item').forEach(el=>{
      el.classList.add('promise-item');
    });
  }

  /* ============================================================
     BLOG HERO SNOWFLAKE DECORATIONS
     ============================================================ */
  function initBlogHeroFlakes(){
    const hero = document.querySelector('.blog-hero');
    if(!hero) return;
    const flakes = [
      {style:'--fs:90px;--dur:22s;right:6%;top:12%', alt:false},
      {style:'--fs:60px;--dur:30s;left:4%;bottom:15%', alt:true},
      {style:'--fs:40px;--dur:18s;right:22%;bottom:10%', alt:false},
    ];
    flakes.forEach(f=>{
      const el = document.createElement('span');
      el.className = 'blog-hero-flake' + (f.alt ? ' alt' : '');
      el.textContent = '❄';
      el.setAttribute('aria-hidden','true');
      el.setAttribute('style', f.style);
      hero.appendChild(el);
    });
  }

  /* ============================================================
     SPA PAGE OBSERVER
     Re-triggers reveal animations when a .page gains .active
     (IntersectionObserver can't see elements inside display:none parents)
     ============================================================ */
  function initSpaObserver(){
    // Shared IO instance that persists across page navigations
    const revObs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          revObs.unobserve(e.target);
        }
      });
    }, {threshold:0.08, rootMargin:'0px 0px -30px 0px'});

    function activatePage(page){
      // Stagger: add class and transition-delay to grid children not yet processed
      const GRIDS = [
        '.pillars-grid','.services-grid','.reviews-grid',
        '.industries-grid','.guarantee-grid','.principles-grid',
        '.safety-list','.ind-grid'
      ];
      GRIDS.forEach(sel=>{
        const grid = page.querySelector(sel);
        if(!grid) return;
        Array.from(grid.children).forEach((c,i)=>{
          if(!c.classList.contains('stagger-child')){
            c.classList.add('stagger-child');
            c.style.transitionDelay = (i*0.08) + 's';
          }
        });
      });

      // Observe all reveal targets in this page
      page.querySelectorAll('.stagger-child:not(.visible)').forEach(el=> revObs.observe(el));
      page.querySelectorAll('.gold-rule:not(.visible)').forEach(el=> revObs.observe(el));
      page.querySelectorAll('.section-label:not(.visible)').forEach(el=> revObs.observe(el));
      page.querySelectorAll('.promise-item:not(.visible)').forEach(el=> revObs.observe(el));
      page.querySelectorAll('.reveal:not(.visible),.reveal-l:not(.visible),.reveal-r:not(.visible)').forEach(el=> revObs.observe(el));

      // Re-attach tilt to any cards in this page (desktop only)
      if(!isTouch()){
        const TILT_SEL = '.pillar-card,.srv-card,.ind-card,.rev-card,.principle-card,.safety-card,.cib-card,.guar-card';
        const INT = 7;
        page.querySelectorAll(TILT_SEL).forEach(card=>{
          if(card.dataset.tiltBound) return;
          card.dataset.tiltBound = '1';
          card.addEventListener('mousemove', e=>{
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;
            const y = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform = `perspective(700px) rotateY(${x*INT}deg) rotateX(${-y*INT}deg) translateZ(6px)`;
          });
          card.addEventListener('mouseleave', ()=> card.style.transform = '');
        });
      }
    }

    // Watch every .page element for the .active class being added
    const mutObs = new MutationObserver((mutations)=>{
      mutations.forEach(m=>{
        if(m.type === 'attributes' && m.attributeName === 'class'){
          const el = m.target;
          if(el.classList.contains('page') && el.classList.contains('active')){
            // Small delay so display:block has taken effect before IO fires
            setTimeout(()=> activatePage(el), 50);
          }
        }
      });
    });

    document.querySelectorAll('.page').forEach(p=>{
      mutObs.observe(p, {attributes:true, attributeFilter:['class']});
      // Also handle the initially-active page
      if(p.classList.contains('active')) activatePage(p);
    });

    // Fallback: if no .page structure, just observe the whole document
    if(!document.querySelector('.page')){
      document.querySelectorAll('.stagger-child,.gold-rule,.section-label,.promise-item,.reveal,.reveal-l,.reveal-r').forEach(el=> revObs.observe(el));
    }
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLL
     ============================================================ */
  function initSmoothAnchors(){
    document.addEventListener('click', e=>{
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const id = a.getAttribute('href').slice(1);
      if(!id) return;
      const target = document.getElementById(id);
      if(!target) return;
      e.preventDefault();
      const navH = (document.getElementById('mainNav')||{offsetHeight:72}).offsetHeight || 72;
      window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - navH - 12, behavior:'smooth'});
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init(){
    if(reduced()) return;

    initReadProgress();
    initCursorGlow();
    initScrollTop();
    initSnowflakes();
    initCoolAirCanvas();
    initBreezeWaves();
    initOrbs();
    initBlogHeroFlakes();
    initMarquee();
    initParallax();
    initPromiseBar();
    initStagger();
    initObserver();
    initSpaObserver();
    initTilt();
    initRipple();
    initSmoothAnchors();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
