// --- FUNCION PARA DETENER LA CAMARA ---
function detenerCamara() {
  const video = document.getElementById('video');
  if (video && video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }
}
// --- MODAL TRIVIA ---
let preguntasTrivia = [];
let indiceTrivia = 0;
let aciertosTrivia = 0;

async function mostrarModalTrivia() {
  const modal = document.getElementById('modal-trivia');
  const cont = document.getElementById('contenido-trivia');
  cont.innerHTML = '<p>Cargando trivia...</p>';
  modal.style.display = 'flex';
  try {
    const resp = await fetch('trivia.json');
    const data = await resp.json();
    // Seleccionar 5 preguntas aleatorias
    const todasLasPreguntas = data.preguntas;
    const preguntasAleatorias = [];
    const indicesUsados = new Set();
    
    while (preguntasAleatorias.length < 5 && preguntasAleatorias.length < todasLasPreguntas.length) {
      const indiceAleatorio = Math.floor(Math.random() * todasLasPreguntas.length);
      if (!indicesUsados.has(indiceAleatorio)) {
        indicesUsados.add(indiceAleatorio);
        preguntasAleatorias.push(todasLasPreguntas[indiceAleatorio]);
      }
    }
    
    preguntasTrivia = preguntasAleatorias;
    indiceTrivia = 0;
    aciertosTrivia = 0;
    mostrarPreguntaTrivia();
  } catch (e) {
    cont.innerHTML = '<p style="color:red">No se pudo cargar la trivia.</p>';
  }
}

function mostrarPreguntaTrivia() {
  const cont = document.getElementById('contenido-trivia');
  if (indiceTrivia >= preguntasTrivia.length) {
    cont.innerHTML = `<h2>¡Trivia finalizada!</h2><p>Respuestas correctas: ${aciertosTrivia} de ${preguntasTrivia.length}</p><button onclick='cerrarModalTrivia()' style='margin-top:20px; background:#18510c; color:white; border:none; border-radius:8px; padding:10px 20px; font-size:1rem; cursor:pointer;'>Cerrar</button>`;
    return;
  }
  const p = preguntasTrivia[indiceTrivia];
  cont.innerHTML = `
    <h3>Pregunta ${indiceTrivia+1} de ${preguntasTrivia.length}</h3>
    <p style='margin-bottom:10px;'>${p.pregunta}</p>
    <div id='opciones-trivia'>
      ${p.opciones.map((op, i) => `<button onclick='responderTrivia(${i})' style='display:block; margin:8px 0; width:100%; background:#18510c; color:white; border:none; border-radius:8px; padding:10px; font-size:1rem; cursor:pointer;'>${op}</button>`).join('')}
    </div>
  `;
}

function responderTrivia(indiceOpcion) {
  const p = preguntasTrivia[indiceTrivia];
  if (indiceOpcion === p.respuesta) {
    aciertosTrivia++;
  }
  indiceTrivia++;
  mostrarPreguntaTrivia();
}

function cerrarModalTrivia() {
  document.getElementById('modal-trivia').style.display = 'none';
}
// Asignar evento al botón de trivia
window.addEventListener('DOMContentLoaded', function() {
  const btnTrivia = document.querySelector('#botones-interaccion #trivia');
  if (btnTrivia) {
    btnTrivia.addEventListener('click', mostrarModalTrivia);
  }
});
// --- MODAL DATOS ---
async function mostrarModalDatos() {
  const modal = document.getElementById('modal-datos');
  const cont = document.getElementById('contenido-datos');
  cont.innerHTML = '<p>Cargando datos...</p>';
  modal.style.display = 'flex';

  try {
    const resp = await fetch('datos_mundial.json');
    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const data = await resp.json();
    
    const mundial = data.mundial_actual;
    const historia = data.historia;

    // Generar listas HTML a partir de los datos
    const listaGanadores = historia.maximos_ganadores.map(g => `<li><b>${g.pais}:</b> ${g.titulos} títulos</li>`).join('');
    const listaCuriosidades = historia.datos_curiosos_historicos.map(c => `<li>${c}</li>`).join('');

    cont.innerHTML = `
      <h2>${mundial.nombre}</h2>
      <p><b>Sedes:</b> ${mundial.sedes.join(', ')}</p>
      <p><b>Equipos participantes:</b> ${mundial.equipos}</p>
      <ul>${mundial.curiosidades.map(c => `<li>${c}</li>`).join('')}</ul>
      
      <hr>

      <h2>Historia de los Mundiales</h2>
      
      <h3>Primer Mundial: ${historia.primer_mundial.sede} ${historia.primer_mundial.año}</h3>
      <p>${historia.primer_mundial.dato}</p>

      <h3>Máximos Ganadores</h3>
      <ul>${listaGanadores}</ul>

      <h3>Récords de Jugadores</h3>
      <ul>
        <li><b>Máximo Goleador:</b> ${historia.records_jugadores.maximo_goleador_historico.nombre} (${historia.records_jugadores.maximo_goleador_historico.goles} goles).</li>
        <li><b>Más Partidos Jugados:</b> ${historia.records_jugadores.mas_partidos_jugados.nombre} (${historia.records_jugadores.mas_partidos_jugados.partidos} partidos).</li>
        <li><b>Más Mundiales Jugados (5):</b> ${historia.records_jugadores.mas_mundiales_jugados.nombre}.</li>
        <li><b>Campeón más Joven:</b> ${historia.records_jugadores.campeon_mas_joven.nombre} con ${historia.records_jugadores.campeon_mas_joven.edad} en ${historia.records_jugadores.campeon_mas_joven.año}.</li>
      </ul>

      <h3>Datos Curiosos Históricos</h3>
      <ul>${listaCuriosidades}</ul>
    `;
  } catch (e) {
    console.error("Error al cargar datos:", e);
    cont.innerHTML = '<p style="color:red">No se pudieron cargar los datos. Revisa la consola para más detalles.</p>';
  }
}
function cerrarModalDatos() {
  document.getElementById('modal-datos').style.display = 'none';
}
// Asignar evento al botón de datos
window.addEventListener('DOMContentLoaded', function() {
  const btnDatos = document.querySelector('#botones-interaccion #datos');
  if (btnDatos) {
    btnDatos.addEventListener('click', mostrarModalDatos);
  }
});

// --- MODAL DATOS DEL PAÍS DETECTADO ---
let paisDetectadoActual = null;

async function mostrarDatosPais() {
  if (!paisDetectadoActual) return;
  
  const modal = document.getElementById('modal-pais-detectado');
  const cont = document.getElementById('contenido-pais-detectado');
  cont.innerHTML = '<p>Cargando datos del país...</p>';
  modal.style.display = 'flex';

  try {
    const resp = await fetch('datos.json');
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const data = await resp.json();
    
    const paisData = data[paisDetectadoActual];
    if (paisData) {
      cont.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #18510c; margin-bottom: 10px; font-size: 1.8rem;">${paisDetectadoActual}</h2>
          <div style="width: 50px; height: 3px; background: #18510c; margin: 0 auto;"></div>
        </div>
        
        <div style="display: grid; gap: 15px;">
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #18510c;">
            <h3 style="color: #ffffff; margin-bottom: 8px; font-size: 1.1rem;">🏛️ Capital</h3>
            <p style="margin: 0; color: #e0e0e0;">${paisData.capital}</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #18510c;">
            <h3 style="color: #ffffff; margin-bottom: 8px; font-size: 1.1rem;">🌍 Continente</h3>
            <p style="margin: 0; color: #e0e0e0;">${paisData.continente}</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #18510c;">
            <h3 style="color: #ffffff; margin-bottom: 8px; font-size: 1.1rem;">🏆 Mejor resultado en Mundial</h3>
            <p style="margin: 0; color: #e0e0e0;">${paisData.mejor_mundial}</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b35;">
            <h3 style="color: #ffffff; margin-bottom: 8px; font-size: 1.1rem;">💡 Dato Curioso</h3>
            <p style="margin: 0; color: #e0e0e0; line-height: 1.5;">${paisData.dato_curioso}</p>
          </div>
        </div>
      `;
    } else {
      cont.innerHTML = `
        <h2 style="color: #18510c; text-align: center;">${paisDetectadoActual}</h2>
        <p style="text-align: center; color: #cccccc;">No se encontraron datos para este país en nuestra base de datos.</p>
      `;
    }
  } catch (e) {
    console.error("Error al cargar datos del país:", e);
    cont.innerHTML = '<p style="color:red; text-align: center;">Error al cargar los datos del país.</p>';
  }
}

function cerrarModalPais() {
  document.getElementById('modal-pais-detectado').style.display = 'none';
}
// --- MODAL VIDEO ---
let videoActual = 0;
let videoActivo = false;
const videosDisponibles = [
  "https://www.youtube.com/embed/DQtvjqm-xxI?si=fKmFhnoC2-x7ld6o&autoplay=1&mute=1",
  "https://www.youtube.com/embed/aK_850XXqTA?si=j9OCrbC-nZdok0nX&autoplay=1&mute=1",
  "https://www.youtube.com/embed/xEGizIl9yt4?si=lUZl9YzWeDx6H4tn&autoplay=1&mute=1", 
  "https://www.youtube.com/embed/kjryZta6rMs?si=yD4LXJLS-VBVsw7s&autoplay=1&mute=1",
  "https://www.youtube.com/embed/HIbpTQoRp3o?si=Iw7ltzM6joPanStx&autoplay=1&mute=1",
  "https://www.youtube.com/embed/0iFtX2oMeC0?si=J1xCPaMeinvxV2tC&autoplay=1&mute=1",
  "https://www.youtube.com/embed/OtOrP362h44?si=jcSirJu4LNQDsaFd&autoplay=1&mute=1",
  "https://www.youtube.com/embed/nxWR-odH7Ck?si=_LhC09-8GGjlM7k3&autoplay=1&mute=",
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

function mostrarModalVideo() {
  videoActivo = true;
  document.getElementById('modal-video').style.display = 'flex';
  document.getElementById('btn-modal-video').style.display = 'flex';
  cargarVideo(videoActual);
}

function cerrarModalVideo() {
  videoActivo = false;
  document.getElementById('modal-video').style.display = 'none';
  document.getElementById('btn-modal-video').style.display = 'none';
  // Resetear filtros
  const iframe = document.getElementById('video-mundial');
  iframe.style.filter = "none";
}

function cargarVideo(indice) {
  if (indice >= 0 && indice < videosDisponibles.length) {
    const iframe = document.getElementById('video-mundial');
    iframe.src = videosDisponibles[indice];
    videoActual = indice;
  }
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
}

function filtro1() {
  if (!videoActivo) return;
  const iframe = document.getElementById('video-mundial');
  iframe.style.filter = "hue-rotate(180deg) saturate(300%)";
}

function filtro2() {
  if (!videoActivo) return;
  const iframe = document.getElementById('video-mundial');
  iframe.style.filter = "sepia(80%) saturate(150%)";
}

function filtro3() {
  if (!videoActivo) return;
  const iframe = document.getElementById('video-mundial');
  iframe.style.filter = "invert(100%)";
}

// --- INICIO RA ---

// Variables para animación
let mixer = null;
let clock = null;
let pausarDeteccion = false;
let tiempoAnimacion = 3000; // 3 segundos de pausa por defecto

function RAbegin() {
  // Limpiar variables globales al iniciar
  currentModel = null;
  mixer = null;
  pausarDeteccion = false;
  paisDetectadoActual = null;
  
  // Mostrar botones extra para animar modelo y diagnóstico
  const btnIniciarModelo = document.getElementById('btn-iniciar-modelo');
  const btnDiagnostico = document.getElementById('btn-diagnostico');
  if (btnIniciarModelo) btnIniciarModelo.style.display = '';
  if (btnDiagnostico) btnDiagnostico.style.display = '';
  let model;
  let scene, camera, renderer;
  // Configuración de banderas y sus modelos 3D correspondientes
  let modelo = "3D_model/F2.glb";
  let banderasConfig = {
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
    17: { nombre: "Tunez", textura: "3D_model/textures/Tunez.png" }
  }
  // Inicializar Three.js
  function inicializarThreeJS() {
    const canvas3d = document.getElementById('canvas3d');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({
      canvas: canvas3d,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight - 60);
    renderer.setClearColor(0x000000, 0);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    clock = new THREE.Clock();
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    // El modelo se mantiene quieto cuando hay una bandera detectada
    // Solo rota si no hay detección activa (puedes comentar estas líneas si no quieres rotación)
    // if (currentModel && !paisDetectadoActual) {
    //   currentModel.rotation.y += 0.005;
    // }
    if (mixer) {
      const delta = clock.getDelta();
      mixer.update(delta);
    }
    renderer.render(scene, camera);
  }

  // Función para limpiar completamente la escena
  function limpiarEscena() {
    if (currentModel) {
      scene.remove(currentModel);
      currentModel = null;
    }
    if (mixer) {
      mixer.stopAllAction();
      mixer.uncacheRoot(mixer.getRoot());
      mixer = null;
    }
    pausarDeteccion = false;
    console.log("Escena limpiada completamente");
  }

  async function cargarModelo() {
    model = await tf.loadLayersModel("modeloIA/model.json");
    console.log("Modelo de IA cargado");
  }

  async function cargarModelo3D(textura) {
    // Verificar que se proporcione una textura válida
    if (!textura) {
      console.error("No se proporcionó textura para cargar el modelo");
      return;
    }
    
    console.log(`Cargando modelo 3D con textura: ${textura}`);
    const loader = new THREE.GLTFLoader();
    
    // Eliminar modelo anterior si existe
    if (currentModel) {
      console.log("Eliminando modelo anterior");
      scene.remove(currentModel);
      currentModel = null;
    }
    
    // Limpiar mixer anterior
    if (mixer) {
      console.log("Limpiando mixer anterior");
      mixer.stopAllAction();
      mixer.uncacheRoot(mixer.getRoot());
      mixer = null;
    }
    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(modelo, resolve, undefined, reject);
      });
      currentModel = gltf.scene;
      currentModel.scale.set(1.5, 1.5, 1.5);
      currentModel.position.set(0, -1, 0); // Ajuste para centrar el modelo verticalmente
      currentModel.rotation.set(0, 0, 0); // Resetear rotación
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(textura);
      currentModel.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });
      
      // Guardar referencia a las animaciones en el modelo
      if (gltf.animations && gltf.animations.length > 0) {
        currentModel.animations = gltf.animations;
      }
      
      scene.add(currentModel);
      // Preparar animaciones si existen
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentModel);
        console.log("Animaciones encontradas en el modelo:", gltf.animations.map(a => a.name));
        
        // Buscar diferentes nombres de animación posibles
        const possibleNames = ['Wave', 'wave', 'Waving', 'waving', 'Animation', 'animation', 'Action', 'action'];
        let foundClip = null;
        
        for (const name of possibleNames) {
          foundClip = gltf.animations.find(a => a.name === name);
          if (foundClip) {
            console.log(`Encontrada animación: ${name}`);
            break;
          }
        }
        
        // Si no encuentra por nombre, usar la primera animación disponible
        if (!foundClip && gltf.animations.length > 0) {
          foundClip = gltf.animations[0];
          console.log(`Usando primera animación disponible: ${foundClip.name}`);
        }
        
        if (foundClip) {
          mixer.clipAction(foundClip).stop(); // No iniciar automáticamente
        }
      } else {
        console.log("No se encontraron animaciones en el modelo");
      }
      console.log("Modelo 3D cargado:", modelo);
    } catch (error) {
      console.error("Error cargando modelo 3D:", error);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      currentModel = new THREE.Mesh(geometry, material);
      scene.add(currentModel);
    }
  }

  async function predecir() {
    if (!model || pausarDeteccion) return; // No predecir si está pausado
    ctx.drawImage(video, 0, 0, frameCanvas.width, frameCanvas.height);
    const tensor = tf.browser.fromPixels(frameCanvas)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims();
    const pred = await model.predict(tensor).data();
    const maxProb = Math.max(...pred);
    const banderaDetectada = pred.indexOf(maxProb);
    const confianza = (maxProb * 100).toFixed(1);
    const umbralConfianza = 0.7;
    
    // Debug logging para ver qué se está detectando
    if (maxProb > 0.5) { // Umbral más bajo para debugging
      console.log(`Detección: Índice ${banderaDetectada}, Confianza: ${confianza}%, País: ${banderasConfig[banderaDetectada] ? banderasConfig[banderaDetectada].nombre : 'Desconocido'}`);
    }
    if (maxProb > umbralConfianza && banderasConfig[banderaDetectada]) {
      const config = banderasConfig[banderaDetectada];
      
      // Solo cargar el modelo si es diferente al actual
      if (paisDetectadoActual !== config.nombre) {
        console.log(`Nueva bandera detectada: ${config.nombre} (${confianza}%)`);
        
        document.getElementById('deteccion-info').style.display = 'block';
        document.getElementById('nombre-bandera').textContent = config.nombre;
        document.getElementById('valor-confianza').textContent = confianza + '%';
        
        // Guardar el país detectado para el modal de datos
        paisDetectadoActual = config.nombre;
        
        await cargarModelo3D(config.textura);
      } else {
        // Solo actualizar la confianza si es el mismo país
        document.getElementById('valor-confianza').textContent = confianza + '%';
      }
    } else {
      document.getElementById('deteccion-info').style.display = 'none';
      paisDetectadoActual = null; // Limpiar país detectado
      
      // Limpiar modelo y mixer cuando no hay detección
      if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
      }
      if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
        mixer = null;
      }
    }
    tensor.dispose();
  }

  const video = document.getElementById("video");
  const frameCanvas = document.getElementById("frameCanvas");
  const ctx = frameCanvas.getContext("2d");

  // Inicializar cámara trasera
  const constraints = {
    video: {
      facingMode: { exact: "environment" }
    }
  };
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(error => {
      console.error("Error accediendo a la cámara trasera:", error);
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
        })
        .catch(fallbackError => {
          console.error("Error accediendo a cualquier cámara:", fallbackError);
          alert("No se pudo acceder a la cámara. Verifica los permisos.");
        });
    });
  cargarModelo();
  inicializarThreeJS();
  
  // Debug inicial
  console.log("=== INICIO DEL MODO RA ===");
  console.log("Estado inicial - currentModel:", currentModel);
  console.log("Estado inicial - mixer:", mixer);
  console.log("Estado inicial - paisDetectadoActual:", paisDetectadoActual);
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 60);
  });
  // Esperar un poco antes de iniciar la predicción para evitar detecciones falsas
  setTimeout(() => {
    console.log("Iniciando predicción de banderas...");
    setInterval(predecir, 500);
  }, 2000); // Esperar 2 segundos
  // Evento para animar el modelo 3D
  if (btnIniciarModelo) {
    btnIniciarModelo.onclick = function() {
      if (mixer && currentModel) {
        // Pausar la detección durante la animación
        pausarDeteccion = true;
        document.getElementById('animacion-progreso').style.display = 'block';
        console.log("Detección pausada para ejecutar animación");
        
        // Buscar animación disponible de forma más flexible
        const actions = mixer._actions || [];
        let animationAction = null;
        
        // Lista de nombres posibles para la animación
        const possibleNames = ['Wave', 'wave', 'Waving', 'waving', 'Animation', 'animation', 'Action', 'action'];
        
        // Buscar por nombre en las acciones existentes
        for (const name of possibleNames) {
          if (actions.length > 0) {
            animationAction = actions.find(a => a._clip && a._clip.name === name);
            if (animationAction) {
              console.log(`Encontrada animación en acciones: ${name}`);
              break;
            }
          }
        }
        
        // Si no encontró en acciones, buscar en las animaciones del modelo
        if (!animationAction && currentModel.animations) {
          for (const name of possibleNames) {
            const clip = currentModel.animations.find(a => a.name === name);
            if (clip) {
              animationAction = mixer.clipAction(clip);
              console.log(`Creada acción para animación: ${name}`);
              break;
            }
          }
        }
        
        // Si aún no encontró, usar la primera animación disponible
        if (!animationAction) {
          if (actions.length > 0 && actions[0]._clip) {
            animationAction = actions[0];
            console.log(`Usando primera acción disponible: ${actions[0]._clip.name}`);
          } else if (currentModel.animations && currentModel.animations.length > 0) {
            animationAction = mixer.clipAction(currentModel.animations[0]);
            console.log(`Usando primera animación del modelo: ${currentModel.animations[0].name}`);
          }
        }
        
        if (animationAction) {
          // Detener todas las animaciones previas
          mixer.stopAllAction();
          
          // Configurar la animación
          animationAction.reset();
          animationAction.setLoop(THREE.LoopOnce); // Solo reproducir una vez
          animationAction.clampWhenFinished = true; // Mantener la pose final
          animationAction.enabled = true;
          animationAction.weight = 1;
          
          // Escuchar cuando termine la animación
          const onAnimationFinished = () => {
            setTimeout(() => {
              pausarDeteccion = false;
              document.getElementById('animacion-progreso').style.display = 'none';
              console.log("Detección reanudada");
              
              // Resetear la animación después de terminar
              if (animationAction) {
                animationAction.reset();
                animationAction.stop();
              }
            }, 500); // Pequeña pausa adicional después de la animación
            
            mixer.removeEventListener('finished', onAnimationFinished);
          };
          
          mixer.addEventListener('finished', onAnimationFinished);
          
          // Reproducir animación
          animationAction.play();
          console.log(`Reproduciendo animación: ${animationAction._clip.name}`);
          
          // Timeout de seguridad en caso de que el evento no se dispare
          setTimeout(() => {
            if (pausarDeteccion) {
              pausarDeteccion = false;
              document.getElementById('animacion-progreso').style.display = 'none';
              console.log("Detección reanudada por timeout de seguridad");
              
              // Resetear animación por seguridad
              if (animationAction) {
                animationAction.reset();
                animationAction.stop();
              }
            }
          }, tiempoAnimacion + 1000);
          
        } else {
          // Si no hay animación, mostrar información detallada
          console.log("=== DIAGNÓSTICO DE ANIMACIONES ===");
          console.log("Acciones del mixer:", mixer._actions.map(a => a._clip ? a._clip.name : 'sin nombre'));
          console.log("Animaciones del modelo:", currentModel.animations ? currentModel.animations.map(a => a.name) : 'ninguna');
          
          // Pausar detección por un momento para evitar interferencias
          setTimeout(() => {
            pausarDeteccion = false;
            document.getElementById('animacion-progreso').style.display = 'none';
          }, 1000);
          
          alert('No se encontraron animaciones en este modelo. Revisa la consola para más detalles.');
        }
      } else {
        alert('Este modelo no tiene animaciones o no está cargado correctamente.');
      }
    }
  }
  
  // Botón de diagnóstico
  if (btnDiagnostico) {
    btnDiagnostico.onclick = function() {
      console.log("=== DIAGNÓSTICO COMPLETO DEL MODELO ===");
      console.log("Modelo actual existe:", !!currentModel);
      console.log("Mixer existe:", !!mixer);
      console.log("Pausa de detección activa:", pausarDeteccion);
      
      if (currentModel) {
        console.log("Propiedades del modelo:", Object.keys(currentModel));
        console.log("Animaciones en currentModel:", currentModel.animations ? currentModel.animations.map(a => a.name) : 'ninguna');
        console.log("Posición del modelo:", currentModel.position);
        console.log("Escala del modelo:", currentModel.scale);
      }
      
      if (mixer) {
        console.log("Acciones del mixer:", mixer._actions.length);
        console.log("Nombres de acciones:", mixer._actions.map(a => a._clip ? a._clip.name : 'sin nombre'));
        console.log("Estados de acciones:", mixer._actions.map(a => ({
          name: a._clip ? a._clip.name : 'sin nombre',
          enabled: a.enabled,
          paused: a.paused,
          weight: a.weight
        })));
      }
      
      // Preguntar si quiere limpiar la escena
      const respuesta = confirm('¿Quieres limpiar la escena completamente? Esto eliminará todos los modelos y animaciones acumulados.');
      if (respuesta) {
        limpiarEscena();
        alert('Escena limpiada. Puedes volver a detectar banderas normalmente.');
      } else {
        alert('Revisa la consola para ver el diagnóstico completo del modelo y sus animaciones.');
      }
    }
  }
}

// Asignar eventos a los botones de interacción
window.addEventListener('DOMContentLoaded', function() {
  const btnVideo = document.querySelector('#botones-interaccion #videomodal');
  if (btnVideo) {
    btnVideo.addEventListener('click', function() {
      mostrarModalVideo();
      document.getElementById('btn-modal-video').style.display = 'flex';
    document.getElementById('video').style.display = 'none';
    document.getElementById('canvas3d').style.display = 'none';
    document.getElementById('frameCanvas').style.display = 'none';
    document.getElementById('deteccion-info').style.display = 'none';
    document.getElementById('btn-iniciar-modelo').style.display = 'none';
    document.getElementById('btn-diagnostico').style.display = 'none';
    document.getElementById('animacion-progreso').style.display = 'none';
    pausarDeteccion = false; // Resetear pausa de detección
    
    // Limpiar escena 3D al salir del modo RA
    try {
      if (typeof currentModel !== 'undefined' && currentModel) {
        scene.remove(currentModel);
        currentModel = null;
      }
      if (typeof mixer !== 'undefined' && mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
        mixer = null;
      }
    } catch (e) {
      console.log("Error al limpiar escena:", e);
    }
    
    detenerCamara();
    });
  }
  const btnDatos = document.querySelector('#botones-interaccion #datos');
  if (btnDatos) {
    btnDatos.addEventListener('click', function() {
      mostrarModalDatos();
       document.getElementById('btn-modal-video').style.display = 'none';
    document.getElementById('video').style.display = 'none';
    document.getElementById('canvas3d').style.display = 'none';
    document.getElementById('frameCanvas').style.display = 'none';
    document.getElementById('deteccion-info').style.display = 'none';
    document.getElementById('btn-iniciar-modelo').style.display = 'none';
    document.getElementById('btn-diagnostico').style.display = 'none';
    document.getElementById('animacion-progreso').style.display = 'none';
    pausarDeteccion = false; // Resetear pausa de detección
    detenerCamara();
    });
  }
  const btnTrivia = document.querySelector('#botones-interaccion #trivia');
  if (btnTrivia) {
    btnTrivia.addEventListener('click', function() {
      mostrarModalTrivia();
      document.getElementById('btn-modal-video').style.display = 'none';
  document.getElementById('video').style.display = 'none';
  document.getElementById('canvas3d').style.display = 'none';
  document.getElementById('frameCanvas').style.display = 'none';
  document.getElementById('deteccion-info').style.display = 'none';
  document.getElementById('btn-iniciar-modelo').style.display = 'none';
  document.getElementById('btn-diagnostico').style.display = 'none';
  document.getElementById('animacion-progreso').style.display = 'none';
  pausarDeteccion = false; // Resetear pausa de detección
  detenerCamara();
    });
  }
  const btnAnimacion = document.querySelector('#botones-interaccion #animacion');
  if (btnAnimacion) {
    btnAnimacion.addEventListener('click', function() {
      // Mostrar cámara y canvas 3D, ocultar otros elementos
      document.getElementById('video').style.display = '';
      document.getElementById('canvas3d').style.display = '';
      document.getElementById('frameCanvas').style.display = 'none';
      document.getElementById('deteccion-info').style.display = 'none';
      document.getElementById('btn-modal-video').style.display = 'none';
      // Ocultar modales si están abiertos
      document.getElementById('modal-video').style.display = 'none';
      document.getElementById('modal-datos').style.display = 'none';
      document.getElementById('modal-trivia').style.display = 'none';
      // Iniciar RA
      RAbegin();
    });
  }
});
