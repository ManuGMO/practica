import express from "express";
const router = express.Router();

import { db } from "../config/db.js";

router.get("/", (req, res) => {
    const sql = `
       SELECT 
            e.id_embarque,
            e.chofer,
            e.num_embarque,
            e.patente_camion,
            e.patente_remolque,
            e.fecha_salida,
            GROUP_CONCAT(DISTINCT c.rut ORDER BY c.rut SEPARATOR ', ') AS ruts,
            GROUP_CONCAT(DISTINCT o.numero_orden ORDER BY o.numero_orden SEPARATOR ', ') AS numeros_ordenes
        FROM embarques e
        JOIN envios v ON e.id_embarque = v.id_embarque
        JOIN ordenes o ON v.id_envio = o.id_envio
        JOIN clientes c ON v.id_cliente = c.id_cliente  
        GROUP BY e.id_embarque, e.chofer, e.num_embarque, e.patente_camion, e.patente_remolque, e.fecha_salida;
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error obteniendo la lista de embarques:", err);
            return res.status(500).json({ error: "Error al obtener los datos" });
        }
        res.json(result);
    });
});


router.get("/:id_embarque", async (req, res) => {
    const { id_embarque } = req.params;
    const sql = `
    SELECT 
        v.fecha,
        m.descripcion, 
        m.tipo_pago, 
        m.num_documento, 
        m.proveedor, 
        m.rut_proveedor, 
        m.precio_unitario, 
        m.peso_unidad, 
        m.metros_cubicos, 
        m.tipo_bulto, 
        m.cantidad_bultos, 
        m.peso_total, 
        m.precio_iva, 
        m.monto_documento,
        o.numero_orden,
        c.rut,
        c.nombre,
        v.condicion_pago
    FROM embarques e
    JOIN envios v ON e.id_embarque = v.id_embarque
    JOIN clientes c ON v.id_cliente = c.id_cliente
    JOIN ordenes o ON v.id_envio = o.id_orden
    JOIN mercancia m ON v.id_envio = m.id_envio
    WHERE e.id_embarque = ?;
`;
    db.query(sql, [id_embarque], (err, result) => {
        if (err) {
            console.error("Error obteniendo las mercancías:", err);
            return res.status(500).json({ error: "Error al obtener los datos" });
        }
        res.json(result);
    });
});



export default router;