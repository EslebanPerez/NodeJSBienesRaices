import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import db from "./config/db.js"

const app = express();
const port = process.env.PORT || 3000;

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}))

//Conexión a la base de datos
try{
  await db.authenticate();
  await db.sync();
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
