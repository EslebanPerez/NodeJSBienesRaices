import { validationResult } from "express-validator";
import {Precio, Categoria, Propiedad} from '../models/index.js'
const admin = async (req, res) => {
  const { id } = req.usuario
  console.log(id);
  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id
    },
    include: [{ model: Categoria, as: 'categoria' }, { model: Precio, as: 'precio'}]
  })
  res.render("propiedades/admin", {
    title: 'Mis propiedades',
    propiedades,
    csrfToken: req.csrfToken(),
  });
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
  console.log("Eliminando");
}

export { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar };
