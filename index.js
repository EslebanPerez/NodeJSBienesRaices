import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js"

const app = express();
const port = 3000;

app.use('/', usuarioRoutes);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
