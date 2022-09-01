const formularioLogin = ( req, res )=>{
    res.render('auth/login',{
        title : "Iniciar Sesión"
    });
}
const formularioRegistro = ( req, res )=>{
    res.render('auth/registro',{
        title : "Crear cuenta"
    });
}
const registrar = ( req, res )=>{
    console.log(req.body);
}
const forgotPassword = ( req, res )=>{
    res.render('auth/password',{
        title : "¿Olvidaste tu contraseña?"
    });
}

export { 
    formularioLogin, 
    formularioRegistro, 
    registrar,
    forgotPassword
}