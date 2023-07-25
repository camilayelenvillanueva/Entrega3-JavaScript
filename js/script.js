const primaryNavList = document.querySelector('#primary-nav-list')
const hamburger = document.querySelector('#hamburger')

hamburger.addEventListener('click', toggleNavList)

function toggleNavList() {
    primaryNavList.classList.toggle('nav-closed')
    hamburger.classList.toggle('hamburger-open')
}

let productos = []

const contenedor = document.getElementById("productos")
const buscador = document.getElementById("buscador")

let carrito = JSON.parse(localStorage.getItem("carrito")) || []

fetch('./js/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data
        crearTarjetas(productos, contenedor)
    })
    .catch(error => {
        console.error('Error al cargar los datos de productos:', error)
    })

buscador.addEventListener("input", filtrar)

function crearTarjetas(array, contenedor) {
    contenedor.innerHTML = ""
    array.forEach(elemento => {
        const mensaje = "Sinopsis: " + elemento.sinopsis
        const producto = document.createElement("div")
        producto.className = "tarjetaProducto"

        producto.innerHTML = `
        <div class="filas">
          <div class="tarjeta">
                <div class="imagen" style="background-image: url(./img/${elemento.rutaImagen})"></div>
                <div class="producto">
                <span class="productoTitulo">${elemento.titulo}</span>
                <span class="productoAutor">${elemento.autor}</span>
            </div>
            <div class="descripcion">
              <p>${mensaje}</p>
            </div>
            <div class="precio">
              <div>
                <span class="precioFinal">$ ${elemento.precio}</span>
              </div>
              <div>
              <button class="boton-comprar" data-id="${elemento.id}">Comprar</button>
            </div>
          </div>
        </div>`

        contenedor.appendChild(producto)
    })

    const botonesComprar = document.querySelectorAll(".boton-comprar")
    botonesComprar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}

function filtrar() {
    const textoBusqueda = buscador.value.toLowerCase()
    const arrayFiltrado = productos.filter(
        producto => producto.titulo.toLowerCase().includes(textoBusqueda)
    )
    crearTarjetas(arrayFiltrado, contenedor)
}

function agregarAlCarrito(event) {
    mensajeAgregamosAlCarrito()
    const libroId = event.target.dataset.id
    const libro = obtenerLibroPorId(libroId)

    const libroEnCarrito = carrito.find(item => item.id === libro.id)

    if (libroEnCarrito) {
        libroEnCarrito.cantidad++
        libroEnCarrito.precioTotal += libro.precio
    } else {
        libro.cantidad = 1
        libro.precioTotal = libro.precio
        carrito.push(libro)
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function obtenerLibroPorId(productoId) {
    const libroEncontrado = productos.find(producto => producto.id === parseInt(productoId))

    if (libroEncontrado) {
        return {
            id: libroEncontrado.id,
            titulo: libroEncontrado.titulo,
            autor: libroEncontrado.autor,
            precio: libroEncontrado.precio
        }
    } else {
        return null
    }
}

function mensajeAgregamosAlCarrito() {
    Toastify({
        text: "SU LIBRO FUE AGREGADO AL CARRITO",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast()
}
