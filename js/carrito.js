let carrito = JSON.parse(localStorage.getItem("carrito")) || []

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
        cantidadElemento.textContent = "unidades: " + producto.cantidad

        totalPrecio += producto.precio * producto.cantidad

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
function finalizarCompra() {
    if (carrito.length > 0) {
        // Calcular el total
        let total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0)

        // Guardar el total gastado en localStorage
        localStorage.setItem("totalGastado", total)

        Toastify({
            text: `Gracias por tu compra! Total gastado: $${total}`,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast()

        // Vaciar el carrito y actualizar la interfaz
        carrito = []
        localStorage.setItem("carrito", JSON.stringify(carrito))
        actualizarInterfazCarrito()
    } else {
        // Mostrar un mensaje si el carrito está vacío
        Toastify({
            text: "Tu carrito está vacío",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast()
    }
}

actualizarInterfazCarrito()

document.getElementById("boton-confirmar").addEventListener("click", finalizarCompra)
