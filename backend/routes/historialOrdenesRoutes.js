import express from "express";
const router = express.Router();

import  authMiddleware  from "../middleware/authMiddleware.js";
import { obtenerEnvios, obtenerMercanciasPorEnvio, EliminarEnvio } from "../controllers/historialOrdenesController.js";

router.get("/", obtenerEnvios);


router.get("/mercanciasOrden/:id_envio", obtenerMercanciasPorEnvio);


router.delete("/eliminarEnvio/:id_envio", EliminarEnvio);

export default router;