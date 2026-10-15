'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'hidrogota-project-v2';
const defaults = {
  "company": "Hidrogota",
  "team": "Equipo por definir",
  "course": "Formación Profesional",
  "answers": [
    "Existimos para aprovechar mejor el agua y ayudar a comunidades que afrontan escasez. Proponemos regenerar aguas residuales, principalmente urbanas de origen humano, para usos como el riego de parques y zonas verdes. Vendemos un servicio útil a ayuntamientos y gestores del agua para sostener una misión social: reservar recursos de agua dulce para otras necesidades. La agricultura sería otra línea, siempre según la calidad exigida y el uso autorizado.",
    "Queremos ser una empresa cercana, responsable y transparente que explique con palabras sencillas de dónde viene el agua y para qué puede utilizarse. Nuestro éxito dependerá de la calidad del tratamiento, el control de costes, la fiabilidad del suministro y un equipo formado. Aspiramos a que ayuntamientos, agricultores y vecinos confíen en nosotros por los controles y los registros comprobables, no solo por nuestra publicidad.",
    "Aportamos una propuesta para reutilizar agua que ya hemos usado y cuidar los espacios verdes sin depender únicamente de nuevas extracciones de agua dulce. Los ayuntamientos esperan continuidad, un precio viable y cumplimiento de las condiciones del servicio; la ciudadanía, protección de la salud y explicaciones claras; el equipo, seguridad y formación. Proponemos publicar resultados comprensibles, encargar análisis a un laboratorio competente y registrar cada suministro para construir confianza.",
    "Respondemos a la sequía, la presión sobre los recursos hídricos y la necesidad de mantener ciudades y cultivos más resilientes. Afrontamos el coste energético, la inversión en instalaciones y redes separadas, los permisos y el posible rechazo al origen del agua. Empezar con un piloto municipal permitiría comprobar la demanda, los costes y los controles antes de crecer. Los efluentes ganaderos serían una fase posterior con evaluación y tratamiento específicos; no los mezclaríamos sin estudio."
  ],
  "mission": "Nuestro propósito es cuidar el agua para cuidar a las personas. Nuestra misión es desarrollar un servicio de regeneración y suministro de aguas residuales para riego de zonas verdes y otros usos no potables autorizados, con controles adecuados, información transparente y un modelo económicamente viable. Hidrogota comienza como una propuesta educativa: sus instalaciones, acuerdos y resultados todavía deben validarse.",
  "scores": {}
};
let state = structuredClone(defaults);
try {
  let saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (!saved) {
    const legacy = JSON.parse(localStorage.getItem('som-sostenibles-project-v1') || 'null');
    if (legacy?.version === 1 && legacy.data) saved = {version:2,data:{...defaults,team:legacy.data.team,course:legacy.data.course}};
  }
  if (saved && saved.version === 2 && saved.data) {
    const data = saved.data;
    for (const name of ['company','team','course','mission']) if (typeof data[name] === 'string' && data[name].trim()) state[name] = data[name].slice(0, name === 'mission' ? 1800 : name === 'company' ? 50 : 80);
    if (Array.isArray(data.answers) && data.answers.length === 4 && data.answers.every(x => typeof x === 'string' && x.trim())) state.answers = data.answers.map(x => x.slice(0,1800));
    if (data.scores && typeof data.scores === 'object') state.scores = data.scores;
  }
} catch {}
let currentQuestion = 0, selectedODS = 6, asgFilter = 'all', odsFilter = 'all';
let toastTimer;
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 4500); }
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({version:2,data:state})); return true; }
  catch { toast('Cambios aplicados en esta sesión. El navegador no permite guardarlos; descarga el proyecto para conservarlos.'); return false; }
}
const questions = [
  {
    "title": "¿Por qué debemos existir?",
    "short": "Nuestra razón fundamental",
    "heading": "Cuidar el agua. Cuidar a las personas.",
    "label": "EL PROPÓSITO",
    "note": "Un servicio viable que responda a una necesidad social y ambiental."
  },
  {
    "title": "¿Cómo queremos ser?",
    "short": "Posicionamiento y claves del éxito",
    "heading": "La confianza se construye gota a gota.",
    "label": "NUESTRA VISIÓN",
    "note": "Calidad, continuidad, transparencia y costes sostenibles."
  },
  {
    "title": "¿Qué aportamos al mundo?",
    "short": "Valor, confianza y expectativas",
    "heading": "Agua que vuelve a ser útil para nuestra comunidad.",
    "label": "VALOR COMPARTIDO",
    "note": "Ayuntamientos, vecinos, agricultores y equipo necesitan compromisos comprobables."
  },
  {
    "title": "¿A qué entorno respondemos?",
    "short": "Tendencias, desafíos y oportunidades",
    "heading": "Prepararnos para un futuro con más presión sobre el agua.",
    "label": "NUESTRO ENTORNO",
    "note": "La sequía abre una necesidad; la viabilidad se demuestra con un piloto y controles."
  }
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
  "2": {
    "why": "La reutilización podría apoyar un riego agrícola más resiliente. Su contribución depende del cultivo, la calidad requerida y las condiciones autorizadas.",
    "action": "Evaluar una segunda fase con agricultores y personal técnico, sin prometer que cualquier agua tratada sirve para cualquier cultivo.",
    "metric": "Indicadores propuestos: m³ destinados a riego agrícola autorizado y superficie atendida, con registro de cultivos y condiciones.",
    "target": "Meta 2.4 · Sistemas agrícolas sostenibles y resilientes",
    "url": "hunger/"
  },
  "6": {
    "why": "Es el centro de Hidrogota: tratar aguas residuales y preparar su reutilización para reducir la presión sobre el agua dulce.",
    "action": "Diseñar un piloto con un ayuntamiento y una entidad gestora. Registrar volumen, calidad, destino y condiciones de uso antes de suministrar agua.",
    "metric": "Indicadores propuestos: m³ regenerados y suministrados por uso autorizado, resultados analíticos y kWh por m³.",
    "target": "Metas 6.3 y 6.4 · Reutilización del agua y uso eficiente",
    "url": "water-and-sanitation/"
  },
  "11": {
    "why": "Los ayuntamientos son el cliente principal propuesto. El riego de parques y jardines puede apoyar el cuidado de los espacios verdes de la ciudad.",
    "action": "Estudiar un parque piloto, su demanda de riego y una distribución separada y señalizada para el agua regenerada.",
    "metric": "Indicadores propuestos: m³ suministrados a zonas verdes, superficie atendida e incidencias del servicio municipal.",
    "target": "Meta 11.7 · Acceso a zonas verdes y espacios públicos",
    "url": "cities/"
  },
  "12": {
    "why": "El agua usada puede volver a ser un recurso. La circularidad también exige gestionar la energía, los reactivos y los residuos del tratamiento.",
    "action": "Hacer un balance de entradas y salidas de agua y registrar consumos y destino de los lodos y otros residuos.",
    "metric": "Indicadores propuestos: proporción del agua de entrada que se suministra para reutilización y residuos generados por m³ tratado.",
    "target": "Meta 12.2 · Gestión sostenible y uso eficiente de recursos naturales",
    "url": "sustainable-consumption-production/"
  }
};
const secondary = {
  "1": "La finalidad social puede beneficiar a comunidades con dificultades de acceso a recursos, pero no contamos con datos para atribuir un efecto sobre la pobreza.",
  "3": "Proteger la salud del equipo y de la comunidad es una condición del servicio. Se aborda con prevención, controles y gestión del riesgo.",
  "4": "La formación del equipo y las explicaciones a la comunidad pueden apoyar el aprendizaje sobre el ciclo del agua.",
  "5": "La igualdad en contratación, salarios y responsabilidades debe formar parte de la gestión de personas.",
  "7": "El tratamiento consume energía. La eficiencia y el suministro energético deben evaluarse en el piloto.",
  "8": "La operación requeriría empleo formado, condiciones dignas y prevención de riesgos biológicos, químicos y mecánicos.",
  "9": "Conexión complementaria importante: instalaciones de regeneración, sensores y redes separadas. El piloto debe demostrar su fiabilidad; no se presenta como tecnología ya construida.",
  "10": "La accesibilidad del servicio y una contratación inclusiva deben estudiarse antes de atribuir un impacto sobre las desigualdades.",
  "13": "La sequía forma parte del contexto. Debemos medir la energía y las emisiones del servicio antes de afirmar un beneficio climático neto.",
  "14": "Reducir vertidos inadecuados puede beneficiar a ecosistemas acuáticos, pero requiere comprobar el efecto real y gestionar los residuos.",
  "15": "El riego debe evitar daños al suelo, acumulación de sales y afectación de ecosistemas. La calidad se adapta al destino.",
  "16": "La transparencia, las autorizaciones y la rendición de cuentas son prácticas de gobernanza necesarias, aunque no se prioriza este ODS por sí solo.",
  "17": "Ayuntamientos, gestores del agua, laboratorios y agricultores serían aliados del piloto. Los acuerdos todavía están por establecer."
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
  {
    "key": "A",
    "name": "Ambiental",
    "subtitle": "APROVECHAR EL AGUA CON CUIDADO",
    "body": "Regenerar agua puede aliviar la presión sobre recursos de agua dulce. También debemos gestionar energía, lodos, fugas y calidad del efluente para evitar trasladar el problema.",
    "action": "Medir entradas, salidas y energía; controlar la calidad y detener el suministro si no cumple las condiciones del uso previsto.",
    "evidence": "Balance de agua, análisis, consumos y registros de residuos. Indicadores: m³ por destino, kWh/m³ e incidencias. ODS 6 y 12."
  },
  {
    "key": "S",
    "name": "Social",
    "subtitle": "PERSONAS INFORMADAS Y PROTEGIDAS",
    "body": "La confianza depende de explicar el origen del agua, su destino y sus límites. El equipo necesita formación y protección frente a los riesgos de la actividad.",
    "action": "Formar al personal y organizar una sesión informativa para vecinos y usuarios del parque piloto, con preguntas y respuestas claras.",
    "evidence": "Registros de formación, consultas y prevención. Indicadores: horas de formación e incidencias atendidas. ODS 11; ODS 2 en la fase agrícola."
  },
  {
    "key": "G",
    "name": "Gobernanza",
    "subtitle": "RESPONSABILIDADES Y DATOS CLAROS",
    "body": "Las autorizaciones, la trazabilidad y la supervisión sostienen el proyecto. Los sensores ayudan a vigilar el proceso, pero no sustituyen todos los análisis ni la responsabilidad de quienes operan.",
    "action": "Asignar responsables, tramitar las autorizaciones y definir un plan de gestión del riesgo con análisis y un protocolo de incidencias.",
    "evidence": "Permisos, resultados analíticos, registros de suministro y revisión de incidencias. Indicadores: registros completos y cumplimiento de controles. ODS 6 y 12."
  }
];
function renderASG() {
  $('#asg-grid').innerHTML=asg.map(a=>`<article class="asg-card"><div class="asg-card-header"><span class="asg-letter" aria-hidden="true">${a.key}</span><div><h3>${a.name}</h3><small>${a.subtitle}</small></div></div><p>${a.body}</p><details><summary>Acciones e indicadores</summary><p><strong>Acción propuesta.</strong> ${a.action}</p><p><strong>Evidencia.</strong> ${a.evidence}</p></details></article>`).join('');
}
const matrix = [
  {
    "type": "risk",
    "asg": "A",
    "ods": [
      6,
      12
    ],
    "title": "Un tratamiento insuficiente",
    "description": "Una avería o un control inadecuado puede producir agua que no cumpla la calidad requerida y causar daños a personas o al entorno.",
    "level": "Prioridad alta",
    "response": "Retener el agua y detener el suministro ante un incumplimiento; analizar y corregir antes de reanudar. Responsable propuesto: calidad y operación. Revisión: según el plan de control. Indicador: incumplimientos e incidencias."
  },
  {
    "type": "opportunity",
    "asg": "A",
    "ods": [
      6,
      12
    ],
    "title": "Dar otro uso al agua que ya usamos",
    "description": "Un piloto puede comprobar cuánta agua se puede reutilizar y en qué condiciones, evitando depender solo de nuevas extracciones.",
    "level": "Potencial alto",
    "response": "Comparar la demanda del parque con el agua disponible y su calidad. Responsable propuesto: operación. Revisión: mensual durante el piloto. Indicador: m³ suministrados y volumen de otras fuentes sustituido, si se acredita."
  },
  {
    "type": "risk",
    "asg": "A",
    "ods": [
      6,
      12
    ],
    "title": "Energía y distribución demasiado costosas",
    "description": "El tratamiento, el bombeo y las distancias pueden hacer inviable el servicio o aumentar su impacto ambiental.",
    "level": "Prioridad alta",
    "response": "Elegir un piloto cercano y calcular inversión, energía y distribución antes de ofrecer un precio. Responsable propuesto: operaciones y finanzas. Revisión: mensual. Indicador: kWh/m³ y coste total por m³."
  },
  {
    "type": "opportunity",
    "asg": "A",
    "ods": [
      2,
      11
    ],
    "title": "Parques y cultivos con más opciones de riego",
    "description": "Disponer de una fuente complementaria puede apoyar zonas verdes y, en una fase posterior, el riego agrícola autorizado.",
    "level": "Potencial alto",
    "response": "Empezar en una zona verde y evaluar después cultivos y condiciones específicas. Responsable propuesto: coordinación municipal y técnica. Revisión: trimestral. Indicador: superficie atendida y m³ por destino."
  },
  {
    "type": "risk",
    "asg": "S",
    "ods": [
      11,
      2
    ],
    "title": "Rechazo al origen del agua",
    "description": "La ciudadanía puede desconfiar por falta de información o por dudas razonables sobre salud, olores y manejo del agua.",
    "level": "Prioridad alta",
    "response": "Explicar para qué sirve el agua, mostrar los controles y recoger las dudas antes del piloto. Responsable propuesto: atención a la comunidad. Revisión: mensual. Indicador: consultas y tiempo de respuesta."
  },
  {
    "type": "opportunity",
    "asg": "S",
    "ods": [
      11
    ],
    "title": "Una comunidad que entiende y participa",
    "description": "La información clara y las visitas educativas pueden ayudar a comprender la reutilización y mejorar el proyecto con aportaciones vecinales.",
    "level": "Potencial medio",
    "response": "Preparar una sesión con el ayuntamiento y evaluar las dudas antes y después. Responsable propuesto: comunicación. Revisión: por actividad. Indicador: participación y comprensión, sin confundir asistencia con aceptación."
  },
  {
    "type": "risk",
    "asg": "G",
    "ods": [
      6,
      12
    ],
    "title": "Retrasos en permisos o fallos de trazabilidad",
    "description": "Empezar sin las autorizaciones necesarias o no poder reconstruir un suministro compromete la viabilidad y la confianza.",
    "level": "Prioridad alta",
    "response": "Revisar requisitos con personal competente y registrar origen, tratamiento, controles y destino. Responsable propuesto: dirección y calidad. Revisión: antes de operar y en cada suministro. Indicador: permisos y registros completos."
  },
  {
    "type": "opportunity",
    "asg": "G",
    "ods": [
      6,
      12
    ],
    "title": "Transparencia que se puede comprobar",
    "description": "Publicar resultados comprensibles y revisar los controles con un laboratorio competente puede reforzar la confianza.",
    "level": "Potencial alto",
    "response": "Diseñar un informe de calidad que indique fecha, uso permitido y límites del dato. Responsable propuesto: calidad. Revisión: según el plan de control. Indicador: controles realizados y registros accesibles."
  }
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
  const lines=[`# Repte Som Professionals: Som Sostenibles`,``,`Empresa: ${state.company}`,`Equipo: ${state.team}`,`Curso: ${state.course}`,``,`Caso ilustrativo editable. Acciones, metas e indicadores propuestos; sin resultados verificados. Análisis de Hidrogota: regeneración de aguas residuales para usos no potables autorizados. El tratamiento depende del origen y del destino. No se afirma potabilidad ni se ofrecen resultados operativos.`,``,`## Actividad 1 · Propósito y misión`,...questions.flatMap((q,i)=>[``,`### ${q.title}`,state.answers[i]]),``,`## Entregable 1 · Síntesis del propósito y misión`,state.mission,``,`## Cómo funcionaría Hidrogota`,`Aguas residuales urbanas → separación → tratamiento biológico → filtración y desinfección → controles → riego autorizado. Esquema simplificado; la solución real necesita diseño técnico. Los efluentes ganaderos requieren evaluación específica.`,`Clientes principales: ayuntamientos y gestores de zonas verdes. Agricultura: segunda fase por validar. ODS 9: infraestructura y seguimiento como conexión complementaria.`,``,`## Actividad 2 · ODS prioritarios`,...Object.entries(priority).flatMap(([n,item])=>[``,`### ODS ${n} · ${ods[Number(n)-1][1]}`,item.why,`Acción: ${item.action}`,item.metric,`${item.target}: https://www.un.org/sustainabledevelopment/es/${item.url}`]),``,`## Criterios ASG`,...asg.flatMap(a=>[``,`### ${a.name}`,a.body,`Acción: ${a.action}`,`Evidencia: ${a.evidence}`]),``,`## Entregable 2 · Riscos i oportunitats`,...matrix.flatMap(r=>[``,`### ${r.type==='risk'?'Riesgo':'Oportunidad'} · ${r.title}`,`ASG: ${r.asg}. ODS: ${r.ods.join(', ')}. ${r.level} (valoración orientativa).`,r.description,`Respuesta: ${r.response}`]),``,`## Autoevaluación del fragmento de rúbrica`,...rubric.map(r=>`- ${r.name}: ${r.id in state.scores?number(state.scores[r.id]):'Sin revisar'} / ${number(r.max)} puntos.`),`Total provisional: ${Object.keys(state.scores).length?number(scoreTotal):'Sin revisar'} / 8,5 puntos. ${Object.keys(state.scores).length}/5 criterios revisados.`,`La imagen facilitada muestra cinco criterios y repite los descriptores de ODS en la fila de factores ASG. Se han conservado sus niveles y puntuaciones. Esta revisión no sustituye la evaluación del profesorado.`,``,`## Comprobación complementaria de riesgos`,`Revisar si cada riesgo u oportunidad explica su relación con el sector, una respuesta, una persona responsable propuesta y un indicador. Esta comprobación no añade puntos a la rúbrica de la imagen.`,``,`## Referencias`,`- Rúbrica: imagen facilitada por el usuario.`,`- Reutilización del agua · MITECO: https://www.miteco.gob.es/es/agua/temas/concesiones-y-autorizaciones/reutilizacion-aguas-depuradas.html`,`- Agenda 2030: https://sdgs.un.org/es/goals`,`- Zinkers: https://zinkers.fundacionrepsol.com`,``,`Proyecto educativo independiente, sin afiliación oficial. Contenido demostrativo adaptable.`];
  const blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='hidrogota-repte-som-professionals.md';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Proyecto descargado con respuestas, ODS, ASG, matriz y autoevaluación.');
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
