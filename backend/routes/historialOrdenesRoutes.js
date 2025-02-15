import express from "express";
const router = express.Router();
import { db } from "../config/db.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

router.get("/historialOrdenes", authMiddleware, async (req, res) => {
        const sql = `
            SELECT 
                e.id_envio,
                c.nombre,
                c.rut,
                c.ciudad,
                e.condicion_pago,
                e.fecha,
                e.ciudad_origen,
                e.ciudad_destino,
                e.id_embarque,
                em.num_embarque,
                o.numero_orden
            FROM envios e
            JOIN clientes c ON e.id_cliente = c.id_cliente
            JOIN ordenes o ON e.id_envio = o.id_envio
            LEFT JOIN embarques em ON e.id_embarque = em.id_embarque
            GROUP BY e.id_envio, c.nombre,c.rut, c.ciudad,e.condicion_pago, e.fecha, e.ciudad_origen, e.ciudad_destino, e.id_embarque, em.num_embarque;
        `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error obteniendo la lista de embarques:", err);
                return res.status(500).json({ error: "Error al obtener los datos" });
            }
            res.json(result);
        });

    });


router.get("/mercanciasOrden/:id_envio", async (req, res) => {
    const { id_envio } = req.params;
    const sql = `
    SELECT 
        m.descripcion, m.tipo_pago, m.num_documento, m.proveedor, m.rut_proveedor, m.precio_unitario, m.peso_unidad, 
            m.metros_cubicos, m.tipo_bulto, m.cantidad_bultos, m.peso_total, m.precio_iva, m.monto_documento
    FROM envios e
    JOIN mercancia m ON e.id_envio = m.id_envio
    WHERE e.id_envio = ?;
`;
    db.query(sql, [id_envio], (err, result) => {
        if (err) {
            console.error("Error obteniendo las mercancías:", err);
            return res.status(500).json({ error: "Error al obtener los datos" });
        }
        res.json(result);
    });
});

export default router;