import express from "express";
const router = express.Router();

import { db } from "../config/db.js";

router.get("/listaEmbarques", (req, res) => {
    const sql = `
        SELECT 
            em.fecha_salida, 
            e.id_envio, 
            c.nombre, 
            m.tipo_pago, 
            m.num_documento, 
            m.peso, 
            m.metros_cubicos, 
            m.tipo_bulto, 
            em.patente_camion, 
            em.patente_remolque
        FROM embarques em
        JOIN envios e ON em.id_embarque = e.id_embarque
        JOIN clientes c ON e.id_cliente = c.id_cliente
        JOIN mercancia m ON e.id_envio = m.id_envio
        WHERE e.id_embarque IS NOT NULL
        ORDER BY em.fecha_salida DESC, e.id_envio ASC;
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error obteniendo la lista de embarques:", err);
            return res.status(500).json({ error: "Error al obtener los datos" });
        }
        res.json(result);
    });
});


export default router;