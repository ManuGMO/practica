//const express = require('express');
import express from "express";
const router = express.Router();


import { crearEnvio, getCliente } from "../controllers/formularioController.js";
import { actualizarOrden, obtenerDatosEnvio } from "../controllers/formularioModController.js";




// Ruta para crear Orden (Cliente, envio y mercancia)
router.post('/createOrder', crearEnvio);

//Obtener cliente por rut
router.get('/getCliente/:rut',getCliente);




//Ruta para obtener datos al Modificar Orden
router.get("/envio/:numero_orden", obtenerDatosEnvio);


//Ruta para modificar la Orden de flete
router.put("/envio/:numero_orden", actualizarOrden);




export default router;
//module.exports = router;