'use strict';
let currentQuestion = 0, selectedODS = 6;
let toastTimer;
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 4500); }
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({version:3,data:state})); return true; }
  catch { toast('Cambios aplicados en esta sesión. El navegador no permite guardarlos; copia tus respuestas antes de cerrar la página para conservarlas.'); return false; }
}
function renderPurpose() {
  $('#purpose-tabs').innerHTML = questions.map((q,i) => `<button class="question-button" id="question-${i}" role="tab" aria-selected="${currentQuestion === i}" aria-controls="purpose-panel" tabindex="${currentQuestion === i ? 0 : -1}" data-question="${i}"><span class="question-index">0${i+1}</span><span><strong>${q.title}</strong><small>${q.short}</small></span><span class="question-arrow" aria-hidden="true">↗</span></button>`).join('');
  updateAnswer();
}
function updateAnswer() {
  const q = questions[currentQuestion];
  $('#purpose-panel').setAttribute('aria-labelledby', `question-${currentQuestion}`);
  $('#answer-heading').textContent = q.heading;
  $('#answer-content').textContent = state.answers[currentQuestion];
  $('#answer-note').textContent = q.note;
  $('#answer-counter').textContent = `0${currentQuestion+1} / 04`;
  $('#purpose-panel .pill').textContent = q.label;
  $('#purpose-panel').classList.remove('content-in');
  void $('#purpose-panel').offsetWidth;
  $('#purpose-panel').classList.add('content-in');
}
$('#purpose-tabs').addEventListener('click', e => {
  const button = e.target.closest('[data-question]');
  if (!button) return;
  currentQuestion = Number(button.dataset.question);
  $$('.question-button').forEach((b,i) => {b.setAttribute('aria-selected',String(i===currentQuestion)); b.tabIndex = i===currentQuestion ? 0 : -1;});
  updateAnswer();
});
$('#purpose-tabs').addEventListener('keydown', e => {
  if (!['ArrowDown','ArrowUp','Home','End'].includes(e.key)) return;
  e.preventDefault();
  currentQuestion = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (currentQuestion + (e.key === 'ArrowDown' ? 1 : -1) + 4) % 4;
  const button = $(`#question-${currentQuestion}`); button.click(); button.focus();
});
function renderODS() {
  $('#ods-grid').innerHTML = ods.map(([n,name,color,symbol]) => `<button class="ods-button ${priority[n]?'priority':''}" data-ods="${n}" style="--ods-color:${color}" aria-label="ODS ${n}: ${name}${priority[n]?', prioritario':''}" aria-pressed="${n===selectedODS}" aria-controls="ods-detail"><span class="ods-number">${n}</span><span class="ods-name">${name}</span><span class="ods-symbol" aria-hidden="true">${symbol}</span>${priority[n]?'<span class="priority-dot" aria-hidden="true"></span>':''}</button>`).join('') + '<div class="ods-end" aria-hidden="true"><strong>17 objetivos.</strong>Un futuro común.</div>';
  renderODSDetail();
}
function odsDetailMarkup(number) {
  const [n,name,color] = ods[number-1], item=priority[n];
  return `<div class="ods-detail-number" style="--detail-color:${color}" aria-hidden="true">${n}</div><div><span class="mini-label">ODS ${n} · ${item?'PRIORITARIO EN ESTE CASO':'CONEXIÓN COMPLEMENTARIA / POR VALORAR'}</span><h3 id="ods-detail-title">${name}</h3><p>${item?item.why:secondary[n]}</p></div><div class="ods-action"><strong>${item?'¿Cómo lo llevamos a la práctica?':'¿Qué falta para priorizarlo?'}</strong><p>${item?item.action:'Identificar una actuación relacionada con el sector, justificar su impacto y definir una evidencia para comprobarlo.'}</p><p style="margin-top:8px">${item?item.metric:'Este objetivo no forma parte de la matriz prioritaria del ejemplo.'}</p><a href="https://www.un.org/sustainabledevelopment/es/${item?item.url:'objetivos-de-desarrollo-sostenible/'}" target="_blank" rel="noopener noreferrer">${item?item.target:'Consultar la Agenda 2030'} ↗</a></div>`;
}
function renderODSDetail() {
  $('#ods-detail').innerHTML = odsDetailMarkup(selectedODS);
  $('#ods-detail').classList.remove('content-in'); void $('#ods-detail').offsetWidth; $('#ods-detail').classList.add('content-in');
}
$('#ods-grid').addEventListener('click', e => {
  const button = e.target.closest('[data-ods]'); if(!button) return;
  selectedODS=Number(button.dataset.ods);
  $$('.ods-button').forEach(b => b.setAttribute('aria-pressed',String(Number(b.dataset.ods)===selectedODS)));
  renderODSDetail();
});
function renderASG() {
  $('#asg-grid').innerHTML=asg.map(a=>`<article class="asg-card"><div class="asg-card-header"><span class="asg-letter" aria-hidden="true">${a.key}</span><div><h3>${a.name}</h3><small>${a.subtitle}</small></div></div><p>${a.body}</p><details><summary>Acciones e indicadores</summary><p><strong>Acción propuesta.</strong> ${a.action}</p><p><strong>Evidencia.</strong> ${a.evidence}</p></details></article>`).join('');
}
function updateProject() {
  $$('[data-company]').forEach(el=>el.textContent=state.company);
  $('#mission-summary').textContent=state.mission;
  $('#team-label').textContent=`${state.team} · ${state.course}`;
  updateAnswer();
}
const dialog=$('#editor'); let editorTrigger=null;
$('#answer-fields').innerHTML=questions.map((q,i)=>`<label>${i+1}. ${q.title}<textarea name="answer${i}" required maxlength="1800" rows="4"></textarea></label>`).join('');
function openEditor(event) {
  editorTrigger=event.currentTarget;
  const form=$('#editor-form');
  for(const key of ['company','team','course','mission']) form.elements[key].value=state[key];
  state.answers.forEach((answer,i)=>form.elements[`answer${i}`].value=answer);
  dialog.showModal();document.body.classList.add('modal-open');
}
$$('.editor-open').forEach(b=>b.addEventListener('click',openEditor));
function closeEditor() {dialog.close();}
$('#close-editor').addEventListener('click',closeEditor);$('#cancel-editor').addEventListener('click',closeEditor);
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(editorTrigger) editorTrigger.focus();});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeEditor();});
$('#editor-form').addEventListener('submit',e=>{
  e.preventDefault();const form=e.currentTarget;
  for(const field of [...form.elements].filter(el=>el.matches('input,textarea'))) {field.setCustomValidity(field.value.trim()?'':'Escribe un contenido para este campo.');if(!field.checkValidity()){field.reportValidity();return;}}
  for(const key of ['company','team','course','mission'])state[key]=form.elements[key].value.trim();
  state.answers=questions.map((_,i)=>form.elements[`answer${i}`].value.trim());
  updateProject();const saved=persist();closeEditor();if(saved)toast('Proyecto guardado en este navegador.');
});
$('#editor-form').addEventListener('input',e=>{if(e.target.setCustomValidity)e.target.setCustomValidity('');});
const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Cerrar menú':'Abrir menú');$('#navigation').classList.toggle('open',expanded);});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');$('#navigation').classList.remove('open');}));
window.addEventListener('keydown',e=>{if(e.key==='Escape' && $('#navigation').classList.contains('open')){menu.click();menu.focus();}});
let scrollPending=false;
function updateScroll(){const height=document.documentElement.scrollHeight-innerHeight;$('#scroll-progress').style.width=`${height>0?scrollY/height*100:0}%`;scrollPending=false;}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}},{passive:true});
renderPurpose();renderODS();renderASG();renderMatrix();updateProject();updateScroll();
if('IntersectionObserver' in window){
  document.documentElement.classList.add('js-reveal');
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.06});
  $$('.reveal').forEach(el=>revealObserver.observe(el));
}
if (location.hash === '#editar') $('.editor-open').click();
