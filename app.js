'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'som-sostenibles-project-v1';
const defaults = {
  company: 'ReVerda', team: 'Equipo por definir', course: 'Formación Profesional',
  answers: [
    'Existimos para alargar la vida de los muebles y reducir el consumo de materias primas. Recuperamos piezas y madera del entorno local, las reparamos y las transformamos en mobiliario duradero. El beneficio económico permite sostener una actividad que, además, ofrece formación y empleo digno a personas con dificultades de acceso al mercado laboral.',
    'Queremos ser un taller de referencia local por la calidad de sus reparaciones, la trazabilidad de los materiales y el trato cercano. Nuestro éxito depende de diseñar piezas reparables, cumplir los plazos y cuidar al equipo. Aspiramos a que clientes y proveedores nos reconozcan por demostrar lo que hacemos con información clara, sin promesas ambientales que no podamos justificar.',
    'Podemos aportar menos residuos, conocimiento sobre reparación y oportunidades de empleo. La clientela espera productos seguros, duraderos y a un precio transparente; el equipo, condiciones dignas y formación; la comunidad, una actividad responsable. Construimos confianza documentando el origen de los materiales, escuchando las incidencias y publicando avances y límites de nuestros compromisos.',
    'Debemos responder al encarecimiento y a la disponibilidad variable de materiales, a la demanda de productos duraderos y a la necesidad de demostrar el impacto real. También afrontamos la falta de profesionales especializados y el consumo energético del taller. Las alianzas con centros de FP, la reparación a domicilio y el ecodiseño abren oportunidades que debemos validar con la demanda local.'
  ],
  mission: 'Nuestro propósito es dar una segunda vida a los materiales y abrir oportunidades profesionales. Nuestra misión es recuperar y transformar mobiliario local con criterios de durabilidad, trazabilidad y empleo digno, ofreciendo soluciones útiles y accesibles mientras medimos y reducimos el impacto de nuestra actividad.',
  scores: {}
};
let state = structuredClone(defaults);
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved && saved.version === 1 && saved.data) {
    const data = saved.data;
    for (const name of ['company','team','course','mission']) if (typeof data[name] === 'string' && data[name].trim()) state[name] = data[name].slice(0, name === 'mission' ? 1800 : name === 'company' ? 50 : 80);
    if (Array.isArray(data.answers) && data.answers.length === 4 && data.answers.every(x => typeof x === 'string' && x.trim())) state.answers = data.answers.map(x => x.slice(0,1800));
    if (data.scores && typeof data.scores === 'object') state.scores = data.scores;
  }
} catch {}
let currentQuestion = 0, selectedODS = 12, asgFilter = 'all', odsFilter = 'all';
let toastTimer;
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 4500); }
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({version:1,data:state})); return true; }
  catch { toast('Cambios aplicados en esta sesión. El navegador no permite guardarlos; descarga el proyecto para conservarlos.'); return false; }
}
const questions = [
  {title:'¿Por qué debemos existir?', short:'Nuestra razón fundamental', heading:'Dar una segunda vida. Abrir nuevas oportunidades.', label:'EL PROPÓSITO', note:'Crear valor económico, social y ambiental desde el mismo propósito.'},
  {title:'¿Cómo queremos ser?', short:'Posicionamiento y claves del éxito', heading:'Que la confianza sea nuestra mejor carta de presentación.', label:'NUESTRA VISIÓN', note:'Calidad, trazabilidad y cercanía como claves de diferenciación.'},
  {title:'¿Qué aportamos al mundo?', short:'Valor, confianza y expectativas', heading:'Un mueble recuperado puede cambiar más de una vida.', label:'VALOR COMPARTIDO', note:'Escuchar a los grupos de interés convierte las expectativas en compromisos.'},
  {title:'¿A qué entorno respondemos?', short:'Tendencias, desafíos y oportunidades', heading:'Leer el presente para diseñar lo que viene.', label:'NUESTRO ENTORNO', note:'Adaptarse requiere identificar tendencias y contrastarlas con evidencias.'}
];
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
const ods = [
  [1,'Fin de la pobreza','#e5243b','↗'],[2,'Hambre cero','#b88b27','♧'],[3,'Salud y bienestar','#367d3b','♡'],[4,'Educación de calidad','#c5192d','▤'],[5,'Igualdad de género','#e53c29','⚥'],[6,'Agua limpia y saneamiento','#168caf','◈'],[7,'Energía asequible y no contaminante','#ac7e00','☀'],[8,'Trabajo decente y crecimiento económico','#a21942','↗'],[9,'Industria, innovación e infraestructura','#c74721','⬡'],[10,'Reducción de las desigualdades','#dd1367','≋'],[11,'Ciudades y comunidades sostenibles','#bc760b','⌂'],[12,'Producción y consumo responsables','#a67524','∞'],[13,'Acción por el clima','#3f7e44','◉'],[14,'Vida submarina','#0a7daf','≈'],[15,'Vida de ecosistemas terrestres','#3c8c28','♧'],[16,'Paz, justicia e instituciones sólidas','#00689d','⚖'],[17,'Alianzas para lograr los objetivos','#19486a','◎']
];
const priority = {
  8: {why:'La actividad del taller depende de profesionales cualificados. El empleo digno y la formación deben acompañar al crecimiento de la empresa.', action:'Proponer un plan anual de formación, revisar la prevención de riesgos y facilitar prácticas acompañadas con centros de FP.', metric:'Indicadores propuestos: horas de formación por persona y año, incidentes laborales y estabilidad de los contratos.', target:'Meta 8.5 · Empleo pleno, productivo y trabajo decente', url:'economic-growth/'},
  12: {why:'Recuperar muebles y materiales es el núcleo de la actividad. Diseñar para reparar y volver a utilizar ayuda a prevenir residuos y a aprovechar los recursos.', action:'Registrar los materiales que entran en el taller, su destino y la proporción de cada pieza que procede de material recuperado.', metric:'Indicadores propuestos: kg de material recuperado, porcentaje de piezas reparables y residuos por unidad entregada.', target:'Meta 12.5 · Prevención, reducción, reciclado y reutilización', url:'sustainable-consumption-production/'},
  13: {why:'El transporte y el consumo energético del taller generan emisiones. La circularidad necesita una medición real para valorar su contribución climática.', action:'Formar al equipo en medición climática; establecer una línea de base de energía y transporte y probar rutas compartidas.', metric:'Indicadores propuestos: horas de formación climática, kWh por pieza y emisiones estimadas, con método y alcance documentados.', target:'Meta 13.3 · Educación y capacidad frente al cambio climático', url:'climate-change-2/'},
  16: {why:'La confianza exige compras transparentes, reglas éticas y comunicación responsable. La contribución empresarial es indirecta y se concreta en prácticas de gobernanza.', action:'Adoptar un código ético, registrar decisiones de compra y habilitar un canal confidencial de consultas e incidencias.', metric:'Indicadores propuestos: compras con trazabilidad y porcentaje de incidencias atendidas dentro del plazo acordado.', target:'Metas 16.5 y 16.6 · Integridad y rendición de cuentas', url:'peace-justice/'}
};
const secondary = {
  1:'El empleo digno podría contribuir de forma indirecta, pero haría falta conocer las condiciones de contratación y la situación de las personas beneficiarias.',
  2:'No existe una relación directa con el taller de mobiliario en este ejemplo. No lo priorizamos sin una actuación específica en alimentación.',
  3:'La prevención de polvo, ruido y accidentes puede proteger la salud del equipo. Se gestiona aquí como criterio social y mediante el ODS 8.',
  4:'Las prácticas y la formación en reparación ofrecen una conexión complementaria. Se debería documentar el aprendizaje adquirido con el centro de FP.',
  5:'La igualdad en el acceso a puestos, retribución y promoción es un compromiso transversal. Conviene analizar datos antes de fijar medidas concretas.',
  6:'El tratamiento de acabados y la gestión del agua merecen revisión. El caso no aporta datos suficientes para considerarlo un objetivo prioritario.',
  7:'La eficiencia y el suministro energético pueden apoyar la actividad. Se abordan inicialmente junto a la medición climática del ODS 13.',
  9:'El diseño de piezas reparables puede impulsar innovación. Sería necesario demostrar la mejora frente a las soluciones que ya existen.',
  10:'La inclusión laboral tiene una relación complementaria. Es necesario verificar que las oportunidades llegan a quienes afrontan mayores barreras.',
  11:'La reparación local puede contribuir a un uso más responsable de recursos en la comunidad. El vínculo principal del caso se desarrolla en el ODS 12.',
  14:'No se acredita una relación directa con los ecosistemas marinos en este caso. Evitamos atribuir impactos positivos sin evidencia.',
  15:'La procedencia de la madera puede vincularse a los ecosistemas terrestres. Se necesita trazabilidad para valorar este impacto.',
  17:'Las alianzas con centros de FP y entidades locales pueden facilitar formación y recogida de materiales. Sería un objetivo complementario sujeto a acuerdos concretos.'
};
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
const asg = [
  {key:'A',name:'Ambiental',subtitle:'CUIDAR LOS RECURSOS',body:'Recuperación de materiales, gestión de residuos y uso eficiente de energía. Medimos antes de afirmar que hemos reducido nuestro impacto.',action:'Separar residuos por tipo y revisar consumos del taller cada mes. Evitar acabados peligrosos cuando existan alternativas adecuadas.',evidence:'Registro de pesajes y facturas energéticas. Indicadores: kg de material recuperado y kWh por pieza. ODS 12 y 13.'},
  {key:'S',name:'Social',subtitle:'PONER A LAS PERSONAS EN EL CENTRO',body:'Trabajo digno, seguridad y formación continua. El impacto social empieza por las condiciones de quienes hacen posible cada producto.',action:'Definir un itinerario de formación, realizar una revisión preventiva y acordar prácticas tutorizadas con centros de FP.',evidence:'Plan de formación y seguimiento de seguridad. Indicadores: horas de formación por persona e incidentes laborales. ODS 8.'},
  {key:'G',name:'Gobernanza',subtitle:'DECIDIR CON TRANSPARENCIA',body:'Compras trazables, conducta ética y comunicación responsable. Asignamos responsabilidades y explicamos tanto avances como límites.',action:'Designar una persona responsable del seguimiento ASG y aprobar un código ético y criterios transparentes de compra.',evidence:'Registro de proveedores y decisiones, junto a un canal confidencial. Indicadores: compras trazables e incidencias resueltas. ODS 16.'}
];
function renderASG() {
  $('#asg-grid').innerHTML=asg.map(a=>`<article class="asg-card"><div class="asg-card-header"><span class="asg-letter" aria-hidden="true">${a.key}</span><div><h3>${a.name}</h3><small>${a.subtitle}</small></div></div><p>${a.body}</p><details><summary>Acciones e indicadores</summary><p><strong>Acción propuesta.</strong> ${a.action}</p><p><strong>Evidencia.</strong> ${a.evidence}</p></details></article>`).join('');
}
const matrix = [
  {type:'risk',asg:'A',ods:[12],title:'Material recuperado de calidad irregular',description:'La variación en el estado de los muebles puede aumentar las horas de trabajo, los rechazos y los costes.',level:'Prioridad alta',response:'Aplicar una revisión de entrada y definir qué piezas se pueden recuperar. Responsable propuesto: producción. Revisión: mensual. Indicador: porcentaje de rechazos y horas por reparación.'},
  {type:'opportunity',asg:'A',ods:[12],title:'Diseñar para reparar, no para reemplazar',description:'Ofrecer reparación y piezas desmontables puede ampliar la vida del producto y crear ingresos por mantenimiento.',level:'Potencial alto',response:'Probar un catálogo de reparaciones con diez encargos piloto antes de ampliarlo. Responsable propuesto: diseño y ventas. Revisión: trimestral. Indicador: margen del servicio y piezas reparadas.'},
  {type:'risk',asg:'A',ods:[13],title:'Energía y transporte que elevan el impacto',description:'Los desplazamientos dispersos y un taller poco eficiente pueden contrarrestar parte del beneficio de recuperar materiales.',level:'Prioridad alta',response:'Registrar consumos y distancias; agrupar recogidas por zona. Responsable propuesto: operaciones. Revisión: mensual. Indicador: kWh por pieza y kilómetros por entrega.'},
  {type:'opportunity',asg:'A',ods:[13],title:'Una red local con rutas compartidas',description:'Agrupar entregas y recogidas con colaboradores cercanos puede reducir distancias y mejorar la eficiencia.',level:'Potencial medio',response:'Comparar una ruta agrupada con el sistema habitual durante un mes. Responsable propuesto: logística. Indicador: km por pieza y coste por entrega. Verificar resultados antes de comunicar ahorros.'},
  {type:'risk',asg:'S',ods:[8],title:'Falta de formación y riesgos en el taller',description:'El uso de maquinaria, el polvo y las cargas físicas requieren capacitación y medidas preventivas consistentes.',level:'Prioridad alta',response:'Revisar la prevención con personal competente y acompañar las nuevas incorporaciones. Responsable propuesto: dirección del taller. Seguimiento: mensual. Indicador: formación realizada e incidentes.'},
  {type:'opportunity',asg:'S',ods:[8],title:'Talento que crece desde la FP',description:'La colaboración con centros de formación puede generar empleo cualificado y oportunidades de aprendizaje práctico.',level:'Potencial alto',response:'Diseñar prácticas tutorizadas con objetivos de aprendizaje. Responsable propuesto: coordinación de formación. Revisión: por trimestre. Indicador: horas de tutoría y competencias adquiridas.'},
  {type:'risk',asg:'G',ods:[16],title:'Promesas ambientales sin evidencia',description:'Comunicar beneficios no medidos o no conocer el origen de la madera puede erosionar la confianza en la marca.',level:'Prioridad alta',response:'Revisar las afirmaciones públicas y documentar el origen de los materiales. Responsable propuesto: dirección. Revisión: antes de cada campaña. Indicador: afirmaciones respaldadas por registros.'},
  {type:'opportunity',asg:'G',ods:[16],title:'Trazabilidad que genera confianza',description:'Una ficha por producto puede explicar materiales, reparaciones y cuidados con información útil para la clientela.',level:'Potencial alto',response:'Crear una ficha sencilla y contrastarla con clientes del piloto. Responsable propuesto: calidad. Revisión: trimestral. Indicador: productos con ficha completa y dudas resueltas.'}
];
function matrixCard(row) {
  return `<article class="matrix-card"><div class="matrix-tags"><span class="tag">${asg.find(a=>a.key===row.asg).name}</span>${row.ods.map(n=>`<span class="tag tag-ods">ODS ${n}</span>`).join('')}<span class="severity">${row.level}</span></div><h4>${row.title}</h4><p>${row.description}</p><details><summary>Respuesta e indicador propuestos</summary><p>${row.response}</p></details></article>`;
}
function renderMatrix() {
  const rows=matrix.filter(r=>(asgFilter==='all'||r.asg===asgFilter)&&(odsFilter==='all'||r.ods.includes(Number(odsFilter))));
  for(const type of ['risk','opportunity']) $(`#${type}-list`).innerHTML = rows.filter(r=>r.type===type).map(matrixCard).join('') || '<p class="empty-state">No hay elementos para esta combinación. Prueba con otra categoría u ODS.</p>';
  const risks=rows.filter(r=>r.type==='risk').length, opportunities=rows.filter(r=>r.type==='opportunity').length;
  $('#matrix-count').textContent=`${risks} ${risks===1?'riesgo':'riesgos'} y ${opportunities} ${opportunities===1?'oportunidad':'oportunidades'}`;
}
$$('.filter').forEach(button=>button.addEventListener('click',()=>{
  asgFilter=button.dataset.asg;
  $$('.filter').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  renderMatrix();
}));
$('#ods-filter').addEventListener('change',e=>{odsFilter=e.target.value;renderMatrix();});
const rubric = [
  {id:'coherence',name:'Coherencia de las ideas',max:2,help:'¿Las ideas siguen un orden claro, incluyen argumentos apropiados y son coherentes con las tareas de la empresa?',levels:[[2,'Desarrollo claro y organizado, con argumentos apropiados y coherentes con las tareas de la empresa.'],[1,'Hay fallos ocasionales en la secuencia, aunque las ideas son acordes con las tareas de la empresa.'],[0.5,'La mayoría de las ideas carece de orden lógico y resulta difícil relacionarlas.'],[0,'No se observa un orden lógico.']],tip:'Conecta propósito, actividad, ODS y decisiones con ejemplos del mismo caso.'},
  {id:'language',name:'Lenguaje y terminología del ámbito',max:1,help:'¿El lenguaje y la terminología son específicos del ámbito de estudio?',levels:[[1,'Sí, en la mayoría de las respuestas.'],[0.5,'Parcialmente, solo en algunas respuestas.'],[0,'No, en ninguna.']],tip:'Usa con precisión términos como trazabilidad, grupos de interés, criterios ASG e indicadores.'},
  {id:'purpose',name:'Propósito empresarial',max:1.5,help:'¿Se explica la razón fundamental de la empresa, más allá del beneficio financiero, incorporando perspectivas internas y externas?',levels:[[1.5,'Se aborda la razón fundamental más allá del beneficio, con perspectivas internas y externas.'],[1,'Se identifica el propósito, pero solo describe beneficios económicos o el impacto social y ambiental se trata de forma insuficiente.'],[0,'No se identifica la razón fundamental de la existencia de la empresa.']],tip:'Explica qué necesidad resuelve la empresa y qué valor crea para el equipo, la clientela y la comunidad.'},
  {id:'ods',name:'Identificación clara de los ODS',max:2,help:'¿Se identifican los ODS asociados y se valora cómo impacta la empresa en la sociedad y el medio ambiente según su sector?',levels:[[2,'Identifica los ODS asociados y evalúa el impacto social y ambiental según el sector y los factores ASG.'],[1,'La identificación de los ODS no es clara, no se relaciona con el sector o su relación con ASG es incorrecta.'],[0,'La identificación de los ODS no es correcta ni clara.']],tip:'Prioriza objetivos con una relación demostrable y acompáñalos de una actuación y una evidencia.'},
  {id:'asg',name:'Identificación clara de factores ASG',max:2,help:'¿Se identifican los factores ambientales, sociales y de gobernanza que afectan a la actividad?',levels:[[2,'Identifica los ODS asociados y evalúa el impacto social y ambiental según el sector y los factores ASG.'],[1,'La identificación de los ODS no es clara, no se relaciona con el sector o su relación con ASG es incorrecta.'],[0,'La identificación de los ODS no es correcta ni clara.']],tip:'La imagen repite los descriptores de ODS en esta fila. Se conserva su contenido y puntuación. Para revisar ASG, justifica factores ambientales, sociales y de gobernanza con ejemplos concretos.'}
];
state.scores=Object.fromEntries(rubric.filter(r=>r.levels.some(([n])=>n===state.scores[r.id])).map(r=>[r.id,state.scores[r.id]]));
const number = n => new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(n);
function renderRubric() {
  $('#rubric').innerHTML=rubric.map((r,i)=>`<details class="rubric-row"><summary><span class="rubric-index">0${i+1}</span><span class="rubric-label">${r.name}</span><span class="rubric-max" id="result-${r.id}">${r.id in state.scores?number(state.scores[r.id]):'—'} / ${number(r.max)} pts</span></summary><div class="rubric-body"><p>${r.help}</p><div class="rubric-options" role="radiogroup" aria-label="Nivel para ${r.name}">${r.levels.map(([score,label],j)=>`<label class="rubric-option"><input type="radio" name="${r.id}" value="${score}" ${state.scores[r.id]===score?'checked':''}><span><strong>${number(score)} pts.</strong> ${label}</span></label>`).join('')}</div><p style="margin-top:12px;margin-bottom:0"><strong>Para mejorar:</strong> ${r.tip}</p></div></details>`).join('');
  updateScore();
}
function updateScore() {
  const entries=Object.values(state.scores), total=entries.reduce((a,b)=>a+b,0), complete=entries.length;
  $('#score-total').textContent=complete?number(total):'—';
  $('#score-circle').style.setProperty('--score-angle',`${total/8.5*360}deg`);
  $('#score-completion').textContent=`${complete} de 5 criterios revisados`;
  $('#score-heading').textContent=complete===5?(total===8.5?'Una base sólida para compartir.':'Ya sabes dónde mejorar.'):'Tu siguiente paso cuenta.';
  $('#score-description').textContent=complete===5?'Revisa las evidencias que respaldan cada respuesta. La puntuación es tu valoración orientativa.':complete?`Continúa con los ${5-complete} criterios pendientes para completar tu revisión.`:'Selecciona un nivel en cada criterio para revisar la calidad del proyecto.';
}
$('#rubric').addEventListener('change',e=>{
  if(!e.target.matches('input[type=radio]')) return;
  const r=rubric.find(x=>x.id===e.target.name); if(!r) return;
  state.scores[r.id]=Number(e.target.value);
  $(`#result-${r.id}`).textContent=`${number(state.scores[r.id])} / ${number(r.max)} pts`;
  updateScore();persist();
});
$('#reset-score').addEventListener('click',()=>{state.scores={};renderRubric();persist();toast('Autoevaluación reiniciada. Puedes volver a elegir los niveles.');});
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
function downloadProject() {
  const scoreTotal=Object.values(state.scores).reduce((a,b)=>a+b,0);
  const lines=[`# Repte Som Professionals: Som Sostenibles`,``,`Empresa: ${state.company}`,`Equipo: ${state.team}`,`Curso: ${state.course}`,``,`Caso ilustrativo editable. Acciones, metas e indicadores propuestos; sin resultados verificados. Los apartados ODS, ASG y matriz corresponden al taller de mobiliario del ejemplo y deben revisarse si se cambia de sector.`,``,`## Actividad 1 · Propósito y misión`,...questions.flatMap((q,i)=>[``,`### ${q.title}`,state.answers[i]]),``,`## Entregable 1 · Síntesis del propósito y misión`,state.mission,``,`## Actividad 2 · ODS prioritarios`,...Object.entries(priority).flatMap(([n,item])=>[``,`### ODS ${n} · ${ods[Number(n)-1][1]}`,item.why,`Acción: ${item.action}`,item.metric,`${item.target}: https://www.un.org/sustainabledevelopment/es/${item.url}`]),``,`## Criterios ASG`,...asg.flatMap(a=>[``,`### ${a.name}`,a.body,`Acción: ${a.action}`,`Evidencia: ${a.evidence}`]),``,`## Entregable 2 · Riscos i oportunitats`,...matrix.flatMap(r=>[``,`### ${r.type==='risk'?'Riesgo':'Oportunidad'} · ${r.title}`,`ASG: ${r.asg}. ODS: ${r.ods.join(', ')}. ${r.level} (valoración orientativa).`,r.description,`Respuesta: ${r.response}`]),``,`## Autoevaluación del fragmento de rúbrica`,...rubric.map(r=>`- ${r.name}: ${r.id in state.scores?number(state.scores[r.id]):'Sin revisar'} / ${number(r.max)} puntos.`),`Total provisional: ${Object.keys(state.scores).length?number(scoreTotal):'Sin revisar'} / 8,5 puntos. ${Object.keys(state.scores).length}/5 criterios revisados.`,`La imagen facilitada muestra cinco criterios y repite los descriptores de ODS en la fila de factores ASG. Se han conservado sus niveles y puntuaciones. Esta revisión no sustituye la evaluación del profesorado.`,``,`## Comprobación complementaria de riesgos`,`Revisar si cada riesgo u oportunidad explica su relación con el sector, una respuesta, una persona responsable propuesta y un indicador. Esta comprobación no añade puntos a la rúbrica de la imagen.`,``,`## Referencias`,`- Rúbrica: imagen facilitada por el usuario.`,`- Agenda 2030: https://sdgs.un.org/es/goals`,`- Zinkers: https://zinkers.fundacionrepsol.com`,``,`Proyecto educativo independiente, sin afiliación oficial. Contenido demostrativo adaptable.`];
  const blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='repte-som-professionals.md';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Proyecto descargado con respuestas, ODS, ASG, matriz y autoevaluación.');
}
$('#export-project').addEventListener('click',downloadProject);
let printCleanup=[];
function preparePrint(){
  if(printCleanup.length)return;
  const panel=$('#purpose-panel');panel.hidden=true;panel.style.display='none';printCleanup.push(()=>{panel.hidden=false;panel.style.display='';});
  const allAnswers=document.createElement('div');allAnswers.className='print-only';allAnswers.innerHTML=questions.map((q,i)=>`<article class="answer-panel print-answer"><h3>${i+1}. ${q.title}</h3><p>${escapeHTML(state.answers[i])}</p></article>`).join('');$('.purpose-layout').append(allAnswers);printCleanup.push(()=>allAnswers.remove());
  const detail=$('#ods-detail');const original=detail.innerHTML;detail.innerHTML=Object.keys(priority).map(n=>`<div class="ods-detail">${odsDetailMarkup(Number(n)).replace('id="ods-detail-title"','')}</div>`).join('');detail.style.display='block';printCleanup.push(()=>{detail.innerHTML=original;detail.style.display='';});
  const originalASG=asgFilter,originalODS=odsFilter;asgFilter='all';odsFilter='all';renderMatrix();printCleanup.push(()=>{asgFilter=originalASG;odsFilter=originalODS;renderMatrix();});
  $$('details').forEach(d=>{const wasOpen=d.open;d.open=true;printCleanup.push(()=>d.open=wasOpen);});
}
function cleanupPrint(){printCleanup.reverse().forEach(fn=>fn());printCleanup=[];}
window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',cleanupPrint);
$('#print-project').addEventListener('click',()=>{preparePrint();window.print();});
const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Cerrar menú':'Abrir menú');$('#navigation').classList.toggle('open',expanded);});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');$('#navigation').classList.remove('open');}));
window.addEventListener('keydown',e=>{if(e.key==='Escape' && $('#navigation').classList.contains('open')){menu.click();menu.focus();}});
let scrollPending=false;
function updateScroll(){const height=document.documentElement.scrollHeight-innerHeight;$('#scroll-progress').style.width=`${height>0?scrollY/height*100:0}%`;scrollPending=false;}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}},{passive:true});
renderPurpose();renderODS();renderASG();renderMatrix();renderRubric();updateProject();updateScroll();
if('IntersectionObserver' in window){
  document.documentElement.classList.add('js-reveal');
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.06});
  $$('.reveal').forEach(el=>revealObserver.observe(el));
  const navObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)$$('#navigation a').forEach(a=>a.classList.toggle('current',a.hash===`#${e.target.id}`));});},{rootMargin:'-20% 0px -60% 0px',threshold:0});
  $$('main>section[id],main>section[id]>div').filter(el=>['proposito','ods','matriz','evaluacion'].includes(el.id)).forEach(el=>navObserver.observe(el));
}
