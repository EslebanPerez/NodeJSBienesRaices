import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarJWT, generarID } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    title: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async(req, res, ) =>{
  await check("email").isEmail().withMessage("El correo es obligatorio").run(req);
  await check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado este vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      title: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  // Comprobar si el usuario existe
  const {email, password } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({where: {email}});

  if(!usuario){
    return res.render("auth/login", {
      title: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      usuario: {
        email: req.body.email,
      },
      errores: [{msg:"El usuario no existe"}],
    });
  }

  // Comprobar si el usuario esta confirmado
  if(!usuario.confirmado){
    return res.render("auth/login", {
      title: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{msg:"No has confirmado tu cuenta"}],
    });
  }

  // Revisar contraseña
  if(!usuario.verificarPassword(password)){
    return res.render("auth/login", {
      title: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      usuario: {
        email: req.body.email,
      },
      errores: [{msg:"La contraseña es incorrecta"}],
    });
  }

  // Autentificando al usuario
  const token = generarJWT({ usuarioID:usuario.id, usuarioNombre:usuario.username});
  console.log(token);

  // ALmacenar Token en un cookie
  return res.cookie('_token', token, {
    httpOnly: true
    //secure : true,
    //sameSite: true
  }).redirect('/mis-propiedades')

};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    title: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  await check("username")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe ser de al menos 6 caracteres")
    .run(req);
  await check("repetirPassword")
    .equals(req.body.password)
    .withMessage("Las contraseñas no coinciden")
    .run(req);
  let resultado = validationResult(req);

  // Verificar que el resultado este vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      title: "Crear cuenta",
      errores: resultado.array(),
      usuario: {
        username: req.body.username,
        email: req.body.email,
      },
    });
  }

  // Extraer los datos
  const { username, email, password } = req.body;

  // Verificar que el usuario no este duplicado
  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.render("auth/registro", {
      title: "Crear cuenta",
      errores: [{ msg: "El email ya ha sido registrado" }],
      csrfToken: req.csrfToken(),
      usuario: {
        username: req.body.username,
        email: req.body.email,
      },
    });
  }

  //Almacenar usuario
  const usuario = await Usuario.create({
    username,
    email,
    password,
    token: generarID(),
  });

  // Envía email de confirmación
  emailRegistro({
    username: usuario.username,
    email: usuario.email,
    token: usuario.token,
  });

  //res.json({msg : 'Usuario creado'});
  // Mostrar mensaje de confirmación
  res.render("templates/mensaje", {
    title: "Cuenta creada correctamente",
    mensaje: "Revisa tu correo para confirmar tu cuenta 😉",
  });
};

//Función que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;
  //console.log( token );
  //Verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmarCuenta", {
      title: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }

  // Confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  //console.log(usuario);
  await usuario.save();

  return res.render("auth/confirmarCuenta", {
    title: "Cuenta confirmada",
    mensaje: "La cuenta se confirmó correctamente",
  });
};

const forgotPassword = (req, res) => {
  res.render("auth/forgot-password", {
    title: "¿Olvidaste tu contraseña?",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);
  let resultado = validationResult(req);

  //console.log(resultado);
  
  // Verificar que el resultado este vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/forgot-password", {
      title: "¿Olvidaste tu contraseña?",
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
    });
  }

  //Buscar el usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/forgot-password", {
      title: "¿Olvidaste tu contraseña?",
      errores: [{ msg: "El email no pertenece a ningún usuario" }],
    });
  }

  // Generar un token y enviar al usuario email
  usuario.token = generarID();
  await usuario.save();
  // Enviar email
  emailOlvidePassword({
    email: usuario.email,
    username: usuario.username,
    token: usuario.token,
  });

  // Renderizar
  res.render("templates/mensaje", {
    title: "Restablecer contraseña",
    mensaje: "Se ha enviado un email para restablecer tu contraseña",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmarCuenta", {
      title: "Restablece tu contraseña",
      mensaje: "Hubo un error al validar tu información, intenta de nuevo",
      error: true,
    });
  }
  // Mostrar formulario para agregar nueva contraseña
  res.render("auth/reset-password", {
    title: "Restablece tu contraseña",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  //Validar password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe ser de al menos 6 caracteres")
    .run(req);
  
  //Verificar que el resultado no este vacío
  let resultado = validationResult(req);
  // Verificar que el resultado este vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/reset-password", {
      title: "Restablece contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        username: req.body.username,
        email: req.body.email,
      },
    });
  }

  const { token } = req.params;
  const { password } = req.body

  //Quien hace el cambio
  const usuario = await Usuario.findOne({ where:{token} })

  // Hashear contraseña
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash( password, salt); 
  usuario.token = null;
  await usuario.save();

  res.render('auth/confirmarCuenta',{
    title: 'Contraseña restablecida',
    mensaje: 'El password se ha guardado correctamente'
  })
};

export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  confirmar,
  forgotPassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
