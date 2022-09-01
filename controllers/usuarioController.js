import Usuario from "../models/Usuario.js";

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
const registrar = async ( req, res )=>{
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
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