import express from "express";
import { formularioLogin, formularioRegistro, registrar, forgotPassword } from "../controllers/usuarioController.js"

const router = express.Router();

router.get("/login", formularioLogin );
router.get("/registro", formularioRegistro );
router.post("/registro", registrar );
router.get("/password", forgotPassword );

export default router;