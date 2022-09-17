const admin = (req, res) => {
  res.render("propiedades/admin", {
    title: 'Mis propiedades',
    barra: true
  });
};

export { admin };
