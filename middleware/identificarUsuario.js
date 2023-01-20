import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const identificarUsuario = async (req, res, next) => {
  // Identificar si hay token
  const token = req.cookies._token;
  if(!token){
    req.usuario = null;
    return next();
  }

  // Comprobar el token
}

export default identificarUsuario;