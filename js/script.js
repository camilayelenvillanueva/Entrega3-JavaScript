
//nav
const primaryNavList = document.querySelector('#primary-nav-list')
const hamburger = document.querySelector('#hamburger')

hamburger.addEventListener('click', toggleNavList)

function toggleNavList() {
    primaryNavList.classList.toggle('nav-closed')
    hamburger.classList.toggle('hamburger-open')
}

//productos
const productos = [
    { id: 1, titulo: "El libro de la selva", categoria: "INFANTILES", precio: 4000, rutaImagen: "01.jpg", autor: "Rudyard Kipling", sinopsis: "Yo nací en la Selva. He obedecido la Leyde la Selva, y no hay ni uno de nuestroslobos al que no haya quitado una espinade las patas. ¿Cómo no van a ser mishermanos?..." },
    { id: 2, titulo: "Una historia de peluche", categoria: "INFANTILES", precio: 3290, rutaImagen: "01.jpg", autor: "Sara Bertrand", sinopsis: "Una historia llena de ternura 'ilustrada por el premiado Rafael Yockteng' en la que descubriremos que cada uno tiene sus formas y que es importante no olvidarlo." },
    { id: 3, titulo: "Cincuentena", categoria: "POESÍA", precio: 3200, rutaImagen: "01.jpg", autor: "Tomas wsher", sinopsis: "Con el festivo pretexto de celebrar sus cincuenta años, García Montero ha seleccionado, entre su producción poética, los cincuenta poemas que integran este volumen." },
    { id: 4, titulo: "Hambriento", categoria: "POESÍA", precio: 4400, rutaImagen: "01.jpg", autor: "Nach", sinopsis: "El primer libro de poesía del artista de hip-hopNach." },
    { id: 5, titulo: "Mujeres", categoria: "NOVELA", precio: 7000, rutaImagen: "01.jpg", autor: "John Updike", sinopsis: "Una novela que funciona como resumen de la literatura de Updike y de sus temas: la sensualidad, el repaso de la vida a través de los cuerpos amados y deseados y el sexo como trascendencia." },
    { id: 6, titulo: "Las reglas del destino", categoria: "NOVELA", precio: 6600, rutaImagen: "01.jpg", autor: "Jazmín Riera", sinopsis: "Esta vez, el destino dicta las reglas." },
    { id: 7, titulo: "Cuatro comidas", categoria: "COCINA", precio: 13000, rutaImagen: "01.jpg", autor: "	Nicolás Artusi", sinopsis: " Empachado de anécdotas y repleto de eurekas, escribo esto bajo una montaña de papeles, libros y enciclopedias que se funden con mis recuerdos lejanos de la infancia, el desayuno de la vida, o con los más cercanos de este almuerzo todavía ...." },
    { id: 8, titulo: "Recetas de carne", categoria: "COCINA", precio: 10400, rutaImagen: "01.jpg", autor: "Pietro Sorba", sinopsis: "¿Por qué no probar más cortes? ¿Por qué no probar nuestras carnes en recetas consolidadas expresadas por otros países del mundo? ¿Por qué no abrir el juego a recetas más creativas? ¿Por qué no inspirarnos en quienes..." },
    { id: 9, titulo: "El libro de la selva", categoria: "INFANTILES", precio: 4000, rutaImagen: "01.jpg", autor: "Rudyard Kipling", sinopsis: "Yo nací en la Selva. He obedecido la Leyde la Selva, y no hay ni uno de nuestroslobos al que no haya quitado una espinade las patas. ¿Cómo no van a ser mishermanos?..." },
    { id: 10, titulo: "Una historia de peluche", categoria: "INFANTILES", precio: 3290, rutaImagen: "01.jpg", autor: "Sara Bertrand", sinopsis: "Una historia llena de ternura 'ilustrada por el premiado Rafael Yockteng' en la que descubriremos que cada uno tiene sus formas y que es importante no olvidarlo." },
    { id: 11, titulo: "Cincuentena", categoria: "POESÍA", precio: 3200, rutaImagen: "01.jpg", autor: "Tomas wsher", sinopsis: "Con el festivo pretexto de celebrar sus cincuenta años, García Montero ha seleccionado, entre su producción poética, los cincuenta poemas que integran este volumen." },
    { id: 12, titulo: "Hambriento", categoria: "POESÍA", precio: 4400, rutaImagen: "01.jpg", autor: "Nach", sinopsis: "El primer libro de poesía del artista de hip-hopNach." }
]

const contenedor = document.getElementById("productos")
const buscador = document.getElementById("buscador")

let carritoJSON = JSON.parse(localStorage.getItem("carrito"))
let carrito = carritoJSON ? carritoJSON : []

crearTarjetas(productos, contenedor)
actualizarInterfazCarrito()

//parar que en el buscardor se filtre por nombre del libro
buscador.addEventListener("input", filtrar)

//crear tarjeta
function crearTarjetas(array, contenedor) {
    contenedor.innerHTML= " "
    array.forEach(elemento => {
        const mensaje = "Sinopsis: " + elemento.sinopsis
        const producto = document.createElement("div")
        producto.className = "tarjetaProducto"

        producto.innerHTML= `
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
              <button class="boton-comprar" data-id="${elemento.id}">Comprar</button>
            </div>
          </div>
        </div>`

        contenedor.appendChild(producto)
    })

    // Agregar eventos a los botones de comprar
    const botonesComprar = document.querySelectorAll(".boton-comprar")
    botonesComprar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}
//filtrar
function filtrar() {
    const textoBusqueda = buscador.value.toLowerCase()
    const arrayFiltrado = productos.filter(
        producto => producto.titulo.toLowerCase().includes(textoBusqueda)
    )
    crearTarjetas(arrayFiltrado, contenedor)
}

//CARRITO
//agregar al carrito
function agregarAlCarrito(event) {
    const libroId = event.target.dataset.id
    const libro = obtenerLibroPorId(libroId)

    !libro ? (alert("El libro seleccionado no existe.")) : null

    const libroEnCarrito = carrito.find(item => item.id === libro.id)

    libroEnCarrito ? (alert("El libro ya está en el carrito. Agregamos otro unidad")) : null

    carrito.push(libro)
    actualizarInterfazCarrito()

    //para guardar los productos y los muestre
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

//filtrar por ID
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

//actualizar carrito 
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

        totalPrecio += producto.precio

        libroElemento.appendChild(tituloElemento)
        libroElemento.appendChild(autorElemento)
        libroElemento.appendChild(precioElemento)

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
//eliminar del carrito
function eliminarDelCarrito(event) {
    const productoId = event.target.dataset.id
    const productoIndex = carrito.findIndex((producto) => producto.id === parseInt(productoId))

    productoIndex > -1 && (carrito.splice(productoIndex, 1), actualizarInterfazCarrito(), localStorage.setItem("carrito", JSON.stringify(carrito)))
}

/* --------------------------------------- */

//botonees
const botonConfirmar = document.getElementById("boton-confirmar")
const botonVolverComprar = document.getElementById("volverComprar")

botonConfirmar.addEventListener("click", confirmarCompra)
botonVolverComprar.addEventListener("click", volverAComprar)

//confirmar la compra
function confirmarCompra() {
    let totalGastado = 0
    carrito.forEach(producto => {
        totalGastado += producto.precio
    })
    //para guardar el totalGastado
    localStorage.setItem("totalGastado", totalGastado)

    const totalGastadoElemento = document.getElementById("total-gastado")
    totalGastadoElemento.textContent = "Total Gastado: $" + totalGastado

    carrito.length = 0
    actualizarInterfazCarrito()
    //Oculta el botón "Confirmar compra" 
    botonConfirmar.style.display = "none"
    //Muestra el botón "Volver a comprar"
    botonVolverComprar.style.display = "block"
}

function volverAComprar() {
    //elimina el carrito del almacenamiento local
    localStorage.removeItem("carrito")
    //vacía el array de productos 
    carrito = []
    //actualiza la interfaz del carrito para reflejar los cambios
    actualizarInterfazCarrito()
    // Redirige al usuario a la página de inicio
    window.location.href = ""
}

//recupero el valor
//let totalGastado = localStorage.getItem("totalGastado")

//borrar el valor cuando se actualice la pagina al tocar el boton "volver a comprar"
localStorage.removeItem("totalGastado")

