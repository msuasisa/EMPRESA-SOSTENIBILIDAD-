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
  const ringArt = `<div class="deck-cover-art" aria-hidden="true"><div class="deck-orbit"></div><div class="deck-orbit"></div><svg viewBox="0 0 420 420" fill="none"><defs><linearGradient id="deck-ring-gradient" x1="70" y1="80" x2="330" y2="330" gradientUnits="userSpaceOnUse"><stop stop-color="#dbedb3"/><stop offset="1" stop-color="#508f6b"/></linearGradient></defs><ellipse cx="210" cy="340" rx="117" ry="15" fill="#123b2b"/><path d="M285 109A117 117 0 1 0 314 264" stroke="url(#deck-ring-gradient)" stroke-width="48" stroke-linecap="round"/><path d="M277 77L327 142L249 144Z" fill="#b5d590" stroke="#b5d590" stroke-width="5" stroke-linejoin="round"/><path d="M210 263Q185 231 205 180" stroke="#c7dfa1" stroke-width="4" stroke-linecap="round"/><path d="M202 226Q158 222 164 187Q199 183 202 226Z" fill="#8cb878"/><path d="M200 209Q199 168 239 161Q252 197 200 209Z" fill="#c5dfa3"/></svg><span class="deck-art-label">RECUPERAR · TRANSFORMAR · VOLVER A CREAR</span></div>`;

  function buildSlides() {
    const questionTags = ['Nuestra razón de ser', 'La empresa que queremos ser', 'Valor para nuestros grupos de interés', 'El entorno al que respondemos'];
    const list = [{
      title: 'Som Sostenibles', chapter: 'Apertura', theme: 'dark',
      body: `<div class="deck-cover-grid"><div><div class="deck-kicker">ZINKERS FP · REPTE SOM PROFESSIONALS</div><h2 class="deck-cover-title" id="deck-slide-title" tabindex="-1"><span>El futuro también es nuestra profesión.</span>Som<br><em>Sostenibles.</em></h2><p class="deck-cover-description">Un propósito claro.<br>Decisiones que crean valor.<br>Una nueva forma de hacer empresa.</p><div class="deck-company"><span aria-hidden="true">↗</span><strong>${esc(state.company)}</strong><small>CASO ILUSTRATIVO<br>PROYECTO EDUCATIVO</small></div></div>${ringArt}</div>`,
      notes: paragraphs([`Presentamos el desarrollo del Repte Som Professionals a través del caso ilustrativo de ${state.company}.`, `Equipo: ${state.team}. Curso: ${state.course}.`, 'El recorrido conecta cuatro preguntas sobre el propósito con los ODS, los criterios ASG, los riesgos y los indicadores de seguimiento. Las actuaciones son propuestas; no se presentan como resultados verificados.'])
    }];

    questions.forEach((question, i) => {
      const parts = sentences(state.answers[i]);
      const lead = short(parts[0] || state.answers[i], 245);
      const supporting = parts.slice(1, 3).map(text => short(text, 220));
      list.push({
        title: question.title, chapter: 'Propósito · ' + (i + 1) + ' de 4', theme: 'light',
        body: `<div class="deck-question-layout"><div class="deck-question-heading"><div class="deck-kicker">ACTIVIDAD 1 · ${esc(question.label)}</div><div class="deck-big-number" aria-hidden="true">0${i + 1}</div><h2 class="deck-heading" id="deck-slide-title" tabindex="-1">${esc(question.title)}</h2><span class="deck-pill">${esc(questionTags[i])}</span></div><div><blockquote class="deck-quote">${esc(lead)}</blockquote>${supporting.length ? `<ul class="deck-idea-list">${supporting.map(text => `<li>${esc(text)}</li>`).join('')}</ul>` : ''}<span class="deck-excerpt-note">Ideas principales de la respuesta · texto completo en el guion</span></div></div>`,
        notes: paragraphs([state.answers[i], question.note])
      });
    });

    list.push({
      title: 'Propósito y misión', chapter: 'Entregable 1', theme: 'dark',
      body: `<div class="deck-mission"><div class="deck-kicker">ENTREGABLE 1 · NUESTRA BRÚJULA</div><h2 class="deck-heading" id="deck-slide-title" tabindex="-1">Un propósito para decidir.<br><em>Una misión para actuar.</em></h2><p class="deck-mission-quote">${esc(short(state.mission, 600))}</p><div class="deck-label-row"><span>${esc(state.company)}</span><span>PROPÓSITO + MISIÓN</span><span>DEL PORQUÉ AL CÓMO</span></div></div>`,
      notes: paragraphs([state.mission, 'Explicad qué necesidad atiende la empresa, a quién aporta valor y cómo se traduce ese propósito en su actividad diaria.'])
    });

    const goals = [8, 12, 13, 16];
    list.push({
      title: 'Nuestros ODS prioritarios', chapter: 'Actividad 2 · ODS', theme: 'light',
      body: titleBlock('ACTIVIDAD 2 · IMPACTO CON DIRECCIÓN', '17 objetivos.<br><em>Cuatro prioridades justificadas.</em>') + `<div class="deck-cards">${goals.map(n => `<article class="deck-card deck-ods-card"><span class="deck-ods-number" style="--deck-ods:${ods[n - 1][2]}">${n}</span><div><span class="deck-card-tag">OBJETIVO DE DESARROLLO SOSTENIBLE</span><h3>${esc(ods[n - 1][1])}</h3><p>${esc(short(priority[n].why, 160))}</p></div></article>`).join('')}</div>`,
      notes: goals.map(n => `<p><strong>ODS ${n} · ${esc(ods[n - 1][1])}</strong><br>${esc(priority[n].why)}<br><br>${esc(priority[n].action)}<br><br>${esc(priority[n].target)}</p>`).join('')
    });

    list.push({
      title: 'Criterios ASG', chapter: 'Actividad 2 · ASG', theme: 'light',
      body: titleBlock('DEL COMPROMISO A LA GESTIÓN', 'Tres miradas.<br><em>Una misma responsabilidad.</em>') + `<div class="deck-asg-grid">${asg.map(a => `<article class="deck-card deck-asg-card"><span class="deck-asg-letter" aria-hidden="true">${a.key}</span><h3>${esc(a.name)}</h3><p>${esc(a.body)}</p><div class="deck-asg-action"><strong>ACCIÓN PROPUESTA</strong><p>${esc(short(a.action, 160))}</p></div></article>`).join('')}</div>`,
      notes: asg.map(a => `<p><strong>${esc(a.name)}</strong><br>${esc(a.body)}<br><br>${esc(a.action)}<br><br>${esc(a.evidence)}</p>`).join('')
    });

    const riskPairs = [
      {goal:12,title:'De un material irregular<br>a un <em>diseño reparable.</em>',name:'Materiales y circularidad'},
      {goal:13,title:'Menos kilómetros.<br><em>Más sentido en cada ruta.</em>',name:'Energía y clima'},
      {goal:8,title:'Cuidar al equipo.<br><em>Hacer crecer el talento.</em>',name:'Personas y formación'},
      {goal:16,title:'Que cada promesa<br>tenga <em>una evidencia.</em>',name:'Ética y trazabilidad'}
    ];
    riskPairs.forEach(pair => {
      const rows = ['risk', 'opportunity'].map(type => matrix.find(row => row.type === type && row.ods.includes(pair.goal)));
      list.push({
        title: pair.name, chapter: 'Entregable 2 · ODS ' + pair.goal, theme: 'dark',
        body: titleBlock('ENTREGABLE 2 · RISCOS I OPORTUNITATS', pair.title) + `<div class="deck-risk-grid">${rows.map((row, i) => `<article class="deck-card deck-risk-card"><div class="deck-risk-label"><span aria-hidden="true">${i ? '↗' : '↘'}</span>${i ? 'OPORTUNIDAD' : 'RIESGO'}</div><h3>${esc(row.title)}</h3><p>${esc(row.description)}</p><div class="deck-risk-response"><span>PRIMERA RESPUESTA PROPUESTA</span><p>${esc(short(sentences(row.response)[0], 185))}</p></div></article>`).join('')}</div><div class="deck-risk-bottom"><span class="deck-pill">ODS ${pair.goal} · ${esc(asg.find(a => a.key === rows[0].asg).name)}</span><span>Responsables, seguimiento e indicadores en el guion</span></div>`,
        notes: rows.map((row, i) => `<p><strong>${i ? 'Oportunidad' : 'Riesgo'}: ${esc(row.title)}</strong><br>${esc(row.description)}<br><br>${esc(row.response)}<br><br>${esc(row.level)}: valoración orientativa del caso ilustrativo.</p>`).join('')
      });
    });

    const metrics = [
      {unit:'kg',title:'Materiales recuperados',goal:12},
      {unit:'kWh',title:'Energía por pieza',goal:13},
      {unit:'h',title:'Formación y seguridad',goal:8},
      {unit:'%',title:'Compras con trazabilidad',goal:16}
    ];
    list.push({
      title: 'Cómo mediremos el avance', chapter: 'Seguimiento del impacto', theme: 'light',
      body: titleBlock('MEDIR · APRENDER · MEJORAR', 'El compromiso se demuestra<br><em>con evidencias.</em>') + `<div class="deck-cards">${metrics.map(metric => `<article class="deck-card deck-metric-card"><span class="deck-metric-unit" aria-hidden="true">${metric.unit}</span><div><span class="deck-card-tag">ODS ${metric.goal} · INDICADOR PROPUESTO</span><h3>${esc(metric.title)}</h3><p>${esc(short(priority[metric.goal].metric.replace('Indicadores propuestos: ', ''), 185))}</p></div></article>`).join('')}</div><p class="deck-metric-note">Primero estableceremos una línea de base. Las unidades representan qué queremos medir; todavía no son resultados.</p>`,
      notes: paragraphs(['Los indicadores son propuestas de seguimiento y requieren una línea de base. No hemos atribuido cifras de ahorro, emisiones evitadas ni resultados sociales sin evidencia.', ...metrics.map(metric => priority[metric.goal].metric), 'En cada revisión deberemos explicar el método de medición, el alcance de los datos y quién se responsabiliza del registro.'])
    });

    const reviewed = Object.keys(state.scores).length;
    const total = Object.values(state.scores).reduce((sum, value) => sum + value, 0);
    list.push({
      title: 'Calidad del proyecto', chapter: 'Evaluación y calidad', theme: 'light',
      body: titleBlock('EVALUACIÓN · CLARIDAD Y COHERENCIA', 'Una buena propuesta<br><em>también se puede evaluar.</em>') + `<div class="deck-rubric-layout"><div class="deck-rubric-list">${rubric.map(r => `<div class="deck-rubric-item"><span>${esc(r.name)}</span><span>${number(r.max)} pts</span></div>`).join('')}</div><div class="deck-rubric-score"><span>${reviewed ? 'AUTOEVALUACIÓN ACTUAL' : 'FRAGMENTO DE RÚBRICA'}</span><strong>${reviewed ? number(total) : '8,5'}</strong><p>${reviewed ? 'de 8,5 puntos posibles' : 'puntos máximos visibles'}</p><small>${reviewed ? `${reviewed} de 5 criterios revisados. Valoración orientativa del equipo.` : 'Cinco criterios de la imagen facilitada. La valoración corresponde al profesorado.'}</small></div></div><p class="deck-metric-note">La revisión de riesgos es complementaria. No se añaden puntos a los niveles de la imagen.</p>`,
      notes: paragraphs(['La imagen muestra un máximo conjunto de 8,5 puntos y repite los descriptores de ODS en la fila ASG. Se han conservado los pesos y los niveles facilitados.', ...rubric.map(r => `${r.name}: ${r.id in state.scores ? number(state.scores[r.id]) : 'sin revisar'} / ${number(r.max)} puntos. ${r.help}`), 'Mostrad la relación entre propósito, actividad, ODS y riesgos. Acompañad cada compromiso de una actuación y una evidencia comprobable.'])
    });

    list.push({
      title: 'Gracias · ¿Preguntas?', chapter: 'Cierre', theme: 'dark',
      body: `<div class="deck-closing"><span class="deck-closing-symbol" aria-hidden="true">✳</span><h2 class="deck-heading" id="deck-slide-title" tabindex="-1">Dejemos una huella<br><em>que merezca la pena.</em></h2><p class="deck-subtitle">El siguiente paso: convertir nuestros compromisos<br>en acciones y evidencias. ¿Preguntas?</p><div class="deck-closing-team"><span>${esc(state.company)}</span><span>${esc(state.team)}</span><span>${esc(state.course)}</span></div><button class="deck-return" data-deck-return>Volver a la web <span aria-hidden="true">↗</span></button></div>`,
      notes: paragraphs(['Cerrad retomando el propósito de la empresa y una actuación que os gustaría poner a prueba.', 'Dejad espacio a preguntas del profesorado y del grupo. Si no disponéis de datos, explicad qué información necesitaríais para responder con rigor.', 'Fuentes: rúbrica facilitada, Agenda 2030 de Naciones Unidas y programa Zinkers de Fundación Repsol. Proyecto educativo independiente.'])
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
