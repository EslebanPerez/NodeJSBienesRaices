import express from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, forgotPassword, resetPassword } from "../controllers/usuarioController.js"

const router = express.Router();

router.get("/login", formularioLogin );
router.get("/registro", formularioRegistro );
router.post("/registro", registrar );
router.get("/password", forgotPassword );
router.post("/password", resetPassword );
router.get("/confirmar/:token", confirmar)


export default router;