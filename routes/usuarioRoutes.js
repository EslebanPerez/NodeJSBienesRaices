import express from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, forgotPassword, resetPassword, comprobarToken, nuevoPassword } from "../controllers/usuarioController.js"

const router = express.Router();

router.get("/login", formularioLogin );
router.get("/registro", formularioRegistro );
router.post("/registro", registrar );
router.get("/forgot-password", forgotPassword );
router.post("/forgot-password", resetPassword );
router.get("/confirmar/:token", confirmar)

// Almacena el nuevo password
router.get("/forgot-password/:token", comprobarToken)
router.post("/forgot-password/:token", nuevoPassword)

export default router;