let productos =[]
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
let total = parseFloat(localStorage.getItem("total")) || 0


//MOSTRAR LOS LIBROS EN EL DOM
const mostrarDom = (data) => {
  const contenedorProductos = document.querySelector(".prods-js")
  contenedorProductos.innerHTML = ""

  data.forEach((producto) => { 
    const DivProd = document.createElement("div")
    DivProd.classList.add("producto")

    const img = `libro${producto.id}.jpeg`

    const cartaprod =`
      <div class="card-bg card h-100 d-flex flex-column" style="width: 18rem;">
        <img src="img/${img}" class="card-img-top" alt="imagen del libro ${producto.id}">
        <div class="card-body">
          <h5 class="card-title">${producto.titulo}</h5>
          <p class="card-text">${producto.desc}</p>
          <p class="precio"><b>Precio:</b> $${producto.precio}</p>
          <button type="button" class="agregar btn btn-primary  " data-id="${producto.id}">Agregar al carrito</button>
        </div>
      </div>  
    `
    DivProd.innerHTML = cartaprod
    contenedorProductos.appendChild(DivProd)
  })

  document.querySelectorAll(".agregar").forEach((btn) => {
    btn.addEventListener("click", agregarAlCarrito);
  })


}

//AGREGAR AL CARRITO

const agregarAlCarrito = (eventCarrito) => {
  const idLibro = parseInt(eventCarrito.target.dataset.id)
  const libro = productos.find((l) => l.id === idLibro)

  if (libro) {
    Swal.fire({
      title: `¿Cuántas unidades de "${libro.titulo}" deseas agregar?`,
      icon: "question",
      input: "range",
      inputLabel: "Cantidad",
      inputAttributes: {
        min: "1",
        max: "10", 
        step: "1"
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Agregar al carrito",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const cantidad = parseInt(result.value)

        if (cantidad > 0) {
          const index = carrito.findIndex((item) => item.id === libro.id)
        
          if (index !== -1) {
            
            carrito[index].cantidad += cantidad
            carrito[index].precioCantidad = carrito[index].cantidad * libro.precio
          } else {
           
            carrito.push({ ...libro, cantidad, precioCantidad: libro.precio * cantidad })
          }
      
          total = carrito.reduce((acc, item) => acc + item.precioCantidad, 0)
        
          localStorage.setItem("carrito", JSON.stringify(carrito))
          localStorage.setItem("total", total)
        
          Swal.fire(`Se agregaron ${cantidad} unidades del libro: ${libro.titulo}`)
        }
      }
    })
  }
}




//--------------------------------------MOSTRAR CARRITO 
const mostrarCarrito = () =>{
  const contenedorCarrito = document.querySelector(".modal-carro")
  contenedorCarrito.innerHTML = ""
  
  //HEADER DEL MODAL
  const header = document.createElement("div")
  header.classList.add("header-modal")
  header.innerHTML = `
    <h2>Libros</h2>
    <div class="d-flex justify-content-between fw-bold border-bottom pb-2 mb-2">
      <span>Título</span>
      <span>Cantidad</span>
      <span>Precio</span>
      <span>Acciones</span>

    </div>
  `
  contenedorCarrito.appendChild(header)

  //LIBROS DEL CARRITO
  carrito.forEach((lib) =>{
    const divLibro = document.createElement("div")
    divLibro.classList.add("libro-carrito")
    const carritoLibro = `
      <div class="d-flex justify-content-between mb-2">
        <h5 class="card-title">${lib.titulo}</h5>
        <span class="precio">${lib.cantidad}</span>
        <span class="precio">${lib.precioCantidad}</span>
        <button type="button" class="borrar-libro btn btn-outline-danger" data-id="${lib.id}">X</button>
      </div>  
    `

    divLibro.innerHTML = carritoLibro
    contenedorCarrito.appendChild(divLibro)
  })


  //TOTAL DEL CARRITO
  const totalFinal = document.querySelector(".total")
  totalFinal.classList.add("texto-total")
  totalFinal.innerHTML = `Total ${total}`

  //BOTON DE BORRAR PRODUCTO DEL CARRITO
  document.querySelectorAll(".borrar-libro").forEach((btn) => {
    btn.addEventListener("click", borrarLibro);
  });
}

//BORRAR LIBRO DEL CARRITO
const borrarLibro = (eventBorrar) => {
  
  const idBorrar = parseInt(eventBorrar.target.dataset.id)
  const index = carrito.findIndex((lib) => lib.id === idBorrar )

  if(index !== -1){
    carrito.splice(index,1)
    total = carrito.reduce((acc, item) => acc + item.precioCantidad, 0)
    mostrarCarrito()
    localStorage.setItem("carrito", JSON.stringify(carrito))
    localStorage.setItem("total", total)
  } 
}

//VACIAR CARRITO
const vaciar = () => {
  carrito = []
  total = 0
  mostrarCarrito()
  localStorage.removeItem("carrito")
  localStorage.removeItem("total")

  
}
//BOTON DE VACIAR CARRITO
let vaciarCarro = document.querySelector(".vaciar")
vaciarCarro.addEventListener("click",vaciar)

//CONFIRMAR COMPRA
const mostrarFormularioCompra = () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Tu carrito aun esta vacio, agrega productos",
      
    });
    
    return
  }

  const contenedorConfirmacion = document.querySelector(".confirmar-body")
  contenedorConfirmacion.innerHTML = ""

  const totalLibros = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precioCantidad, 0)

  const resumen = document.createElement("div")
  resumen.classList.add("mb-4")
  resumen.innerHTML = `
    <h5>Resumen de tu compra</h5>
    <p>Total de libros: <strong>${totalLibros}</strong></p>
    <p>Total a pagar: <strong>$${totalPrecio}</strong></p>
  `
  contenedorConfirmacion.appendChild(resumen)

  const form = document.createElement("form")
  form.innerHTML = `
    <div class="mb-3">
      <label for="nombre" class="form-label">Nombre completo</label>
      <input type="text" class="form-control" id="nombre" required>
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Correo electrónico</label>
      <input type="email" class="form-control" id="email" required>
    </div>
    <div class="mb-3">
      <label for="direccion" class="form-label">Dirección de envío</label>
      <input type="text" class="form-control" id="direccion" required>
    </div>
  `
  contenedorConfirmacion.appendChild(form)

  const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'))
  modalCompra.show()
}


//FINALIZAR LA COMPRA
const finalizarCompra = () => {
  
  const nombre = document.getElementById("nombre").value.trim()
  const email = document.getElementById("email").value.trim()
  const direccion = document.getElementById("direccion").value.trim()

  if (!nombre || !email || !direccion) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos antes de finalizar la compra.",
    })
    return; 
  }
  


  vaciar()
  const modalCompra = bootstrap.Modal.getInstance(document.getElementById('modalCompra'))
  if (modalCompra) {
    modalCompra.hide();
  }

  Swal.fire({
    title: "Muchas Gracias por su compra!",
    icon: "success",
    draggable: true
  })
  
}



//BOTON DE FINALIZAR LA COMPRA
let botonFinalizarCompra = document.querySelector(".fin-compra")
botonFinalizarCompra.addEventListener("click", finalizarCompra)

//BOTON DE CONFIRMAR COMPRA
let botonContinuar = document.querySelector(".continuar")
botonContinuar.addEventListener("click", mostrarFormularioCompra)

//BOTON DE ABRIR MODAL DEL CARRITO
let botonCarrito = document.querySelector(".ver-carro")
botonCarrito.addEventListener("click",mostrarCarrito)



//FETCH DE LOS DATOS DEL .JSON
const getData = async () => {
  try {
    let data = await fetch("./prods.json")
    data = await data.json()
    productos = data
    mostrarDom(data)
  } catch (error) {
    console.error("Ocurrió un error al obtener los datos:", error)
    
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ocurrio un error al cargar los productos, intenta nuevamente"
      
    })
    
  }
}

getData()