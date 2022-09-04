import { request } from "express";
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
    await check ("repetirPassword").equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    let resultado = validationResult(req);

    console.log(resultado);
    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
            title : "Crear cuenta",
            errores: resultado.array(),
            usuario: {
                username: req.body.username,
                email: req.body.email
            }
        });
    }

    //Extraer los datos
    const { username, email, password } = req.body;
    // Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if (existeUsuario){
        return res.render('auth/registro',{
            title : "Crear cuenta",
            errores: [{msg: 'El email ya ha sido registrado'}],
            usuario: {
                username: req.body.username,
                email: req.body.email
            }
        });
    }
    //Almacenar usuario
    const usuario = await Usuario.create({
        username,
        email,
        password,
        token: 123456,
    });
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