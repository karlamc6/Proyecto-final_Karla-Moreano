function principal() {
    let productos = [
        { id: 1, pelicula: "Manhattan", sala: "1", costo: "3400", funcion: "21:10 horas", genero: "Drama", rutaImagen: "manhattan.jpg" },
        { id: 2, pelicula: "Maridos y Mujeres", sala: "3", costo: "4000", funcion: "20:00 horas", genero: "Drama", rutaImagen: "maridosMujeres.jpg" },
        { id: 3, pelicula: "La Rosa Purpura del Cairo", sala: "5", costo: "3400", funcion: "20:15 horas", genero: "Ficcion", rutaImagen: "rosaPurpura.jpg" },
        { id: 4, pelicula: "Annie Hall ", sala: "9", costo: "4000", funcion: "18:20 horas", genero: "Comedia", rutaImagen: "annieHall.jpg" },
        { id: 5, pelicula: "Bananas", sala: "2", costo: "3400", funcion: "17.00 horas", genero: "Comedia", rutaImagen: "bananas.png" },
        { id: 6, pelicula: "Scoop", sala: "4", costo: "3400", funcion: "19:50 horas", genero: "Drama", rutaImagen: "scoop.png" },
        { id: 7, pelicula: "Poderosa Afrodita", sala: "7", costo: "4000", funcion: "20.30 horas", genero: "Comedia", rutaImagen: "poderosaAfrodita.jpg" },
        { id: 8, pelicula: "La Tapadera", sala: "6", costo: "4500", funcion: "21:30 horas", genero: "Drama", rutaImagen: "laTapadera.jpg" },
        { id: 9, pelicula: "Desmontando a Harry", sala: "8", costo: "4500", funcion: "20.40 horas", genero: "Comedia", rutaImagen: "desmontandoaHarry.jpg" },
        { id: 10, pelicula: "La Zarpa", sala: "10", costo: "4000", funcion: "21.50 horas", genero: "Terror", rutaImagen: "laZarpa.jpg" },
    ]
    
    let carrito = recuperarCarritoDelStorage("carrito")
    renderizarCarrito[carrito]

    crearTarjetasProductos(productos)

    let inputBuscar = document.getElementById("inputBuscar")
    inputBuscar.addEventListener("keyup", (e) => filtrarYrenderizar(e, productos))

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarYrenderizarConBoton(inputBuscar, productos))

    let filtroGeneros = document.getElementById("filtroGeneros")
    filtroGeneros.addEventListener("change", (e) => filtrarPorGenero(e, productos))

    let botonProductosCarrito = document.getElementById("productosCarrito")
    botonProductosCarrito.addEventListener("click", verOcultarCarrito)

    let botonesAgregarProductos = document.getElementsByClassName("botonAgregarAlCarrito")
    for (const boton of botonesAgregarProductos) {
        boton.addEventListener("click", (e) => agregarProductoAlCarrito(e, productos))
    }

    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", finalizarCompra)
}

principal()

function filtrarPorGenero(e, productos) {
    const genero = e.target.value
    const productosFiltrados = productos.filter(producto => producto.genero.includes(genero))
    crearTarjetasProductos(productosFiltrados)
}

function calcularTotal(productos) {
    return productos.reduce((acum, producto) => acum + producto.subtotal, 0)
}

function actualizarTotal(total) {
    let elementoTotal = document.getElementById("total")
    elementoTotal.innerText = "$" + total
}

function finalizarCompra() {
    renderizarCarrito([])
    localStorage.removeItem("carrito")

    Swal.fire("Tu compra ha sido procesada, te esperamos!");
}

function filtrarYrenderizarConBoton(input, productos) {
    let productosFiltrados = filtrar(input.value, productos)
    crearTarjetasProductos(productosFiltrados)
}

function filtrarYrenderizar(e, productos) {
    e.target.value === "" && crearTarjetasProductos(productos)
}

function filtrar(valor, productos) {
    return productos.filter(({ pelicula, categoria }) => pelicula.includes(valor) || categoria.includes(valor))
}

function verOcultarCarrito(e) {
    let carrito = document.getElementById("pantallaCarrito")
    let contenedorProductos = document.getElementById("pantallaProductos")

    carrito.classList.toggle("oculta")
    contenedorProductos.classList.toggle("oculta")

    e.target.innerText = e.target.innerText === "Carrito" ? "Productos" : "Carrito"
}

function crearTarjetasProductos(productos) {
    let contenedor = document.getElementById("contenedorProductos")
    contenedor.innerHTML = ""
    productos.forEach(({ rutaImagen, pelicula, sala, genero, id, costo }) => {
        //Creando elementos con append
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "producto"
        tarjetaProducto.innerHTML = `
            <img src=./images/${rutaImagen} />
            <h3>${pelicula}</h3>
            <p>Sala : ${sala}</p>
            <p>$${costo}</p>
            <p>Genero : ${genero}</p>
            <button class=botonAgregarAlCarrito id=agc${id}>Comprar ahora</button>
        `
        contenedor.appendChild(tarjetaProducto)
    })
}


function agregarProductoAlCarrito(event, productos) {
    let carrito = [ ]
    carrito = recuperarCarritoDelStorage()
    let idProducto = Number(event.target.id.substring(3))
    console.log(idProducto) 
    let productoOriginal = productos.find(({ id }) => id === idProducto)
    let { id, costo, pelicula, sala, genero, funcion } = productoOriginal
    let indiceProductoEnCarrito = carrito.findIndex(({ id }) => id === idProducto)
    if (indiceProductoEnCarrito === -1) {
        carrito.push({
            id,
            pelicula,
            sala,
            funcion,
            genero,
            precioUnitario: costo,
            unidades: 1,
            subtotal: costo,
        })
    } else {
        carrito[indiceProductoEnCarrito].unidades++
        carrito[indiceProductoEnCarrito].subtotal = carrito[indiceProductoEnCarrito].precioUnitario * carrito[indiceProductoEnCarrito].unidades
    }

    guardarEnStorage(carrito)
    renderizarCarrito(carrito)
    
    Toastify({
        text: "Funcion agregada",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #C0A787, #000000)",
        },
       
      }).showToast();
}


function renderizarCarrito(carrito) {
    let contenedorCarrito = document.getElementById("carrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(({ id, pelicula, precioUnitario, unidades, subtotal }) => {
        let tarjetaCarrito = document.createElement("div")
        tarjetaCarrito.className = "tarjetaCarrito"
        tarjetaCarrito.id = "tca" + id

        tarjetaCarrito.innerHTML = `
            <p>${pelicula}</p>
            <p>${precioUnitario}</p>
            <div class=unidades>
                <button id=run${id}>-</button>
                <p>${unidades}</p>
                <button id=sun${id}>+</button>
            </div>
            <p>${subtotal}</p>
            <button id=eli${id}>Eliminar entrada</button>
        `
        contenedorCarrito.appendChild(tarjetaCarrito)
        let botonEliminar = document.getElementById("eli" + id)
        botonEliminar.addEventListener("click", eliminarProductoDelCarrito)

        let botonRestarUnidad = document.getElementById("run" + id)
        botonRestarUnidad.addEventListener("click", restarUnidadProdCarrito)

        let botonSumarUnidad = document.getElementById("sun" + id)
        botonSumarUnidad.addEventListener("click", sumarUnidadProdCarrito)
    })

    let total = calcularTotal(carrito)
    actualizarTotal(total)
}

function sumarUnidadProdCarrito(e) {
    let id = Number(e.target.id.substring(3))
    let carrito = recuperarCarritoDelStorage()
    let indiceProducto = carrito.findIndex(producto => producto.id === id)

    if (indiceProducto !== -1) {
        carrito[indiceProducto].unidades++
        carrito[indiceProducto].subtotal = carrito[indiceProducto].precioUnitario * carrito[indiceProducto].unidades
        guardarEnStorage(carrito)

        console.dir(e.target)
        e.target.previousElementSibling.innerText =  carrito[indiceProducto].unidades 
        e.target.parentElement.nextElementSibling.innerText = carrito[indiceProducto].subtotal
    }

    const total = calcularTotal(carrito)
    actualizarTotal(total)
    /* console.log(carrito[indiceProducto].unidades)
    console.log(carrito[indiceProducto].subtotal) */
    

    /* renderizarCarrito(carrito) */   
}


function restarUnidadProdCarrito(e) {
    let id = Number(e.target.id.substring(3))
    let carrito = recuperarCarritoDelStorage()
    let indiceProducto = carrito.findIndex(producto => producto.id === id)

    if (indiceProducto !== -1) {
        carrito[indiceProducto].unidades--
        if (carrito[indiceProducto].unidades === 0) {
            carrito.splice(indiceProducto, 1)
            e.target.parentElement.parentElement.remove()
        } else{
            carrito[indiceProducto].subtotal = carrito[indiceProducto].precioUnitario * carrito[indiceProducto].unidades
            console.dir(e.target)
            e.target.nextElementSibling.innerText =  carrito[indiceProducto].unidades
            e.target.parentElement.nextElementSibling.innerText = carrito[indiceProducto].subtotal
        }
        guardarEnStorage(carrito)
    }

    const total = calcularTotal(carrito)
    actualizarTotal(total)
    /* console.log(carrito[indiceProducto].unidades)
    console.log(carrito[indiceProducto].subtotal) */
    

    /* renderizarCarrito(carrito) */   
}

function eliminarProductoDelCarrito(e) {
    let id = Number(e.target.id.substring(3))
    let carrito = recuperarCarritoDelStorage()
    let indiceProducto = carrito.findIndex(producto => producto.id === id)
    if (indiceProducto !== -1) {
        carrito.splice(indiceProducto, 1)
        /* let tarjetaCarrito = document.getElementById("tca" + id)
        tarjetaCarrito.remove() */
        e.target.parentElement.remove() //forma mas optima y complexxx
    }

    guardarEnStorage(carrito)
    /* renderizarCarrito(carrito) */ //la forma mas rapida y menos eficaz para poder eliminar el producto
    const total = calcularTotal(carrito)
    actualizarTotal(total)
}

function guardarEnStorage(valor) {
    let valorJson = JSON.stringify(valor)
    localStorage.setItem("carrito", valorJson)
}

function recuperarCarritoDelStorage() {
    return JSON.parse(localStorage.getItem("carrito")) ?? []
}


Swal.fire({
    title: 'Bienvenido(a) a nuestra plataforma!',
    text: 'Adelante',
    icon: 'success',
    confirmButtonText: 'Entrar'
  })