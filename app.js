

//MOSTRAR LOS LIBROS EN EL DOM
const mnostrarDom = (data) => {
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
          <button type="button" class="btn btn-primary agregar" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      </div>  
    `
    DivProd.innerHTML = cartaprod
    contenedorProductos.appendChild(DivProd)
  })

  document.querySelector(".agregar").forEach((btn) => {
    btn.addEventListener("click", agregarAlCarrito)

  })


}

//AGREGAR AL CARRITO

const agregarAlCarrito = () =>{
  
}




//FETCH DE LOS DATOS DEL .JSON
const getData = async () => {
  let data = await fetch("./prods.json")
  .then((res) => res.json())
  .then((json) => {return json})

  mnostrarDom(data)
}

getData()