import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js"

const app = express();
const port = 3000;

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
