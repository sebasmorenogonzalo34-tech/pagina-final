let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function dinero(numero) {
    return '$' + numero.toLocaleString('es-CO');
}

function guardar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    dibujar();
}

function dibujar() {
    const total = carrito.reduce((suma, p) => suma + p.precio * p.cantidad, 0);
    const cantidad = carrito.reduce((suma, p) => suma + p.cantidad, 0);
    document.querySelectorAll('.contador').forEach(c => c.textContent = cantidad);

    const lista = document.getElementById('listacarrito');
    if (!lista) return;
    lista.innerHTML = carrito.length
        ? carrito.map(p => `<li><span>${p.cantidad} × ${p.nombre}</span><strong>${dinero(p.precio * p.cantidad)}</strong></li>`).join('')
        : '<li>Tu carrito está vacío.</li>';
    document.getElementById('totalcarrito').textContent = dinero(total);
}

document.querySelectorAll('.agregar').forEach(boton => {
    boton.addEventListener('click', () => {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);
        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) existente.cantidad++;
        else carrito.push({ nombre, precio, cantidad: 1 });
        guardar();

        const texto = boton.textContent;
        boton.textContent = '¡Añadido!';
        setTimeout(() => boton.textContent = texto, 1200);
    });
});

const vaciar = document.getElementById('vaciar');
if (vaciar) vaciar.addEventListener('click', () => {
    carrito = [];
    guardar();
});

dibujar();
