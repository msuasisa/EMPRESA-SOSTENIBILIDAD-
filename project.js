'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'hidrogenesis-project-v3';
const defaults = {
  "company": "Hidrogenesis",
  "team": "Equipo por definir",
  "course": "Formación Profesional",
  "answers": [
    "Existimos para aprovechar mejor el agua y ayudar a comunidades que afrontan escasez. Proponemos regenerar aguas residuales, principalmente urbanas de origen humano, para usos como el riego de parques y zonas verdes. Vendemos un servicio útil a ayuntamientos y gestores del agua para sostener una misión social: reservar recursos de agua dulce para otras necesidades. La agricultura sería otra línea, siempre según la calidad exigida y el uso autorizado.",
    "Queremos ser una empresa cercana, responsable y transparente que explique con palabras sencillas de dónde viene el agua y para qué puede utilizarse. Nuestro éxito dependerá de la calidad del tratamiento, el control de costes, la fiabilidad del suministro y un equipo formado. Aspiramos a que ayuntamientos, agricultores y vecinos confíen en nosotros por los controles y los registros comprobables, no solo por nuestra publicidad.",
    "Aportamos una propuesta para reutilizar agua que ya hemos usado y cuidar los espacios verdes sin depender únicamente de nuevas extracciones de agua dulce. Los ayuntamientos esperan continuidad, un precio viable y cumplimiento de las condiciones del servicio; la ciudadanía, protección de la salud y explicaciones claras; el equipo, seguridad y formación. Proponemos publicar resultados comprensibles, encargar análisis a un laboratorio competente y registrar cada suministro para construir confianza.",
    "Respondemos a la sequía, la presión sobre los recursos hídricos y la necesidad de mantener ciudades y cultivos más resilientes. Afrontamos el coste energético, la inversión en instalaciones y redes separadas, los permisos y el posible rechazo al origen del agua. Empezar con un piloto municipal permitiría comprobar la demanda, los costes y los controles antes de crecer. Los efluentes ganaderos serían una fase posterior con evaluación y tratamiento específicos; no los mezclaríamos sin estudio."
  ],
  "mission": "Nuestro propósito es cuidar el agua para cuidar a las personas. Nuestra misión es desarrollar un servicio de regeneración y suministro de aguas residuales para riego de zonas verdes y otros usos no potables autorizados, con controles adecuados, información transparente y un modelo económicamente viable. Hidrogenesis comienza como una propuesta educativa: sus instalaciones, acuerdos y resultados todavía deben validarse."
};
let state = structuredClone(defaults);
function loadSavedProject(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
const saved = loadSavedProject(KEY) || loadSavedProject('hidrogota-project-v2');
if (saved && [2,3].includes(saved.version) && saved.data) {
  const data = saved.data;
  for (const name of ['company','team','course','mission']) if (typeof data[name] === 'string' && data[name].trim()) state[name] = data[name].replace(/Hidrogota/gi,'Hidrogenesis').slice(0, name === 'mission' ? 1800 : name === 'company' ? 50 : 80);
  if (Array.isArray(data.answers) && data.answers.length === 4 && data.answers.every(value => typeof value === 'string' && value.trim())) state.answers = data.answers.map(value => value.replace(/Hidrogota/gi,'Hidrogenesis').slice(0,1800));
} else {
  const legacy = loadSavedProject('som-sostenibles-project-v1');
  for (const name of ['team','course']) if (typeof legacy?.data?.[name] === 'string' && legacy.data[name].trim()) state[name] = legacy.data[name].slice(0,80);
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
    "why": "Es el centro de Hidrogenesis: tratar aguas residuales y preparar su reutilización para reducir la presión sobre el agua dulce.",
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
