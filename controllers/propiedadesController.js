const admin = (req, res) => {
  res.render("propiedades/admin", {
    title: 'Mis propiedades',
    barra: true
  });
};

// Formulario para crear una nueva propiedad
const crear = (req, res) => {
  res.render("propiedades/crear", {
    title: 'Crear nueva propiedad',
    barra: true
  });
}

export { admin, crear };
