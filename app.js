/**
 * Prototipo clicable — Plataforma PDEC (PDEC-IDACCC)
 * Sin backend: todo el estado vive en memoria + localStorage (solo para que la
 * demo se sienta "viva" entre clics). No hay llamadas de red ni datos reales.
 */

const STORAGE_KEY = 'pdec_prototipo_v1';
const app = document.getElementById('app');

// ---------------------------------------------------------------
// Estado
// ---------------------------------------------------------------
function estadoInicial() {
  const estados = {};
  const notas = {};
  FASES.forEach(f => f.componentes.forEach(c => {
    estados[c.cod] = c.estado;
    notas[c.cod] = '';
  }));
  return { role: null, viewingJacId: null, estados, notas, uploads: {} };
}

let state = cargarEstado();

function cargarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return estadoInicial();
    const parsed = JSON.parse(raw);
    const base = estadoInicial();
    return { ...base, ...parsed, estados: { ...base.estados, ...(parsed.estados || {}) }, notas: { ...base.notas, ...(parsed.notas || {}) } };
  } catch (e) { return estadoInicial(); }
}
function guardarEstado() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function resetDemo() { localStorage.removeItem(STORAGE_KEY); state = estadoInicial(); location.hash = '#/entry'; render(); }

// ---------------------------------------------------------------
// Íconos (inline SVG, trazo — nunca solo color para comunicar estado)
// ---------------------------------------------------------------
const ICON = {
  arrow: '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowLeft: '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg class="icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg class="icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  upload: '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 16V5M12 5l-4 4M12 5l4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 15.5v2.2A2.3 2.3 0 006.8 20h10.4a2.3 2.3 0 002.3-2.3v-2.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  file: '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M7 3.5h7l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3.5V8h4" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  building: '<svg class="icon" viewBox="0 0 24 24" fill="none"><rect x="4" y="3.5" width="10" height="17" rx="1" stroke="currentColor" stroke-width="1.7"/><path d="M14 9.5h6v10a1 1 0 01-1 1h-5" stroke="currentColor" stroke-width="1.7"/><path d="M7 7h1M10 7h1M7 10.5h1M10 10.5h1M7 14h1M10 14h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  users: '<svg class="icon" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8.5" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c.7-3 3-4.7 5.5-4.7S13.8 16 14.5 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="17" cy="9" r="2.4" stroke="currentColor" stroke-width="1.6"/><path d="M15.5 19c.4-2.2 1.6-3.6 3.2-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  toolbox: '<svg class="icon" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="9" width="17" height="10.5" rx="1.5" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 9V6.5a1.5 1.5 0 011.5-1.5h4a1.5 1.5 0 011.5 1.5V9" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 13.5h17" stroke="currentColor" stroke-width="1.5"/></svg>',
  info: '<svg class="icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>',
  lock: '<svg class="icon" viewBox="0 0 24 24" fill="none"><rect x="5.5" y="10.5" width="13" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  x: '<svg class="icon" viewBox="0 0 24 24" fill="none" style="width:14px;height:14px"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

// ---------------------------------------------------------------
// Utilidades de datos
// ---------------------------------------------------------------
function fase(n) { return FASES.find(f => f.n === Number(n)); }
function componente(n, cod) { return fase(n).componentes.find(c => c.cod === cod); }
function estadoDe(cod) { return state.estados[cod]; }
function setEstado(cod, e) { state.estados[cod] = e; guardarEstado(); }

function pctFases(fasesArr) {
  const total = fasesArr.reduce((a, f) => a + f.componentes.length, 0);
  const validados = fasesArr.reduce((a, f) => a + f.componentes.filter(c => estadoDe(c.cod) === 'validado').length, 0);
  return { validados, total, pct: total ? Math.round((validados / total) * 100) : 0 };
}
function pctFase(f) {
  const total = f.componentes.length;
  const validados = f.componentes.filter(c => estadoDe(c.cod) === 'validado').length;
  return { validados, total, pct: total ? Math.round((validados / total) * 100) : 0 };
}
const momento1Fases = () => FASES.filter(f => f.momento === 1);
const momento2Fases = () => FASES.filter(f => f.momento === 2);

// ---------------------------------------------------------------
// Router
// ---------------------------------------------------------------
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/entry';
  render();
});

function nav(hash) {
  // Si el hash no cambia (ej. Villa Hermosa -> "Revisar" ya estando en #/home),
  // el navegador no dispara "hashchange" — forzamos el re-render igual.
  if (location.hash === hash) render();
  else location.hash = hash;
}

function parseRoute() {
  const h = location.hash.replace(/^#\//, '');
  const parts = h.split('/').filter(Boolean);
  if (parts[0] === 'fase' && parts[1] && parts[2]) return { name: 'componente', n: parts[1], cod: parts[2] };
  if (parts[0] === 'fase' && parts[1]) return { name: 'fase', n: parts[1] };
  if (parts[0] === 'home') return { name: 'home' };
  return { name: 'entry' };
}

function render() {
  const route = parseRoute();
  if (route.name !== 'entry' && !state.role) { location.hash = '#/entry'; return; }
  document.body.classList.toggle('is-entry', route.name === 'entry');
  updateDemoBar();

  if (route.name === 'entry') return renderEntry();
  if (route.name === 'home') return renderHome();
  if (route.name === 'fase') return renderFase(route.n);
  if (route.name === 'componente') return renderComponente(route.n, route.cod);
}

// ---------------------------------------------------------------
// Barra de demo (marco del prototipo)
// ---------------------------------------------------------------
function updateDemoBar() {
  const label = document.getElementById('demo-role-label');
  const switchBtn = document.getElementById('demo-switch-role');
  if (!state.role) { label.textContent = ''; switchBtn.style.display = 'none'; return; }
  switchBtn.style.display = '';
  label.textContent = state.role === 'jac' ? 'Viendo como: JAC' : (state.viewingJacId ? `Viendo como: IDACCC → ${jacById(state.viewingJacId).nombre}` : 'Viendo como: IDACCC (portafolio)');
}
document.getElementById('demo-switch-role').addEventListener('click', () => {
  state.role = state.role === 'jac' ? 'idaccc' : 'jac';
  state.viewingJacId = state.role === 'jac' ? JAC_ACTUAL.id : null;
  guardarEstado();
  nav('#/home'); render();
});
document.getElementById('demo-reset').addEventListener('click', resetDemo);

function jacById(id) { return JAC_PORTAFOLIO.find(j => j.id === id) || JAC_ACTUAL; }

// ---------------------------------------------------------------
// Toast
// ---------------------------------------------------------------
let toastTimer;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.getElementById('tpl-toast').content.firstElementChild.cloneNode(true); document.body.appendChild(el); }
  el.innerHTML = `<span class="toast__dot"></span>${msg}`;
  requestAnimationFrame(() => el.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

// ---------------------------------------------------------------
// Modal
// ---------------------------------------------------------------
function openModal(html) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
}
function closeModal() { document.getElementById('modal-overlay')?.remove(); }

// ---------------------------------------------------------------
// Appbar compartido
// ---------------------------------------------------------------
function appbar(crumbs) {
  const isIdaccc = state.role === 'idaccc';
  const jacCtx = isIdaccc ? jacById(state.viewingJacId || JAC_ACTUAL.id) : JAC_ACTUAL;
  const badgeName = isIdaccc ? 'Equipo IDACCC' : JAC_ACTUAL.nombre;
  const badgeSub = isIdaccc ? (state.viewingJacId ? `Revisando · ${jacCtx.nombre}` : 'UCG Centro · Panel de seguimiento') : `${JAC_ACTUAL.comuna} · ${JAC_ACTUAL.municipio}`;
  const initials = isIdaccc ? 'ID' : 'JAC'.slice(0,1) + 'V';

  const crumbsHtml = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    return isLast ? `<span class="current">${c.label}</span>` : `<a onclick="nav('${c.hash}')">${c.label}</a> <span>/</span>`;
  }).join(' ');

  return `
  <div class="appbar">
    <div class="container container--wide appbar__inner">
      <div class="appbar__brand" onclick="nav('#/home')">
        <div class="appbar__logo">P</div>
        <div>
          <div class="appbar__wordmark">PDEC <span>·</span> Proceso de Planeación</div>
          <div class="appbar__sub">${isIdaccc ? 'Panel institucional IDACCC' : 'Panel de la Junta de Acción Comunal'}</div>
        </div>
      </div>
      <div class="appbar__crumbs">${crumbsHtml}</div>
      <div class="appbar__right">
        <div class="appbar__badge">
          <div class="appbar__badge-name">${badgeName}</div>
          <div class="appbar__badge-sub">${badgeSub}</div>
        </div>
        <div class="appbar__avatar ${isIdaccc ? 'appbar__avatar--idaccc' : ''}">${initials}</div>
        <button class="appbar__exit" onclick="salir()">Salir</button>
      </div>
    </div>
  </div>`;
}
function salir() { state.role = null; state.viewingJacId = null; guardarEstado(); nav('#/entry'); }

// ---------------------------------------------------------------
// PANTALLA: Entrada (simula los botones embebidos en SIIC — aquí unidos en
// una sola pantalla solo para poder demostrar ambos flujos en un prototipo)
// ---------------------------------------------------------------
function renderEntry() {
  app.innerHTML = `
  <div class="entry">
    <div class="entry__frame">
      <div class="entry__browserbar">
        <span class="entry__dot"></span><span class="entry__dot"></span><span class="entry__dot"></span>
        <span class="entry__url">idaccc.gov.co/Home/SistemaIntegrado</span>
      </div>
      <div class="entry__label">— esta pantalla no existe como tal: junta en un solo lugar dos botones que en la vida real viven separados dentro de SIIC —</div>
      <div class="entry__body">
        <div class="entry__gov">${ICON.building} Contexto simulado: dentro de <b>SIIC · GOV.CO</b></div>
        <div class="entry__title">Sistema Integrado — Módulo PDEC</div>
        <p class="entry__subtitle">En SIIC no aparece una pantalla para "elegir" quién eres. Cada botón vive en su propio panel — uno dentro del panel que ya usa la JAC, otro dentro del panel interno de IDACCC — y SIIC ya sabe quién eres cuando lo ves ahí. Un clic te lleva directo a tu vista, con el rol ya resuelto por un token firmado — sin login propio.</p>

        <div class="entry__panels">
          <button class="entry-card" onclick="entrarComo('jac')">
            <div class="entry-card__icon">${ICON.users}</div>
            <div class="entry-card__title">Panel de la JAC</div>
            <div class="entry-card__desc">Así se vería el botón dentro del panel que hoy ya usa cada JAC en SIIC. Simula el ingreso de <b>${JAC_ACTUAL.nombre}</b> — entra directo a su propia vista, sin preguntar nada más.</div>
            <div class="entry-card__cta">Entrar al módulo PDEC ${ICON.arrow}</div>
          </button>
          <button class="entry-card entry-card--idaccc" onclick="entrarComo('idaccc')">
            <div class="entry-card__icon">${ICON.building}</div>
            <div class="entry-card__title">Panel interno IDACCC</div>
            <div class="entry-card__desc">Así se vería el botón dentro del panel interno del equipo de IDACCC en SIIC. Entra directo al seguimiento y validación de todas las JAC activas.</div>
            <div class="entry-card__cta">Entrar al módulo PDEC ${ICON.arrow}</div>
          </button>
        </div>

        <div class="entry__foot">token de acceso firmado por SIIC · sin contraseña propia · el rol ya viene resuelto, nadie lo elige a mano</div>
      </div>
    </div>
  </div>`;
}
function entrarComo(role) {
  state.role = role;
  state.viewingJacId = role === 'jac' ? JAC_ACTUAL.id : null;
  guardarEstado();
  nav('#/home');
}

// ---------------------------------------------------------------
// PANTALLA: Home — avance general (la pantalla "vitrina" para el jefe)
// ---------------------------------------------------------------
function renderHome() {
  if (state.role === 'idaccc' && !state.viewingJacId) return renderHomeIdacccPortafolio();
  return renderHomeAvanceGeneral();
}

function ringSvg(pct, size = 132) {
  const r = 56, c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return `
    <div class="hero__ring" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 132 132" width="${size}" height="${size}">
        <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0B7CFF"/><stop offset="100%" stop-color="#12B7C9"/>
        </linearGradient></defs>
        <circle class="hero__ring-track" cx="66" cy="66" r="${r}"/>
        <circle class="hero__ring-fill" cx="66" cy="66" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="hero__ring-pct"><b>${pct}%</b><span>AVANCE</span></div>
    </div>`;
}

function timelineHtml(activeN) {
  return `<div class="timeline">` + FASES.map((f, i) => {
    const { pct } = pctFase(f);
    const done = pct === 100;
    const active = f.n === Number(activeN);
    return `
      <div class="timeline__step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}" onclick="nav('#/fase/${f.n}')">
        <div class="timeline__dot">${done ? '✓' : f.n}</div>
        <div class="timeline__label">${f.nombre.split(' ').slice(0,2).join(' ')}</div>
      </div>
      ${i < FASES.length - 1 ? '<div class="timeline__line"></div>' : ''}
    `;
  }).join('') + `</div>`;
}

function renderHomeAvanceGeneral() {
  const jacCtx = state.role === 'idaccc' ? jacById(state.viewingJacId) : JAC_ACTUAL;
  const general = pctFases(FASES);
  const m1 = pctFases(momento1Fases());
  const m2 = pctFases(momento2Fases());
  const isIdacccViewing = state.role === 'idaccc';

  app.innerHTML = `
    ${appbar([{ label: isIdacccViewing ? 'Portafolio' : 'Inicio', hash: isIdacccViewing ? '#/home' : '#/home' }, { label: isIdacccViewing ? jacCtx.nombre : 'Avance general' }])}
    <div class="page">
      <div class="container container--wide">

        ${isIdacccViewing ? `<button type="button" class="back-btn" onclick="volverAPortafolio()">${ICON.arrowLeft} Volver al portafolio IDACCC</button>` : ''}

        <div class="hero">
          <div class="hero__row">
            <div class="hero__ring-wrap">${ringSvg(general.pct)}</div>
            <div class="hero__info">
              <div class="hero__eyebrow">${isIdacccViewing ? 'Seguimiento IDACCC · ' + jacCtx.nombre : 'Avance general del proceso'}</div>
              <div class="hero__title">${isIdacccViewing ? `Estado del PDEC de ${jacCtx.nombre}` : `El PDEC de ${JAC_ACTUAL.nombre} va avanzando`}</div>
              <p class="hero__desc">${isIdacccViewing
                ? `Vista de seguimiento institucional: ${general.validados} de ${general.total} componentes ya están validados por IDACCC en las 6 fases del proceso.`
                : `Este es el resumen de todo el proceso: ${general.validados} de ${general.total} componentes ya están validados. Sigue por donde quedaste.`}</p>
              <div class="hero__stats">
                <div class="hero__stat"><b>${general.validados}/${general.total}</b><span>COMPONENTES VALIDADOS</span></div>
                <div class="hero__stat"><b>${m1.pct}%</b><span>MOMENTO 1</span></div>
                <div class="hero__stat"><b>${m2.pct}%</b><span>MOMENTO 2</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="section" style="margin-top:22px">
          <div class="eyebrow">Recorrido completo · 6 fases</div>
          ${timelineHtml(null)}
        </div>

        <div class="momentos">
          ${momentoCard(1, 'Momento 1', momento1Fases(), m1)}
          ${momentoCard(2, 'Momento 2', momento2Fases(), m2)}
        </div>

        <p class="footnote">Prototipo clicable — pantallas de demostración, sin conexión a datos reales · EIA Softworks</p>
      </div>
    </div>
  `;
}

function momentoCard(num, label, fasesArr, agg) {
  const rango = num === 1 ? 'Fases 1 y 2' : 'Fases 3 a 6';
  return `
    <div class="momento-card" onclick="nav('#/fase/${fasesArr[0].n}')">
      <div class="momento-card__top">
        <div>
          <span class="momento-card__tag">${label.toUpperCase()}</span>
          <div class="momento-card__title">${label} · ${rango}</div>
          <div class="momento-card__fases">${fasesArr.map(f => f.nombre).join(' · ')}</div>
        </div>
        <div class="momento-card__pct">${agg.pct}%</div>
      </div>
      <div class="bar"><div class="bar__fill" style="width:${agg.pct}%"></div></div>
      <div class="momento-card__list">
        ${fasesArr.map(f => { const p = pctFase(f); return `
          <div class="momento-card__fase-row">
            <b>F${f.n}</b> ${f.nombre}
            <div class="mini-bar"><div style="width:${p.pct}%"></div></div>
            <span>${p.validados}/${p.total}</span>
          </div>`; }).join('')}
      </div>
      <div class="momento-card__cta">Abrir ${label} ${ICON.arrow}</div>
    </div>`;
}

function portafolioLive() {
  // La fila de Villa Hermosa refleja el estado real de la demo (es la única JAC con datos
  // navegables); el resto del portafolio queda con sus cifras mock fijas.
  const real = pctFases(FASES);
  const enRevisionReal = FASES.flatMap(f => f.componentes).filter(c => estadoDe(c.cod) === 'en_revision').length;
  return JAC_PORTAFOLIO.map(j => j.id === JAC_ACTUAL.id ? { ...j, validados: real.validados, enRevision: enRevisionReal } : j);
}

function renderHomeIdacccPortafolio() {
  const portafolio = portafolioLive();
  const validadosTotal = portafolio.reduce((a, j) => a + j.validados, 0);
  const totalTotal = portafolio.reduce((a, j) => a + j.total, 0);
  const revisionTotal = portafolio.reduce((a, j) => a + j.enRevision, 0);
  const avgPct = Math.round((portafolio.reduce((a, j) => a + j.validados / j.total, 0) / portafolio.length) * 100);

  app.innerHTML = `
    ${appbar([{ label: 'Portafolio IDACCC' }])}
    <div class="page">
      <div class="container container--wide">
        <div class="eyebrow">Panel institucional · IDACCC</div>
        <h1 class="page-title">Seguimiento a todas las JAC activas</h1>
        <p class="page-desc">Vista única para el equipo de IDACCC: avance agregado de cada Junta de Acción Comunal en las 6 fases del PDEC, y acceso directo al detalle para validar.</p>

        <div class="kpis section" style="margin-top:18px">
          <div class="kpi"><div class="kpi__label">JAC activas</div><div class="kpi__value">${JAC_PORTAFOLIO.length}</div></div>
          <div class="kpi kpi--warn"><div class="kpi__label">Formatos en revisión</div><div class="kpi__value">${revisionTotal}</div></div>
          <div class="kpi kpi--ok"><div class="kpi__label">Formatos validados</div><div class="kpi__value">${validadosTotal} <small>/ ${totalTotal}</small></div></div>
          <div class="kpi kpi--accent"><div class="kpi__label">Avance promedio</div><div class="kpi__value">${avgPct}%</div></div>
        </div>

        <div class="section">
          <div class="eyebrow" style="margin-bottom:10px">Juntas de Acción Comunal</div>
          <div class="jac-list">
            ${portafolio.map(j => {
              const pct = Math.round((j.validados / j.total) * 100);
              const drillable = j.drillable;
              return `
              <div class="jac-row ${drillable ? 'is-drillable' : ''}" ${drillable ? `onclick="verJacDesdeIdaccc('${j.id}')"` : ''}>
                <div class="jac-row__avatar">${j.nombre.split(' ').slice(-1)[0].slice(0,2).toUpperCase()}</div>
                <div class="jac-row__main">
                  <div class="jac-row__name">${j.nombre}</div>
                  <div class="jac-row__sub">${j.comuna} · ${j.validados}/${j.total} validados${j.enRevision ? ` · ${j.enRevision} en revisión` : ''}</div>
                </div>
                <div class="jac-row__bar"><div class="bar"><div class="bar__fill" style="width:${pct}%"></div></div></div>
                <div class="jac-row__pct">${pct}%</div>
                <div class="jac-row__chip">${j.enRevision > 0 ? `<span class="estado estado--revision">${j.enRevision} en revisión</span>` : `<span class="estado estado--validado">Sin pendientes</span>`}</div>
                ${drillable
                  ? `<button type="button" class="btn btn-teal btn-sm jac-row__cta" onclick="event.stopPropagation(); verJacDesdeIdaccc('${j.id}')">Revisar ${ICON.arrow}</button>`
                  : `<span class="jac-row__nodemo" title="Esta demo solo tiene el detalle cargado para JAC Villa Hermosa">Sin detalle en esta demo</span>`}
              </div>`;
            }).join('')}
          </div>
        </div>

        <p class="footnote">Prototipo clicable — pantallas de demostración, sin conexión a datos reales · EIA Softworks</p>
      </div>
    </div>
  `;
}
function verJacDesdeIdaccc(id) { state.viewingJacId = id; guardarEstado(); nav('#/home'); }
function volverAPortafolio() { state.viewingJacId = null; guardarEstado(); nav('#/home'); }

// ---------------------------------------------------------------
// PANTALLA: Fase (plantilla única reutilizada por las 6 fases)
// ---------------------------------------------------------------
function renderFase(n) {
  const f = fase(n);
  const { validados, total, pct } = pctFase(f);
  const isIdaccc = state.role === 'idaccc';
  const momentoLabel = f.momento === 1 ? 'Momento 1' : 'Momento 2';

  app.innerHTML = `
    ${appbar([{ label: 'Inicio', hash: '#/home' }, { label: `Fase ${f.n}` }])}
    <div class="page">
      <div class="container">
        <button type="button" class="back-btn" onclick="nav('#/home')">${ICON.arrowLeft} Volver a Inicio</button>
        <div class="eyebrow">${momentoLabel} · Fase ${f.n} de 6</div>
        <h1 class="page-title">${f.nombre}</h1>
        <p class="page-desc">${f.resumen}</p>

        <div class="fase-tools">
          <button type="button" class="fase-tool" onclick="abrirPresentacion(${f.n})" data-tip="Contexto y objetivo de esta fase, antes de empezar a cargar evidencia">
            <div class="fase-tool__icon">${ICON.info}</div>
            <div>
              <div class="fase-tool__title">Presentación</div>
              <div class="fase-tool__desc">Qué se busca en esta fase y por qué</div>
            </div>
          </button>
          <button type="button" class="fase-tool fase-tool--teal" onclick="abrirCajaHerramientas(${f.n})" data-tip="Descarga las plantillas y guías oficiales de esta fase">
            <div class="fase-tool__icon">${ICON.toolbox}</div>
            <div>
              <div class="fase-tool__title">Caja de herramientas</div>
              <div class="fase-tool__desc">Formatos y matrices oficiales descargables</div>
            </div>
          </button>
        </div>

        <div class="section" style="margin-top:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div class="eyebrow">Componentes de esta fase</div>
            <div style="font-size:13px;font-weight:700;color:var(--ink-soft)">${validados} de ${total} validados · ${pct}%</div>
          </div>
          <div class="bar" style="margin-bottom:16px"><div class="bar__fill" style="width:${pct}%"></div></div>

          <div class="comp-list">
            ${f.componentes.map(c => {
              const est = estadoDe(c.cod);
              const meta = ESTADO_META[est];
              const accionLabel = isIdaccc ? 'Revisar' : (est === 'validado' ? 'Ver' : 'Cargar evidencia');
              return `
              <div class="comp-row">
                <div class="comp-row__cod">${c.cod}</div>
                <div class="comp-row__main">
                  <div class="comp-row__name">${c.nombre}</div>
                  <div class="comp-row__estado"><span class="estado ${meta.clase}">${meta.etiqueta}</span></div>
                </div>
                <div class="comp-row__actions">
                  <button class="btn ${isIdaccc ? 'btn-teal' : 'btn-primary'} btn-sm" onclick="nav('#/fase/${f.n}/${c.cod}')">${accionLabel} ${ICON.arrow}</button>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <p class="footnote">Prototipo clicable — pantallas de demostración, sin conexión a datos reales · EIA Softworks</p>
      </div>
    </div>
  `;
}

function abrirPresentacion(n) {
  const f = fase(n);
  openModal(`
    <div class="modal__head">
      <div><div class="modal__eyebrow">Presentación · Fase ${f.n}</div><div class="modal__title">${f.nombre}</div></div>
      <button class="modal__close" onclick="closeModal()">${ICON.x}</button>
    </div>
    <div class="modal__body">
      <p>${f.resumen}</p>
      <p>Esta ventana reemplaza la necesidad de una pantalla aparte: aquí la JAC encuentra el contexto de la fase antes de empezar a cargar evidencia, sin perder su lugar en el proceso.</p>
    </div>
  `);
}
function abrirCajaHerramientas(n) {
  const f = fase(n);
  const formatos = f.componentes.flatMap(c => c.formatos || [{ cod: `F${c.cod}`, nombre: `Formato oficial — ${c.nombre}`, tipo: 'Formato' }]);
  openModal(`
    <div class="modal__head">
      <div><div class="modal__eyebrow">Caja de herramientas · Fase ${f.n}</div><div class="modal__title">Formatos y matrices oficiales</div></div>
      <button class="modal__close" onclick="closeModal()">${ICON.x}</button>
    </div>
    <div class="modal__body">
      <p>Plantillas y guías descargables de esta fase, tal como están en los formatos oficiales del PDEC.</p>
      <div class="modal__files">
        ${formatos.map(fmt => `
          <div class="file-item">
            <div class="file-item__icon">${ICON.file}</div>
            <div class="file-item__main">
              <div class="file-item__cod">${fmt.cod} · ${fmt.tipo}</div>
              <div class="file-item__name">${fmt.nombre}</div>
            </div>
            <div class="file-item__action"><button class="btn btn-outline btn-sm" onclick="toast('En la versión real se descarga la plantilla oficial en Word.')">Descargar</button></div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
}

// ---------------------------------------------------------------
// PANTALLA: Detalle de componente (repositorio + diagnóstico)
// ---------------------------------------------------------------
function renderComponente(n, cod) {
  const f = fase(n);
  const c = componente(n, cod);
  const isIdaccc = state.role === 'idaccc';
  const est = estadoDe(c.cod);
  const meta = ESTADO_META[est];
  const formatos = c.formatos || [{ cod: `F${c.cod}`, nombre: `Formato oficial — ${c.nombre}`, tipo: 'Formato' }];
  const uploadedSet = state.uploads[c.cod] || {};

  app.innerHTML = `
    ${appbar([{ label: 'Inicio', hash: '#/home' }, { label: `Fase ${f.n}`, hash: `#/fase/${f.n}` }, { label: `${c.cod} ${c.nombre}` }])}
    <div class="page">
      <div class="container">
        <button type="button" class="back-btn" onclick="nav('#/fase/${f.n}')">${ICON.arrowLeft} Volver a Fase ${f.n}</button>
        <div class="eyebrow">Fase ${f.n} · Componente ${c.cod}</div>
        <h1 class="page-title">${c.nombre}</h1>
        <p class="page-desc">Repositorio de evidencia de este componente y su diagnóstico. ${isIdaccc ? 'La vista es la misma que ve la JAC — como IDACCC además puedes validar u observar.' : 'Aquí subes la evidencia de este componente para que IDACCC la revise.'}</p>

        <div class="detail-grid">
          <div>
            <div class="section">
              <div class="eyebrow" style="margin-bottom:10px">Repositorio</div>
              <div class="file-list">
                ${formatos.map(fmt => {
                  const up = uploadedSet[fmt.cod] || est === 'validado' || est === 'en_revision';
                  return `
                  <div class="file-item ${up ? 'is-uploaded' : ''}">
                    <div class="file-item__icon">${up ? ICON.check : ICON.file}</div>
                    <div class="file-item__main">
                      <div class="file-item__cod">${fmt.cod} · ${fmt.tipo}</div>
                      <div class="file-item__name">${fmt.nombre}</div>
                      <div class="file-item__meta">${up ? 'Cargado por la JAC · escritorio.pdf' : 'Sin cargar todavía'}</div>
                    </div>
                    <div class="file-item__action">
                      ${up
                        ? `<button class="btn btn-outline btn-sm" onclick="toast('En la versión real se abre el archivo cargado.')">Ver archivo</button>`
                        : (isIdaccc ? `<span class="estado estado--porcargar">Pendiente</span>` : `<button class="btn btn-primary btn-sm" onclick="subirArchivo('${c.cod}','${fmt.cod}')">${ICON.upload} Cargar</button>`)
                      }
                    </div>
                  </div>`;
                }).join('')}
              </div>

              ${!isIdaccc ? `
              <div class="dropzone" style="margin-top:12px" onclick="cargarEvidenciaCompleta('${c.cod}')">
                <div class="dropzone__icon">${ICON.upload}</div>
                <div class="dropzone__title">Cargar evidencia de este componente</div>
                <div class="dropzone__sub">Arrastra los archivos aquí o haz clic para simular la carga completa</div>
              </div>` : ''}
            </div>
          </div>

          <div>
            <div class="diag-box">
              <div class="diag-box__head">
                <div class="diag-box__title">Diagnóstico</div>
                <span class="estado ${meta.clase}">${meta.etiqueta}</span>
              </div>
              <div class="diag-box__note">
                ${nota_para_estado(est, isIdaccc)}
                ${state.notas[c.cod] ? `<br><br><b>Observación de IDACCC:</b> ${state.notas[c.cod]}` : ''}
              </div>

              ${isIdaccc ? `
              <div class="review-panel">
                <div class="review-panel__label">Panel de revisión · IDACCC</div>
                <textarea id="obs-${c.cod}" placeholder="Observaciones para la JAC (opcional)">${state.notas[c.cod] || ''}</textarea>
                <div class="review-panel__actions">
                  <button class="btn btn-primary btn-sm" onclick="marcarValidado('${c.cod}')">${ICON.check} Marcar como validado</button>
                  <button class="btn btn-danger-outline btn-sm" onclick="solicitarAjustes('${c.cod}')">Solicitar ajustes</button>
                </div>
              </div>` : ''}
            </div>
          </div>
        </div>

        <p class="footnote">Prototipo clicable — pantallas de demostración, sin conexión a datos reales · EIA Softworks</p>
      </div>
    </div>
  `;
}

function nota_para_estado(est, isIdaccc) {
  if (est === 'por_cargar') return isIdaccc ? 'La JAC todavía no ha cargado evidencia para este componente.' : 'Aún no has cargado evidencia. Cuando la subas, pasará a "En revisión".';
  if (est === 'en_revision') return isIdaccc ? 'Evidencia cargada por la JAC, pendiente de tu validación.' : 'Tu evidencia fue cargada y está siendo revisada por IDACCC.';
  return isIdaccc ? 'Ya validaste este componente.' : 'IDACCC ya validó este componente. ¡Buen trabajo!';
}

function subirArchivo(cod, fmtCod) {
  state.uploads[cod] = state.uploads[cod] || {};
  state.uploads[cod][fmtCod] = true;
  if (estadoDe(cod) === 'por_cargar') setEstado(cod, 'en_revision');
  guardarEstado();
  toast('Archivo cargado. El componente pasa a "En revisión".');
  render();
}
function cargarEvidenciaCompleta(cod) {
  const comp = FASES.flatMap(f => f.componentes).find(c => c.cod === cod);
  const formatos = comp.formatos || [{ cod: `F${cod}` }];
  state.uploads[cod] = state.uploads[cod] || {};
  formatos.forEach(fmt => state.uploads[cod][fmt.cod] = true);
  if (estadoDe(cod) === 'por_cargar') setEstado(cod, 'en_revision');
  guardarEstado();
  toast('Evidencia cargada. IDACCC ya puede revisarla.');
  render();
}
function marcarValidado(cod) {
  state.notas[cod] = document.getElementById(`obs-${cod}`)?.value || '';
  setEstado(cod, 'validado');
  guardarEstado();
  toast('Componente marcado como Validado.');
  render();
}
function solicitarAjustes(cod) {
  const val = document.getElementById(`obs-${cod}`)?.value || 'Revisar la información cargada y volver a enviar.';
  state.notas[cod] = val;
  setEstado(cod, 'por_cargar');
  guardarEstado();
  toast('Se solicitaron ajustes a la JAC.');
  render();
}
