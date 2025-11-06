const banderasConfig = {
  0: { nombre: "Mexico", textura: "3D_model/textures/Mexico.png" },
  1: { nombre: "USA", textura: "3D_model/textures/USA.png" },
  2: { nombre: "Canada", textura: "3D_model/textures/Canada.png" },
  3: { nombre: "Japon", textura: "3D_model/textures/Japon.png" },
  4: { nombre: "Nueva Zelanda", textura: "3D_model/textures/Nueva_Zelanda.png" },
  5: { nombre: "Iran", textura: "3D_model/textures/Iran.png" },
  6: { nombre: "Argentina", textura: "3D_model/textures/Argentina.png" },
  7: { nombre: "Uzbekistan", textura: "3D_model/textures/Urbekistan.png" },
  8: { nombre: "Corea", textura: "3D_model/textures/Corea.png" },
  9: { nombre: "Jordania", textura: "3D_model/textures/Jordania.png" },
  10: { nombre: "Australia", textura: "3D_model/textures/Australia.png" },
  11: { nombre: "Brasil", textura: "3D_model/textures/Brasil.png" },
  12: { nombre: "Ecuador", textura: "3D_model/textures/Ecuador.png" },
  13: { nombre: "Colombia", textura: "3D_model/textures/Colombia.png" },
  14: { nombre: "Paraguay", textura: "3D_model/textures/Paraguay.png" },
  15: { nombre: "Uruguay", textura: "3D_model/textures/Uruguay.png" },
  16: { nombre: "Marruecos", textura: "3D_model/textures/Marruecos.png" },
  17: { nombre: "Tunez", textura: "3D_model/textures/Tunez.png" },
  18: { nombre: "NO", textura: null }
};

let preguntasTrivia = [];
let indiceTrivia = 0;
let aciertosTrivia = 0;

const videosDisponibles = [
  "https://www.youtube.com/embed/DQtvjqm-xxI?si=fKmFhnoC2-x7ld6o&autoplay=1&mute=1",
  "https://www.youtube.com/embed/aK_850XXqTA?si=j9OCrbC-nZdok0nX&autoplay=1&mute=1",
  "https://www.youtube.com/embed/xEGizIl9yt4?si=lUZl9YzWeDx6H4tn&autoplay=1&mute=1",
  "https://www.youtube.com/embed/kjryZta6rMs?si=yD4LXJLS-VBVsw7s&autoplay=1&mute=1",
  "https://www.youtube.com/embed/HIbpTQoRp3o?si=Iw7ltzM6joPanStx&autoplay=1&mute=1",
  "https://www.youtube.com/embed/0iFtX2oMeC0?si=J1xCPaMeinvxV2tC&autoplay=1&mute=1",
  "https://www.youtube.com/embed/OtOrP362h44?si=jcSirJu4LNQDsaFd&autoplay=1&mute=1",
  "https://www.youtube.com/embed/nxWR-odH7Ck?si=_LhC09-8GGjlM7k3&autoplay=1&mute=1",
  "https://www.youtube.com/embed/Z_EbSQXs4aA?si=lmJhQMh0AABt0rby&autoplay=1&mute=1",
  "https://www.youtube.com/embed/HAiTNTTb-Q4?si=-nbVm923rU6gZj76&autoplay=1&mute=1",
  "https://www.youtube.com/embed/pMDo_xz5Uso?si=ghVXjX-zmE6UpWPP&autoplay=1&mute=1",
  "https://www.youtube.com/embed/gPThW5Ouvag?si=KKYULUpgQJXHvwd3&autoplay=1&mute=1",
  "https://www.youtube.com/embed/L3KC6SmcTVw?si=j0NURNNK8EHmB83-&autoplay=1&mute=1",
  "https://www.youtube.com/embed/eJf8oO65rTo?si=RCUy477FJ50WZu2g&autoplay=1&mute=1",
  "https://www.youtube.com/embed/Kg9YnEmZL6I?si=iikTIf7XXpI5oFQl&autoplay=1&mute=1",
  "https://www.youtube.com/embed/IBlgdHN_y7I?si=t8hZKVMVx_2-ETQz&autoplay=1&mute=1",
  "https://www.youtube.com/embed/GV75CzkOj-A?si=09LZhI6CLAH5bsmH&autoplay=1&mute=1",
  "https://www.youtube.com/embed/9EidzDKgglo?si=TjAcZ-2huNxQIbYy&autoplay=1&mute=1",
  "https://www.youtube.com/embed/FBfGUNSrid4?si=7ic4YQuOyypZvomz&autoplay=1&mute=1"
];

const VIDEO_FILTERS = {
  original: "none",
  sepia: "sepia(70%) saturate(120%)",
  bn: "grayscale(100%) contrast(110%)",
  vibrante: "hue-rotate(25deg) saturate(190%)"
};

let videoActual = 0;
let videoActivo = false;
let videoFilter = "original";

let tfModel = null;
let raSessionActive = false;
let raPredictionInterval = null;
let raScene = null;
let raCamera = null;
let raRenderer = null;
let currentModel = null;
let mixer = null;
let currentAnimations = [];
let activeAnimationAction = null;
let isAnimationPlaying = false;
let animationIsPaused = false;
let animationFinishHandler = null;
let animationSafetyTimeout = null;
let clock = null;
let pausarDeteccion = false;
let videoStream = null;
let animationFrameId = null;
let ctx = null;
let resizeObserver = null;

let paisDetectadoActual = null;
let contadorDeteccionSostenida = 0;
const DETECCIONES_REQUERIDAS = 3; // Número de detecciones consecutivas antes de cambiar
let modalTimeout = null;
let lastHighConfidenceDetection = null;

const UI = {
  viewer: null,
  stage: null,
  stagePlaceholder: null,
  video: null,
  canvas3d: null,
  frameCanvas: null,
  detectionCard: null,
  animacionCard: null,
  nombreBandera: null,
  valorConfianza: null,
  sidebarMenu: null,
  menuToggle: null,
  menuPanel: null,
  menuOverlay: null,
  menuClose: null,
  sidebarButtons: [],
  raControls: null,
  panel: null,
  panelTitle: null,
  panelBody: null,
  panelClose: null,
  startButton: null,
  diagnosticButton: null
};

let currentPanelAction = null;

document.addEventListener('DOMContentLoaded', init);

function setAnimationButtonState(state) {
  if (!UI.startButton) return;
  const icon = UI.startButton.querySelector('i');
  const label = UI.startButton.querySelector('span');

  if (icon) {
    icon.classList.remove('fa-play', 'fa-pause');
  }

  switch (state) {
    case 'pause':
      if (icon) {
        icon.classList.add('fa-pause');
      }
      if (label) {
        label.textContent = 'Pausar';
      }
      break;
    case 'resume':
      if (icon) {
        icon.classList.add('fa-play');
      }
      if (label) {
        label.textContent = 'Reanudar';
      }
      break;
    default:
      if (icon) {
        icon.classList.add('fa-play');
      }
      if (label) {
        label.textContent = 'Animar';
      }
      break;
  }
}

function clearAnimationSafetyTimer() {
  if (animationSafetyTimeout) {
    clearTimeout(animationSafetyTimeout);
    animationSafetyTimeout = null;
  }
}

function startAnimationSafetyTimer() {
  clearAnimationSafetyTimer();
  animationSafetyTimeout = setTimeout(() => {
    animationSafetyTimeout = null;
    if (isAnimationPlaying && !animationIsPaused) {
      teardownAnimationTracking();
    }
  }, 4000);
}

function teardownAnimationTracking(resetButton = true) {
  clearAnimationSafetyTimer();
  if (animationFinishHandler && mixer) {
    mixer.removeEventListener('finished', animationFinishHandler);
  }
  animationFinishHandler = null;
  if (activeAnimationAction) {
    activeAnimationAction.stop();
  }
  activeAnimationAction = null;
  isAnimationPlaying = false;
  animationIsPaused = false;
  pausarDeteccion = false;
  if (UI.animacionCard) {
    UI.animacionCard.style.display = 'none';
  }
  if (resetButton) {
    setAnimationButtonState('idle');
  }
  if (mixer) {
    mixer.stopAllAction();
  }
}

function setRAControlsVisible(shouldShow) {
  if (!UI.raControls) return;
  UI.raControls.style.display = shouldShow ? 'block' : 'none';
  if (UI.startButton) {
    UI.startButton.style.display = shouldShow ? 'inline-flex' : 'none';
    if (shouldShow && !isAnimationPlaying && !animationIsPaused) {
      setAnimationButtonState('idle');
    }
  }
  if (UI.diagnosticButton) {
    UI.diagnosticButton.style.display = shouldShow ? 'inline-flex' : 'none';
  }
  if (!shouldShow) {
    teardownAnimationTracking();
  }
}

function init() {
  UI.viewer = document.querySelector('.ra-viewer');
  UI.stage = document.querySelector('.ra-viewer__stage');
  UI.stagePlaceholder = document.getElementById('stage-placeholder');
  UI.video = document.getElementById('video');
  UI.canvas3d = document.getElementById('canvas3d');
  UI.frameCanvas = document.getElementById('frameCanvas');
  UI.detectionCard = document.getElementById('deteccion-info');
  UI.animacionCard = document.getElementById('animacion-progreso');
  UI.nombreBandera = document.getElementById('nombre-bandera');
  UI.valorConfianza = document.getElementById('valor-confianza');
  UI.sidebarMenu = document.getElementById('sidebar-menu');
  UI.menuToggle = document.getElementById('menu-toggle');
  UI.menuPanel = document.getElementById('menu-panel');
  UI.menuOverlay = document.getElementById('menu-overlay');
  UI.menuClose = document.getElementById('menu-close');
  UI.sidebarButtons = Array.from(document.querySelectorAll('.sidebar-btn'));
  UI.raControls = document.getElementById('ra-controls');
  UI.panel = document.getElementById('info-panel');
  UI.panelTitle = document.getElementById('panel-title');
  UI.panelBody = document.getElementById('panel-body');
  UI.panelClose = document.getElementById('panel-close');
  UI.startButton = document.getElementById('btn-iniciar-modelo');
  UI.diagnosticButton = document.getElementById('btn-diagnostico');

  setupSidebarMenu();
  setupStageObservers();
  bindControlButtons();

  setStageMode('idle');
  setPanelEmptyState();
}

function setupSidebarMenu() {
  if (!UI.sidebarMenu) return;

  UI.menuToggle?.addEventListener('click', () => {
    UI.sidebarMenu.classList.add('is-open');
  });

  UI.menuClose?.addEventListener('click', () => {
    UI.sidebarMenu.classList.remove('is-open');
  });
  
  UI.menuOverlay?.addEventListener('click', () => {
    UI.sidebarMenu.classList.remove('is-open');
  });

  UI.sidebarButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      handleAction(btn.dataset.action);
      UI.sidebarMenu.classList.remove('is-open');
    });
  });

  UI.panelClose?.addEventListener('click', closePanel);
}

function setupStageObservers() {
  if (!UI.stage || typeof ResizeObserver === 'undefined') return;
  resizeObserver = new ResizeObserver(updateRendererSize);
  resizeObserver.observe(UI.stage);
}

function bindControlButtons() {
  UI.startButton?.addEventListener('click', triggerModelAnimation);
  UI.diagnosticButton?.addEventListener('click', triggerDiagnostic);
}

function handleAction(action) {
  if (!action) return;

  if (action === 'animar') {
    triggerModelAnimation();
    flashHubButton(action);
    return;
  }

  if (action === 'diagnostico') {
    triggerDiagnostic();
    flashHubButton(action);
    return;
  }

  if (currentPanelAction && currentPanelAction !== action) {
    cleanupPanel(currentPanelAction);
  }

  if (action === 'animacion') {
    setActiveSidebarButton(action);
    startRA();
    return;
  }

  detenerRA();
  setActiveSidebarButton(action);
  setStageMode('panel');

  switch (action) {
    case 'video':
      renderVideoPanel();
      break;
    case 'datos':
      renderDatosPanel();
      break;
    case 'trivia':
      renderTriviaPanel();
      break;
    default:
      setPanelEmptyState();
      break;
  }
}

function flashSidebarButton(action) {
  const button = UI.sidebarButtons.find((btn) => btn.dataset.action === action);
  if (!button) return;
  button.classList.add('is-flash');
  setTimeout(() => button.classList.remove('is-flash'), 450);
}

function setActiveSidebarButton(action) {
  UI.sidebarButtons.forEach((btn) => {
    const isActive = Boolean(action && btn.dataset.action === action);
    btn.classList.toggle('sidebar-btn--active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function cleanupPanel(action) {
  if (!action) return;

  UI.panel?.classList.remove('ra-panel--overlay');

  switch (action) {
    case 'video': {
      const iframe = document.getElementById('video-mundial');
      if (iframe) {
        iframe.src = '';
      }
      videoActivo = false;
      break;
    }
    case 'trivia':
      preguntasTrivia = [];
      indiceTrivia = 0;
      aciertosTrivia = 0;
      break;
    default:
      break;
  }
}

function setStageMode(mode) {
  if (UI.viewer) {
    UI.viewer.dataset.mode = mode;
    UI.viewer.classList.toggle('show-panel', mode === 'panel');
    UI.viewer.classList.toggle('stage-mode--ra', mode === 'ra');
    UI.viewer.classList.toggle('stage-mode--idle', mode === 'idle');
  }

  if (UI.stage) {
    UI.stage.dataset.mode = mode;
  }

  if (UI.stagePlaceholder) {
    UI.stagePlaceholder.hidden = mode !== 'idle';
  }

  if (mode !== 'ra') {
    setRAControlsVisible(false);
  }

  if (mode === 'panel') {
    if (UI.video) UI.video.style.display = 'none';
    if (UI.canvas3d) UI.canvas3d.style.display = 'none';
    if (UI.frameCanvas) UI.frameCanvas.style.display = 'none';
    if (UI.startButton) UI.startButton.style.display = 'none';
    if (UI.diagnosticButton) UI.diagnosticButton.style.display = 'none';
    hideDetectionCards();
    return;
  }

  const isRA = mode === 'ra';
  if (UI.video) {
    UI.video.style.display = isRA ? 'block' : 'none';
    UI.video.style.visibility = isRA ? 'visible' : 'hidden';
  }
  if (UI.canvas3d) UI.canvas3d.style.display = isRA ? 'block' : 'none';
  if (UI.frameCanvas) UI.frameCanvas.style.display = 'none';

  if (!isRA) {
    if (UI.startButton) UI.startButton.style.display = 'none';
    if (UI.diagnosticButton) UI.diagnosticButton.style.display = 'none';
    setRAControlsVisible(false);
    hideDetectionCards();
  }
}

function setPanelEmptyState() {
  currentPanelAction = null;

  if (UI.panel) {
    UI.panel.classList.remove('is-open');
    UI.panel.classList.remove('ra-panel--overlay');
  }

  UI.viewer?.classList.remove('show-panel');

  if (UI.panelTitle) {
    UI.panelTitle.textContent = 'Explorador mundialista';
  }

  if (UI.panelBody) {
    UI.panelBody.innerHTML = '<p class="panel-empty">Selecciona un módulo en el dock inferior para mostrar contenido aquí.</p>';
  }
}

function openPanel(action, title, content) {
  currentPanelAction = action;

  if (action) {
    setActiveSidebarButton(action);
  }

  if (UI.panel) {
    UI.panel.classList.remove('ra-panel--overlay');
    UI.panel.classList.add('is-open');
  }

  if (action !== 'animacion') {
    setStageMode('panel');
  }

  if (UI.panelTitle) {
    UI.panelTitle.textContent = title;
  }

  if (UI.panelBody) {
    UI.panelBody.innerHTML = content;
  }
}

function closePanel() {
  const previousAction = currentPanelAction;
  cleanupPanel(previousAction);
  setPanelEmptyState();

  // Cancelar timeout si se cierra el panel manualmente
  if (modalTimeout) {
    clearTimeout(modalTimeout);
    modalTimeout = null;
  }

  if (raSessionActive) {
    setActiveSidebarButton('animacion');
    setStageMode('ra');
  } else {
    setActiveSidebarButton(null);
    setStageMode('idle');
  }
}

function setPanelLoading(action, title, message) {
  const html = `
    <section class="panel-section panel-loading">
      <span class="panel-pill"><i class="fa-solid fa-circle-notch fa-spin"></i> ${title}</span>
      <p>${message}</p>
    </section>`;

  openPanel(action, title, html);

  if (action === 'animacion') {
    UI.panel?.classList.add('ra-panel--overlay');
  }
}

function renderRAInstructions() {
  const html = `
    <section class="panel-section">
      <span class="panel-pill"><i class="fa-solid fa-camera"></i> Preparación</span>
      <ul class="panel-list">
        <li class="panel-list__item">
          <span class="panel-list__icon"><i class="fa-solid fa-person-chalkboard"></i></span>
          <div class="panel-meta">
            <strong>Ubica la bandera</strong>
            <span>Coloca la bandera dentro del recuadro y evita movimientos bruscos.</span>
          </div>
        </li>
        <li class="panel-list__item">
          <span class="panel-list__icon"><i class="fa-solid fa-lightbulb"></i></span>
          <div class="panel-meta">
            <strong>Permite buena iluminación</strong>
            <span>La detección funciona mejor con luz uniforme.</span>
          </div>
        </li>
        <li class="panel-list__item">
          <span class="panel-list__icon"><i class="fa-solid fa-circle-play"></i></span>
          <div class="panel-meta">
            <strong>Activa la animación</strong>
            <span>Después de detectar una bandera puedes usar el botón “Animar” para ver el modelo 3D.</span>
          </div>
        </li>
      </ul>
    </section>`;

  openPanel('animacion', 'Escaneo en tiempo real', html);
  UI.panel?.classList.add('ra-panel--overlay');
}

async function renderDatosPanel() {
  setPanelLoading('datos', 'Atlas mundialista', 'Cargando datos oficiales del torneo...');

  try {
    const resp = await fetch('datos_mundial.json');
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const mundialActual = data.mundial_actual || {};
    const historia = data.historia || {};
    const primerMundial = historia.primer_mundial || {};
  const resumenPrimerMundial = [primerMundial.sede, primerMundial.campeon].filter(Boolean).join(' — ');
    const maximosGanadores = Array.isArray(historia.maximos_ganadores) ? historia.maximos_ganadores : [];
    const curiosidadesHistoricas = Array.isArray(historia.datos_curiosos_historicos) ? historia.datos_curiosos_historicos : [];
    const curiosidadesActuales = Array.isArray(mundialActual.curiosidades) ? mundialActual.curiosidades : [];
    const records = historia.records_jugadores || {};

    const ganadoresHtml = maximosGanadores
      .map(({ pais, titulos }) => `
        <li class="panel-list__item">
          <span class="panel-list__icon"><i class="fa-solid fa-trophy"></i></span>
          <div class="panel-meta">
            <strong>${pais}</strong>
            <span>${titulos} títulos mundiales</span>
          </div>
        </li>`)
      .join('');

    const curiosidadesActualesHtml = curiosidadesActuales
      .map((dato) => `<li>${dato}</li>`)
      .join('');

    const curiosidadesHistoricasHtml = curiosidadesHistoricas
      .map((dato) => `<li>${dato}</li>`)
      .join('');

    const recordLabels = {
      maximo_goleador_historico: 'Máximo goleador histórico',
      mas_partidos_jugados: 'Más partidos disputados',
      mas_mundiales_jugados: 'Más mundiales jugados',
      campeon_mas_joven: 'Campeón más joven'
    };

    const recordsHtml = Object.entries(records)
      .map(([clave, info]) => {
        if (!info) return '';
        const datos = [info.goles ? `${info.goles} goles` : null,
          info.partidos ? `${info.partidos} partidos` : null,
          info.cantidad ? `${info.cantidad} participaciones` : null,
          info.edad || null,
          info.año ? `(${info.año})` : null,
          info.pais || null]
          .filter(Boolean)
          .join(' • ');
        const descripcion = datos || info.dato || '';
        return `
          <li class="panel-list__item">
            <span class="panel-list__icon"><i class="fa-solid fa-star"></i></span>
            <div class="panel-meta">
              <strong>${recordLabels[clave] || clave}</strong>
              <span>${info.nombre ? `${info.nombre}${descripcion ? ' — ' : ''}` : ''}${descripcion}</span>
            </div>
          </li>`;
      })
      .join('');

    const interesBandera = Boolean(paisDetectadoActual);
    const seguimientoHtml = `
      <section class="panel-section">
        <span class="panel-pill"><i class="fa-solid fa-magnifying-glass"></i> Seguimiento RA</span>
        <p>${interesBandera ? `Última bandera detectada: <strong>${paisDetectadoActual}</strong>. Accede a su ficha completa.` : 'Escanea una bandera para habilitar su ficha detallada mientras exploras el Atlas.'}</p>
        <button type="button" class="chip" data-action="mostrar-datos-deteccion"${interesBandera ? '' : ' disabled'}>
          <i class="fa-solid fa-compass"></i>
          <span>Ver datos de la bandera detectada</span>
        </button>
      </section>`;

    const html = `
      <section class="panel-section">
        <span class="panel-pill"><i class="fa-solid fa-earth-americas"></i> Mundial 2026</span>
        <h3>${mundialActual.nombre || 'Copa Mundial de la FIFA 2026'}</h3>
        <p><strong>Fechas:</strong> ${mundialActual.fecha || 'Por confirmar'}</p>
        <p><strong>Sedes anfitrionas:</strong> ${(mundialActual.sedes || []).join(', ') || 'Por confirmar'}</p>
        <p><strong>Equipos participantes:</strong> ${mundialActual.equipos || '—'}</p>
        ${curiosidadesActualesHtml ? `<ul>${curiosidadesActualesHtml}</ul>` : ''}
      </section>
      <section class="panel-section">
        <span class="panel-pill"><i class="fa-solid fa-medal"></i> Palmarés histórico</span>
        ${ganadoresHtml ? `<ul class="panel-list">${ganadoresHtml}</ul>` : '<p class="panel-empty">No hay registros históricos disponibles.</p>'}
      </section>
      <section class="panel-section">
        <span class="panel-pill"><i class="fa-solid fa-clock-rotate-left"></i> Historia del torneo</span>
        <p><strong>Primer mundial (${primerMundial.año || '—'})</strong>: ${resumenPrimerMundial || 'Información no disponible'}</p>
        ${primerMundial.dato ? `<p>${primerMundial.dato}</p>` : ''}
        ${recordsHtml ? `<ul class="panel-list">${recordsHtml}</ul>` : '<p class="panel-empty">No hay récords destacados registrados.</p>'}
        ${curiosidadesHistoricasHtml ? `<ul>${curiosidadesHistoricasHtml}</ul>` : ''}
      </section>
      ${seguimientoHtml}`;

    openPanel('datos', 'Atlas mundialista', html);

    const botonDetalle = UI.panelBody?.querySelector('[data-action="mostrar-datos-deteccion"]');
    if (botonDetalle && !botonDetalle.hasAttribute('disabled')) {
      botonDetalle.addEventListener('click', mostrarDatosPais);
    }
  } catch (error) {
    console.error('Error al cargar datos globales del mundial:', error);
    openPanel('datos', 'Atlas mundialista', '<p class="panel-empty">No se pudo cargar la información. Intenta nuevamente.</p>');
  }
}

async function renderTriviaPanel() {
  setPanelLoading('trivia', 'Trivia mundialista', 'Preparando nuevas preguntas...');
  await loadTrivia();
}

async function loadTrivia() {
  try {
    const resp = await fetch('trivia.json');
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const todasLasPreguntas = data.preguntas || [];

    if (!todasLasPreguntas.length) {
      openPanel('trivia', 'Trivia mundialista', '<p class="panel-empty">No hay preguntas disponibles por el momento.</p>');
      return;
    }

    const preguntasAleatorias = [];
    const indicesUsados = new Set();
    while (preguntasAleatorias.length < 5 && preguntasAleatorias.length < todasLasPreguntas.length) {
      const indice = Math.floor(Math.random() * todasLasPreguntas.length);
      if (!indicesUsados.has(indice)) {
        indicesUsados.add(indice);
        preguntasAleatorias.push(todasLasPreguntas[indice]);
      }
    }

    preguntasTrivia = preguntasAleatorias;
    indiceTrivia = 0;
    aciertosTrivia = 0;

    renderTriviaQuestion();
  } catch (error) {
    console.error('Error al cargar la trivia:', error);
    openPanel('trivia', 'Trivia mundialista', '<p class="panel-empty">No se pudo cargar la trivia. Revisa tu conexión e intenta otra vez.</p>');
  }
}

function renderTriviaQuestion() {
  if (!preguntasTrivia.length) {
    openPanel('trivia', 'Trivia Mundialista', '<p class="panel-empty">No hay preguntas disponibles.</p>');
    return;
  }

  if (indiceTrivia >= preguntasTrivia.length) {
    renderTriviaSummary();
    return;
  }

  const pregunta = preguntasTrivia[indiceTrivia];
  const html = `
    <section class="panel-section trivia-card">
      <div class="trivia-meta">
        <span class="panel-pill"><i class="fa-solid fa-question"></i> Pregunta ${indiceTrivia + 1}/${preguntasTrivia.length}</span>
        <span>Aciertos: ${aciertosTrivia}</span>
      </div>
      <h3>${pregunta.pregunta}</h3>
      <div class="trivia-options">
        ${pregunta.opciones.map((opcion, idx) => `<button type="button" data-answer="${idx}">${opcion}</button>`).join('')}
      </div>
      <p class="trivia-feedback" aria-live="polite"></p>
    </section>`;

  openPanel('trivia', 'Trivia Mundialista', html);

  UI.panelBody?.querySelectorAll('.trivia-options button').forEach((btn) => {
    btn.addEventListener('click', () => handleTriviaAnswer(Number(btn.dataset.answer), btn));
  });
}

function handleTriviaAnswer(indiceOpcion, botonSeleccionado) {
  const pregunta = preguntasTrivia[indiceTrivia];
  if (!pregunta) return;

  const opcionesContainer = UI.panelBody?.querySelector('.trivia-options');
  if (!opcionesContainer || opcionesContainer.dataset.locked === 'true') {
    return;
  }

  opcionesContainer.dataset.locked = 'true';
  const botones = Array.from(opcionesContainer.querySelectorAll('button'));
  botones.forEach((btn) => {
    btn.disabled = true;
  });

  const respuestaCorrecta = pregunta.respuesta;
  const textoCorrecto = pregunta.opciones[respuestaCorrecta];
  const feedback = UI.panelBody?.querySelector('.trivia-feedback');

  if (Number.isInteger(respuestaCorrecta) && botones[respuestaCorrecta]) {
    botones[respuestaCorrecta].classList.add('is-correct');
  }

  if (indiceOpcion === respuestaCorrecta) {
    aciertosTrivia++;
    botonSeleccionado?.classList.add('is-correct');
    if (feedback) {
      feedback.textContent = '¡Correcto!';
    }
  } else {
    botonSeleccionado?.classList.add('is-incorrect');
    if (feedback) {
      feedback.textContent = `Incorrecto. La respuesta correcta era: ${textoCorrecto}.`;
    }
  }

  setTimeout(() => {
    indiceTrivia++;
    renderTriviaQuestion();
  }, 1600);
}

function renderTriviaSummary() {
  const html = `
    <section class="panel-section trivia-card trivia-summary">
      <span class="panel-pill"><i class="fa-solid fa-trophy"></i> Resultado final</span>
      <strong>${aciertosTrivia} / ${preguntasTrivia.length}</strong>
      <p>¡Gracias por participar! ¿Quieres volver a intentarlo con nuevas preguntas?</p>
      <button type="button" class="chip" data-action="retry-trivia">Reintentar trivia</button>
    </section>`;

  openPanel('trivia', 'Trivia Mundialista', html);
  UI.panelBody?.querySelector('[data-action="retry-trivia"]').addEventListener('click', renderTriviaPanel);
}

function renderVideoPanel() {
  const html = `
    <section class="panel-section panel-video">
      <span class="panel-pill"><i class="fa-solid fa-play"></i> Highlights 2026</span>
      <div class="video-frame">
        <iframe id="video-mundial" title="Video del Mundial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="panel-video__controls">
        <button type="button" data-video-nav="-1"><i class="fa-solid fa-chevron-left"></i><span>Anterior</span></button>
        <button type="button" data-video-nav="1"><span>Siguiente</span><i class="fa-solid fa-chevron-right"></i></button>
      </div>
      <hr class="panel-divider">
      <p>Ajusta el estilo del video para adaptarlo a la ambientación que prefieras.</p>
      <div class="panel-video__filters">
        <button type="button" data-filter="original" class="is-active"><i class="fa-regular fa-circle"></i><span>Original</span></button>
        <button type="button" data-filter="sepia"><i class="fa-solid fa-sun"></i><span>Sepia cálida</span></button>
        <button type="button" data-filter="bn"><i class="fa-solid fa-circle-half-stroke"></i><span>Blanco y negro</span></button>
        <button type="button" data-filter="vibrante"><i class="fa-solid fa-star"></i><span>Vibrante</span></button>
      </div>
    </section>`;

  openPanel('video', 'Highlights del Mundial', html);
  bindVideoPanelEvents();
  videoActivo = true;
  cargarVideo(videoActual);
  applyVideoFilter(videoFilter);
}

function bindVideoPanelEvents() {
  UI.panelBody?.querySelectorAll('[data-video-nav]').forEach((btn) => {
    btn.addEventListener('click', () => cambiarVideo(Number(btn.dataset.videoNav)));
  });

  UI.panelBody?.querySelectorAll('.panel-video__filters button').forEach((btn) => {
    btn.addEventListener('click', () => applyVideoFilter(btn.dataset.filter));
  });
}

function cargarVideo(indice) {
  const iframe = document.getElementById('video-mundial');
  if (!iframe) return;
  if (indice < 0 || indice >= videosDisponibles.length) return;
  videoActual = indice;
  iframe.src = videosDisponibles[indice];
}

function cambiarVideo(direccion) {
  if (!videoActivo) return;
  let nuevoIndice = videoActual + direccion;
  if (nuevoIndice < 0) {
    nuevoIndice = videosDisponibles.length - 1;
  } else if (nuevoIndice >= videosDisponibles.length) {
    nuevoIndice = 0;
  }
  cargarVideo(nuevoIndice);
  applyVideoFilter(videoFilter);
}

function applyVideoFilter(filterKey) {
  videoFilter = filterKey || 'original';
  const iframe = document.getElementById('video-mundial');
  if (iframe) {
    iframe.style.filter = VIDEO_FILTERS[videoFilter] || 'none';
  }

  UI.panelBody?.querySelectorAll('.panel-video__filters button').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.filter === videoFilter);
  });
}

async function mostrarDatosPais() {
  if (!paisDetectadoActual || !UI.panel) return;

  UI.panel.classList.add('is-open');
  UI.panel.classList.add('ra-panel--overlay');
  UI.viewer?.classList.remove('show-panel');
  if (UI.panelTitle) {
    UI.panelTitle.textContent = `Selección detectada: ${paisDetectadoActual}`;
  }
  if (UI.panelBody) {
    UI.panelBody.innerHTML = '<p class="panel-empty">Buscando información del país...</p>';
  }

  try {
    const resp = await fetch('datos.json');
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json();
    const paisData = data[paisDetectadoActual];

    if (!paisData) {
      UI.panelBody.innerHTML = `<p class="panel-empty">No hay datos registrados para ${paisDetectadoActual}.</p>`;
      return;
    }

    const html = `
      <section class="panel-section">
        <span class="panel-pill"><i class="fa-solid fa-flag"></i> ${paisDetectadoActual}</span>
        <ul class="panel-list">
          <li class="panel-list__item">
            <span class="panel-list__icon"><i class="fa-solid fa-landmark"></i></span>
            <div class="panel-meta">
              <strong>Capital</strong>
              <span>${paisData.capital}</span>
            </div>
          </li>
          <li class="panel-list__item">
            <span class="panel-list__icon"><i class="fa-solid fa-earth-americas"></i></span>
            <div class="panel-meta">
              <strong>Continente</strong>
              <span>${paisData.continente}</span>
            </div>
          </li>
          <li class="panel-list__item">
            <span class="panel-list__icon"><i class="fa-solid fa-trophy"></i></span>
            <div class="panel-meta">
              <strong>Mejor mundial</strong>
              <span>${paisData.mejor_mundial}</span>
            </div>
          </li>
          <li class="panel-list__item">
            <span class="panel-list__icon"><i class="fa-solid fa-lightbulb"></i></span>
            <div class="panel-meta">
              <strong>Dato curioso</strong>
              <span>${paisData.dato_curioso}</span>
            </div>
          </li>
        </ul>
      </section>`;

    UI.panelBody.innerHTML = html;
  } catch (error) {
    console.error('Error al cargar datos del país:', error);
    if (UI.panelBody) {
      UI.panelBody.innerHTML = '<p class="panel-empty">No se pudo cargar la información del país seleccionado.</p>';
    }
  }
}

async function startRA() {
  setStageMode('ra');
  setRAControlsVisible(false);

  if (raSessionActive) {
    renderRAInstructions();
    return;
  }

  raSessionActive = true;
  pausarDeteccion = false;
  paisDetectadoActual = null;
  contadorDeteccionSostenida = 0;

  try {
    if (!tfModel) {
      setPanelLoading('animacion', 'Activando RA', 'Cargando modelo de visión por computadora...');
    }
    await loadTensorModel();
    initThreeScene();
    await startCameraStream();
    beginDetectionLoop();
    renderRAInstructions();
  } catch (error) {
    console.error('Error al iniciar la experiencia RA:', error);
    openPanel('animacion', 'Escaneo en tiempo real', '<p class="panel-empty">No se pudo activar la cámara. Verifica los permisos e inténtalo nuevamente.</p>');
    UI.panel?.classList.add('ra-panel--overlay');
    detenerRA();
  }
}

async function loadTensorModel() {
  if (tfModel) return;
  tfModel = await tf.loadLayersModel('modeloIA/model.json');
}

function initThreeScene() {
  if (raScene || !UI.canvas3d) return;

  raScene = new THREE.Scene();
  const { width, height } = getStageSize();
  raCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  raCamera.position.z = 5;

  raRenderer = new THREE.WebGLRenderer({ canvas: UI.canvas3d, alpha: true, antialias: true });
  raRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  raRenderer.setSize(width, height, false);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  raScene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
  directionalLight.position.set(1, 1, 1);
  raScene.add(directionalLight);

  clock = new THREE.Clock();
  animateScene();
}

function animateScene() {
  if (!raRenderer || !raScene || !raCamera) return;
  animationFrameId = requestAnimationFrame(animateScene);
  if (mixer && clock) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }
  raRenderer.render(raScene, raCamera);
}

function getStageSize() {
  if (!UI.stage) {
    return { width: 640, height: 960 };
  }
  const rect = UI.stage.getBoundingClientRect();
  let { width, height } = rect;
  if (!height) {
    height = width * (16 / 9);
  }
  return { width, height };
}

async function startCameraStream() {
  if (!UI.video) return;

  // Try to get the environment camera, fallback to any camera if not available
  let constraints = { video: { facingMode: { ideal: 'environment' } } };
  try {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    // Fallback: try without facingMode
    try {
      constraints = { video: true };
      videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      alert('No se pudo acceder a la cámara. Por favor, revisa los permisos del navegador.');
      throw err;
    }
  }

  UI.video.srcObject = videoStream;
  await UI.video.play().catch(() => {});

  if (!ctx && UI.frameCanvas) {
    ctx = UI.frameCanvas.getContext('2d');
  }
}

function beginDetectionLoop() {
  if (!UI.frameCanvas) return;
  UI.frameCanvas.width = 400;
  UI.frameCanvas.height = 200;

  if (raPredictionInterval) {
    clearInterval(raPredictionInterval);
  }

  setTimeout(() => {
    if (!raSessionActive) return;
    raPredictionInterval = setInterval(predecir, 500);
  }, 1500);
}

async function predecir() {
  if (!tfModel || !ctx || !UI.video || pausarDeteccion) return;
  if (!UI.video.videoWidth || !UI.video.videoHeight) return;

  ctx.drawImage(UI.video, 0, 0, UI.frameCanvas.width, UI.frameCanvas.height);
  const tensor = tf.browser
    .fromPixels(UI.frameCanvas)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(255)
    .expandDims();

  const pred = await tfModel.predict(tensor).data();
  tensor.dispose();

  const maxProb = Math.max(...pred);
  const banderaDetectada = pred.indexOf(maxProb);
  const confianza = (maxProb * 100).toFixed(1);
  const umbralConfianza = 0.7;

  if (maxProb > umbralConfianza && banderasConfig[banderaDetectada] && banderasConfig[banderaDetectada].nombre !== "NO") {
    const config = banderasConfig[banderaDetectada];
    
    // Solo actualizar si es una bandera diferente a la actual
    if (paisDetectadoActual !== config.nombre) {
      contadorDeteccionSostenida++;
      
      // Requerir detecciones consecutivas para evitar falsos positivos
      if (contadorDeteccionSostenida >= DETECCIONES_REQUERIDAS) {
        paisDetectadoActual = config.nombre;
        contadorDeteccionSostenida = 0;
        
        if (UI.detectionCard) {
          UI.detectionCard.style.display = 'grid';
        }
        if (UI.nombreBandera) {
          UI.nombreBandera.textContent = config.nombre;
        }
        if (UI.valorConfianza) {
          UI.valorConfianza.textContent = `${confianza}%`;
        }
        
        // Solo cargar modelo si tiene textura
        if (config.textura) {
          await cargarModelo3D(config.textura);
          setRAControlsVisible(Boolean(currentModel));
        } else {
          setRAControlsVisible(false);
        }
        
        // Activar modal automático si la confianza es mayor al 90%
        if (maxProb > 0.9 && !modalTimeout) {
          lastHighConfidenceDetection = config.nombre;
          modalTimeout = setTimeout(() => {
            if (paisDetectadoActual === lastHighConfidenceDetection) {
              mostrarDatosPais();
            }
            modalTimeout = null;
          }, 3000);
        }
      }
    } else {
      // Reiniciar contador si es la misma bandera
      contadorDeteccionSostenida = 0;
      // Actualizar solo la confianza si es la misma bandera
      if (UI.valorConfianza) {
        UI.valorConfianza.textContent = `${confianza}%`;
      }
      setRAControlsVisible(Boolean(currentModel));
      
      // Activar modal automático si la confianza es mayor al 90%
      if (maxProb > 0.9 && !modalTimeout && paisDetectadoActual !== lastHighConfidenceDetection) {
        lastHighConfidenceDetection = config.nombre;
        modalTimeout = setTimeout(() => {
          if (paisDetectadoActual === lastHighConfidenceDetection) {
            mostrarDatosPais();
          }
          modalTimeout = null;
        }, 3000);
      }
    }
  } else if (paisDetectadoActual !== null) {
    // Solo limpiar si había algo detectado anteriormente
    contadorDeteccionSostenida = 0;
    paisDetectadoActual = null;
    
    // Cancelar timeout si se pierde la detección
    if (modalTimeout) {
      clearTimeout(modalTimeout);
      modalTimeout = null;
    }
    hideDetectionCards();
    setRAControlsVisible(false);
    clearModel();
  }
}

async function cargarModelo3D(textura) {
  if (!raScene) return;
  
  // Limpiar modelo anterior
  clearModel();
  
  const loader = new THREE.GLTFLoader();

  try {
    // Cargar el modelo 3D
    const gltf = await new Promise((resolve, reject) => {
      loader.load('3D_model/F2.glb', resolve, undefined, reject);
    });

    currentModel = gltf.scene;
    
    // Si hay textura, aplicarla al modelo
    if (textura) {
      const textureLoader = new THREE.TextureLoader();
      const texture = await new Promise((resolve, reject) => {
        textureLoader.load(textura, resolve, undefined, reject);
      });
      
      currentModel.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat.map) mat.map = texture;
            });
          } else {
            if (child.material.map) child.material.map = texture;
          }
        }
      });
    }

    // Configurar animaciones si existen
    currentAnimations = Array.isArray(gltf.animations) ? gltf.animations : [];
    if (currentAnimations.length > 0) {
      mixer = new THREE.AnimationMixer(currentModel);
      currentAnimations.forEach((clip) => {
        mixer.clipAction(clip);
      });
    } else {
      mixer = null;
    }

    // Posicionar y escalar el modelo
    currentModel.position.set(0, 0, 0);
    currentModel.scale.setScalar(1);
    
    raScene.add(currentModel);
  } catch (error) {
    console.error('Error al cargar el modelo 3D:', error);
  }
}

function clearModel() {
  if (currentModel && raScene) {
    raScene.remove(currentModel);
  }
  currentModel = null;
  currentAnimations = [];
  teardownAnimationTracking();
  if (mixer) {
    mixer = null;
  }
}

function hideDetectionCards() {
  if (UI.detectionCard) {
    UI.detectionCard.style.display = 'none';
  }
  if (UI.animacionCard) {
    UI.animacionCard.style.display = 'none';
  }
}

function triggerModelAnimation() {
  if (!raSessionActive || !currentModel) {
    window.alert('Escanea una bandera para cargar un modelo 3D antes de animarlo.');
    return;
  }

  if (!currentAnimations.length) {
    window.alert('Este modelo no cuenta con animaciones configuradas.');
    return;
  }

  if (isAnimationPlaying && activeAnimationAction) {
    if (!animationIsPaused) {
      activeAnimationAction.paused = true;
      animationIsPaused = true;
      pausarDeteccion = false;
      if (UI.animacionCard) {
        UI.animacionCard.style.display = 'none';
      }
      setAnimationButtonState('resume');
      clearAnimationSafetyTimer();
    } else {
      activeAnimationAction.paused = false;
      animationIsPaused = false;
      pausarDeteccion = true;
      if (UI.animacionCard) {
        UI.animacionCard.style.display = 'grid';
      }
      setAnimationButtonState('pause');
      startAnimationSafetyTimer();
    }
    return;
  }

  if (!mixer) {
    mixer = new THREE.AnimationMixer(currentModel);
    currentAnimations.forEach((clip) => mixer.clipAction(clip));
  }

  const posiblesNombres = ['Wave', 'wave', 'Waving', 'waving', 'Animation', 'animation', 'Action', 'action'];
  let clipSeleccionado = null;

  for (const nombre of posiblesNombres) {
    clipSeleccionado = currentAnimations.find((clip) => clip.name === nombre);
    if (clipSeleccionado) break;
  }

  if (!clipSeleccionado) {
    clipSeleccionado = currentAnimations[0];
  }

  const animationAction = mixer.clipAction(clipSeleccionado);
  if (!animationAction) {
    window.alert('Este modelo no cuenta con animaciones configuradas.');
    return;
  }

  mixer.stopAllAction();
  animationAction.reset();
  animationAction.setLoop(THREE.LoopOnce);
  animationAction.clampWhenFinished = true;
  animationAction.enabled = true;
  animationAction.paused = false;
  animationAction.play();

  activeAnimationAction = animationAction;
  isAnimationPlaying = true;
  animationIsPaused = false;

  pausarDeteccion = true;
  if (UI.animacionCard) {
    UI.animacionCard.style.display = 'grid';
  }
  setAnimationButtonState('pause');
  startAnimationSafetyTimer();

  if (animationFinishHandler && mixer) {
    mixer.removeEventListener('finished', animationFinishHandler);
  }
  animationFinishHandler = () => {
    teardownAnimationTracking();
  };
  mixer.addEventListener('finished', animationFinishHandler);
}

function triggerDiagnostic() {
  if (!raSessionActive) {
    window.alert('Activa la experiencia RA para ejecutar el diagnóstico.');
    return;
  }

  console.group('Diagnóstico RA');
  console.log('Modelo de IA cargado:', !!tfModel);
  console.log('Mixer activo:', !!mixer);
  console.log('Modelo 3D presente:', !!currentModel);
  console.log('Pausa de detección:', pausarDeteccion);
  console.log('País detectado actual:', paisDetectadoActual);
  const animacionesDisponibles = currentAnimations.map((clip) => clip.name || 'sin nombre');
  console.log('Animaciones disponibles:', animacionesDisponibles.length ? animacionesDisponibles : 'sin animaciones');
  console.groupEnd();

  const limpiar = window.confirm('¿Quieres limpiar la escena actual? Esto eliminará el modelo y reanudará la detección.');
  if (limpiar) {
    clearModel();
    pausarDeteccion = false;
    if (UI.animacionCard) {
      UI.animacionCard.style.display = 'none';
    }
  }
}

function detenerRA() {
  if (!raSessionActive) return;

  if (raPredictionInterval) {
    clearInterval(raPredictionInterval);
    raPredictionInterval = null;
  }

  detenerCamara();
  clearModel();

  if (raScene) {
    raScene = null;
  }
  raCamera = null;

  if (raRenderer) {
    raRenderer.dispose();
    raRenderer = null;
  }

  clock = null;
  pausarDeteccion = false;
  paisDetectadoActual = null;
  contadorDeteccionSostenida = 0;
  hideDetectionCards();

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  setRAControlsVisible(false);

  // Limpiar timeout del modal automático
  if (modalTimeout) {
    clearTimeout(modalTimeout);
    modalTimeout = null;
  }
  lastHighConfidenceDetection = null;

  raSessionActive = false;

  setStageMode('idle');
}

function detenerCamara() {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
    videoStream = null;
  }

  if (UI.video && UI.video.srcObject) {
    UI.video.srcObject.getTracks().forEach((track) => track.stop());
    UI.video.srcObject = null;
  }
}

function updateRendererSize() {
  if (!raRenderer || !raCamera || !UI.stage) return;
  const { width, height } = getStageSize();
  if (!width || !height) return;
  raCamera.aspect = width / height;
  raCamera.updateProjectionMatrix();
  raRenderer.setSize(width, height, false);
}

window.addEventListener('resize', updateRendererSize);
window.addEventListener('beforeunload', detenerRA);

window.mostrarDatosPais = mostrarDatosPais;
