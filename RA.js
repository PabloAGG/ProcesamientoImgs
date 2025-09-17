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
    preguntasTrivia = data.preguntas;
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
// --- MODAL VIDEO ---
function mostrarModalVideo() {
  document.getElementById('modal-video').style.display = 'flex';
  const v = document.getElementById('video-mundial');
  v.currentTime = 0;
  v.play();
}
function cerrarModalVideo() {
  document.getElementById('modal-video').style.display = 'none';
  document.getElementById('video-mundial').pause();
}

// --- INICIO RA ---

// Variables para animación
let mixer = null;
let clock = null;

function RAbegin() {
  // Mostrar botón extra para animar modelo
  const btnIniciarModelo = document.getElementById('btn-iniciar-modelo');
  if (btnIniciarModelo) btnIniciarModelo.style.display = '';
  let model;
  let scene, camera, renderer, currentModel;
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
    7: { nombre: "Urbekistan", textura: "3D_model/textures/Urbekistan.png" },
    8: { nombre: "Corea", textura: "3D_model/textures/Corea.png" },
    9: { nombre: "Jordania", textura: "3D_model/textures/Jordania.png" },
    10: { nombre: "Australia", textura: "3D_model/textures/Australia.png" },
    11: { nombre: "Brasil", textura: "3D_model/textures/Brasil.png" },
    12: { nombre: "Ecuador", textura: "3D_model/textures/Ecuador.png" }
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
    if (currentModel) {
      currentModel.rotation.y += 0.01;
    }
    if (mixer) {
      const delta = clock.getDelta();
      mixer.update(delta);
    }
    renderer.render(scene, camera);
  }

  async function cargarModelo() {
    model = await tf.loadLayersModel("modeloIA/model.json");
    console.log("Modelo de IA cargado");
  }

  async function cargarModelo3D(textura) {
    const loader = new THREE.GLTFLoader();
    // Eliminar modelo anterior si existe
   
    mixer = null;
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
      scene.add(currentModel);
      // Preparar animaciones si existen
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentModel);
        // Buscar animación llamada 'Summary'
        const summaryClip = gltf.animations.find(a => a.name === 'Wave');
        if (summaryClip) {
          mixer.clipAction(summaryClip).stop(); // No iniciar automáticamente
        }
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
    if (!model) return;
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
    if (maxProb > umbralConfianza && banderasConfig[banderaDetectada]) {
      document.getElementById('deteccion-info').style.display = 'block';
      document.getElementById('nombre-bandera').textContent = banderasConfig[banderaDetectada].nombre;
      document.getElementById('valor-confianza').textContent = confianza + '%';
      const config = banderasConfig[banderaDetectada];
      await cargarModelo3D(config.textura);
      console.log(`Bandera detectada: ${config.nombre} (${confianza}%)`);
    } else {
      document.getElementById('deteccion-info').style.display = 'none';
      if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
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
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 60);
  });
  setInterval(predecir, 500);
  // Evento para animar el modelo 3D
  if (btnIniciarModelo) {
    btnIniciarModelo.onclick = function() {
      if (mixer) {
        // Buscar animación llamada 'Summary' y reproducirla
        const actions = mixer._actions || [];
        let summaryAction = null;
        if (actions.length > 0) {
          summaryAction = actions.find(a => a._clip && a._clip.name === 'Wave');
        }
        if (!summaryAction && mixer._root && mixer._root.animations) {
          // fallback: buscar en animations
          const summaryClip = mixer._root.animations.find(a => a.name === 'Wave');
          if (summaryClip) summaryAction = mixer.clipAction(summaryClip);
        }
        if (summaryAction) {
          summaryAction.reset();
          summaryAction.play();
        } else {
    console.log("Animaciones encontradas en el modelo:", mixer._actions.map(a => a._clip.name));
          alert('No se encontró la animación "Summary" en el modelo.');
        }
      } else {
        alert('Este modelo no tiene animaciones.');
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
    document.getElementById('video').style.display = 'none';
    document.getElementById('canvas3d').style.display = 'none';
    document.getElementById('frameCanvas').style.display = 'none';
    document.getElementById('deteccion-info').style.display = 'none';
    document.getElementById('btn-iniciar-modelo').style.display = 'none';
    detenerCamara();
    });
  }
  const btnDatos = document.querySelector('#botones-interaccion #datos');
  if (btnDatos) {
    btnDatos.addEventListener('click', function() {
      mostrarModalDatos();
    document.getElementById('video').style.display = 'none';
    document.getElementById('canvas3d').style.display = 'none';
    document.getElementById('frameCanvas').style.display = 'none';
    document.getElementById('deteccion-info').style.display = 'none';
    document.getElementById('btn-iniciar-modelo').style.display = 'none';
    detenerCamara();
    });
  }
  const btnTrivia = document.querySelector('#botones-interaccion #trivia');
  if (btnTrivia) {
    btnTrivia.addEventListener('click', function() {
      mostrarModalTrivia();
  document.getElementById('video').style.display = 'none';
  document.getElementById('canvas3d').style.display = 'none';
  document.getElementById('frameCanvas').style.display = 'none';
  document.getElementById('deteccion-info').style.display = 'none';
  document.getElementById('btn-iniciar-modelo').style.display = 'none';
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
      // Ocultar modales si están abiertos
      document.getElementById('modal-video').style.display = 'none';
      document.getElementById('modal-datos').style.display = 'none';
      document.getElementById('modal-trivia').style.display = 'none';
      // Iniciar RA
      RAbegin();
    });
  }
});
