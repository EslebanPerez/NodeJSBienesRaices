import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator";
import {Precio, Categoria, Propiedad, Mensaje} from '../models/index.js'
import { esVendedor } from '../helpers/index.js';
const admin = async (req, res) => {

  // Leer queryString
  const { pagina: paginaActual } = req.query;

  console.log(paginaActual);

  const expresion = /^[1-9]$/
  if(!expresion.test(paginaActual)){
    return res.redirect('/mis-propiedades?pagina=1')
  }

  try {
    const { id } = req.usuario
    // Limites y offset para el paginado
    const limit = 5;
    const offset = ((paginaActual * limit)-limit )

    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit,
        offset,
        where: {
          usuarioId: id
        },
        include: [{ model: Categoria, as: 'categoria' }, { model: Precio, as: 'precio'}]
      }),
      Propiedad.count({
        where:{
          usuarioId: id
        }
      })
    ])

    res.render("propiedades/admin", {
      title: 'Mis propiedades',
      propiedades,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total/limit),
      paginaActual: Number(paginaActual),
      total,
      offset, 
      limit
    });
  } catch (error) {
    console.log(error);
  }

};

// Formulario para crear una nueva propiedad
const crear = async(req, res) => {
  // Consultar modelo de Precios y Categorías
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render("propiedades/crear", {
    title: 'Crear nueva propiedad',
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
  });
}

const guardar = async(req, res) => {
  // Resultado de validación
  let resultado = validationResult(req);
  if(!resultado.isEmpty()){
    
    // Consultar modelo de Precios y Categorías
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
  ])

  return res.render("propiedades/crear", {
    title: 'Crear nueva propiedad',
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    errores: resultado.array(),
    datos: req.body
  });
  }
  // Crear un registro
  //console.log(req.body);
  const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio:precioId, categoria:categoriaId} = req.body

  const { id: usuarioId } = req.usuario;
  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
      usuarioId,
      image: ''
    })
    const {id} = propiedadGuardada;
    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
}

const agregarImagen= async (req, res) =>{

  const { id } = req.params;

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if(!propiedad){
    return res.redirect('/mis-propiedades');
  }

  // Validar que la propiedad no este publicada
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades');
  }

  // Validad que la propiedad pertenece a quien visita esta página
  //console.log(typeof req.usuario.id.toString() );
  //console.log(typeof propiedad.usuarioId.toString());
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
    return res.redirect("/mis-propiedades")
  }


  res.render('propiedades/agregar-imagen',{
    title: `Agregar Imagen ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  })
}

const almacenarImagen = async(req, res, next) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if(!propiedad){
    return res.redirect('/mis-propiedades');
  }

  // Validar que la propiedad no este publicada
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades');
  }

  // Validad que la propiedad pertenece a quien visita esta página
  //console.log(typeof req.usuario.id.toString() );
  //console.log(typeof propiedad.usuarioId.toString());
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
    return res.redirect("/mis-propiedades")
  }


  res.render('propiedades/agregar-imagen',{
    title: `Agregar Imagen ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  })
  try {
    console.log(req.file);

    // Almacenar la imagen y publicar propiedad
    propiedad.image = req.file.filename
    propiedad.publicado = 1

    await propiedad.save()
    next();
  } catch (error) {
    console.log(error);
  }
}

const editar = async(req, res, ) => {
  const { id } = req.params;
  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }
  // Revisar que quien visita la URL, es quien creo la propiedad
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
    return res.redirect('/mis-propiedades')
  }

   // Consultar modelo de Precios y Categorías
   const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render("propiedades/editar", {
    title: `Editar propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad
  });
}

const guardarCambios = async(req, res) => {
    // Resultado de validación
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
      
      // Consultar modelo de Precios y Categorías
      const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
  
    return res.render("propiedades/editar", {
      title: 'Editar propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    });
    }
 
  const { id } = req.params;
  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }
  // Revisar que quien visita la URL, es quien creo la propiedad
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
    return res.redirect('/mis-propiedades')
  }

   // Consultar modelo de Precios y Categorías
   const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  // Reescribir el objeto y actualizarlo
  try {
    const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio:precioId, categoria:categoriaId } = req.body
    propiedad.set({
      titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId, categoriaId
    })
    await propiedad.save()
    res.redirect('/mis-propiedades')
    console.log(propiedad);
  } catch (error) {
    console.log(error);
  }
}
const eliminar = async (req, res) => {
  const { id } = req.params
  
  // Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id);
  
  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }
  
  // Revisar que quien visita la URL, es quien creo la propiedad
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
    return res.redirect('/mis-propiedades')
  }
  
  // Eliminar la imagen de la propiedad
  await unlink(`public/uploads/${propiedad.image}`)
  console.log("Se elimino la imagen");

  // Eliminar la propiedad
  await propiedad.destroy();
  return res.redirect('/mis-propiedades')

}

// Mostrar una propiedad
const mostrarPropiedad = async (req, res)=>{
  const { id } = req.params 
  
  console.log(req.usuario);

  // Comprobar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [{ model: Categoria, as: 'categoria' }, { model: Precio, as: 'precio'}]
  })
  if(!propiedad){
    return res.redirect('/404')
  }
  res.render('propiedades/mostrar', {
    propiedad,
    title: propiedad.titulo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId )
  })
}

const enviarMensaje = async (req, res) =>{
  const { id } = req.params 

  // Comprobar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [{ model: Categoria, as: 'categoria' }, { model: Precio, as: 'precio'}]
  })
  if(!propiedad){
    return res.redirect('/404')
  }
  // Renderizar error
  // Resultado de validación
  let resultado = validationResult(req);
  if(!resultado.isEmpty()){
   return res.render('propiedades/mostrar', {
      propiedad,
      title: propiedad.titulo,
      csrfToken: req.csrfToken(),
      usuario: req.usuario,
      esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId ),
      errores: resultado.array()
    })
  }
  console.log(req.params)
  console.log(req.body)
  console.log(req.usuario)

  const {mensaje} = req.body
  const {id: propiedadId} = req.params
  const {id: usuarioId} = req.usuario

   await Mensaje.create({
    mensaje,
    propiedadId,
    usuarioId
   })
  res.redirect(`${process.env.BACKEND_URL}:${process.env.PORT}/propiedad/${propiedadId}`) 

  /*return res.render('propiedades/mostrar', {
    propiedad,
    title: propiedad.titulo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId ),
    enviado: true
  })*/
}

export { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad, enviarMensaje};
