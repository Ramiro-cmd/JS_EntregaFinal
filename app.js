let productos =[]
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
let total = 0


//MOSTRAR LOS LIBROS EN EL DOM
const mostrarDom = (data) => {
  const contenedorProductos = document.querySelector(".prods-js")
  contenedorProductos.innerHTML = ""

  data.forEach((producto) => { 
    const DivProd = document.createElement("div")
    DivProd.classList.add("producto")

    const img = `libro${producto.id}.jpeg`;

    const cartaprod =`
      <div class="card" style="width: 18rem;">
        <img src="img/${img}" class="card-img-top" alt="imagen del libro ${producto.id}">
        <div class="card-body">
          <h5 class="card-title">${producto.titulo}</h5>
          <p class="card-text">${producto.desc}</p>
          <p class="precio">${producto.precio}</p>
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

const agregarAlCarrito = (eventCarrito) =>{
  const idLibro = parseInt(eventCarrito.target.dataset.id)
  const libro = productos.find((l) => l.id === idLibro)

  if(libro){
    let cantidad = parseInt(prompt(`¿Cuántas unidades de ${libro.titulo} deseas agregar?`))
    if(cantidad > 0){
      let precioCantidad = libro.precio * cantidad
      carrito.push( {...libro, cantidad, precioCantidad})
      total = precioCantidad + total 
      alert(`Agregaste ${cantidad} unidad(es) al carrito`)
    }else{
      alert("cantidad incorrecta")
    }
  }
}




//MOSTRAR CARRITO 
const mostrarCarrito = () =>{
  const contenedorCarrito = document.querySelector(".modal-body")
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
        <p class="precio">${lib.cantidad}</p>
        <p class="precio">${lib.precioCantidad}</p>
        <button type="button" class="btn btn-outline-danger">X</button>
      </div>  
    `

    divLibro.innerHTML = carritoLibro
    contenedorCarrito.appendChild(divLibro)
  })

  //FOOTER DEL MODAL
  const totalFinal = document.querySelector(".total")
  totalFinal.classList.add("texto-total")
  totalFinal.innerHTML = `Total ${total}`

}

let botonCarrito = document.querySelector(".ver-carro")
botonCarrito.addEventListener("click",mostrarCarrito)



//FETCH DE LOS DATOS DEL .JSON
const getData = async () => {
  let data = await fetch("./prods.json")
  .then((res) => res.json())
  .then((json) => {return json})
  productos = data
  mostrarDom(data)
}

getData()