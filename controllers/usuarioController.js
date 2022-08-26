const formularioLogin = ( req, res )=>{
    res.render('auth/login',{
        title : "Ingresar"
    });
}
const formularioRegistro = ( req, res )=>{
    res.render('auth/registro',{
        title : "Crear cuenta"
    });
}

export { 
    formularioLogin, 
    formularioRegistro 
}