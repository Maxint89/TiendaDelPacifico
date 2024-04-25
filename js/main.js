document.addEventListener("DOMContentLoaded", function () {

    const listaProductosHTML = document.querySelector('.listaProductos');
    const listaCarritoHTML = document.querySelector('.listaCarrito');
    const iconoCarrito = document.querySelector('.carrito-icono');
    const iconoCarritoSpan = document.querySelector('.carrito-icono span');
    const body = document.querySelector('body');
    const cerrarCarrito = document.querySelector('.cerrar-carrito');
    const comprarCarrito = document.querySelector('.comprar-carrito');
    const btnVaciarCarrito = document.querySelector('.vaciarCarrito');
    let carrito = [];
    let productos = [];

    comprarCarrito.addEventListener('click', () => {
        Swal.fire({
            title: '¿Está seguro de finalizar la compra?',
            text: 'Esto vaciará el carrito y eliminará su compra actual.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Finalizar compra',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                listaCarritoHTML.innerHTML = '';
                localStorage.removeItem('carrito');
                iconoCarritoSpan.innerText = '0';
                actualizarTotalCarrito();
                Swal.fire(
                    '¡Gracias por su compra!',
                    'Esperamos verlo de nuevo pronto.',
                    'success'
                );
            }
        });
    });

    iconoCarrito.addEventListener('click', () => {
        body.classList.toggle('mostrarCarrito');
    })
    cerrarCarrito.addEventListener('click', () => {
        body.classList.toggle('mostrarCarrito');
    })

    const agregarDatosAHTML = () => {
        if (productos.length > 0) {
            productos.forEach(producto => {
                let nuevoProducto = document.createElement('div');
                nuevoProducto.dataset.id = producto.id;
                nuevoProducto.classList.add('item');
                nuevoProducto.innerHTML =
                    `<img src="${producto.imagen}" alt="">
                <h2>${producto.nombre}</h2>
                <div class="precio">$${producto.precio}</div>
                <button class="agregarCarrito">Agregar al carrito</button>`;
                listaProductosHTML.appendChild(nuevoProducto);
            });
        }
    }
    listaProductosHTML.addEventListener('click', (event) => {
        let tomarClick = event.target;
        if (tomarClick.classList.contains('agregarCarrito')) {
            let id_producto = tomarClick.parentElement.dataset.id;
            agregarAlCarrito(id_producto);
        }
    })

    const calcularTotalGastado = () => {
        let total = 0;
        carrito.forEach(item => {
            let productoUbicacion = productos.findIndex((value) => value.id == item.producto_id);
            let info = productos[productoUbicacion];
            total += info.precio * item.cantidad;
        });
        return total;
    }

    const actualizarTotalCarrito = () => {
        let totalGastado = calcularTotalGastado();
        let carritoTotalElement = document.getElementById('carrito-total');
        carritoTotalElement.innerText = `$${totalGastado}`;
        localStorage.setItem('totalGastado', totalGastado);
    }

    const agregarAlCarrito = (producto_id) => {
        let productoEnCarrito = carrito.find(item => item.producto_id === producto_id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({
                producto_id: producto_id,
                cantidad: 1
            });
        }
        agregarCarritoAHTML();
        agregarCarritoLS();
        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            position: "left", 
            style: {
                background: "linear-gradient(to right, #0b7018, #10d12a)",
            },
            onClick: function () { }
        }).showToast();
    }

    const agregarCarritoLS = () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    const agregarCarritoAHTML = () => {
        listaCarritoHTML.innerHTML = '';
        let cantidadTotal = 0;
        if (carrito.length > 0) {
            carrito.forEach(item => {
                cantidadTotal = cantidadTotal + item.cantidad;
                let itemNuevo = document.createElement('div');
                itemNuevo.classList.add('item');
                itemNuevo.dataset.id = item.producto_id;

                let productoUbicacion = productos.findIndex((value) => value.id == item.producto_id);
                let info = productos[productoUbicacion];
                listaCarritoHTML.appendChild(itemNuevo);
                itemNuevo.innerHTML = `
                <div class="imagen">
                    <img src="${info.imagen}">
                </div>
                <div class="nombre">
                    ${info.nombre}
                </div>
                <div class="precio">$${info.precio}</div>
                <div class="cantidad">
                    <span class="menos"><</span>
                    <span>${item.cantidad}</span>
                    <span class="mas">></span>
                </div>
            `;
            })
        }
        iconoCarritoSpan.innerText = cantidadTotal;
        actualizarTotalCarrito();
    }

    listaCarritoHTML.addEventListener('click', (event) => {
        let tomarClick = event.target;
        if (tomarClick.classList.contains('menos') || tomarClick.classList.contains('mas')) {
            let producto_id = tomarClick.parentElement.parentElement.dataset.id;
            let botonCantidad = 'menos';
            if (tomarClick.classList.contains('mas')) {
                botonCantidad = 'mas';
            }
            modificarCarrito(producto_id, botonCantidad);
        }
    })

    const modificarCarrito = (producto_id, botonCantidad) => {
        let posicionItemCarrito = carrito.findIndex((value) => value.producto_id == producto_id);
        if (posicionItemCarrito >= 0) {
            switch (botonCantidad) {
                case 'mas':
                    carrito[posicionItemCarrito].cantidad++;
                    break;

                default:
                    let cambiarCantidad = carrito[posicionItemCarrito].cantidad - 1;
                    if (cambiarCantidad > 0) {
                        carrito[posicionItemCarrito].cantidad = cambiarCantidad;
                    } else {
                        carrito.splice(posicionItemCarrito, 1);
                    }
                    break;
            }
        }
        agregarCarritoAHTML();
        agregarCarritoLS();
    }

    btnVaciarCarrito.addEventListener('click', () => {
        carrito = [];
        listaCarritoHTML.innerHTML = '';
        localStorage.removeItem('carrito');
        iconoCarritoSpan.innerText = '0';
        actualizarTotalCarrito();
    });

    const iniciarPagina = () => {
        fetch('./js/productos.json')
            .then(response => response.json())
            .then(data => {
                productos = data;
                agregarDatosAHTML();

                if (localStorage.getItem('carrito')) {
                    carrito = JSON.parse(localStorage.getItem('carrito'));
                    agregarCarritoAHTML();
                }
            })
    }
    iniciarPagina();
})
