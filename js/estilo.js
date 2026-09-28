const rejilla=document.getElementById('rejilla');
const pista=document.getElementById('pista');
const ticket=document.getElementById('ticket');
let bandeja={};

function barras(notas){
  return `<div class="barraapilada">${notas.map((n,i)=>`<span style="width:${n[1]}%;background:${colores[i%3]}"></span>`).join('')}</div><ul class="leyenda">${notas.map((n,i)=>`<li><i style="background:${colores[i%3]}"></i>${n[0]} <b>${n[1]}%</b></li>`).join('')}</ul>`;
}

rejilla.innerHTML=pasteles.map(p=>`
  <article class="tarjeta">
    <div class="foto"><img src="${p.imagen}" alt="${p.nombre}" loading="lazy" onerror="this.style.display='none'"></div>
    <div class="info">
      <span class="etiqueta">${p.etiqueta}</span>
      <h3>${p.nombre}</h3>
      <p class="descripcion">${p.descripcion}</p>
      <details class="notas"><summary>Ver notas de sabor</summary>${barras(p.notas)}</details>
      <label class="tamano">Porciones<select>${p.porciones.map((q,j)=>`<option value="${j}">${q[0]} · ${dinero(q[1])}</option>`).join('')}</select></label>
      <button class="boton botonancho" onclick="agregar('${p.id}',this)">Añadir a bandeja</button>
      <a href="detalle.html?id=${p.id}" class="boton botonancho">Ver detalles</a>
    </div>
  </article>`).join('');

pista.innerHTML=pasteles.map(p=>`
  <div class="diapositiva"><img src="${p.imagen}" alt="${p.nombre}" onerror="this.style.display='none'">
    <div class="textodiapositiva"><span class="insignia">Favorito ${p.id}</span><h3>${p.nombre}</h3><p>${p.descripcion}</p><a href="detalle.html?id=${p.id}" class="boton botonclaro">Conocer más</a></div>
  </div>`).join('');

function dato(k){
  const [id,i]=k.split('|'),p=pasteles.find(x=>x.id===id);
  return {id,p,tam:p.porciones[i][0],precio:p.porciones[i][1]};
}

function total(){
  return Object.keys(bandeja).reduce((s,k)=>s+dato(k).precio*bandeja[k],0);
}

function agregar(id,boton){
  const k=id+'|'+boton.closest('.info').querySelector('select').value;
  bandeja[k]=(bandeja[k]||0)+1;
  dibujarBandeja();
}

function dibujarBandeja(){
  const claves=Object.keys(bandeja);
  document.getElementById('listabandeja').innerHTML=claves.length?claves.map(k=>{
    const d=dato(k);
    return `<li><span>${bandeja[k]} × ${d.p.nombre}<small> (${d.id}) · ${d.tam}</small></span><strong>${dinero(d.precio*bandeja[k])}</strong></li>`;
  }).join(''):'<li class="vacio">Tu bandeja está vacía. Añade pasteles desde el catálogo.</li>';
  document.getElementById('totalpedido').textContent=dinero(total());
}

document.getElementById('formulariopedido').addEventListener('submit',e=>{
  e.preventDefault();
  if(!Object.keys(bandeja).length)return alert('Añade al menos un pastel a la bandeja');
  const f=new FormData(e.target);
  const lineas=Object.keys(bandeja).map(k=>{
    const d=dato(k);
    return `<li><span>${bandeja[k]} × ${d.p.nombre} <small>ID ${d.id} · ${d.tam}</small></span><span>${dinero(d.precio*bandeja[k])}</span></li>`;
  }).join('');
  ticket.innerHTML=`
    <span class="sello">✓</span><h2>¡Pedido confirmado!</h2>
    <p class="numeropedido">PED-${Math.floor(100000+Math.random()*900000)}</p>
    <p>Gracias, <strong>${f.get('nombre')}</strong>.</p>
    <ul class="lineas">${lineas}<li class="totalfila"><span>Total</span><span>${dinero(total())}</span></li></ul>
    <p class="detalleticket">${f.get('entrega')==='domicilio'?'Domicilio: '+f.get('direccion'):'Recogida en tienda'} · ${f.get('fecha')} · ${f.get('hora')}<br>Pago: ${f.get('pago')}</p>
    <p class="nota">Pedido de prueba, no es real.</p>
    <form method="dialog"><button class="boton">Cerrar</button></form>`;
  ticket.showModal();
});

ticket.onclose=()=>{
  bandeja={};
  document.getElementById('formulariopedido').reset();
  dibujarBandeja();
};

dibujarBandeja();