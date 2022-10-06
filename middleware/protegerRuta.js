const protegerRuta = async (req, res, next) => {
    console.log("Desde el middleware");
    // Verificar si hay un token 
    next();
}

export default protegerRuta;