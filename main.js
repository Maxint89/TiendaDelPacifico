document.addEventListener("DOMContentLoaded", function () {

    const listaProductosHTML = document.querySelector('.listaProductos');
    const listaCarritoHTML = document.querySelector('.listaCarrito');
    const iconoCarrito = document.querySelector('.carrito-icono');
    const iconoCarritoSpan = document.querySelector('.carrito-icono span');
    const body = document.querySelector('body');
    const cerrarCarrito = document.querySelector('.cerrar-carrito');
    const btnVaciarCarrito = document.querySelector('.vaciarCarrito');
    let carrito = [];


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

        // Guardar el total en localStorage
        localStorage.setItem('totalGastado', totalGastado);
    }

    const agregarAlCarrito = (producto_id) => {
        let productoEnCarrito = carrito.findIndex((value) => value.producto_id == producto_id);
        if (carrito.length <= 0) {
            carrito = [{
                producto_id: producto_id,
                cantidad: 1
            }];
        } else if (productoEnCarrito < 0) {
            carrito.push({
                producto_id: producto_id,
                cantidad: 1
            });
        } else {
            carrito[productoEnCarrito].cantidad = carrito[productoEnCarrito].cantidad++;
        }
        agregarCarritoAHTML();
        agregarCarritoLS();
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
            <div class="image">
                    <img src="${info.imagen}">
                </div>
                <div class="name">
                ${info.nombre}
                </div>
                <div class="price">$${info.precio}</div>
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
                    carrito[posicionItemCarrito].cantidad = carrito[posicionItemCarrito].cantidad + 1;
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
        fetch('productos.json')
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