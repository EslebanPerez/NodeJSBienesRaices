import Precio from "../models/Precio";
import Categoria from "../models/Categoria";

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
    categorias,
    precios
  });
}

export { admin, crear };
