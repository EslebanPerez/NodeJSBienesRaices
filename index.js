import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import db from "./config/db.js"

const app = express();
const port = 3000;

//Conexión a la base de datos
try{
  await db.authenticate();
  console.log("Conexion correcta a la base de datos");
} catch(error){
  console.log(error);
}

//Habilitando Pug 
app.set("view engine", "pug");
app.set("views", "./views");
// Carpeta publica
app.use(express.static('public'))

//Routing
app.use('/auth', usuarioRoutes);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
