const K = 'carrito';
const leer = () => JSON.parse(localStorage.getItem(K) || '[]');

const pintar = () => {
    const carrito = leer();
    
    // 1. Actualiza todos los contadores numéricos
    document.querySelectorAll('.contador').forEach(e => e.textContent = carrito.length);

    // 2. Muestra los elementos en la sección visual del carrito (si existe en el HTML)
    const contenedorLista = document.getElementById('lista-carrito');
    const contenedorTotal = document.getElementById('total-carrito');
    
    if (!contenedorLista) return; // Si no está la sección en esta página, no hace nada más

    if (carrito.length === 0) {
        contenedorLista.innerHTML = '<p class="descripcion">Tu carrito está vacío.</p>';
        if (contenedorTotal) contenedorTotal.textContent = '$0';
        return;
    }

    let html = '';
    let total = 0;

    carrito.forEach((producto, index) => {
        total += producto.precio;
        html += `
            <div class="item-carrito" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--borde);">
                <span>${producto.nombre}</span>
                <span>$${producto.precio.toLocaleString()}</span>
                <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color: #D98190; cursor:pointer; font-weight:bold;">✕</button>
            </div>
        `;
    });

    contenedorLista.innerHTML = html;
    if (contenedorTotal) contenedorTotal.textContent = '$' + total.toLocaleString();
};

// Función extra para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    const c = leer();
    c.splice(index, 1); // Borra el producto en esa posición
    localStorage.setItem(K, JSON.stringify(c));
    pintar(); // Actualiza la vista
}

function agregar(nombre, precio, cantidad = 1) {
    const c = leer();
    while (cantidad--) c.push({ nombre, precio });
    localStorage.setItem(K, JSON.stringify(c));
    pintar();
}

document.addEventListener('click', e => {
    const b = e.target.closest('.agregar');
    if (b) agregar(b.dataset.nombre, +b.dataset.precio);
});

document.addEventListener('submit', e => {
    const f = e.target;
    if (!f.matches('.formagregar')) return;
    e.preventDefault();
    const o = f.porcion.selectedOptions[0];
    agregar(o.dataset.nombre, +o.value, +f.cantidad.value || 1);
});

pintar();