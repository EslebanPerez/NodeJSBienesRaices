const admin = (req, res) => {
  res.render("propiedades/admin", {
    title: 'Mis propiedades'
  });
};

export { admin };
