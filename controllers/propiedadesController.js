import { validationResult } from "express-validator";
import Precio from "../models/Precio.js";
import Categoria from "../models/Categoria.js";

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
}

export { admin, crear, guardar };
