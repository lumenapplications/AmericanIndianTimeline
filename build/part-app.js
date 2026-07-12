/* ═════════════════════════════════════════════════════════════════
   THE PATTERN — application layer
   Data (D, CONNECTIONS, ESSAYS, RD, MAPS) is used as-is. Never mutated.
   ═════════════════════════════════════════════════════════════════ */
'use strict';

/* ── Constants ─────────────────────────────────────────────────── */
var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Category → dark-theme colors (audit -text variants for legibility) */
var CAT = {
  h:{name:'Historical Event',  col:'#3d8b68', raw:'#2d6a4f'},
  t:{name:'Treaty / Proclamation', col:'#4f83c4', raw:'#1d4e89'},
  s:{name:'Statute',           col:'#e06a3a', raw:'#b5451b'},
  l:{name:'Case Law',          col:'#9a76d4', raw:'#5c3d8f'}
};
var TYPE_COLORS = {reclass:'#e05a3a', sovereign:'#3d8b68', override:'#c9a84c', cartographic:'#4f83c4', echo:'#9a76d4'};
var TYPE_LABELS = {reclass:'They Named Us', sovereign:'They Signed the Treaties', override:'Then They Took It Back', cartographic:'The Maps Knew', echo:'The Pattern Repeats'};

/* Unbroken Chain framing (approved rulings) */
var PROLOGUE_END = 4;                       /* D[0..4] = the world before the chain */
var ALERT_IDX = {20:1, 21:1, 24:1, 29:1};   /* 1830 · 1831–32 · 1848 · 1924 */
var TERMINUS_IDX = 36;                      /* 2026 Callais — the live end of the line */
var ALERT_PHRASE = {
  20:'The Consent Requirement Breached',
  21:'The Court Ruled. The Executive Refused.',
  24:'The System Knew It Was Wrong',
  29:'Paper Genocide'
};
/* Quote stations — verbatim primary-source quotes, placed after node index */
var STATIONS = {
  18:[{q:'The utmost good faith shall always be observed towards the Indians; their lands and property shall never be taken from them without their consent.', s:'Northwest Ordinance, Article III — 1787'}],
  21:[{q:'Distinct political communities, having territorial boundaries, within which their authority is exclusive.', s:'Chief Justice John Marshall — Worcester v. Georgia, 1832'},
      {q:'The decision of the Supreme Court has fell still born.', s:'President Andrew Jackson, letter to John Coffee — April 1832'}],
  26:[{q:'No obligation of any treaty lawfully made and ratified with any such Indian nation or tribe prior to March third, eighteen hundred and seventy-one, shall be hereby invalidated or impaired.', s:'Indian Appropriations Act — 25 U.S.C. § 71, 1871'}],
  27:[{q:'Null and void to every intent and purpose whatsoever.', s:'Treaty of Washington voiding the Treaty of Indian Springs — Creek Nation, 1826'}],
  34:[{q:'Because Congress has not said otherwise, we hold the government to its word.', s:'Justice Neil Gorsuch — McGirt v. Oklahoma, 2020'}],
  36:[{q:'Today’s decision renders Section 2 all but a dead letter.', s:'Justice Elena Kagan, dissenting — Louisiana v. Callais, 2026'}]
};

/* ── Small helpers ─────────────────────────────────────────────── */
function $(s, c){ return (c||document).querySelector(s); }
function $$(s, c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }
function esc(t){ var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
function firstSentences(text, max){
  if(!text) return '';
  if(text.length <= max) return text;
  var cut = text.slice(0, max);
  var p = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.”'), cut.lastIndexOf('.)'));
  return p > 60 ? text.slice(0, p+1) : cut + '…';
}
function scField(n, labels){
  for(var i=0;i<n.sc.length;i++) if(labels.indexOf(n.sc[i].l)!==-1) return n.sc[i].x;
  return '';
}

/* Node degree + connection lookup */
var NODE_CONNS = (function(){
  var m = {}; D.forEach(function(_,i){ m[i]=[]; });
  CONNECTIONS.forEach(function(c){ m[c[0]].push({other:c[1], type:c[2], dir:'out'}); m[c[1]].push({other:c[0], type:c[2], dir:'in'}); });
  return m;
})();

/* ═════════════════ ROUTER ═════════════════ */
var currentPage = null;
var currentRouteKey = null;
var pageInited = {};

/* Per-route scroll memory: first visit starts at top; returning to a
   route during the session restores where the reader left off. */
var pageScroll = {};
try{ pageScroll = JSON.parse(sessionStorage.getItem('pt-scroll')||'{}'); }catch(e){}
function saveScroll(){
  if(currentRouteKey===null) return;
  pageScroll[currentRouteKey] = window.scrollY;
  try{ sessionStorage.setItem('pt-scroll', JSON.stringify(pageScroll)); }catch(e){}
}
function restoreScroll(key){
  var y = pageScroll[key] || 0;
  window.scrollTo({top:y, left:0, behavior:'instant'});
}

function parseHash(){
  var h = location.hash.replace(/^#\/?/, '');
  var q = null, m = h.split('?');
  h = m[0]; if(m[1]){ q = {}; m[1].split('&').forEach(function(kv){ var p=kv.split('='); q[p[0]]=decodeURIComponent(p[1]||''); }); }
  var seg = h.split('/');
  return {page: seg[0]||'home', sub: seg[1]||null, q:q};
}
function go(page, sub, q){
  var h = '#/'+page + (sub? '/'+sub : '') + (q? '?'+Object.keys(q).map(function(k){return k+'='+encodeURIComponent(q[k]);}).join('&') : '');
  if(location.hash === h){ route(); } else { location.hash = h; }
}
function showPage(p){ go(p); } /* legacy alias used by verbatim content CTAs */

function route(){
  var r = parseHash();
  var page = ['home','pattern','essays','timeline','research'].indexOf(r.page)!==-1 ? r.page : 'home';
  var routeKey = page + (r.sub ? '/'+r.sub : '');

  if(routeKey !== currentRouteKey) saveScroll();

  $$('.page').forEach(function(el){ el.classList.remove('active'); });
  $$('.nv-tab').forEach(function(el){ el.classList.remove('active'); });
  $('#page-'+page).classList.add('active');
  $('#tab-'+page).classList.add('active');

  var routeChanged = routeKey !== currentRouteKey;
  currentPage = page;
  currentRouteKey = routeKey;

  if(!pageInited[page]){ pageInited[page]=true; initPage(page); }

  /* per-route state */
  if(page==='essays'){
    if(r.sub && ESSAYS[r.sub]) renderEssay(r.sub);
    else showEssayIndex();
  }
  if(page==='timeline'){
    ensureWeb();
    if(r.q && r.q.node!==undefined){
      var i = parseInt(r.q.node,10);
      if(!isNaN(i) && D[i]) setTimeout(function(){ webSelectNode(i, true); }, 350);
    }
  }
  if(window.ScrollTrigger && routeChanged) ScrollTrigger.refresh(); /* refresh FIRST — its scroll memory must not fight the restore */
  if(routeChanged){
    restoreScroll(routeKey);                                        /* sync — layout is ready after class switch */
    requestAnimationFrame(function(){                               /* reinforcement after fonts/images settle — */
      if(currentRouteKey === routeKey) restoreScroll(routeKey);     /* guarded so a late callback can't drag an old */
    });                                                             /* page's position onto the new page */
  }
}
window.addEventListener('beforeunload', saveScroll);

/* ═════════════════ REVEALS ═════════════════ */
function arm(el){ el.classList.add('rv'); }
function reveal(els, opts){
  opts = opts||{};
  if(RM || !window.gsap){ els.forEach(function(e){ e.classList.add('rv-in'); e.classList.remove('rv'); }); return; }
  els.forEach(function(el, idx){
    gsap.fromTo(el, {opacity:0, y:16}, {
      opacity:1, y:0, duration: opts.duration||1.0, ease:'power2.out',
      delay: (opts.stagger? (idx%6)*opts.stagger : 0),
      scrollTrigger:{trigger: el, start:'top 86%', once:true},
      onStart:function(){ el.classList.remove('rv'); }
    });
  });
}

function initPage(page){
  if(page==='home') initHome();
  if(page==='pattern') initPattern();
  if(page==='essays') reveal($$('#esIndexView .rv'));
  if(page==='research') initResearch();
}

/* ═════════════════ HOME ═════════════════ */
function initHome(){
  /* Cover: word-by-word, pulse, resolve, CTA */
  var line = $('#cvLine');
  var words = 'Something has always felt off.'.split(' ');
  line.innerHTML = words.map(function(w){ return '<span class="w">'+esc(w)+'</span>'; }).join('');
  var ws = $$('.w', line);

  if(RM || !window.gsap){
    ws.forEach(function(w){ w.style.opacity=1; w.style.transform='none'; });
    ['cvPulse'].forEach(function(id){ $('#'+id).style.display='none'; });
    $('#cvResolve').style.opacity=1; $('#cvCta').style.opacity=1; $('#cvHint').style.opacity=1;
  } else {
    var tl = gsap.timeline({delay:.6});
    tl.to(ws, {opacity:1, y:0, duration:.9, ease:'power2.out', stagger:.42})
      .to('#cvPulse', {opacity:1, duration:.8, ease:'power1.out'}, '+=.5')
      .to('#cvPulse', {scale:2.4, opacity:0, duration:1.6, ease:'power1.out', repeat:1})
      .set('#cvPulse', {display:'none'})
      .to('#cvResolve', {opacity:1, duration:1.4, ease:'power1.out'}, '-=.4')
      .to('#cvCta', {opacity:1, duration:1.1, ease:'power1.out'}, '-=.3')
      .to('#cvHint', {opacity:.7, duration:1}, '-=.5');
  }

  /* Founding essay reveals:每 direct child block */
  var body = $('#page-home .hm-body');
  if(body){
    var blocks = $$(':scope > *', body);
    blocks.forEach(arm); reveal(blocks);
  }
  ['.hm-header','.hm-citations','.hm-cta-wrap'].forEach(function(sel){
    var el = $('#page-home '+sel); if(el){ arm(el); reveal([el]); }
  });
  initCiteTips($('#page-home'));
  initProgressRail();
}

function initProgressRail(){
  var rail = $('#progressRail');
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    rail.style.width = (max>0 ? (h.scrollTop/max*100) : 0) + '%';
  }, {passive:true});
}

/* Citation tooltips — sup.hm-cite / es-cite match numbered citation items */
function initCiteTips(scope){
  var tip = $('#citeTip');
  $$('sup.hm-cite, sup.es-cite', scope).forEach(function(sup){
    sup.addEventListener('mouseenter', function(e){
      var num = sup.textContent.trim();
      var item = null;
      $$('.hm-cite-item, .es-cite-item', scope).forEach(function(it){
        var n = $('.hm-cite-num, .es-cite-num', it);
        if(n && n.textContent.trim()===num && !item) item = it;
      });
      if(!item) return;
      var txt = $('.hm-cite-text, .es-cite-text', item);
      tip.innerHTML = txt ? txt.innerHTML : item.innerHTML;
      tip.classList.add('show');
      positionTip(e);
    });
    sup.addEventListener('mousemove', positionTip);
    sup.addEventListener('mouseleave', function(){ tip.classList.remove('show'); });
  });
  function positionTip(e){
    var pad=16, w=tip.offsetWidth, hgt=tip.offsetHeight;
    var x = Math.min(e.clientX+pad, window.innerWidth - w - 12);
    var y = e.clientY - hgt - pad; if(y < 60) y = e.clientY + pad;
    tip.style.left=x+'px'; tip.style.top=y+'px';
  }
}

/* ═════════════════ THE PATTERN PAGE ═════════════════ */
function initPattern(){
  var pg = $('#page-pattern');

  /* Expanders (verbatim content uses onclick="ptToggle(this)") */
  /* Then vs Now flip construction */
  $$('.pt-tnow .pt-card', pg).forEach(function(card){
    var cols = $('.pt-card-cols', card);
    var hidden = $('.pt-hidden-connection', card);
    var refl = $('.pt-reflection', card);
    if(!cols || !hidden) return;
    var stage = document.createElement('div'); stage.className='flip-stage';
    var front = document.createElement('div'); front.className='flip-front';
    var back  = document.createElement('div'); back.className='flip-back';
    cols.parentNode.insertBefore(stage, cols);
    front.appendChild(cols);
    var fBtn = document.createElement('button');
    fBtn.className='flip-btn'; fBtn.innerHTML='Reveal the hidden connection &#8635;';
    fBtn.onclick = function(){ flip(stage, true); };
    front.appendChild(fBtn);
    back.appendChild(hidden);
    if(refl) back.appendChild(refl);
    var bBtn = document.createElement('button');
    bBtn.className='flip-btn'; bBtn.innerHTML='&#8634; Back to the record';
    bBtn.onclick = function(){ flip(stage, false); };
    back.appendChild(bBtn);
    stage.appendChild(front); stage.appendChild(back);
    sizeStage(stage, front, back);
  });
  window.addEventListener('resize', function(){
    $$('.flip-stage', pg).forEach(function(st){
      sizeStage(st, $('.flip-front',st), $('.flip-back',st));
    });
  });

  buildChain();

  /* Scroll reveals for section shells and cards */
  var revealSets = [
    '.pt-hero .pt-eyebrow,.pt-hero .pt-h1,.pt-hero .pt-hero-body-wrap,.pt-hero .pt-ctas',
    '.pt-section-label,.pt-section-h,.pt-section-sub',
    '.pt-decision-item', '.pt-tnow .pt-card', '.pt-step,.pt-step-arrow',
    '.pt-now-item', '.pt-pt-item', '.pt-pen-insight', '.pt-action',
    '.pt-closing-body > *', '.pt-follow-btns'
  ];
  revealSets.forEach(function(sel){
    var els = $$(sel, pg); els.forEach(arm);
    reveal(els, {stagger:.12});
  });

  armChainTriggers();
}

function sizeStage(stage, front, back){
  stage.style.height='auto';
  var wasFlipped = stage.classList.contains('flipped');
  stage.classList.remove('flipped');
  var fh = front.offsetHeight;
  back.style.position='static'; var bh = back.offsetHeight; back.style.position='';
  stage.style.height = Math.max(fh,bh)+'px';
  if(wasFlipped) stage.classList.add('flipped');
}
function flip(stage, toBack){
  if(RM){ stage.classList.toggle('flipped', toBack); return; }
  stage.classList.toggle('flipped', toBack);
}

function ptToggle(btn){
  var wrap = btn.closest('.pt-expand-wrap');
  var content = $('.pt-expand-content', wrap);
  var open = wrap.classList.toggle('open');
  content.style.maxHeight = open ? content.scrollHeight+'px' : '0px';
}

/* ── The Unbroken Chain ────────────────────────────────────────── */
function buildChain(){
  var mount = $('#chainMount');
  var html = '';

  html += '<p class="ch-note rv">The chain runs 1662 to 2026 — three hundred sixty-four years. The record behind it goes back fourteen thousand. Every link below is a documented instrument. Click any link to open it.</p>';
  html += '<div class="ch-counter" id="chCounter" aria-hidden="true">BEFORE</div>';
  html += '<div class="ch-frame">';

  D.forEach(function(n, i){
    var cat = CAT[n.c];
    var cls = 'ch-item';
    if(i <= PROLOGUE_END) cls += ' prologue';
    if(ALERT_IDX[i]) cls += ' alert';
    if(i === TERMINUS_IDX) cls += ' terminus';

    if(i === PROLOGUE_END+1){
      html += '<div class="ch-threshold rv"><span>1662 — The chain begins</span></div>';
    }

    html += '<div class="'+cls+'" data-i="'+i+'" id="chItem'+i+'">';
    html += '<span class="ch-year">'+esc(n.s)+'</span>';
    html += '<span class="ch-dot"></span>';
    html += '<div class="ch-rail"></div>';
    html += '<div class="ch-body" role="button" tabindex="0" aria-expanded="false" aria-label="'+esc(n.t)+' — open detail">';
    if(ALERT_PHRASE[i]) html += '<p class="ch-alert-phrase">'+esc(ALERT_PHRASE[i])+'</p>';
    if(i===TERMINUS_IDX) html += '<p class="ch-alert-phrase" style="color:var(--statute-t)">Present Tense</p>';
    html += '<span class="ch-badge" style="color:'+cat.col+';border-color:'+cat.col+'55">'+esc(cat.name)+'</span>';
    html += '<h3 class="ch-title">'+n.t+'</h3>';
    html += '<p class="ch-text">'+firstSentences(scField(n,['What Occurred']), 210)+'</p>';
    html += '<p class="ch-more">+ Open the record</p>';
    html += '<div class="ch-detail" id="chDetail'+i+'"></div>';
    html += '</div></div>';

    (STATIONS[i]||[]).forEach(function(st, k){
      var pair = (STATIONS[i].length>1);
      if(!pair || k===0) html += '<div class="ch-quote rv'+(pair?' paired':'')+'" >';
      html += '<div class="'+(k>0?'ch-quote-b':'')+'">';
      html += '<p class="ch-quote-text">'+esc(st.q)+'</p>';
      html += '<p class="ch-quote-src">'+esc(st.s)+'</p>';
      html += '</div>';
      if(!pair || k===STATIONS[i].length-1) html += '</div>';
    });
  });

  html += '</div>'; /* ch-frame */

  /* Today coda — kept from the current site, verbatim text */
  html += '<div class="ch-coda" id="chCoda">'
    + '<p class="ch-coda-label rv">Today</p>'
    + '<p class="ch-coda-text rv">The Dawes Rolls remain the primary federal gateway to Indigenous political status. Algorithmic systems reproduce discriminatory outcomes through neutral-appearing variables. The 1619 Project legislative restrictions are active law in 18 states.</p>'
    + '<p class="ch-coda-final rv">The chain has no break.</p>'
    + '</div>';

  mount.innerHTML = html;

  /* Click-to-expand */
  $$('.ch-body', mount).forEach(function(body){
    var item = body.closest('.ch-item');
    var i = parseInt(item.dataset.i, 10);
    function togg(){
      var det = $('#chDetail'+i);
      var open = !item.classList.contains('exp');
      if(open && !det.innerHTML){
        var n = D[i], inner = '<div class="ch-detail-in">';
        n.sc.forEach(function(s){
          inner += '<div class="ch-detail-sec"><p class="ch-detail-label">'+esc(s.l)+'</p><p class="ch-detail-text">'+s.x+'</p></div>';
        });
        inner += '<button class="rd-map-btn" onclick="event.stopPropagation();go(\'timeline\',null,{node:'+i+'})">View in the Pattern Web &#8594;</button>';
        inner += '</div>';
        det.innerHTML = inner;
      }
      item.classList.toggle('exp', open);
      body.setAttribute('aria-expanded', open);
      det.style.maxHeight = open ? det.scrollHeight+'px' : '0px';
    }
    body.addEventListener('click', togg);
    body.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); togg(); } });
  });
}

function armChainTriggers(){
  var counter = $('#chCounter');
  if(RM || !window.gsap){
    $$('.ch-item').forEach(function(it){
      it.classList.add('armed');
      $('.ch-rail', it).style.transform='scaleY(1)';
    });
    $$('#chainMount .rv').forEach(function(e){ e.classList.add('rv-in'); });
    return;
  }
  $$('.ch-item').forEach(function(item){
    var i = parseInt(item.dataset.i,10);
    var year = $('.ch-year',item), dot=$('.ch-dot',item), rail=$('.ch-rail',item), body=$('.ch-body',item);
    gsap.set([year,dot,body],{opacity:0});
    gsap.set(year,{y:12}); gsap.set(body,{y:16});
    var tl = gsap.timeline({
      scrollTrigger:{trigger:item, start:'top 80%', once:true,
        onEnter:function(){
          if(counter) counter.textContent = (i<=PROLOGUE_END) ? 'BEFORE' : D[i].s.toUpperCase();
          if(ALERT_IDX[i] || i===TERMINUS_IDX) item.classList.add('armed');
        }},
    });
    tl.to(year,{opacity:1,y:0,duration:.7,ease:'power2.out'})
      .to(dot,{opacity:1,duration:.4},'-=.4')
      .to(body,{opacity:1,y:0,duration:.9,ease:'power2.out'},'-=.2')
      .to(rail,{scaleY:1,duration:1.0,ease:'power1.out'},'-=.5');
  });
  reveal($$('#chainMount .rv'));
  reveal($$('.ch-quote'), {duration:1.3});
  /* coda hold */
  var coda = $('#chCoda');
  gsap.fromTo($$('.rv', coda), {opacity:0,y:16},{opacity:1,y:0,duration:1.3,ease:'power2.out',stagger:.5,
    scrollTrigger:{trigger:coda, start:'top 62%', once:true}});
}

/* ═════════════════ ESSAYS ═════════════════ */
var ESSAY_ART = {pen:'assets/web/essay-01-1600w.jpg', scale:'assets/web/essay-02-1600w.jpg', binary:'assets/web/essay-03-1600w.jpg', nextsteps:'assets/web/essay-04-1600w.jpg'};

function openEssay(key){ go('essays', key); }
function closeEssay(){ go('essays'); }
function showEssayIndex(){
  $('#esReaderView').style.display='none';
  $('#esIndexView').style.display='block';
}
function renderEssay(key){
  var e = ESSAYS[key];
  $('#esIndexView').style.display='none';
  var rv = $('#esReaderView'); rv.style.display='block';
  $('#esReaderTitle').textContent = e.title;
  $('#esChapterArt').style.backgroundImage = 'url('+ESSAY_ART[key]+')';
  var body = $('#esReaderBody');
  body.innerHTML = e.html;

  /* Essay Four: mark the developing-argument divider the author wrote */
  if(key==='nextsteps'){
    $$('p,h2,h3', body).forEach(function(el){
      var t = el.textContent.toLowerCase();
      if(t.indexOf('developing argument')!==-1 && el.textContent.length < 400) el.classList.add('dev-arg');
    });
  }

  /* Binary essay: two-forces interstitial before the physics counter-arguments */
  if(key==='binary'){
    var target = null;
    $$('h2,h3', body).forEach(function(h){
      var t=h.textContent.toLowerCase();
      if(!target && (t.indexOf('physics')!==-1 || t.indexOf('counter')!==-1)) target=h;
    });
    var vis = document.createElement('div');
    vis.className='bin-visual';
    vis.innerHTML =
      '<svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two equal columns facing each other across a shared field — the space between them is not empty">'
      +'<rect x="52" y="40" width="14" height="160" fill="none" stroke="#f0e6cc" stroke-width="1.5" opacity=".85"/>'
      +'<rect x="374" y="40" width="14" height="160" fill="none" stroke="#f0e6cc" stroke-width="1.5" opacity=".85"/>'
      +'<circle cx="220" cy="120" r="58" fill="none" stroke="#c9a84c" stroke-width="1" opacity=".9"/>'
      +'<path d="M 178 120 a 42 42 0 0 1 84 0 a 42 42 0 0 1 -84 0" fill="none" stroke="#c9a84c" stroke-width="1" opacity=".55"/>'
      +'<ellipse cx="220" cy="120" rx="24" ry="58" fill="none" stroke="#c9a84c" stroke-width="1" opacity=".7"/>'
      +'<line x1="66" y1="120" x2="162" y2="120" stroke="#c9a84c" stroke-width=".8" opacity=".5"/>'
      +'<line x1="278" y1="120" x2="374" y2="120" stroke="#c9a84c" stroke-width=".8" opacity=".5"/>'
      +'</svg>'
      +'<p class="bin-caption">Two forces. The field between them was never empty.</p>';
    if(target) target.parentNode.insertBefore(vis, target);
    else body.appendChild(vis);
  }

  /* Reveals + citations */
  var blocks = $$('.es-essay-body > *', body.parentNode);
  blocks.forEach(arm); reveal(blocks);
  initCiteTips(rv);
  /* scroll position handled by the router's per-route memory */
  if(window.ScrollTrigger) requestAnimationFrame(function(){ ScrollTrigger.refresh(); });
}

/* ═════════════════ TIMELINE — shared pieces ═════════════════ */
var activeFilters = [];

function switchView(v){
  $('#vt-web').classList.toggle('vt-active', v==='web');
  $('#vt-linear').classList.toggle('vt-active', v==='linear');
  $('#view-web').style.display = v==='web' ? 'block':'none';
  $('#view-linear').style.display = v==='linear' ? 'block':'none';
  $('#vt-desc-web').style.display = v==='web' ? 'block':'none';
  $('#vt-desc-linear').style.display = v==='linear' ? 'block':'none';
  if(v==='linear') buildLinear();
  if(v==='web' && window.PW) PW.onShow();
}

function toggleFilter(type){
  var i = activeFilters.indexOf(type);
  if(i===-1) activeFilters.push(type); else activeFilters.splice(i,1);
  $$('.vt-filter').forEach(function(b){ b.classList.toggle('on', activeFilters.indexOf(b.dataset.type)!==-1); });
  if(window.PW) PW.applyFilters(activeFilters);
  applyLinearFilters();
}

function filteredNodeSet(){
  if(!activeFilters.length) return null; /* null = all */
  var s = {};
  CONNECTIONS.forEach(function(c){
    if(activeFilters.indexOf(c[2])!==-1){ s[c[0]]=1; s[c[1]]=1; }
  });
  return s;
}

/* Shared node-detail renderer (web panel, linear expand, research detail) */
function nodeDetailHTML(i, opts){
  opts = opts||{};
  var n = D[i], cat = CAT[n.c], rd = RD[n.y] || {};
  var html = '';
  html += '<div class="rd-meta"><span class="rd-badge" style="color:'+cat.col+';border-color:'+cat.col+'66">'+esc(n.y)+'</span><span class="rd-cat">'+esc(cat.name)+'</span></div>';
  html += '<h2 class="rd-title">'+n.t+'</h2>';

  var thesisText = rd.tc || scField(n,['Thesis Impact','Thesis Connection']);
  if(thesisText) html += '<div class="rd-thesis"><div class="rd-thesis-label">Thesis Connection</div><div class="rd-thesis-text">'+thesisText+'</div></div>';
  if(rd.cp) html += '<div class="rd-chain"><div class="rd-chain-label">Chain Position</div><div class="rd-chain-text">'+rd.cp+'</div></div>';

  var wo = rd.wo || scField(n,['What Occurred']);
  if(wo) html += '<div class="rd-section"><div class="rd-section-label">What Occurred</div><div class="rd-section-text">'+wo+'</div></div>';
  var ps = rd.ps || scField(n,['Primary Source','Primary Support']);
  if(ps) html += '<div class="rd-section"><div class="rd-section-label">Primary Source</div><div class="rd-section-text">'+ps+'</div></div>';
  var rc = rd.rc || scField(n,['Research Context','Research']);
  if(rc) html += '<div class="rd-section"><div class="rd-section-label">Research Context</div><div class="rd-section-text">'+rc+'</div></div>';

  if(rd.ap && rd.ap.length){
    html += '<div class="rd-section"><div class="rd-section-label">Analytical Points</div><div class="rd-ap-list">';
    rd.ap.forEach(function(pt,idx){ html += '<div class="rd-ap-item"><span class="rd-ap-num">'+(idx+1)+'</span><span class="rd-ap-text">'+pt+'</span></div>'; });
    html += '</div></div>';
  }
  var covered = ['What Occurred','Primary Source','Primary Support','Research Context','Research','Thesis Impact','Thesis Connection'];
  n.sc.forEach(function(s){
    if(covered.indexOf(s.l)===-1) html += '<div class="rd-section"><div class="rd-section-label">'+esc(s.l)+'</div><div class="rd-section-text">'+s.x+'</div></div>';
  });

  /* Documented connections */
  if(opts.connections !== false && NODE_CONNS[i].length){
    html += '<div class="rd-conns"><div class="rd-section-label">Documented Connections</div>';
    NODE_CONNS[i].forEach(function(c){
      var o = D[c.other];
      html += '<button class="rd-conn" onclick="'+(opts.connOnClick||'webSelectNode')+'('+c.other+', true)">'
        + '<span class="rd-conn-dot" style="background:'+TYPE_COLORS[c.type]+'"></span>'
        + '<span class="rd-conn-year">'+esc(o.s)+'</span>'
        + '<span class="rd-conn-label">'+esc(o.l)+'</span>'
        + '<span class="rd-conn-type">'+esc(TYPE_LABELS[c.type])+'</span>'
        + '</button>';
    });
    html += '</div>';
  }

  if(rd.cites && rd.cites.length){
    html += '<div class="rd-citations"><div class="rd-citations-label">Citations &amp; Sources</div>';
    rd.cites.forEach(function(c){ html += '<div class="rd-cite">'+c+'</div>'; });
    html += '</div>';
  }

  html += '<div class="rd-tags">';
  (n.tg||[]).forEach(function(t){ html += '<span class="rd-tag">'+esc(t)+'</span>'; });
  html += '</div>';

  if(MAPS[n.s]) html += '<button class="rd-map-btn" onclick="openMap(\''+n.s+'\')">&#9670; View the Primary Map</button>';
  return html;
}

/* Web panel open/close (PW calls into these) */
function openWebPanel(i){
  $('#webPanelContent').innerHTML = nodeDetailHTML(i, {connOnClick:'webSelectNode'});
  $('#webPanel').classList.add('open');
  $('#webPanelContent').scrollTop = 0;
}
function closeWebPanel(){
  $('#webPanel').classList.remove('open');
  if(window.PW) PW.deselect();
}
function webSelectNode(i, fly){
  if(currentPage!=='timeline'){ go('timeline', null, {node:i}); return; }
  switchView('web');
  if(window.PW) PW.select(i, fly!==false);
  else openWebPanel(i);
}

/* Linear view */
var linearBuilt = false;
function buildLinear(){
  if(linearBuilt) { applyLinearFilters(); return; }
  linearBuilt = true;
  var list = $('#lnList'), html='';
  D.forEach(function(n,i){
    var cat = CAT[n.c];
    html += '<div><button class="ln-item" id="lnItem'+i+'" onclick="lnToggle('+i+')" aria-expanded="false">'
      + '<span class="ln-year">'+esc(n.s)+'</span>'
      + '<span class="ln-dot" style="background:'+cat.col+'"></span>'
      + '<span class="ln-info"><span class="ln-label">'+esc(cat.name)+'</span><span class="ln-title">'+n.t+'</span></span>'
      + '</button><div class="ln-detail" id="lnDetail'+i+'"></div></div>';
  });
  list.innerHTML = html;
}
function lnToggle(i){
  var det = $('#lnDetail'+i), item = $('#lnItem'+i);
  var open = !item.classList.contains('sel');
  $$('.ln-item.sel').forEach(function(el){ el.classList.remove('sel'); el.setAttribute('aria-expanded','false'); });
  $$('.ln-detail').forEach(function(el){ el.style.maxHeight='0px'; });
  if(open){
    if(!det.innerHTML) det.innerHTML = '<div class="ln-detail-in">'+nodeDetailHTML(i,{connOnClick:'lnJump'})+'</div>';
    item.classList.add('sel'); item.setAttribute('aria-expanded','true');
    det.style.maxHeight = det.scrollHeight+'px';
    setTimeout(function(){ det.style.maxHeight = det.scrollHeight+'px'; }, 400);
  }
}
function lnJump(i){
  lnToggle(i);
  var el = $('#lnItem'+i); if(el) el.scrollIntoView({behavior: RM?'auto':'smooth', block:'center'});
}
function applyLinearFilters(){
  var set = filteredNodeSet();
  $$('.ln-item').forEach(function(el){
    var i = parseInt(el.id.replace('lnItem',''),10);
    el.style.opacity = (!set || set[i]) ? 1 : .25;
  });
}

/* Lazy web init */
var webInited = false;
function ensureWeb(){
  if(webInited) { if(window.PW) PW.onShow(); return; }
  webInited = true;
  if(window.PW) PW.init();
}

/* ═════════════════ RESEARCH ═════════════════ */
var rpCat = [], rpConn = [], rpQuery = '';
function initResearch(){
  $('#rpSearch').addEventListener('input', function(){ rpQuery = this.value.toLowerCase(); buildResearchList(); });
  buildResearchList();
}
function rpToggleCat(c){
  var i = rpCat.indexOf(c); if(i===-1) rpCat.push(c); else rpCat.splice(i,1);
  $$('#rpCatFilters .rp-f').forEach(function(b){ b.classList.toggle('on', rpCat.indexOf(b.dataset.c)!==-1); });
  buildResearchList();
}
function rpToggleConn(t){
  var i = rpConn.indexOf(t); if(i===-1) rpConn.push(t); else rpConn.splice(i,1);
  $$('#rpConnFilters .rp-f').forEach(function(b){ b.classList.toggle('on', rpConn.indexOf(b.dataset.t)!==-1); });
  buildResearchList();
}
function rpMatches(i){
  var n = D[i];
  if(rpCat.length && rpCat.indexOf(n.c)===-1) return false;
  if(rpConn.length){
    var hit = NODE_CONNS[i].some(function(c){ return rpConn.indexOf(c.type)!==-1; });
    if(!hit) return false;
  }
  if(rpQuery){
    var rd = RD[n.y]||{};
    var hay = (n.y+' '+n.l+' '+n.t+' '+(n.tg||[]).join(' ')+' '
      + n.sc.map(function(s){return s.x;}).join(' ')+' '
      + (rd.wo||'')+' '+(rd.ps||'')+' '+(rd.rc||'')+' '+(rd.tc||'')).toLowerCase();
    if(hay.indexOf(rpQuery)===-1) return false;
  }
  return true;
}
function buildResearchList(){
  var list = $('#rpList'), html='', count=0;
  D.forEach(function(n,i){
    if(!rpMatches(i)) return;
    count++;
    var cat = CAT[n.c];
    html += '<button class="rp-item" id="rpItem'+i+'" onclick="selectResearchItem('+i+')">'
      + '<span class="rp-item-dot" style="background:'+cat.col+'"></span>'
      + '<span class="rp-item-info"><span class="rp-item-year">'+esc(n.y)+'</span><br><span class="rp-item-label">'+esc(n.l)+'</span></span>'
      + '</button>';
  });
  list.innerHTML = html;
  $('#rpCount').textContent = count + ' of 37 Timeline Points';
}
function selectResearchItem(i){
  $$('.rp-item.active').forEach(function(el){ el.classList.remove('active'); });
  var it = $('#rpItem'+i); if(it){ it.classList.add('active'); }
  $('#rpEmpty').style.display='none';
  var det = $('#rpDetail');
  det.style.display='block';
  det.innerHTML = nodeDetailHTML(i, {connOnClick:'rpJump'});
  det.scrollTop = 0;
  if(window.innerWidth<880) det.scrollIntoView({behavior: RM?'auto':'smooth', block:'start'});
}
function rpJump(i){ selectResearchItem(i); var el=$('#rpItem'+i); if(el) el.scrollIntoView({block:'nearest'}); }

/* ═════════════════ GLOSSARY ═════════════════ */
function toggleGlossary(){
  var ov = $('#glossOverlay');
  var open = !ov.classList.contains('open');
  ov.classList.toggle('open', open);
  if(open){ var s=$('#glossSearch'); if(s) setTimeout(function(){ s.focus(); },380); }
}
function closeGlossary(){ $('#glossOverlay').classList.remove('open'); }
function closeGlossaryOutside(e){ if(e.target===$('#glossOverlay')) closeGlossary(); }
function glossFilter(){
  var q = ($('#glossSearch').value||'').toLowerCase();
  $$('.gloss-entry').forEach(function(entry){
    var text = entry.textContent.toLowerCase();
    entry.style.display = text.indexOf(q)!==-1 ? 'block':'none';
  });
  $$('.gloss-section').forEach(function(sec){
    var any = $$('.gloss-entry', sec).some(function(en){ return en.style.display!=='none'; });
    sec.style.display = any ? 'block':'none';
  });
}
document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){ closeGlossary(); closeWebPanel(); closeMap(); }
});

/* ═════════════════ MAP MODAL ═════════════════ */
function openMap(shortYear){
  var m = MAPS[shortYear]; if(!m) return;
  $('#mapModalImg').src = m.src;
  $('#mapModalImg').alt = m.caption;
  $('#mapModalCaption').textContent = m.caption;
  var link = $('#mapModalLink'); link.href = m.link; link.textContent = 'Open source record →';
  $('#mapModal').classList.add('open');
}
function closeMap(e){ if(e && e.target!==$('#mapModal') && e.type==='click' && e.currentTarget!==e.target) return; $('#mapModal').classList.remove('open'); }
function openMapFromDetail(y){ openMap(y); }

/* ═════════════════ BOOT ═════════════════ */
document.addEventListener('DOMContentLoaded', function(){
  if('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    if(ScrollTrigger.clearScrollMemory) ScrollTrigger.clearScrollMemory('manual');
  }
  /* glossary search binding (markup is verbatim; original used oninput inline?) */
  var gs = $('#glossSearch'); if(gs) gs.addEventListener('input', glossFilter);
  window.addEventListener('hashchange', route);
  route();
});
