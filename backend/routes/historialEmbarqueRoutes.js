import express from "express";
const router = express.Router();
import { db } from "../config/db.js";

router.get("/historialEmbarques", async (req, res) => {
        const sql = `
            SELECT 
                e.id_embarque,
                e.chofer,
                e.num_embarque,
                e.patente_camion,
                e.patente_remolque,
                e.fecha_salida,
                GROUP_CONCAT(o.numero_orden ORDER BY o.numero_orden SEPARATOR ', ') AS numeros_ordenes
            FROM embarques e
            JOIN envios v ON e.id_embarque = v.id_embarque
            JOIN ordenes o ON v.id_envio = o.id_envio
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


router.get("/mercanciasEmbarque/:id_embarque", async (req, res) => {
    const { id_embarque } = req.params;
    const sql = `
    SELECT 
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
        m.monto_documento
    FROM embarques e
    JOIN envios v ON e.id_embarque = v.id_embarque
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