import { validationResult } from "express-validator";
import {Precio, Categoria, Propiedad} from '../models/index.js'
const admin = (req, res) => {
  res.render("propiedades/admin", {
    title: 'Mis propiedades',
    barra: true
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
    barra: true,
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
    barra: true,
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

export { admin, crear, guardar };
