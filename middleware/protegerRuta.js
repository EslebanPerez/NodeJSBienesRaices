import jwt  from "jsonwebtoken";
import {Usuario} from '../models/index.js'
const protegerRuta = async (req, res, next) => {
    console.log("Desde el middleware");
    // Verificar si hay un token 
    const {_token} = req.cookies;
    if(!_token){
        return res.redirect('/auth/login');
    }

    // Comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.findByPk(decoded.id)     
        console.log(usuario);
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }

    next();
}

export default protegerRuta;