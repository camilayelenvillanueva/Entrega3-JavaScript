
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

let carritoJSON = JSON.parse(localStorage.getItem("carrito"))
let carrito = carritoJSON ? carritoJSON : []

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
    contenedor.innerHTML = " "
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
      
      
    actualizarInterfazCarrito()

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

function actualizarInterfazCarrito() {
    const carritoElemento = document.getElementById("carrito")
    const totalPrecioElemento = document.getElementById("total-precio")
    carritoElemento.innerHTML = ""

    let totalPrecio = 0

    carrito.forEach(producto => {
        const libroElemento = document.createElement("div")
        libroElemento.classList.add("book")

        const tituloElemento = document.createElement("h2")
        tituloElemento.textContent = producto.titulo

        const autorElemento = document.createElement("p")
        autorElemento.textContent = "Autor: " + producto.autor

        const precioElemento = document.createElement("p")
        const precioFormateado = producto.precio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        precioElemento.textContent = "Precio: $" + precioFormateado

        const cantidadElemento = document.createElement("p")
        cantidadElemento.textContent = "unidades: "+producto.cantidad

        totalPrecio += producto.precio* producto.cantidad

        libroElemento.appendChild(tituloElemento)
        libroElemento.appendChild(autorElemento)
        libroElemento.appendChild(precioElemento)
        libroElemento.appendChild(cantidadElemento)

        carritoElemento.appendChild(libroElemento)

        const eliminarElemento = document.createElement("button")
        eliminarElemento.classList.add("eliminar")
        eliminarElemento.setAttribute("data-id", producto.id)
        eliminarElemento.textContent = "Eliminar"
        eliminarElemento.addEventListener("click", eliminarDelCarrito)

        libroElemento.appendChild(eliminarElemento)
        carritoElemento.appendChild(libroElemento)

    })

    const totalPrecioFormateado = totalPrecio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    totalPrecioElemento.textContent = "Total: $" + totalPrecioFormateado

}

function eliminarDelCarrito(event) {
    const productoId = event.target.dataset.id
    const productoIndex = carrito.findIndex((producto) => producto.id === parseInt(productoId))

    productoIndex > -1 && (carrito.splice(productoIndex, 1), actualizarInterfazCarrito(), localStorage.setItem("carrito", JSON.stringify(carrito)))
}

const botonConfirmar = document.getElementById("boton-confirmar")
const botonVolverComprar = document.getElementById("volverComprar")

botonConfirmar.addEventListener("click", confirmarCompra)
botonVolverComprar.addEventListener("click", volverAComprar)


function confirmarCompra() {
    let totalGastado = 0
    carrito.forEach(producto => {
        totalGastado += producto.precio
    })

    localStorage.setItem("totalGastado", totalGastado)

    const totalGastadoElemento = document.getElementById("total-gastado")
    totalGastadoElemento.textContent = "Total Gastado: $" + totalGastado

    carrito.length = 0
    actualizarInterfazCarrito()
    botonConfirmar.style.display = "none"
    botonVolverComprar.style.display = "block"
}

function volverAComprar() {
    localStorage.removeItem("carrito")
    carrito = []
    actualizarInterfazCarrito()
    window.location.href = ""
}

localStorage.removeItem("totalGastado")

function vaAlCarrito() {

    Toastify({
        text: "IR AL CARRITO",
        destination: "#seccionCarrito",
        duration: StaticRange,
        newWindow: false,
        close: true,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function volveraArriba() { }
    }).showToast();
    volveraArriba()
}

function volveraArriba() {
    Toastify({
        text: "VOLVER ARRIBA",
        duration: StaticRange,
        destination: "#seccionProductos",
        newWindow: false,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {
            showToast()
        }
    }).showToast();
}

vaAlCarrito()

function mensaje() {
    Toastify({
        text: "El libro ya está en el carrito. Agregamos otra unidad",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}
function mensajeAgregamosAlCarrito() {
    Toastify({
        text: "SU LIBRO FUE AGREGADO AL CARRITO",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}
