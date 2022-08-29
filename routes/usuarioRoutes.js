import express from "express";
import { formularioLogin, formularioRegistro,forgotPassword } from "../controllers/usuarioController.js"

const router = express.Router();

router.get("/login", formularioLogin );
router.get("/registro", formularioRegistro );
router.get("/password", forgotPassword );

export default router;