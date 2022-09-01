import {check, validationResult} from "express-validator"
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
    await check ("username").notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check ("email").isEmail().withMessage('Eso no parece un email').run(req);
    await check ("password").isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req);
    await check ("repetirPassword").equals("password").withMessage('Las contraseñas no coinciden').run(req);
    let resultado = validationResult(req);

    res.json(resultado.array());

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