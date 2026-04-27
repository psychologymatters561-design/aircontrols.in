/* ============================================================
   animations.js — Air Control site-wide animation layer
   ============================================================ */
(function(){
  'use strict';

  const isTouch = () => window.matchMedia('(hover:none)').matches;
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const raf = window.requestAnimationFrame;

  /* ---- Read progress bar ---- */
  function initReadProgress(){
    const bar = document.createElement('div');
    bar.id = 'read-progress';
    document.body.prepend(bar);
    function update(){
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (scrolled/total)*100 : 0) + '%';
    }
    window.addEventListener('scroll', update, {passive:true});
  }

  /* ---- Cursor glow (desktop only) ---- */
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

  /* ---- Scroll-to-top button ---- */
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

  /* ---- Trust strip marquee duplication ---- */
  function initMarquee(){
    const strip = document.querySelector('.trust-strip');
    const inner = document.querySelector('.trust-strip-inner');
    if(!strip || !inner) return;
    if(inner.dataset.duped) return;
    inner.dataset.duped = '1';
    // clone items into inner for seamless loop (inner animates -50%)
    const items = Array.from(inner.children);
    items.forEach(item=>{
      const cl = item.cloneNode(true);
      cl.setAttribute('aria-hidden','true');
      inner.appendChild(cl);
    });
  }

  /* ---- Stagger grid children ---- */
  function initStagger(){
    const grids = [
      '.pillars-grid', '.services-grid', '.reviews-grid',
      '.industries-grid', '.guarantee-grid', '.principles-grid',
      '.safety-list', '.ind-grid'
    ];
    grids.forEach(sel=>{
      const grid = document.querySelector(sel);
      if(!grid) return;
      const children = Array.from(grid.children);
      children.forEach((c,i)=>{
        c.classList.add('stagger-child');
        c.style.transitionDelay = (i*0.08)+'s';
      });
    });
  }

  /* ---- IntersectionObserver for reveal + stagger + gold-rule ---- */
  function initObserver(){
    const opts = {threshold:0.12, rootMargin:'0px 0px -40px 0px'};
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, opts);

    // Stagger children (new — not handled by inline initReveal)
    document.querySelectorAll('.stagger-child').forEach(el=> observer.observe(el));
    // Gold rules (draw-in animation)
    document.querySelectorAll('.gold-rule').forEach(el=> observer.observe(el));
    // Section labels (letter-spacing reveal)
    document.querySelectorAll('.section-label').forEach(el=> observer.observe(el));
    // Promise items
    document.querySelectorAll('.promise-item').forEach(el=> observer.observe(el));
  }

  /* ---- 3D card tilt ---- */
  function initTilt(){
    if(isTouch() || prefersReduced()) return;
    const CARDS = '.pillar-card,.srv-card,.ind-card,.rev-card,.principle-card,.safety-card,.cib-card,.guar-card';
    const INTENSITY = 8; // max degrees

    document.querySelectorAll(CARDS).forEach(card=>{
      card.addEventListener('mousemove', e=>{
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x*INTENSITY}deg) rotateX(${-y*INTENSITY}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', ()=>{
        card.style.transform = '';
      });
    });
  }

  /* ---- Ripple on click ---- */
  function initRipple(){
    const TARGETS = '.btn,.nav-cta-btn,.mob-cta,.cta-btn,.cta-primary,.cta-secondary';
    document.addEventListener('click', e=>{
      const btn = e.target.closest(TARGETS);
      if(!btn) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.6;
      const span = document.createElement('span');
      span.className = 'ripple-wave';
      span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      btn.appendChild(span);
      span.addEventListener('animationend', ()=> span.remove());
    });
  }

  /* ---- Hero parallax (subtle) ---- */
  function initParallax(){
    if(isTouch() || prefersReduced()) return;
    const hero = document.querySelector('.hero');
    if(!hero) return;
    const canvas = hero.querySelector('canvas');
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(y > window.innerHeight) return;
      hero.style.backgroundPositionY = (y * 0.3) + 'px';
      if(canvas) canvas.style.transform = `translateY(${y * 0.15}px)`;
    }, {passive:true});
  }

  /* ---- Floating orbs in dark sections ---- */
  function initOrbs(){
    const dark = document.querySelector('.hero');
    if(!dark || prefersReduced()) return;
    [
      {cls:'orb-1 orb'},
      {cls:'orb-2 orb'},
      {cls:'orb-3 orb'}
    ].forEach(o=>{
      const el = document.createElement('div');
      el.className = o.cls;
      dark.style.position = dark.style.position || 'relative';
      dark.style.overflow = 'hidden';
      dark.appendChild(el);
    });
  }

  /* ---- Promise bar items: add class for observer ---- */
  function initPromiseBar(){
    document.querySelectorAll('.promise-bar > *, .promise-item-wrap, .prom-item').forEach(el=>{
      el.classList.add('promise-item');
    });
  }

  /* ---- Smooth anchor scrolling with offset ---- */
  function initSmoothAnchors(){
    document.addEventListener('click', e=>{
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const id = a.getAttribute('href').slice(1);
      if(!id) return;
      const target = document.getElementById(id);
      if(!target) return;
      e.preventDefault();
      const navH = (document.getElementById('mainNav') || {offsetHeight:72}).offsetHeight || 72;
      window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - navH - 12, behavior:'smooth'});
    });
  }

  /* ---- Init ---- */
  function init(){
    if(prefersReduced()) return;

    initReadProgress();
    initCursorGlow();
    initScrollTop();
    initMarquee();
    initParallax();
    initOrbs();
    initPromiseBar();
    initStagger();
    initObserver();
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
