import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import appRouters from "./routes/appRouters.js";
import db from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));

// Habilitando cookie-parser
app.use(cookieParser());

// Habilitando CSRF
app.use(csrf({ cookie : true }))

//Conexión a la base de datos
try{
  await db.authenticate();
  await db.sync();
  console.log("Conexión correcta a la base de datos");
} catch(error){
  console.log(error);
}

//Habilitando Pug 
app.set("view engine", "pug");
app.set("views", "./views");
// Carpeta publica
app.use(express.static('public'))

//Routing
app.use('/', appRouters)
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
