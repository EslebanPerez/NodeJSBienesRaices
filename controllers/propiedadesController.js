import { validationResult } from "express-validator";
import {Precio, Categoria, Propiedad} from '../models/index.js'
const admin = (req, res) => {
  res.render("propiedades/admin", {
    title: 'Mis propiedades'
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

export { admin, crear, guardar, agregarImagen };
