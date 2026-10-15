(function () {
  'use strict';

  const presentation = document.getElementById('presentation');
  const stage = document.getElementById('deck-stage');
  const canvas = document.getElementById('deck-canvas');
  const notes = document.getElementById('deck-notes');
  const indexPanel = document.getElementById('deck-index');
  const notesToggle = document.getElementById('deck-notes-toggle');
  const indexToggle = document.getElementById('deck-index-toggle');
  const fullscreenButton = document.getElementById('deck-fullscreen');
  const esc = escapeHTML;
  let slides = [];
  let slideIndex = 0;
  let returnHash = '#inicio';
  let returnTitle = document.title;
  let returnFocus = null;
  let timer = null;
  let startedAt = 0;
  let touchStart = null;
  let transitionTimer = null;
  let controlsTimer = null;
  let messageTimer = null;

  function fitCanvas() {
    if (!presentation.open) return;
    const scale = Math.max(0.05, Math.min(stage.clientWidth / 1280, stage.clientHeight / 720));
    canvas.style.setProperty('--deck-scale', String(scale));
    const content = canvas.querySelector('.deck-slide.is-active .deck-slide-inner');
    if (content) content.style.setProperty('--deck-content-scale', String(Math.min(1, 580 / Math.max(1, content.offsetHeight))));
  }

  function revealControls() {
    if (!presentation.open) return;
    presentation.classList.add('controls-visible');
    clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => {
      if (notes.hidden && indexPanel.hidden && !presentation.querySelector('.deck-header:focus-within,.deck-footer:focus-within')) presentation.classList.remove('controls-visible');
    }, 2500);
  }

  function showMessage(message) {
    const element = document.getElementById('deck-message');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => element.classList.remove('visible'), 4500);
  }

  const short = (text, limit = 190) => {
    const value = String(text).trim();
    if (value.length <= limit) return value;
    const cut = value.slice(0, limit);
    const space = cut.lastIndexOf(' ');
    return cut.slice(0, space > limit * 0.6 ? space : limit).replace(/[,:;.]$/, '') + '…';
  };
  const sentences = text => (String(text).match(/[^.!?]+(?:[.!?]+|$)/g) || [String(text)]).map(s => s.trim()).filter(Boolean);
  const paragraphs = blocks => blocks.map(block => `<p>${esc(block)}</p>`).join('');
  const titleBlock = (kicker, title, subtitle = '') => `<div class="deck-section-heading"><div class="deck-kicker">${esc(kicker)}</div><h2 class="deck-heading" id="deck-slide-title" tabindex="-1">${title}</h2>${subtitle ? `<p class="deck-subtitle">${esc(subtitle)}</p>` : ''}</div>`;
  const ringArt = `<div class="deck-cover-art" aria-hidden="true"><div class="deck-orbit"></div><div class="deck-orbit"></div><svg viewBox="0 0 420 420" fill="none"><defs><linearGradient id="deck-water" x1="120" y1="80" x2="300" y2="330" gradientUnits="userSpaceOnUse"><stop stop-color="#d7fff1"/><stop offset=".5" stop-color="#82dcda"/><stop offset="1" stop-color="#2088a8"/></linearGradient></defs><ellipse cx="210" cy="350" rx="160" ry="29" stroke="#7ccece" opacity=".3"/><ellipse cx="210" cy="350" rx="120" ry="15" fill="#062e3b"/><path d="M210 55C188 101 112 173 112 237a98 98 0 0 0 196 0C308 173 232 101 210 55Z" fill="url(#deck-water)"/><path d="M150 232c0-27 15-49 32-71" stroke="#e1fff7" stroke-width="11" stroke-linecap="round" opacity=".7"/><path d="M165 266c23 25 62 29 92 4" stroke="#d3fff0" stroke-width="4" stroke-linecap="round"/></svg><span class="deck-art-label">REGENERAR · CONTROLAR · REUTILIZAR</span></div>`;

  function buildSlides() {
    const questionTags = ['Nuestra razón de ser', 'La empresa que queremos ser', 'Valor para nuestros grupos de interés', 'El entorno al que respondemos'];
    const list = [{
      title: 'Hidrogota', chapter: 'Apertura · 0:45', theme: 'dark',
      body: `<div class="deck-cover-grid"><div><div class="deck-kicker">ZINKERS FP · REPTE SOM PROFESSIONALS</div><h2 class="deck-cover-title" id="deck-slide-title" tabindex="-1"><span>Som Sostenibles · Repte Som Professionals</span>Hidro<br><em>gota.</em></h2><p class="deck-cover-description">Cuidar el agua.<br>Cuidar a las personas.<br>Dar otra oportunidad a cada gota.</p><div class="deck-company"><span aria-hidden="true">↗</span><strong>${esc(state.company)}</strong><small>NUESTRA EMPRESA<br>PROPUESTA EDUCATIVA</small></div></div>${ringArt}</div>`,
      notes: paragraphs([`Presentamos nuestro proyecto de empresa para el Repte Som Professionals: ${state.company}.`, `Equipo: ${state.team}. Curso: ${state.course}.`, 'El recorrido conecta cuatro preguntas sobre el propósito con los ODS, los criterios ASG, los riesgos y los indicadores de seguimiento. Las actuaciones son propuestas; no se presentan como resultados verificados.'])
    }];

    list.push({
      title:'¿A quién ayudamos?', chapter:'La necesidad y el servicio · 1:15', theme:'light',
      body:titleBlock('EL PROBLEMA Y NUESTRA RESPUESTA', 'Queremos parques verdes.<br><em>También debemos cuidar el agua.</em>') + '<div class="deck-cards"><article class="deck-card"><span class="deck-card-tag">LA NECESIDAD</span><h3>Menos dependencia del agua dulce</h3><p>La sequía y la presión sobre el agua obligan a buscar cómo aprovechar mejor la que ya usamos.</p></article><article class="deck-card"><span class="deck-card-tag">NUESTRO CLIENTE</span><h3>Ayuntamientos y zonas verdes</h3><p>Proponemos vender un servicio de suministro de agua regenerada y seguimiento para el riego autorizado.</p></article><article class="deck-card"><span class="deck-card-tag">CÓMO EMPEZARÍAMOS</span><h3>Un parque, un piloto</h3><p>Comprobar demanda, costes, tratamiento, permisos y distribución antes de ampliar el servicio.</p></article><article class="deck-card"><span class="deck-card-tag">POSIBLE SIGUIENTE PASO</span><h3>Agricultura</h3><p>Estudiar cada cultivo y las condiciones del riego. El origen ganadero requiere una evaluación específica.</p></article></div>',
      notes:paragraphs(['Tiempo orientativo: 1 minuto y 15 segundos. Imaginad un parque que necesita riego. Nuestra idea es estudiar si parte de esa demanda puede atenderse con agua que ya hemos utilizado, después de tratarla y comprobar su calidad.', 'El propósito es social y ambiental, pero la empresa necesita ingresos. El cliente propuesto es el ayuntamiento o el gestor de zonas verdes, que pagaría por el servicio y su seguimiento. No hemos calculado todavía tarifas ni firmado contratos.', 'La agricultura sería una segunda fase. Las aguas de origen animal no se consideran equivalentes a las urbanas: necesitan una evaluación y un diseño adecuados.'])
    }, {
      title:'¿Cómo vuelve a ser útil?', chapter:'El proceso explicado fácil · 1:30', theme:'dark',
      body:titleBlock('DEL AGUA USADA A UN NUEVO USO', 'El agua no se crea.<br><em>Se recupera.</em>') + '<div class="deck-process-flow"><article><span>01</span><h3>Separar</h3><p>Retirar sólidos.</p></article><article><span>02</span><h3>Tratar</h3><p>Reducir materia orgánica con microorganismos.</p></article><article><span>03</span><h3>Regenerar</h3><p>Filtrar y desinfectar según el destino.</p></article><article><span>04</span><h3>Comprobar</h3><p>Controlar la calidad antes del suministro.</p></article></div><div class="deck-process-result"><span>AGUAS RESIDUALES URBANAS</span><b>→</b><span>RIEGO AUTORIZADO</span></div><p class="deck-metric-note">Esquema simplificado. Tratamiento adaptado al origen y al uso. No proponemos agua para beber.</p>',
      notes:paragraphs(['Tiempo orientativo: 1 minuto y 30 segundos. No hacemos agua de la nada: recuperamos el agua que ya forma parte de las aguas residuales, principalmente urbanas de origen humano.', 'Primero se separan sólidos. Después, un tratamiento biológico ayuda a reducir la materia orgánica. La regeneración incorpora las etapas necesarias, como filtración y desinfección, para el uso previsto.', 'El proceso no es una receta universal. Necesita diseño técnico, gestión de residuos, análisis y autorizaciones. Si los controles no cumplen, se retiene el agua y no se suministra.', 'Los sensores permitirían vigilar ciertos parámetros, pero no sustituyen todos los análisis. No disponemos de una planta real ni de datos en directo.', 'Referencia: MITECO, reutilización de aguas tratadas: https://www.miteco.gob.es/es/agua/temas/concesiones-y-autorizaciones/reutilizacion-aguas-depuradas.html'])
    });

    questions.forEach((question, i) => {
      const parts = sentences(state.answers[i]);
      const lead = short(parts[0] || state.answers[i], 245);
      const supporting = parts.slice(1, 3).map(text => short(text, 220));
      list.push({
        title: question.title, chapter: 'Propósito · ' + (i + 1) + ' de 4 · 0:45', theme: 'light',
        body: `<div class="deck-question-layout"><div class="deck-question-heading"><div class="deck-kicker">ACTIVIDAD 1 · ${esc(question.label)}</div><div class="deck-big-number" aria-hidden="true">0${i + 1}</div><h2 class="deck-heading" id="deck-slide-title" tabindex="-1">${esc(question.title)}</h2><span class="deck-pill">${esc(questionTags[i])}</span></div><div><blockquote class="deck-quote">${esc(lead)}</blockquote>${supporting.length ? `<ul class="deck-idea-list">${supporting.map(text => `<li>${esc(text)}</li>`).join('')}</ul>` : ''}<span class="deck-excerpt-note">Ideas principales de la respuesta · texto completo en el guion</span></div></div>`,
        notes: paragraphs(['Tiempo orientativo: 45 segundos. Resumid la idea principal y añadid un ejemplo; no hace falta leer el párrafo entero.', state.answers[i], question.note])
      });
    });

    list.push({
      title: 'Propósito y misión', chapter: 'Entregable 1 · 0:45', theme: 'dark',
      body: `<div class="deck-mission"><div class="deck-kicker">ENTREGABLE 1 · NUESTRA BRÚJULA</div><h2 class="deck-heading" id="deck-slide-title" tabindex="-1">Un propósito para decidir.<br><em>Una misión para actuar.</em></h2><p class="deck-mission-quote">${esc(short(state.mission, 600))}</p><div class="deck-label-row"><span>${esc(state.company)}</span><span>PROPÓSITO + MISIÓN</span><span>DEL PORQUÉ AL CÓMO</span></div></div>`,
      notes: paragraphs([state.mission, 'Explicad qué necesidad atiende la empresa, a quién aporta valor y cómo se traduce ese propósito en su actividad diaria.'])
    });

    const goals = [6, 12, 11, 2];
    list.push({
      title: 'Nuestros ODS prioritarios', chapter: 'Actividad 2 · ODS · 1:15', theme: 'light',
      body: titleBlock('ACTIVIDAD 2 · IMPACTO CON DIRECCIÓN', '17 objetivos.<br><em>Cuatro prioridades justificadas.</em>') + `<div class="deck-cards">${goals.map(n => `<article class="deck-card deck-ods-card"><span class="deck-ods-number" style="--deck-ods:${ods[n - 1][2]}">${n}</span><div><span class="deck-card-tag">OBJETIVO DE DESARROLLO SOSTENIBLE</span><h3>${esc(ods[n - 1][1])}</h3><p>${esc(short(priority[n].why, 160))}</p></div></article>`).join('')}</div>`,
      notes: paragraphs(['Tiempo orientativo: 1 minuto y 15 segundos. ODS 6 es el núcleo; ODS 12 explica el uso responsable del recurso; ODS 11 conecta con parques y ciudades; ODS 2 es una contribución agrícola por validar. ODS 9 complementa el proyecto mediante infraestructura, sensores y redes separadas.']) + goals.map(n => `<p><strong>ODS ${n} · ${esc(ods[n - 1][1])}</strong><br>${esc(priority[n].why)}<br><br>${esc(priority[n].action)}<br><br>${esc(priority[n].target)}</p>`).join('')
    });

    list.push({
      title: 'Criterios ASG', chapter: 'Actividad 2 · ASG · 1:15', theme: 'light',
      body: titleBlock('DEL COMPROMISO A LA GESTIÓN', 'Tres miradas.<br><em>Una misma responsabilidad.</em>') + `<div class="deck-asg-grid">${asg.map(a => `<article class="deck-card deck-asg-card"><span class="deck-asg-letter" aria-hidden="true">${a.key}</span><h3>${esc(a.name)}</h3><p>${esc(a.body)}</p><div class="deck-asg-action"><strong>ACCIÓN PROPUESTA</strong><p>${esc(short(a.action, 160))}</p></div></article>`).join('')}</div>`,
      notes: paragraphs(['Tiempo orientativo: 1 minuto y 15 segundos. Ambiental es cómo cuidamos el agua y gestionamos los impactos; social, cómo protegemos e informamos a las personas; gobernanza, quién responde y cómo se comprueba lo que hacemos.']) + asg.map(a => `<p><strong>${esc(a.name)}</strong><br>${esc(a.body)}<br><br>${esc(a.action)}<br><br>${esc(a.evidence)}</p>`).join('')
    });

    const riskGroups = [
      {name:'Calidad y viabilidad',title:'Si no cumple la calidad,<br><em>se detiene el suministro.</em>',category:'A',chapter:'Entregable 2 · Ambiental · 1:15',
       risk:'Un fallo de tratamiento puede causar daños. La energía, el bombeo y la distribución también pueden hacer inviable el servicio.',
       opportunity:'Reutilizar agua para zonas verdes y, después, estudiar el riego agrícola con un diseño que sea viable.',
       action:'Retener ante un incumplimiento y corregir. Medir calidad, energía y coste por m³ en el piloto.'},
      {name:'Confianza y responsabilidad',title:'La confianza necesita<br><em>pruebas y responsables.</em>',category:'SG',chapter:'Entregable 2 · Social y gobernanza · 1:15',
       risk:'El origen del agua puede generar rechazo. Los permisos incompletos y la falta de registros comprometen el proyecto.',
       opportunity:'Explicar con claridad, escuchar al vecindario y publicar controles comprensibles para construir confianza.',
       action:'Tramitar permisos, asignar responsables, documentar suministros y atender las dudas de la comunidad.'}
    ];
    riskGroups.forEach(group => {
      const rows=matrix.filter(row=>group.category.includes(row.asg));
      list.push({
        title:group.name,chapter:group.chapter,theme:'dark',
        body:titleBlock('ENTREGABLE 2 · RISCOS I OPORTUNITATS',group.title) + `<div class="deck-risk-grid"><article class="deck-card deck-risk-card"><div class="deck-risk-label">↘ RIESGOS</div><h3>Lo que debemos anticipar</h3><p>${esc(group.risk)}</p></article><article class="deck-card deck-risk-card"><div class="deck-risk-label">↗ OPORTUNIDADES</div><h3>Lo que podemos impulsar</h3><p>${esc(group.opportunity)}</p></article></div><div class="deck-shared-action"><strong>PRIMERA RESPUESTA PROPUESTA</strong><p>${esc(group.action)}</p></div>`,
        notes:paragraphs(['Tiempo orientativo: 1 minuto y 15 segundos. Mostrad cómo se relaciona cada riesgo con una acción y una evidencia. La matriz completa de la web conserva los ocho registros y sus filtros.']) + rows.map(row=>`<p><strong>${row.type==='risk'?'Riesgo':'Oportunidad'}: ${esc(row.title)}</strong><br>${esc(row.description)}<br><br>${esc(row.response)}</p>`).join('')
      });
    });

    const metrics = [
      {unit:'m³',title:'Agua por destino autorizado',goal:6,description:'Volumen suministrado, con registro del destino y de los controles de calidad.'},
      {unit:'kWh/m³',title:'Energía y eficiencia',goal:6,description:'Energía consumida por cada metro cúbico tratado. También calcularíamos el coste por m³.'},
      {unit:'%',title:'Aprovechamiento del agua',goal:12,description:'Agua suministrada para reutilización respecto al volumen que entra en el sistema.'},
      {unit:'m²',title:'Zonas verdes atendidas',goal:11,description:'Superficie del piloto atendida, volumen de riego e incidencias del servicio.'}
    ];
    list.push({
      title: 'Cómo mediremos el avance', chapter: 'Seguimiento del impacto · 0:45', theme: 'light',
      body: titleBlock('MEDIR · APRENDER · MEJORAR', 'El compromiso se demuestra<br><em>con evidencias.</em>') + `<div class="deck-cards">${metrics.map(metric => `<article class="deck-card deck-metric-card"><span class="deck-metric-unit" aria-hidden="true">${metric.unit}</span><div><span class="deck-card-tag">ODS ${metric.goal} · INDICADOR PROPUESTO</span><h3>${esc(metric.title)}</h3><p>${esc(metric.description)}</p></div></article>`).join('')}</div><p class="deck-metric-note">Primero estableceremos una línea de base. Las unidades representan qué queremos medir; todavía no son resultados.</p>`,
      notes: paragraphs(['Los indicadores son propuestas de seguimiento y requieren una línea de base. No hemos atribuido cifras de ahorro, emisiones evitadas ni resultados sociales sin evidencia.', ...metrics.map(metric => metric.title + ': ' + metric.description), 'En cada revisión deberemos explicar el método de medición, el alcance de los datos y quién se responsabiliza del registro.'])
    });

    const reviewed = Object.keys(state.scores).length;
    const total = Object.values(state.scores).reduce((sum, value) => sum + value, 0);
    list.push({
      title: 'Calidad del proyecto', chapter: 'Evaluación y calidad · 0:30', theme: 'light',
      body: titleBlock('EVALUACIÓN · CLARIDAD Y COHERENCIA', 'Una buena propuesta<br><em>también se puede evaluar.</em>') + `<div class="deck-rubric-layout"><div class="deck-rubric-list">${rubric.map(r => `<div class="deck-rubric-item"><span>${esc(r.name)}</span><span>${number(r.max)} pts</span></div>`).join('')}</div><div class="deck-rubric-score"><span>${reviewed ? 'AUTOEVALUACIÓN ACTUAL' : 'FRAGMENTO DE RÚBRICA'}</span><strong>${reviewed ? number(total) : '8,5'}</strong><p>${reviewed ? 'de 8,5 puntos posibles' : 'puntos máximos visibles'}</p><small>${reviewed ? `${reviewed} de 5 criterios revisados. Valoración orientativa del equipo.` : 'Cinco criterios de la imagen facilitada. La valoración corresponde al profesorado.'}</small></div></div><p class="deck-metric-note">La revisión de riesgos es complementaria. No se añaden puntos a los niveles de la imagen.</p>`,
      notes: paragraphs(['La imagen muestra un máximo conjunto de 8,5 puntos y repite los descriptores de ODS en la fila ASG. Se han conservado los pesos y los niveles facilitados.', ...rubric.map(r => `${r.name}: ${r.id in state.scores ? number(state.scores[r.id]) : 'sin revisar'} / ${number(r.max)} puntos. ${r.help}`), 'Mostrad la relación entre propósito, actividad, ODS y riesgos. Acompañad cada compromiso de una actuación y una evidencia comprobable.'])
    });

    list.push({
      title: '¿Regaríais un parque con esta agua?', chapter: 'Conversación y cierre · 1:30', theme: 'dark',
      body: `<div class="deck-closing"><span class="deck-closing-symbol" aria-hidden="true">✳</span><h2 class="deck-heading" id="deck-slide-title" tabindex="-1">¿Regaríais un parque<br><em>con agua regenerada?</em></h2><p class="deck-subtitle">Si se comprueba que cumple los controles<br>para ese uso, ¿qué os gustaría saber antes?</p><div class="deck-closing-team"><span>${esc(state.company)}</span><span>${esc(state.team)}</span><span>${esc(state.course)}</span></div><button class="deck-return" data-deck-return>Volver a la web <span aria-hidden="true">↗</span></button></div>`,
      notes: paragraphs(['Tiempo orientativo: 1 minuto y 30 segundos. La suma del recorrido es de unos 15 minutos, incluida esta conversación.', 'Preguntad al grupo si regaría un parque con esta agua y pedid una razón o una duda. Explicad que la confianza debe apoyarse en controles adecuados para el uso, no en prometer seguridad absoluta.', 'Cerrad con el lema: cuidar el agua para cuidar a las personas. El siguiente paso sería estudiar un piloto municipal.', 'Dejad espacio a preguntas del profesorado y del grupo. Si no disponéis de datos, explicad qué información necesitaríais para responder con rigor.', 'Fuentes: rúbrica facilitada, Agenda 2030 de Naciones Unidas y programa Zinkers de Fundación Repsol. Proyecto educativo independiente.'])
    });
    return list;
  }

  function updateTimer() {
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    document.getElementById('deck-timer').textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  }

  function renderIndex() {
    document.getElementById('deck-index-list').innerHTML = slides.map((slide, i) => `<button data-deck-slide="${i}" ${i === slideIndex ? 'aria-current="step"' : ''}><span>${String(i + 1).padStart(2, '0')}</span>${esc(slide.title)}</button>`).join('');
  }

  function showSlide(nextIndex, focus = true) {
    const previousIndex = slideIndex;
    const next = Math.max(0, Math.min(slides.length - 1, nextIndex));
    const outgoing = canvas.querySelector('.deck-slide.is-active');
    if (outgoing && next === previousIndex) return;
    slideIndex = next;
    const slide = slides[slideIndex];
    clearTimeout(transitionTimer);
    canvas.querySelectorAll('.deck-slide:not(.is-active)').forEach(element => element.remove());
    if (outgoing) {
      outgoing.classList.remove('is-active', 'is-entering', 'from-right', 'from-left');
      outgoing.classList.add('is-leaving', slideIndex > previousIndex ? 'to-left' : 'to-right');
      outgoing.setAttribute('aria-hidden', 'true');
      outgoing.inert = true;
      const oldHeading = outgoing.querySelector('#deck-slide-title');
      if (oldHeading) oldHeading.removeAttribute('id');
    }
    const incoming = document.createElement('article');
    incoming.className = `deck-slide deck-theme-${slide.theme} is-active is-entering ${!outgoing || slideIndex > previousIndex ? 'from-right' : 'from-left'}`;
    incoming.setAttribute('role', 'group');
    incoming.setAttribute('aria-roledescription', 'diapositiva');
    incoming.setAttribute('aria-label', `${slideIndex + 1} de ${slides.length}`);
    incoming.innerHTML = `<div class="deck-slide-inner">${slide.body}</div>`;
    canvas.append(incoming);
    stage.dataset.theme = slide.theme;
    fitCanvas();
    transitionTimer = setTimeout(() => {
      if (outgoing) outgoing.remove();
      incoming.classList.remove('is-entering', 'from-right', 'from-left');
    }, 1150);
    document.getElementById('deck-notes-title').textContent = slide.title;
    document.getElementById('deck-notes-content').innerHTML = slide.notes;
    notes.scrollTop = 0;
    document.getElementById('deck-chapter').textContent = slide.chapter;
    document.getElementById('deck-counter').textContent = `${String(slideIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    document.getElementById('deck-progress-bar').style.width = `${(slideIndex + 1) / slides.length * 100}%`;
    document.getElementById('deck-previous').disabled = slideIndex === 0;
    document.getElementById('deck-next').disabled = slideIndex === slides.length - 1;
    history.replaceState(null, '', `#presentacion/${slideIndex + 1}`);
    renderIndex();
    if (focus) document.getElementById('deck-slide-title').focus({preventScroll:true});
    revealControls();
  }

  function toggleNotes() {
    const visible = notes.hidden;
    notes.hidden = !visible;
    presentation.querySelector('.deck-body').classList.toggle('with-notes', visible);
    notesToggle.setAttribute('aria-expanded', String(visible));
    notesToggle.setAttribute('aria-label', visible ? 'Ocultar guion de apoyo' : 'Mostrar guion de apoyo');
    fitCanvas();
    revealControls();
  }

  function toggleIndex(force) {
    const visible = typeof force === 'boolean' ? force : indexPanel.hidden;
    indexPanel.hidden = !visible;
    indexToggle.setAttribute('aria-expanded', String(visible));
    if (visible) indexPanel.querySelector('[aria-current="step"]').focus({preventScroll:true});
    revealControls();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === presentation) await document.exitFullscreen();
      else if (presentation.requestFullscreen && document.fullscreenEnabled) await presentation.requestFullscreen();
      else showMessage('Tu navegador no permite activar la pantalla completa en esta ventana.');
    } catch {
      showMessage('La presentación ocupa la ventana. El navegador no ha permitido activar la pantalla completa.');
    }
  }

  function openPresentation(index = 0, trigger = null) {
    if (dialog.open) return;
    if (!presentation.open) {
      returnHash = /^#presentacion(?:\/\d+)?$/.test(location.hash) ? '#inicio' : location.hash || '#inicio';
      returnTitle = document.title;
      returnFocus = trigger || document.activeElement;
      slides = buildSlides();
      notes.hidden = true;
      notesToggle.setAttribute('aria-expanded', 'false');
      notesToggle.setAttribute('aria-label', 'Mostrar guion de apoyo');
      presentation.querySelector('.deck-body').classList.remove('with-notes');
      toggleIndex(false);
      canvas.replaceChildren();
      presentation.showModal();
      presentation.classList.add('controls-visible');
      document.body.classList.add('presenting');
      document.title = state.company + ' · Presentación | Som Sostenibles';
      document.getElementById('presentation-name').textContent = state.company + ' · Repte Som Professionals';
      startedAt = Date.now();
      updateTimer();
      timer = setInterval(updateTimer, 1000);
    }
    showSlide(index);
  }

  function closePresentation() {
    if (!presentation.open) return;
    if (document.fullscreenElement === presentation) document.exitFullscreen().catch(() => {});
    presentation.close();
  }

  presentation.addEventListener('close', () => {
    clearInterval(timer);
    clearTimeout(transitionTimer);
    clearTimeout(controlsTimer);
    clearTimeout(messageTimer);
    canvas.replaceChildren();
    document.getElementById('deck-message').classList.remove('visible');
    timer = null;
    document.body.classList.remove('presenting');
    document.title = returnTitle;
    if (/^#presentacion(?:\/\d+)?$/.test(location.hash)) history.replaceState(null, '', returnHash);
    const focusTarget = returnFocus && returnFocus.isConnected && returnFocus.getClientRects().length ? returnFocus : document.querySelector('.hero .presentation-trigger');
    if (focusTarget) focusTarget.focus({preventScroll:true});
  });
  presentation.addEventListener('cancel', event => {event.preventDefault(); closePresentation();});
  document.querySelectorAll('.presentation-trigger').forEach(button => button.addEventListener('click', event => {
    if (document.getElementById('navigation').classList.contains('open')) document.querySelector('.menu-toggle').click();
    openPresentation(0, event.currentTarget);
    if (presentation.open && presentation.requestFullscreen && document.fullscreenEnabled && !document.fullscreenElement) toggleFullscreen();
  }));
  document.getElementById('deck-next').addEventListener('click', () => showSlide(slideIndex + 1));
  document.getElementById('deck-previous').addEventListener('click', () => showSlide(slideIndex - 1));
  document.getElementById('deck-close').addEventListener('click', closePresentation);
  document.getElementById('deck-home').addEventListener('click', event => {event.preventDefault(); closePresentation();});
  document.getElementById('deck-index-close').addEventListener('click', () => {toggleIndex(false); indexToggle.focus();});
  notesToggle.addEventListener('click', toggleNotes);
  indexToggle.addEventListener('click', () => toggleIndex());
  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.getElementById('deck-index-list').addEventListener('click', event => {
    const button = event.target.closest('[data-deck-slide]');
    if (!button) return;
    toggleIndex(false);
    showSlide(Number(button.dataset.deckSlide));
  });
  stage.addEventListener('click', event => {if (event.target.closest('[data-deck-return]')) closePresentation();});
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || event.target.closest('button,a')) return;
    touchStart = {x:event.clientX, y:event.clientY};
  }, {passive:true});
  stage.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 65 && Math.abs(dy) < 50) showSlide(slideIndex + (dx < 0 ? 1 : -1));
  }, {passive:true});
  stage.addEventListener('pointercancel', () => {touchStart = null;});
  document.addEventListener('fullscreenchange', () => {
    const active = document.fullscreenElement === presentation;
    fullscreenButton.setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Activar pantalla completa');
    fullscreenButton.title = active ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)';
    fitCanvas();
    revealControls();
  });
  presentation.addEventListener('pointermove', revealControls, {passive:true});
  presentation.addEventListener('pointerdown', revealControls, {passive:true});
  presentation.addEventListener('focusin', revealControls);
  window.addEventListener('resize', fitCanvas);
  if ('ResizeObserver' in window) new ResizeObserver(fitCanvas).observe(stage);
  document.addEventListener('keydown', event => {
    if (!presentation.open || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const key = event.key.toLowerCase();
    if (key === 'escape') {
      event.preventDefault();
      if (!indexPanel.hidden) {toggleIndex(false); indexToggle.focus();}
      else closePresentation();
    } else if (key === 'n') {event.preventDefault(); toggleNotes();}
    else if (key === 'g') {event.preventDefault(); toggleIndex();}
    else if (key === 'f') {event.preventDefault(); toggleFullscreen();}
    else if (!indexPanel.hidden) return;
    else if (['arrowright','pagedown'].includes(key) || (key === ' ' && !event.target.closest('button,a'))) {event.preventDefault(); showSlide(slideIndex + 1);}
    else if (['arrowleft','pageup'].includes(key)) {event.preventDefault(); showSlide(slideIndex - 1);}
    else if (key === 'home') {event.preventDefault(); showSlide(0);}
    else if (key === 'end') {event.preventDefault(); showSlide(slides.length - 1);}
  });
  function openFromHash() {
    const match = location.hash.match(/^#presentacion(?:\/(\d+))?$/);
    if (match) openPresentation(Math.max(0, Number(match[1] || 1) - 1));
    else if (presentation.open) closePresentation();
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
