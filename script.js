/* =================================================================
   ⚙️  CONFIGURACIÓN — cambia SOLO esta parte
   ================================================================= */
const CONFIG = {

  // 🔒 Fecha que abre el candado (la que tu pareja debe ingresar)
  //    Formato: día, mes, y los DOS últimos dígitos del año.
  fechaSecreta: { dia: 4, mes: 3, anio: 26 },   // = 03 / 05 / 23  (3 de mayo de 2023)

  // ⏱️  Fecha desde la que cuenta "Nuestro Tiempo Juntos" (año completo, mes, día)
  fechaInicio: "2026-03-04",

  // 💬 Frases que flotan sobre el carrusel
  frases: [
    "Tú haces mi mundo brillar",
    "Eres mi sueño",
    "Contigo todo es perfecto",
    "Mi lugar favorito, eres tú",
    "Juntos, por siempre"
  ],

  // 🖼️ Fotos del carrusel (reemplázalas por las tuyas en la carpeta /fotos)
  fotos: [
    "fotos/coraz.jpeg",
    "fotos/muse.jpg",
    "fotos/cin.jpeg",
    "fotos/ascen.jpeg",
    "fotos/cor.jpeg"
  ],

  // 💌 La carta
  carta:
`Bby Love, desde el primer día que te vi, supe que eras mi lugar favorito.
No hay palabras para poder expresar cuánto te amo, pero pasaré cada día demostrándotelo con hechos,
por eso te tengo que decir algo muy importante...
Reserve una tarde solo para nosotros ✨.
Te espero el 26 de junio a las 15:30 p.m. porque preparé algo con muchísimo cariño para celebrar tu cumpleaños.
No te lo pierdas, porque quiero regalarte más momentos bonitos
Te espero 💗`
};

/* =================================================================
   👇  De aquí para abajo NO necesitas tocar nada
   ================================================================= */

/* ---------- Corazones flotantes de fondo ---------- */
(function hearts(){
  const cont = document.getElementById('bgHearts');
  const N = 18;
  for(let i=0;i<N;i++){
    const h = document.createElement('div');
    h.className = 'h';
    h.textContent = '💗';
    const size = 12 + Math.random()*28;
    h.style.left = Math.random()*100 + 'vw';
    h.style.fontSize = size + 'px';
    h.style.setProperty('--s', (0.6 + Math.random()*0.9).toFixed(2));
    h.style.animationDuration = (9 + Math.random()*10) + 's';
    h.style.animationDelay = (-Math.random()*12) + 's';
    cont.appendChild(h);
  }
})();

/* ---------- Candado ---------- */
const estado = { dia:4, mes:3, anio:26 };
const limites = { dia:[1,31], mes:[1,12], anio:[20,30] };
const lockWrap = document.getElementById('lockWrap');
let abierto = false;

function pad(n){ return String(n).padStart(2,'0'); }

function pintarDials(){
  document.querySelectorAll('.dial').forEach(d=>{
    const u = d.dataset.unit;
    d.querySelector('.dial-value').textContent = pad(estado[u]);
  });
}

function cambiar(unit, dir){
  if(abierto) return;
  const [min,max] = limites[unit];
  estado[unit] += dir;
  if(estado[unit] > max) estado[unit] = min;
  if(estado[unit] < min) estado[unit] = max;
  pintarDials();
  verificar();
}

document.querySelectorAll('.dial').forEach(d=>{
  const u = d.dataset.unit;
  d.querySelector('.up').addEventListener('click', ()=>cambiar(u, 1));
  d.querySelector('.down').addEventListener('click', ()=>cambiar(u,-1));
});

function verificar(){
  const s = CONFIG.fechaSecreta;
  if(estado.dia===s.dia && estado.mes===s.mes && estado.anio===s.anio){
    abrir();
  }
}

function abrir(){
  abierto = true;
  lockWrap.classList.add('open');
  setTimeout(()=>{
    document.getElementById('lockScreen').style.display = 'none';
    const c = document.getElementById('content');
    c.classList.add('show');
    iniciarCarrusel();
    iniciarContador();
    window.scrollTo(0,0);
  }, 650);
}

// inicializa dials con el valor mínimo visible del video (01/01/20)
estado.dia=1; estado.mes=1; estado.anio=20; pintarDials();

/* ---------- Carrusel coverflow ---------- */
let cfIndex = 0, cfTimer = null;
function iniciarCarrusel(){
  const cf = document.getElementById('coverflow');
  cf.innerHTML = '';
  CONFIG.fotos.forEach((src,i)=>{
    const card = document.createElement('div');
    card.className = 'cf-card';
    const img = document.createElement('img');
    img.src = src; img.alt = 'Recuerdo ' + (i+1);
    card.appendChild(img);
    card.addEventListener('click', ()=>{ cfIndex = i; render(); reiniciarAuto(); });
    cf.appendChild(card);
  });
  render();
  reiniciarAuto();
}

function render(){
  const cards = document.querySelectorAll('.cf-card');
  const n = cards.length;
  cards.forEach((card,i)=>{
    let off = i - cfIndex;
    if(off > n/2) off -= n;
    if(off < -n/2) off += n;
    const abs = Math.abs(off);
    if(abs > 2){ card.style.opacity = 0; card.style.pointerEvents='none'; return; }
    card.style.opacity = 1; card.style.pointerEvents='auto';
    const tx = off * 64;
    const rot = off * -32;
    const sc = off === 0 ? 1 : 0.78 - (abs-1)*0.1;
    const z = 100 - abs;
    card.style.transform = `translateX(${tx}%) rotateY(${rot}deg) scale(${sc})`;
    card.style.zIndex = z;
  });
  // frase flotante
  const fp = document.getElementById('floatingPhrase');
  const frase = CONFIG.frases[cfIndex % CONFIG.frases.length] || '';
  fp.style.opacity = 0;
  setTimeout(()=>{ fp.textContent = frase; fp.style.opacity = 1; }, 250);
}

function reiniciarAuto(){
  clearInterval(cfTimer);
  cfTimer = setInterval(()=>{
    cfIndex = (cfIndex + 1) % CONFIG.fotos.length;
    render();
  }, 3500);
}

/* ---------- Contador ---------- */
function iniciarContador(){
  const inicio = new Date(CONFIG.fechaInicio + "T00:00:00");
  const el = {
    a:document.getElementById('cAnios'), me:document.getElementById('cMeses'),
    d:document.getElementById('cDias'), h:document.getElementById('cHoras'),
    mi:document.getElementById('cMin'), s:document.getElementById('cSeg')
  };
  function tick(){
    const ahora = new Date();
    let aa = ahora.getFullYear()-inicio.getFullYear();
    let mm = ahora.getMonth()-inicio.getMonth();
    let dd = ahora.getDate()-inicio.getDate();
    let hh = ahora.getHours()-inicio.getHours();
    let nn = ahora.getMinutes()-inicio.getMinutes();
    let ss = ahora.getSeconds()-inicio.getSeconds();
    if(ss<0){ ss+=60; nn--; }
    if(nn<0){ nn+=60; hh--; }
    if(hh<0){ hh+=24; dd--; }
    if(dd<0){ const m=new Date(ahora.getFullYear(),ahora.getMonth(),0).getDate(); dd+=m; mm--; }
    if(mm<0){ mm+=12; aa--; }
    el.a.textContent=aa; el.me.textContent=mm; el.d.textContent=dd;
    el.h.textContent=hh; el.mi.textContent=nn; el.s.textContent=ss;
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Carta ---------- */
const overlay = document.getElementById('letterOverlay');
document.getElementById('letterText').textContent = CONFIG.carta;
function abrirCarta(){ overlay.classList.add('show'); }
function cerrarCarta(){ overlay.classList.remove('show'); }
const env = document.getElementById('envelope');
env.addEventListener('click', abrirCarta);
env.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') abrirCarta(); });
document.getElementById('letterClose').addEventListener('click', cerrarCarta);
overlay.addEventListener('click', e=>{ if(e.target===overlay) cerrarCarta(); });
