(function(){
  const lat = 20.67444163271174;
  const lng = -103.38739216304566;
  const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

  let markers = new L.FeatureGroup().addTo(mapa)

  let propiedades = [];

  // Filtros
  const filtros = {
    categoria: '',
    precio: ''
  }

  const categoriasSelect = document.querySelector('#categorias')
  const preciosSelect = document.querySelector('#precios')

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  // Filtrado de categorías y precios
  categoriasSelect.addEventListener('change', e => {
    console.log(+e.target.value);
    filtros.categoria = +e.target.value;
    filtrarPropiedades();
  })
  
  preciosSelect.addEventListener('change', e => {
    console.log(+e.target.value);
    filtros.precio = +e.target.value
    filtrarPropiedades();
  })


  const obtenerPropiedades = async () => {
    try {
      const url = '/api/propiedades';
      const respuesta = await fetch(url);
       propiedades = await respuesta.json();

      mostrarPropiedades(propiedades);

    } catch (error) {
      console.log(error);
    }
  }

  const mostrarPropiedades = propiedades => {
    //console.log(propiedades);

    propiedades.forEach(propiedad => {
      // Agregando todos los pines
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true
      }).addTo(mapa)
      .bindPopup(`
        <p class="text-lime-600 font-bold ">${propiedad.categoria.nombre}</p>
        <h1 class="text-xl font-extrabold uppercase my-4">${propiedad.titulo}</h1>
        <img src='uploads/${propiedad.image}' alt='${propiedad.titulo}'>
        <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
        <a href="/propiedad/${propiedad.id}" class=" bg-lime-400 block p-2 text-center font-bold uppercase text-white">Ver propiedad</a>
      `)

      markers.addLayer(marker)
    });
  }

  const filtrarPropiedades=()=>{
    const resultado = propiedades.filter(filtrarCategoria  )
    console.log(resultado);
  }

  const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad

  obtenerPropiedades()

}
)()