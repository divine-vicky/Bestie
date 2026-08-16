/* ======================================================================
   TO MARS — A JOURNEY FOR YOU
   Everything you'd want to personalize lives in the CONFIG block below.
   ====================================================================== */

const CONFIG = {
  HER_NAME: "Maddy",

  // Put your email here — this is where her "wish" gets sent to (via a
  // mailto link, since there's no real backend behind this page).
  YOUR_EMAIL: "divineobed963@gmail.com",

  // Drop your mp3 in this same folder and put its exact filename here.
  MUSIC_FILE: "your-song.mp3",

  OPENER_LINES: [
    "Maddy — before anything else,",
    "I wanted to give you something no one else has ever gotten:",
    "a whole trip to Mars.",
    "Sit back. This one's for you."
  ],

  // Exactly 12 — one per star she finds on Mars.
  STAR_REASONS: [
    "Because your smile fixes my whole day",
    "The way you laugh at your own jokes before you even finish them",
    "You remember the small things I forget about myself",
    "You make ordinary days feel like something worth keeping",
    "The way you say my name when you're annoyed at me 😅",
    "You're the first person I want to tell good news",
    "You're patient with me even when I don't deserve it",
    "Your hugs genuinely fix bad days",
    "You make me want to be better, just by being you",
    "The random voice notes that make zero sense but make me smile anyway",
    "You believed in me before I believed in myself",
    "You know I'll always love you, my sweet Maddy 💗"
  ],

  WISH_PLACEHOLDER: "bobo write ur wish down here, I no be God 😹",

  // Shown on screen while flying from Mars to the sun.
  SUN_FLIGHT_TEXT: "I'll take you to the sun ☀️",

  // Shown big and bold once you arrive at the sun.
  BIRTHDAY_NAME: "Amanda (megastar)😹",

  // {{NAME}} gets swapped for HER_NAME automatically.
  LETTER_TEXT: `My dearest {{NAME}},

If you made it all the way to Mars with me, congratulations — you survived my slightly unhinged, way-too-elaborate way of saying something very simple: I love you.

You are, without argument, the most beautiful thing that has happened to me — yes, even on the days you steal my hoodies and never give them back.

You make ordinary moments feel like something worth keeping. The way you laugh, the way you overthink a text for twenty minutes and then just send "ok", the way you remember things I said months ago that I've already forgotten — all of it. I love all of it.

I'm not always great at saying this stuff out loud, so I built you a whole rocket launch instead. Seemed easier than words. (It was not easier. It took forever. Please appreciate this.)

So here it is, plainly: you mean the world to me, and I don't plan on letting that change any time soon.

Yours, always (and a little dramatically),
[Your Name]`
};

/* ---------------------------------------------------------------------
   1. RENDERER / SCENE / CAMERA
   --------------------------------------------------------------------- */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04060c);
scene.fog = new THREE.FogExp2(0x04060c, 0.0009);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 6000);

function resize(){
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

scene.add(new THREE.AmbientLight(0x445566, 0.6));
const sunLight = new THREE.DirectionalLight(0xffffff, 1.1);
sunLight.position.set(200,150,80);
scene.add(sunLight);

/* ---------------------------------------------------------------------
   2. STARFIELD
   --------------------------------------------------------------------- */
function buildStars(count, spread, size){
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const r = spread*(0.3+Math.random()*0.7);
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos((Math.random()*2)-1);
    pos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
    pos[i*3+2] = r*Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({ color:0xbfe8ff, size, sizeAttenuation:true, transparent:true, opacity:0.85 });
  return new THREE.Points(geo, mat);
}
const starsFar = buildStars(3200, 1900, 1.6);
scene.add(starsFar);
const starsNear = buildStars(700, 550, 2.3);
scene.add(starsNear);

/* ---------------------------------------------------------------------
   3. PLANETS (procedural textures — no external images needed)
   --------------------------------------------------------------------- */
function canvasTexture(draw, size=512){
  const c = document.createElement('canvas'); c.width=c.height=size;
  draw(c.getContext('2d'), size);
  return new THREE.CanvasTexture(c);
}

const earthTex = canvasTexture((ctx,s)=>{
  ctx.fillStyle = '#0b3d68'; ctx.fillRect(0,0,s,s);
  ctx.fillStyle = '#0f5c8c';
  for(let i=0;i<40;i++){ ctx.beginPath(); ctx.arc(Math.random()*s, Math.random()*s, 20+Math.random()*50, 0, Math.PI*2); ctx.fill(); }
  ctx.fillStyle = '#2f9e5b';
  for(let i=0;i<26;i++){ ctx.beginPath(); ctx.ellipse(Math.random()*s, Math.random()*s, 30+Math.random()*60, 18+Math.random()*40, Math.random()*Math.PI, 0, Math.PI*2); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  for(let i=0;i<10;i++){ ctx.beginPath(); ctx.ellipse(Math.random()*s, Math.random()*s*0.3, 40+Math.random()*80, 14+Math.random()*20, 0,0,Math.PI*2); ctx.fill(); }
});

const marsTex = canvasTexture((ctx,s)=>{
  ctx.fillStyle = '#7a3319'; ctx.fillRect(0,0,s,s);
  ctx.fillStyle = '#9a4a26';
  for(let i=0;i<50;i++){ ctx.beginPath(); ctx.arc(Math.random()*s, Math.random()*s, 15+Math.random()*45, 0, Math.PI*2); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for(let i=0;i<70;i++){ ctx.beginPath(); ctx.arc(Math.random()*s, Math.random()*s, 4+Math.random()*14, 0, Math.PI*2); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,220,190,0.18)';
  for(let i=0;i<8;i++){ ctx.beginPath(); ctx.arc(Math.random()*s, Math.random()*s, 6+Math.random()*10, 0, Math.PI*2); ctx.fill(); }
});

function makePlanet(radius, tex, glowColor){
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(radius,48,48), new THREE.MeshStandardMaterial({ map:tex, roughness:0.9, metalness:0.05 })));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(radius*1.12,32,32), new THREE.MeshBasicMaterial({ color:glowColor, transparent:true, opacity:0.18, side:THREE.BackSide, blending:THREE.AdditiveBlending })));
  return g;
}

const EARTH_POS = new THREE.Vector3(-70, 0, -40);
const MARS_POS  = new THREE.Vector3(130, 20, -260);

const earth = makePlanet(22, earthTex, 0x5be0ff);
earth.position.copy(EARTH_POS);
scene.add(earth);

const mars = makePlanet(26, marsTex, 0xff8a4c);
mars.position.copy(MARS_POS);
scene.add(mars);

// The sun — where the second flight (after the wish) ends up.
const SUN_POS = MARS_POS.clone().add(new THREE.Vector3(150, -20, -300));
function buildSun(radius){
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(radius,32,32), new THREE.MeshBasicMaterial({ color:0xfff2b0 })));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(radius*1.3,24,24), new THREE.MeshBasicMaterial({ color:0xffcf6b, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, side:THREE.BackSide })));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(radius*1.8,24,24), new THREE.MeshBasicMaterial({ color:0xff9a4c, transparent:true, opacity:0.18, blending:THREE.AdditiveBlending, side:THREE.BackSide })));
  return g;
}
const sun = buildSun(40);
sun.position.copy(SUN_POS);
scene.add(sun);

/* ---------------------------------------------------------------------
   4. ROCKET
   --------------------------------------------------------------------- */
function buildRocket(){
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color:0xe7ecf0, metalness:0.4, roughness:0.35 });
  const accentMat = new THREE.MeshStandardMaterial({ color:0x5be0ff, metalness:0.3, roughness:0.4 });

  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,4,16), bodyMat));

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.9,1.8,16), bodyMat);
  nose.position.y = 2.9; g.add(nose);

  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.92,0.92,0.4,16), accentMat);
  stripe.position.y = 0.4; g.add(stripe);

  const finGeo = new THREE.ConeGeometry(0.7,1.4,4);
  for(let i=0;i<3;i++){
    const fin = new THREE.Mesh(finGeo, accentMat);
    const ang = (i/3)*Math.PI*2;
    fin.position.set(Math.cos(ang)*1.1, -1.7, Math.sin(ang)*1.1);
    fin.rotation.x = Math.PI/2.4;
    fin.rotation.y = ang;
    g.add(fin);
  }

  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.55,1.4,12),
    new THREE.MeshBasicMaterial({ color:0xffb066, transparent:true, opacity:0.85, blending:THREE.AdditiveBlending }));
  flame.position.y = -2.6; flame.rotation.x = Math.PI;
  g.add(flame);
  g.userData.flame = flame;

  // Nose starts along +Y; rotate so it points along -Z, matching lookAt's
  // convention (an object's local -Z axis faces whatever it lookAt()s).
  g.rotation.x = -Math.PI/2;
  return g;
}
const rocket = buildRocket();
rocket.visible = false;
scene.add(rocket);

/* ---------------------------------------------------------------------
   5. CAMERA CONTROLS (only active once she's exploring Mars)
   --------------------------------------------------------------------- */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 45;
controls.maxDistance = 220;
controls.enabled = false;

camera.position.set(EARTH_POS.x+40, EARTH_POS.y+18, EARTH_POS.z+90);
camera.lookAt(EARTH_POS);

/* ---------------------------------------------------------------------
   6. STATE MACHINE + FLIGHT ANIMATION
   --------------------------------------------------------------------- */
let STATE = 'launch';
const LOOP_DURATION = 4200;
const FLIGHT_DURATION = 5200;
const LOOP_RADIUS = 34;
let loopStart = 0, flightStart = 0;
let flightCurve = null;

function showScene(id){
  document.querySelectorAll('.scene').forEach(el=>{
    if(el.id === id){ el.classList.remove('hidden'); el.classList.add('visible'); }
    else { el.classList.remove('visible'); el.classList.add('hidden'); }
  });
}

function beginLoop(){
  STATE = 'loop';
  loopStart = performance.now();
  rocket.visible = true;
  showScene('scene-flight');
}

function updateFlight(now){
  if(STATE === 'loop'){
    const t = Math.min(1, (now-loopStart)/LOOP_DURATION);
    const ang = -Math.PI/2 + t*Math.PI*2;
    const pos = new THREE.Vector3(
      EARTH_POS.x + Math.cos(ang)*LOOP_RADIUS,
      EARTH_POS.y + Math.sin(ang*1.3)*10,
      EARTH_POS.z + Math.sin(ang)*LOOP_RADIUS
    );
    rocket.position.copy(pos);
    const ahead = new THREE.Vector3(
      EARTH_POS.x + Math.cos(ang+0.05)*LOOP_RADIUS,
      EARTH_POS.y + Math.sin((ang+0.05)*1.3)*10,
      EARTH_POS.z + Math.sin(ang+0.05)*LOOP_RADIUS
    );
    rocket.lookAt(ahead);

    const camOffset = pos.clone().sub(EARTH_POS).normalize().multiplyScalar(26).add(new THREE.Vector3(0,10,0));
    camera.position.lerp(pos.clone().add(camOffset), 0.06);
    camera.lookAt(pos);

    if(t >= 1){
      STATE = 'flight';
      flightStart = now;
      const mid = pos.clone().lerp(MARS_POS, 0.5).add(new THREE.Vector3(20,60,-40));
      const end = MARS_POS.clone().add(new THREE.Vector3(0,0,60));
      flightCurve = new THREE.QuadraticBezierCurve3(pos.clone(), mid, end);
    }
  }
  else if(STATE === 'flight'){
    const t = Math.min(1, (now-flightStart)/FLIGHT_DURATION);
    const e = t<0.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOutQuad
    const pos = flightCurve.getPoint(e);
    const ahead = flightCurve.getPoint(Math.min(1, e+0.01));
    rocket.position.copy(pos);
    rocket.lookAt(ahead);

    const back = pos.clone().sub(ahead).normalize().multiplyScalar(22).add(new THREE.Vector3(0,8,0));
    camera.position.lerp(pos.clone().add(back), 0.08);
    camera.lookAt(pos);

    if(t >= 1) onLanded();
  }
}

function onLanded(){
  STATE = 'landed';
  rocket.visible = false;
  document.getElementById('scene-flight').classList.remove('visible');
  document.getElementById('scene-flight').classList.add('hidden');
  setTimeout(beginMars, 500);
}

/* ---------------------------------------------------------------------
   7. MARS — STAR HUNT
   --------------------------------------------------------------------- */
const STAR_RADIUS = 44;
const starMeshes = [];
let foundCount = 0;

// Hand-placed so all 12 sit on the side of Mars facing the starting camera —
// no need to orbit all the way around just to find them.
const STAR_OFFSETS = [
  {x:-35, y:30, z:20}, {x:-15, y:42, z:15}, {x:10,  y:40, z:25}, {x:32,  y:34, z:18},
  {x:44,  y:14, z:10}, {x:40,  y:-10,z:22}, {x:20,  y:-30,z:18}, {x:-5,  y:-38,z:25},
  {x:-28, y:-28,z:15}, {x:-44, y:-4, z:20}, {x:0,   y:8,  z:46}, {x:18,  y:20, z:40}
];

function starSpriteTexture(){
  const c = document.createElement('canvas'); c.width=c.height=128;
  const ctx = c.getContext('2d');
  ctx.translate(64,64);
  ctx.fillStyle = '#bfe8ff';
  ctx.shadowColor = '#5be0ff'; ctx.shadowBlur = 22;
  ctx.beginPath();
  for(let i=0;i<10;i++){
    const ang = (i/10)*Math.PI*2 - Math.PI/2;
    const rad = i%2===0 ? 46 : 19;
    const x = Math.cos(ang)*rad, y = Math.sin(ang)*rad;
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.closePath(); ctx.fill();
  return new THREE.CanvasTexture(c);
}

function buildMarsStars(){
  STAR_OFFSETS.forEach((o,i)=>{
    const mat = new THREE.SpriteMaterial({ map:starSpriteTexture(), transparent:true, blending:THREE.AdditiveBlending, depthWrite:false });
    const s = new THREE.Sprite(mat);
    s.position.set(MARS_POS.x+o.x, MARS_POS.y+o.y, MARS_POS.z+o.z);
    s.scale.set(7,7,1);
    s.userData = { index:i, found:false };
    scene.add(s);
    starMeshes.push(s);
  });
}

// The special golden star that appears once all 12 are found — tapping it
// is what opens the wish box.
let wishStar = null;
let wishStarActive = false;

function buildWishStar(){
  const mat = new THREE.SpriteMaterial({ map:starSpriteTexture(), color:0xffe9b0, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false });
  const s = new THREE.Sprite(mat);
  s.position.set(MARS_POS.x, MARS_POS.y+55, MARS_POS.z+10);
  s.scale.set(0.001,0.001,1); // invisible until revealed
  s.userData = { isWishStar:true };
  scene.add(s);
  return s;
}

function revealWishStar(){
  wishStarActive = true;
  const hint = document.getElementById('marsHint');
  hint.textContent = 'Tap the golden star to make a wish';
  hint.classList.remove('hidden');
  document.getElementById('wishStarLabel').classList.remove('hidden');
  let t = 0;
  (function grow(){
    t += 0.04;
    const s = Math.min(14, 14*Math.min(1,t));
    wishStar.scale.set(s,s,1);
    if(t < 1) requestAnimationFrame(grow);
  })();
}

function beginMars(){
  STATE = 'mars';
  buildMarsStars();
  wishStar = buildWishStar();
  camera.position.copy(MARS_POS.clone().add(new THREE.Vector3(0,20,90)));
  controls.target.copy(MARS_POS);
  controls.enabled = true;
  showScene('scene-mars');
}

function onStarFound(star){
  star.userData.found = true;
  foundCount++;
  star.material.color = new THREE.Color(0xffcf9e);

  const panel = document.getElementById('reasonPanel');
  panel.textContent = CONFIG.STAR_REASONS[star.userData.index];
  panel.classList.remove('hidden');

  document.getElementById('marsCounter').textContent = `${foundCount} / 12 found`;
  if(foundCount === 1) document.getElementById('marsHint').classList.add('hidden');
  if(foundCount >= 12) setTimeout(revealWishStar, 1200);
}

// Tap detection (distinguishes a tap from an orbit-drag)
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();
let downPos = null, downTime = 0;

renderer.domElement.addEventListener('pointerdown', (e)=>{ downPos = {x:e.clientX, y:e.clientY}; downTime = performance.now(); });
renderer.domElement.addEventListener('pointerup', (e)=>{
  if(!downPos) return;
  const dist = Math.hypot(e.clientX-downPos.x, e.clientY-downPos.y);
  const dt = performance.now()-downTime;
  downPos = null;
  if(dist > 10 || dt > 500) return; // that was a drag, not a tap
  if(STATE !== 'mars') return;

  pointerNDC.x = (e.clientX/window.innerWidth)*2-1;
  pointerNDC.y = -(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(pointerNDC, camera);
  const targets = wishStarActive ? [...starMeshes, wishStar] : starMeshes;
  const hits = raycaster.intersectObjects(targets);
  if(!hits.length) return;
  const obj = hits[0].object;
  if(obj.userData.isWishStar){ if(wishStarActive) beginWish(); }
  else if(!obj.userData.found){ onStarFound(obj); }
});

/* ---------------------------------------------------------------------
   8. WISH + CONFETTI + FLIGHT TO THE SUN + BIRTHDAY REVEAL + LETTER
   --------------------------------------------------------------------- */
function beginWish(){
  STATE = 'wish';
  controls.enabled = false;
  document.getElementById('wishStarLabel').classList.add('hidden');
  document.getElementById('wishInput').placeholder = CONFIG.WISH_PLACEHOLDER;
  showScene('scene-wish');
}

document.getElementById('wishDoneBtn').addEventListener('click', ()=>{
  const wish = document.getElementById('wishInput').value.trim();
  if(!wish){ document.getElementById('wishInput').focus(); return; }
  const subject = encodeURIComponent(`${CONFIG.HER_NAME}'s wish 🌠`);
  const body = encodeURIComponent(wish);
  try{ window.location.href = `mailto:${CONFIG.YOUR_EMAIL}?subject=${subject}&body=${body}`; }catch(err){}

  document.getElementById('scene-wish').classList.remove('visible');
  document.getElementById('scene-wish').classList.add('hidden');
  burstConfetti();
  setTimeout(beginSunFlight, 2600);
});

function burstConfetti(){
  const layer = document.getElementById('confettiLayer');
  layer.classList.remove('hidden');
  const colors = ['#5be0ff','#ffcf9e','#ff8a4c','#ffe9b0','#a9e9ff','#ffffff'];
  for(let i=0;i<70;i++){
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = (Math.random()*100)+'vw';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDuration = (2.2+Math.random()*1.6)+'s';
    p.style.animationDelay = (Math.random()*0.4)+'s';
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    layer.appendChild(p);
  }
  setTimeout(()=>{ layer.classList.add('hidden'); layer.innerHTML=''; }, 3200);
}

function heartBurst(){
  const layer = document.getElementById('confettiLayer');
  layer.classList.remove('hidden');
  const glyphs = ['💗','💛','✨','💫'];
  for(let i=0;i<26;i++){
    const p = document.createElement('div');
    p.className = 'heart-piece';
    p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    p.style.left = (Math.random()*100)+'vw';
    p.style.animationDuration = (3+Math.random()*2)+'s';
    p.style.animationDelay = (Math.random()*1)+'s';
    layer.appendChild(p);
  }
  setTimeout(()=>{ layer.classList.add('hidden'); layer.innerHTML=''; }, 5200);
}

// ---- Second flight: Mars → the sun ----
const SUN_FLIGHT_DURATION = 5200;
let sunFlightStart = 0;
let sunFlightCurve = null;

function beginSunFlight(){
  STATE = 'toSun';
  rocket.position.copy(MARS_POS.clone().add(new THREE.Vector3(0,10,50)));
  rocket.visible = true;
  showScene('scene-flight');

  const txt = document.getElementById('sunFlightText');
  txt.textContent = CONFIG.SUN_FLIGHT_TEXT;
  txt.classList.remove('hidden');

  sunFlightStart = performance.now();
  const start = rocket.position.clone();
  const mid = start.clone().lerp(SUN_POS, 0.5).add(new THREE.Vector3(0,70,0));
  const end = SUN_POS.clone().add(new THREE.Vector3(0,0,50));
  sunFlightCurve = new THREE.QuadraticBezierCurve3(start, mid, end);
}

function updateSunFlight(now){
  const t = Math.min(1, (now-sunFlightStart)/SUN_FLIGHT_DURATION);
  const e = t<0.5 ? 2*t*t : -1+(4-2*t)*t;
  const pos = sunFlightCurve.getPoint(e);
  const ahead = sunFlightCurve.getPoint(Math.min(1, e+0.01));
  rocket.position.copy(pos);
  rocket.lookAt(ahead);

  const back = pos.clone().sub(ahead).normalize().multiplyScalar(24).add(new THREE.Vector3(0,9,0));
  camera.position.lerp(pos.clone().add(back), 0.08);
  camera.lookAt(pos);

  if(t >= 1) onReachSun();
}

function onReachSun(){
  STATE = 'sunburst';
  rocket.visible = false;
  document.getElementById('sunFlightText').classList.add('hidden');
  document.getElementById('scene-flight').classList.remove('visible');
  document.getElementById('scene-flight').classList.add('hidden');

  const flash = document.getElementById('sunFlash');
  flash.classList.add('flash-active');
  setTimeout(()=> flash.classList.remove('flash-active'), 900);

  setTimeout(beginBirthday, 500);
}

function beginBirthday(){
  STATE = 'birthday';
  document.getElementById('birthdayText').innerHTML =
    `Happy Birthday<br>${CONFIG.BIRTHDAY_NAME}<br><span class="birthday-love">💗💛💗💛💗</span>`;
  showScene('scene-birthday');
  heartBurst();
  setTimeout(beginLetter, 4200);
}

function beginLetter(){
  STATE = 'letter';
  document.getElementById('letterBody').textContent = CONFIG.LETTER_TEXT.replace(/\{\{NAME\}\}/g, CONFIG.HER_NAME);
  showScene('scene-letter');
}

/* ---------------------------------------------------------------------
   9. LAUNCH SCREEN + MUSIC
   --------------------------------------------------------------------- */
(function buildOpenerLines(){
  const wrap = document.getElementById('openerLines');
  CONFIG.OPENER_LINES.forEach((line,i)=>{
    const span = document.createElement('span');
    span.textContent = line;
    span.style.animationDelay = `${0.3 + i*0.55}s`;
    wrap.appendChild(span);
  });
})();

document.getElementById('launchBtn').addEventListener('click', ()=>{
  const audio = document.getElementById('bgMusic');
  audio.src = CONFIG.MUSIC_FILE;
  audio.loop = true;
  audio.volume = 0.5;
  audio.play().catch(()=>{});
  document.getElementById('muteBtn').classList.remove('hidden');
  beginLoop();
}, { once:true });

document.getElementById('muteBtn').addEventListener('click', ()=>{
  const audio = document.getElementById('bgMusic');
  audio.muted = !audio.muted;
  document.getElementById('muteBtn').textContent = audio.muted ? '🔇' : '🔊';
});

/* ---------------------------------------------------------------------
   10. MAIN LOOP
   --------------------------------------------------------------------- */
function animate(now){
  requestAnimationFrame(animate);
  updateFlight(now||0);
  if(STATE === 'toSun') updateSunFlight(now||0);

  starsFar.rotation.y += 0.00008;
  starsNear.rotation.y += 0.00014;

  if(rocket.visible && rocket.userData.flame){
    rocket.userData.flame.scale.y = 0.8 + Math.sin((now||0)*0.02)*0.25;
  }

  if(STATE === 'mars'){
    starMeshes.forEach((s,i)=>{
      if(!s.userData.found){
        const p = 0.85 + Math.sin((now||0)*0.003 + i)*0.15;
        s.scale.set(7*p, 7*p, 1);
      }
    });
    controls.update();
  }

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
