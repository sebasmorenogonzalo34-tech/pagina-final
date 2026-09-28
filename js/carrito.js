const K = 'carrito';
const $ = s => document.querySelector(s);
const leer = () => JSON.parse(localStorage.getItem(K) || '[]');
const pesos = n => '$' + n.toLocaleString('es-CO');

function guardar(c) {
  localStorage.setItem(K, JSON.stringify(c));
  pintar();
}

function pintar() {
  const c = leer();
  document.querySelectorAll('.contador').forEach(e => e.textContent = c.length);
  mostrar(c);
}

function agregar(nombre, precio, cantidad = 1) {
  const c = leer();
  while (cantidad--) c.push({ nombre, precio });
  guardar(c);
  aviso(nombre + ' · añadido');
}

// Mensajito flotante al añadir
function aviso(texto) {
  let a = $('.toast');
  if (!a) {
    a = document.createElement('div');
    a.className = 'toast';
    a.setAttribute('role', 'status');
    document.body.append(a);
  }
  a.textContent = texto;
  a.classList.add('ver');
  clearTimeout(a.t);
  a.t = setTimeout(() => a.classList.remove('ver'), 1800);
}

// Lista del carrito (solo existe en pedido.html)
function mostrar(c) {
  const lista = $('#listacarrito');
  if (!lista) return;
  const g = {};
  c.forEach(i => (g[i.nombre] ??= { ...i, n: 0 }).n++);
  const items = Object.values(g);
  const total = c.reduce((s, i) => s + i.precio, 0);

  lista.innerHTML = items.map(i => `
    <li>
      <div>
        <strong>${i.nombre}</strong>
        <div class="controlcantidad">
          <button data-accion="menos" data-nombre="${i.nombre}" aria-label="Quitar una unidad">−</button>
          <span>${i.n}</span>
          <button data-accion="mas" data-nombre="${i.nombre}" aria-label="Agregar una unidad">+</button>
          <button class="quitar" data-accion="quitar" data-nombre="${i.nombre}">Quitar</button>
        </div>
      </div>
      <span>${pesos(i.precio * i.n)}</span>
    </li>`).join('');

  $('#vacio').hidden = items.length > 0;
  $('#pie-carrito').hidden = !items.length;
  $('#total').textContent = pesos(total);

  // Rellena el formulario para que el pedido llegue completo por correo
  const t = $('#pedidotexto');
  if (t && items.length) {
    t.value = items.map(i => `${i.nombre} x${i.n}`).join('\n') + `\nTotal: ${pesos(total)}`;
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('.agregar, [data-accion]');
  if (!b) return;
  if (b.classList.contains('agregar')) return agregar(b.dataset.nombre, +b.dataset.precio);

  const { accion, nombre } = b.dataset;
  let c = leer();
  const i = c.findIndex(x => x.nombre === nombre);
  if (accion === 'mas' && i > -1) c.push(c[i]);
  if (accion === 'menos' && i > -1) c.splice(i, 1);
  if (accion === 'quitar') c = c.filter(x => x.nombre !== nombre);
  if (accion === 'vaciar') c = [];
  guardar(c);
});

document.addEventListener('submit', e => {
  const f = e.target;
  if (!f.matches('.formagregar')) return;
  e.preventDefault();
  const o = f.porcion.selectedOptions[0];
  agregar(o.dataset.nombre, +o.value, +f.cantidad.value || 1);
});

pintar();