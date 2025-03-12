import express from "express";
import { obtenerLista, obtenerMercancias } from "../controllers/listaController.js";
const router = express.Router();



router.get("/", obtenerLista);


router.get("/:id_embarque", obtenerMercancias);



export default router;