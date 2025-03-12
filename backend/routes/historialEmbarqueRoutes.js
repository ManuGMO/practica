import express from "express";
import { obtenerEmbarques, obtenerMercancias } from "../controllers/historialEmbarqueController.js";
const router = express.Router();


router.get("/", obtenerEmbarques);


router.get("/mercanciasEmbarque/:id_embarque", obtenerMercancias);


export default router;