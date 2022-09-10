import { request } from "express";
import {check, validationResult} from "express-validator"
import Usuario from "../models/Usuario.js";
import { generarID } from "../helpers/tokens.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js" 

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
        token: generarID(),
    });

    // Envia email de confirmación
    emailRegistro({
        username: usuario.username,
        email: usuario.email,
        token: usuario.token
    })

    //res.json({msg : 'Usuario creado'});
    // Mostrar mensaje de confirmación
    res.render('templates/mensaje',{
        title: 'Cuenta creada correctamente',
        mensaje: 'Revisa tu correo para confirmar tu cuenta 😉'
    })

}

//Función que comprueba una cu enta
const confirmar = async (req, res) => {
    const { token } = req.params;
    //console.log( token );
    //Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token}});
    if(!usuario){
        return res.render('auth/confirmarCuenta',{
            title: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }
    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    console.log(usuario);
    await usuario.save();

    return res.render('auth/confirmarCuenta',{
        title: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmó correctamente'
    })
    
}

const forgotPassword = ( req, res )=>{
    res.render('auth/forgot-password',{
        title : "¿Olvidaste tu contraseña?"
    });
}

const resetPassword = async (req, res) =>{
    await check ("email").isEmail().withMessage('Eso no parece un email').run(req);
    let resultado = validationResult(req);

    //console.log(resultado);
    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/forgot-password',{
            title : "¿Olvidaste tu contraseña?",
            errores: resultado.array()
        });
    }

    //Buscar el usuario
    const { email } = req.body;
    const usuario = await Usuario.findOne({where : {email} });
    if(!usuario){
        return res.render('auth/forgot-password',{
            title : "¿Olvidaste tu contraseña?",
            errores: [{ msg: "El email no pertecenece a ningún usuario" }]
        });
    }

    // Generar un token y enviar al usuario email
    usuario.token = generarID()
    await usuario.save()
    // Enviar email
    emailOlvidePassword({
        email: usuario.email,
        username: usuario.username,
        token: usuario.token
    }) 

    // Renderizar 
    res.render('templates/mensaje', {
        title: 'Restablecer contraseña',
        mensaje: 'Se ha enviado un email con las instrucciones'
    })
}
const comprobarToken = async (req, res) =>{
    const { token } = req.params;
    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario){
        return res.render('auth/confirmarCuenta',{
            title: 'Reestablece tu contraseña',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        })
    }
    console.log(usuario);
}
const nuevoPassword = (req, res) =>{

}

export { 
    formularioLogin, 
    formularioRegistro, 
    registrar,
    confirmar,
    forgotPassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}