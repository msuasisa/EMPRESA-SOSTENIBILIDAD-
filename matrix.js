'use strict';
let asgFilter='all', odsFilter='all';
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

renderMatrix();
