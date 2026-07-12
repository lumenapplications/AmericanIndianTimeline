/* ═════════════════════════════════════════════════════════════════
   THE PATTERN — Pattern Web (Three.js render, d3-force layout)
   37 nodes · 63 documented connections · slow directional particle flow
   ═════════════════════════════════════════════════════════════════ */
'use strict';

var PW = (function(){
  var scene, camera, renderer, raycaster, pointer;
  var nodeMeshes = [], halos = [], alertHalos = [], edgeLines = [], particleSys = null;
  var positions = [];            /* [{x,y,z}] per node */
  var edgeData = [];             /* {curve, type, from, to, line} */
  var selected = -1, hovered = -1;
  var stage, canvas, labelLayer, labels = {};
  var rafId = null, running = false, inited = false, webglOK = true;
  var clock = 0;
  var IS_MOBILE = window.matchMedia('(max-width:760px)').matches;
  var PARTICLES_PER_EDGE = (typeof RM!=='undefined'&&RM) ? 0 : (IS_MOBILE ? 3 : 7);

  /* camera orbit state */
  var orbit = {theta: .45, phi: 1.15, dist: 560, target: null, dragging:false, px:0, py:0, vTheta:0, vPhi:0};
  var IDLE_RATE = (typeof RM!=='undefined'&&RM) ? 0 : (4 * Math.PI/180) / 60; /* 4°/min in rad/s */
  var lastInteract = 0;

  var CAT_GLOW = {h:'#3d8b68', t:'#4f83c4', s:'#e06a3a', l:'#9a76d4'};

  /* ── Layout ──────────────────────────────────────────────────── */
  function computeLayout(){
    var cached = null;
    try{ cached = JSON.parse(sessionStorage.getItem('pw-layout-v1')||'null'); }catch(e){}
    if(cached && cached.length===D.length){ positions = cached; return; }

    var nodes = D.map(function(n,i){ return {index:i}; });
    var links = CONNECTIONS.map(function(c){ return {source:c[0], target:c[1], type:c[2]}; });
    var linkDist = {reclass:95, sovereign:115, override:85, cartographic:130, echo:150};

    /* century → radial ring: deep past outside, present center (the chain closes inward) */
    function era(i){
      var s = D[i].s, y = parseInt(String(s).replace(/[^0-9-]/g,''),10);
      if(String(s).indexOf('BCE')!==-1 || isNaN(y)) y = 1500;
      return Math.max(0, Math.min(1, (2030 - y) / 500)); /* 0=present 1=deep past */
    }
    var sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance(function(l){ return linkDist[l.type]||110; }).strength(.5))
      .force('charge', d3.forceManyBody().strength(-190))
      .force('center', d3.forceCenter(0,0))
      .force('radial', d3.forceRadial(function(d){ return 60 + era(d.index)*190; }, 0, 0).strength(.32))
      .force('collide', d3.forceCollide(16))
      .stop();
    for(var t=0;t<300;t++) sim.tick();

    positions = nodes.map(function(nd,i){
      /* deterministic z from index — depth without chaos, compressed 2.5D */
      var z = (((i*2654435761)>>>0) % 1000 / 1000 - .5) * 150 * .8;
      return {x:nd.x, y:nd.y, z:z};
    });
    try{ sessionStorage.setItem('pw-layout-v1', JSON.stringify(positions)); }catch(e){}
  }

  /* ── Textures ────────────────────────────────────────────────── */
  function glowTexture(hex){
    var c = document.createElement('canvas'); c.width=c.height=128;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(64,64,0,64,64,64);
    grad.addColorStop(0,'rgba(255,255,255,.9)');
    grad.addColorStop(.25, hex+'cc');
    grad.addColorStop(.6, hex+'44');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=grad; g.fillRect(0,0,128,128);
    var tx = new THREE.CanvasTexture(c); return tx;
  }

  /* ── Init ────────────────────────────────────────────────────── */
  function init(){
    stage = document.getElementById('webStage');
    canvas = document.getElementById('webCanvas');
    labelLayer = document.getElementById('webLabels');

    try{
      renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
    }catch(e){ webglOK=false; }
    if(!webglOK || !renderer){
      webglOK = false;
      var note = document.createElement('p');
      note.className='web-fallback';
      note.textContent='3D view unavailable in this browser — showing the chronological record instead.';
      stage.parentNode.insertBefore(note, stage);
      stage.style.display='none';
      switchView('linear');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_MOBILE?1.5:1.75));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(46, 1, 1, 4000);
    orbit.target = new THREE.Vector3(0,0,0);
    raycaster = new THREE.Raycaster();
    raycaster.params.Points = {threshold: 6};
    pointer = new THREE.Vector2();

    computeLayout();
    buildNodes();
    buildEdges();
    buildParticles();
    bindInput();
    resize();
    window.addEventListener('resize', resize);

    inited = true;
    onShow();

    /* entry fade */
    if(window.gsap && !RM){
      gsap.from(orbit, {dist: 900, duration: 2.2, ease:'power2.out'});
      canvas.style.opacity = 0;
      gsap.to(canvas, {opacity:1, duration:1.4, ease:'power1.out'});
    }
  }

  function buildNodes(){
    var texCache = {};
    D.forEach(function(n,i){
      var deg = NODE_CONNS[i].length;
      var r = deg>=6 ? 9 : deg>=3 ? 6.5 : 4.6;
      var col = new THREE.Color(CAT_GLOW[n.c]);
      var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r, 20, 20),
        new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:.95})
      );
      var p = positions[i];
      mesh.position.set(p.x, p.y, p.z);
      mesh.userData.i = i;
      scene.add(mesh); nodeMeshes.push(mesh);

      if(!texCache[n.c]) texCache[n.c] = glowTexture(CAT_GLOW[n.c]);
      var halo = new THREE.Sprite(new THREE.SpriteMaterial({map:texCache[n.c], transparent:true, opacity:.75, blending:THREE.AdditiveBlending, depthWrite:false}));
      halo.scale.setScalar(r*7);
      halo.position.copy(mesh.position);
      scene.add(halo); halos.push(halo);

      /* alert / terminus pulse halo */
      if(ALERT_IDX[i] || i===TERMINUS_IDX){
        var hex = i===TERMINUS_IDX ? '#e06a3a' : '#e0c968';
        if(!texCache[hex]) texCache[hex] = glowTexture(hex);
        var ah = new THREE.Sprite(new THREE.SpriteMaterial({map:texCache[hex], transparent:true, opacity:.5, blending:THREE.AdditiveBlending, depthWrite:false}));
        ah.scale.setScalar(r*9);
        ah.position.copy(mesh.position);
        ah.userData.base = r*9;
        scene.add(ah); alertHalos.push(ah);
        if(window.gsap && !RM){
          var st = {k:0};
          gsap.to(st, {k:1, duration:2.4, ease:'sine.inOut', repeat:-1, yoyo:true, onUpdate:function(){
            ah.scale.setScalar(ah.userData.base * (1 + st.k*.5));
            ah.material.opacity = .5 - st.k*.3;
          }});
        }
      }
    });
  }

  function buildEdges(){
    CONNECTIONS.forEach(function(c){
      var a = positions[c[0]], b = positions[c[1]];
      var va = new THREE.Vector3(a.x,a.y,a.z), vb = new THREE.Vector3(b.x,b.y,b.z);
      var mid = va.clone().add(vb).multiplyScalar(.5);
      var lift = va.distanceTo(vb) * .22;
      mid.z += lift * ((c[0]+c[1])%2===0 ? 1 : -1);
      var curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      var geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(28));
      var mat = new THREE.LineBasicMaterial({color: new THREE.Color(TYPE_COLORS[c[2]]), transparent:true, opacity:.32, blending:THREE.AdditiveBlending});
      var line = new THREE.Line(geo, mat);
      scene.add(line);
      edgeLines.push(line);
      edgeData.push({curve:curve, type:c[2], from:c[0], to:c[1], line:line, speed:1});
    });
  }

  function buildParticles(){
    if(!PARTICLES_PER_EDGE) return;
    var count = edgeData.length * PARTICLES_PER_EDGE;
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count*3);
    var col = new Float32Array(count*3);
    var meta = []; /* {edge, phase} */
    var k=0;
    edgeData.forEach(function(e, ei){
      var c = new THREE.Color(TYPE_COLORS[e.type]);
      for(var j=0;j<PARTICLES_PER_EDGE;j++){
        meta.push({edge:ei, phase:j/PARTICLES_PER_EDGE});
        col[k*3]=c.r; col[k*3+1]=c.g; col[k*3+2]=c.b;
        k++;
      }
    });
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    var mat = new THREE.PointsMaterial({size:3.2, vertexColors:true, transparent:true, opacity:.85, blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true});
    particleSys = new THREE.Points(geo, mat);
    particleSys.userData.meta = meta;
    scene.add(particleSys);
  }

  /* ── Input ───────────────────────────────────────────────────── */
  function bindInput(){
    var downX=0, downY=0, moved=false;
    canvas.addEventListener('pointerdown', function(e){
      orbit.dragging=true; moved=false; downX=e.clientX; downY=e.clientY;
      orbit.px=e.clientX; orbit.py=e.clientY;
      canvas.classList.add('dragging'); canvas.setPointerCapture(e.pointerId);
      lastInteract = performance.now();
    });
    canvas.addEventListener('pointermove', function(e){
      var r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX-r.left)/r.width)*2-1;
      pointer.y = -((e.clientY-r.top)/r.height)*2+1;
      if(orbit.dragging){
        var dx = e.clientX-orbit.px, dy = e.clientY-orbit.py;
        if(Math.abs(e.clientX-downX)+Math.abs(e.clientY-downY) > 5) moved=true;
        orbit.vTheta = -dx*.0042; orbit.vPhi = -dy*.0036;
        orbit.theta += orbit.vTheta; orbit.phi += orbit.vPhi;
        orbit.phi = Math.max(.25, Math.min(Math.PI-.25, orbit.phi));
        orbit.px=e.clientX; orbit.py=e.clientY;
        lastInteract = performance.now();
      }
    });
    canvas.addEventListener('pointerup', function(e){
      orbit.dragging=false; canvas.classList.remove('dragging');
      if(!moved) handleClick();
      lastInteract = performance.now();
    });
    canvas.addEventListener('wheel', function(e){
      e.preventDefault();
      orbit.dist = Math.max(160, Math.min(1400, orbit.dist * (1 + Math.sign(e.deltaY)*.09)));
      lastInteract = performance.now();
    }, {passive:false});
    /* pinch */
    var pinchD = 0;
    canvas.addEventListener('touchstart', function(e){ if(e.touches.length===2){ pinchD = dist2(e); } }, {passive:true});
    canvas.addEventListener('touchmove', function(e){
      if(e.touches.length===2){
        var d = dist2(e);
        orbit.dist = Math.max(160, Math.min(1400, orbit.dist * (pinchD/d)));
        pinchD = d; lastInteract = performance.now();
      }
    }, {passive:true});
    function dist2(e){ var dx=e.touches[0].clientX-e.touches[1].clientX, dy=e.touches[0].clientY-e.touches[1].clientY; return Math.sqrt(dx*dx+dy*dy)||1; }
  }

  function handleClick(){
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(nodeMeshes, false);
    if(hits.length){ select(hits[0].object.userData.i, true); }
  }

  /* ── Selection & camera ──────────────────────────────────────── */
  function select(i, fly){
    selected = i;
    openWebPanel(i);
    highlight();
    if(fly && window.gsap && !RM){
      var p = positions[i];
      var tgt = new THREE.Vector3(p.x,p.y,p.z);
      gsap.to(orbit.target, {x:p.x, y:p.y, z:p.z, duration:1.2, ease:'power2.inOut'});
      gsap.to(orbit, {dist: 240, duration:1.2, ease:'power2.inOut'});
    } else if(fly){
      orbit.target.set(positions[i].x, positions[i].y, positions[i].z);
      orbit.dist = 240;
    }
  }
  function deselect(){
    selected = -1;
    highlight();
    if(window.gsap && !RM){
      gsap.to(orbit.target, {x:0,y:0,z:0, duration:1.2, ease:'power2.inOut'});
      gsap.to(orbit, {dist: 560, duration:1.2, ease:'power2.inOut'});
    } else { orbit.target.set(0,0,0); orbit.dist=560; }
  }

  /* ── Filters ─────────────────────────────────────────────────── */
  var curFilters = [];
  function applyFilters(filters){
    curFilters = filters.slice();
    highlight();
    /* reframe camera on active subgraph */
    var set = filteredNodeSet();
    if(set && window.gsap && !RM){
      var min=new THREE.Vector3(1e9,1e9,1e9), max=new THREE.Vector3(-1e9,-1e9,-1e9);
      Object.keys(set).forEach(function(k){
        var p = positions[+k];
        min.x=Math.min(min.x,p.x); min.y=Math.min(min.y,p.y); min.z=Math.min(min.z,p.z);
        max.x=Math.max(max.x,p.x); max.y=Math.max(max.y,p.y); max.z=Math.max(max.z,p.z);
      });
      var c = min.clone().add(max).multiplyScalar(.5);
      var radius = Math.max(120, min.distanceTo(max)*.62);
      gsap.to(orbit.target, {x:c.x, y:c.y, z:c.z, duration:1.4, ease:'power2.inOut'});
      gsap.to(orbit, {dist: radius*2.1, duration:1.4, ease:'power2.inOut'});
    } else if(!set && window.gsap && !RM && selected===-1){
      gsap.to(orbit.target, {x:0,y:0,z:0, duration:1.2, ease:'power2.inOut'});
      gsap.to(orbit, {dist:560, duration:1.2, ease:'power2.inOut'});
    }
  }

  function highlight(){
    var set = filteredNodeSet();  /* null = all on */
    var selSet = null;
    if(selected!==-1){
      selSet = {}; selSet[selected]=1;
      NODE_CONNS[selected].forEach(function(c){ selSet[c.other]=1; });
    }
    nodeMeshes.forEach(function(m,i){
      var on = (!set || set[i]) && (!selSet || selSet[i]);
      var target = on ? .95 : .12;
      tweenOpacity(m.material, target);
      tweenOpacity(halos[i].material, on ? .75 : .06);
    });
    edgeData.forEach(function(e){
      var typeOn = !curFilters.length || curFilters.indexOf(e.type)!==-1;
      var selOn = selected===-1 || e.from===selected || e.to===selected;
      var on = typeOn && selOn;
      tweenOpacity(e.line.material, on ? (curFilters.length||selected!==-1 ? .8 : .32) : .05);
      e.speed = on && (curFilters.length||selected!==-1) ? 1.6 : 1;
    });
    updateLabels(set, selSet);
  }
  function tweenOpacity(mat, v){
    if(window.gsap && !RM) gsap.to(mat, {opacity:v, duration:.9, ease:'power1.out'});
    else mat.opacity = v;
  }

  /* ── Labels ──────────────────────────────────────────────────── */
  function ensureLabel(i){
    if(labels[i]) return labels[i];
    var el = document.createElement('div');
    el.className='web-label';
    el.textContent = D[i].s + ' · ' + D[i].l;
    labelLayer.appendChild(el);
    labels[i] = el;
    return el;
  }
  var labelSet = {};
  function updateLabels(set, selSet){
    labelSet = {};
    Object.keys(ALERT_IDX).forEach(function(k){ labelSet[k]=1; });
    labelSet[TERMINUS_IDX]=1;
    if(selSet) Object.keys(selSet).forEach(function(k){ labelSet[k]=1; });
    else if(set && Object.keys(set).length<=14) Object.keys(set).forEach(function(k){ labelSet[k]=1; });
    Object.keys(labels).forEach(function(k){ if(!labelSet[k]) labels[k].style.opacity=0; });
    Object.keys(labelSet).forEach(function(k){ ensureLabel(+k); });
  }

  function projectLabels(){
    var r = canvas.getBoundingClientRect();
    Object.keys(labelSet).forEach(function(k){
      var i=+k, el=labels[i]; if(!el) return;
      var v = new THREE.Vector3(positions[i].x, positions[i].y, positions[i].z).project(camera);
      if(v.z>1){ el.style.opacity=0; return; }
      el.style.opacity = 1;
      el.style.left = ((v.x+1)/2*r.width)+'px';
      el.style.top  = ((-v.y+1)/2*r.height)+'px';
    });
  }

  /* ── Frame loop ──────────────────────────────────────────────── */
  var lastT = 0;
  function frame(t){
    rafId = requestAnimationFrame(frame);
    var dt = Math.min(.05, (t-lastT)/1000)||0; lastT = t;
    clock += dt;

    /* idle drift */
    if(!orbit.dragging && (performance.now()-lastInteract) > 4000) orbit.theta += IDLE_RATE*dt*60/60;

    /* camera from orbit */
    var ct = orbit.target;
    camera.position.set(
      ct.x + orbit.dist * Math.sin(orbit.phi) * Math.cos(orbit.theta),
      ct.y + orbit.dist * Math.cos(orbit.phi),
      ct.z + orbit.dist * Math.sin(orbit.phi) * Math.sin(orbit.theta)
    );
    camera.lookAt(ct);

    /* particles along curves — slow, directional */
    if(particleSys){
      var meta = particleSys.userData.meta;
      var arr = particleSys.geometry.attributes.position.array;
      for(var k=0;k<meta.length;k++){
        var e = edgeData[meta[k].edge];
        var tt = (meta[k].phase + clock*.05*e.speed) % 1;
        var p = e.curve.getPoint(tt);
        arr[k*3]=p.x; arr[k*3+1]=p.y; arr[k*3+2]=p.z;
      }
      particleSys.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
    projectLabels();
  }

  function resize(){
    if(!renderer) return;
    var r = stage.getBoundingClientRect();
    var w = r.width, h = r.height;
    renderer.setSize(w, h, false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }

  function onShow(){
    if(!inited || !webglOK) return;
    resize();
    if(!running){ running=true; rafId=requestAnimationFrame(frame); }
  }
  function onHide(){
    if(rafId) cancelAnimationFrame(rafId);
    running=false;
  }

  /* pause when tab hidden or page inactive */
  document.addEventListener('visibilitychange', function(){
    if(document.hidden) onHide();
    else if(currentPage==='timeline') onShow();
  });

  return {init:init, onShow:onShow, onHide:onHide, select:select, deselect:deselect, applyFilters:applyFilters};
})();
