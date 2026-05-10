(function(){
  'use strict';

  /* === Reading progress bar === */
  var bar=document.getElementById('blog-progress');
  function updateProgress(){
    var s=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
    if(bar)bar.style.width=(h>0?Math.min(100,s/h*100):0)+'%';
    var btn=document.getElementById('back-to-top');
    if(btn){s>440?btn.classList.add('visible'):btn.classList.remove('visible');}
  }
  window.addEventListener('scroll',updateProgress,{passive:true});
  updateProgress();

  /* === Back to top === */
  var topBtn=document.getElementById('back-to-top');
  if(topBtn)topBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});

  /* === Scroll-triggered fade-in === */
  if('IntersectionObserver' in window){
    var targets=[
      '.blog-body h2','.blog-content h2',
      '.blog-body h3','.blog-content h3',
      '.noise-card','.step-box','.check-item',
      '.reason-card','.red-flag','.area-pill',
      '.highlight-box','.warning-box',
      '.faq-item','.compare-table','.schedule-table','.price-table',
      '.checklist','.cta-banner'
    ];
    var els=document.querySelectorAll(targets.join(','));
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
    els.forEach(function(el){
      el.classList.add('scroll-fade');
      obs.observe(el);
    });
  }

  /* === FAQ accordion === */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var h3=item.querySelector('h3');
    var p=item.querySelector('p');
    if(!h3||!p)return;
    /* wrap the answer paragraph for smooth height transition */
    var wrapper=document.createElement('div');
    wrapper.className='faq-answer';
    p.parentNode.insertBefore(wrapper,p);
    wrapper.appendChild(p);
    h3.style.cursor='pointer';
    h3.addEventListener('click',function(){
      var isOpen=item.classList.contains('faq-open');
      /* close all */
      document.querySelectorAll('.faq-item.faq-open').forEach(function(i){i.classList.remove('faq-open');});
      if(!isOpen)item.classList.add('faq-open');
    });
  });
  /* open first FAQ by default */
  var firstFaq=document.querySelector('.faq-item');
  if(firstFaq)firstFaq.classList.add('faq-open');

})();
