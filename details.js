'use strict';
$$('[data-company]').forEach(element=>element.textContent=state.company);
$$('[data-mission]').forEach(element=>element.textContent=state.mission);
$('#team-label').textContent=state.team+' · '+state.course;
const explanations = [
  ['Queremos atender una necesidad, no solo vender agua.', 'Un ayuntamiento necesita regar un parque. Estudiaríamos si puede hacerlo con agua regenerada y con qué condiciones.'],
  ['Queremos que se nos conozca por trabajar con claridad.', 'La confianza dependería de controles, un servicio fiable, costes viables y personas bien formadas.'],
  ['Aportar valor también significa escuchar lo que esperan los demás.', 'Un vecino puede querer saber para qué sirve el agua; el ayuntamiento también necesita conocer el coste y quién responde si hay un fallo.'],
  ['La sequía es una necesidad del entorno; la viabilidad se debe estudiar.', 'No ampliaríamos el proyecto solo porque la idea guste. Primero comprobaríamos demanda, calidad, costes y distribución en un piloto.']
];
if ($('#purpose-reading')) $('#purpose-reading').innerHTML=questions.map((question,index)=>`<article class="reading-answer" id="pregunta-${index+1}"><div class="reading-answer-heading"><span class="reading-number">0${index+1}</span><div><span class="mini-label">${escapeHTML(question.label)}</span><h3>${escapeHTML(question.title)}</h3></div></div><p>${escapeHTML(state.answers[index])}</p><div class="simple-example"><strong>Dicho fácil: ${escapeHTML(explanations[index][0])}</strong><p>${escapeHTML(explanations[index][1])}</p></div></article>`).join('');
if ($('#goals-reading')) $('#goals-reading').innerHTML=[6,12,11,2].map(n=>{
  const item=priority[n],goal=ods[n-1];
  return `<article class="reading-goal"><div class="reading-goal-heading"><span style="--goal-color:${goal[2]}">${n}</span><div><span class="mini-label">ODS ${n}</span><h3>${escapeHTML(goal[1])}</h3></div></div><p>${escapeHTML(item.why)}</p><dl><div><dt>Qué haríamos</dt><dd>${escapeHTML(item.action)}</dd></div><div><dt>Cómo lo comprobaríamos</dt><dd>${escapeHTML(item.metric.replace('Indicadores propuestos: ',''))}</dd></div></dl><a class="detail-source" href="https://www.un.org/sustainabledevelopment/es/${item.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.target)} ↗</a></article>`;
}).join('');
const plainASG={A:['¿Cómo afecta nuestra actividad al entorno?','Reutilizar agua puede ser útil, pero también debemos revisar la energía, las fugas y los residuos. No basta con mirar solo el beneficio.'],S:['¿Cómo cuidamos e informamos a las personas?','Debemos formar al equipo, prevenir riesgos y explicar a la comunidad cómo se usa el agua y qué controles tiene.'],G:['¿Quién decide y quién responde?','Gobernanza significa tener responsabilidades claras, permisos y registros que permitan comprobar lo que hacemos.']};
if ($('#asg-reading')) $('#asg-reading').innerHTML=asg.map(item=>`<article class="reading-answer"><div class="reading-answer-heading"><span class="reading-number">${item.key}</span><div><span class="mini-label">${escapeHTML(item.name)}</span><h3>${plainASG[item.key][0]}</h3></div></div><p>${plainASG[item.key][1]}</p><dl><div><dt>Acción propuesta</dt><dd>${escapeHTML(item.action)}</dd></div><div><dt>Evidencia</dt><dd>${escapeHTML(item.evidence)}</dd></div></dl></article>`).join('');
if ($('#goals-all')) {
  $('#goals-all').innerHTML=ods.map(([n,name,color])=>`<details data-goal-type="${priority[n]?'priority':'other'}"><summary><span class="goal-inline-number" style="--goal-color:${color}">${n}</span><span>${escapeHTML(name)}<small>${priority[n]?'Prioritario':'Complementario o por valorar'}</small></span></summary><p>${escapeHTML(priority[n]?.why || secondary[n])}</p></details>`).join('');
  const filterGoals=()=>{
    const filter=$('#goals-filter').value;
    let visible=0;
    $$('#goals-all details').forEach(element=>{element.hidden=filter!=='all'&&element.dataset.goalType!==filter;if(!element.hidden) visible++;});
    $('#goals-count').textContent=visible+' objetivos visibles';
  };
  $('#goals-filter').addEventListener('change',filterGoals);filterGoals();
}
const menu=$('.menu-toggle');
menu.addEventListener('click',()=>{
  const open=menu.getAttribute('aria-expanded')!=='true';
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  $('#navigation').classList.toggle('open',open);
});
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
let scrollPending=false;
function updateReadingProgress(){
  const height=document.documentElement.scrollHeight-innerHeight;
  $('#scroll-progress').style.width=(height>0?scrollY/height*100:0)+'%';scrollPending=false;
}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateReadingProgress);}},{passive:true});
updateReadingProgress();
