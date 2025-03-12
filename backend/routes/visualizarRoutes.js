import express, { Router } from "express";
import { obtenerOrdenPorNumero } from "../controllers/visualizarController.js";
const router = express.Router();



router.get("/:numero_orden", obtenerOrdenPorNumero);


export default router;