import express, { Router } from "express";
const router = express.Router();

import { db } from "../config/db.js";

router.get("/visualizar/:numero_orden", (req, res) => {
    const { numero_orden } = req.params;

    const sql = `
        SELECT 
            o.numero_orden, 
            e.id_envio, e.lugar, e.fecha, e.ciudad_origen, e.ciudad_destino, e.lugar_recogida, e.lugar_entrega,
            c.rut, c.nombre, c.direccion, c.actividad_economica, c.comuna, c.ciudad, c.region, c.telefono,
            m.descripcion, m.tipo_pago, m.num_documento, m.proveedor, m.peso, m.metros_cubicos, m.tipo_bulto, m.cantidad_bultos
        FROM ordenes o
        JOIN envios e ON o.id_envio = e.id_envio
        JOIN clientes c ON e.id_cliente = c.id_cliente
        JOIN mercancia m ON e.id_envio = m.id_envio
        WHERE o.numero_orden = ?`;

    db.query(sql, [numero_orden], (err, results) => {
        if (err) {
            console.error("Error obteniendo la orden:", err);
            res.status(500).json({ error: "Error al obtener los datos" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Orden no encontrada" });
        } else {
            // Separar los datos de la primera fila como cliente/envío y los demás como mercancía
            const envioData = {
                id_envio: results[0].id_envio,
                lugar: results[0].lugar,
                fecha: results[0].fecha,
                origen: results[0].ciudad_origen,
                destino: results[0].ciudad_destino,
                recogida: results[0].lugar_recogida,
                entrega: results[0].lugar_entrega
            };

            const clienteData = {
                rut: results[0].rut,
                nombre: results[0].nombre,
                direccion: results[0].direccion,
                actividad: results[0].actividad_economica,
                comuna: results[0].comuna,
                ciudad: results[0].ciudad,
                region: results[0].region,
                telefono: results[0].telefono
            };

            const mercancia = results.map(row => ({
                descripcion: row.descripcion,
                tipo_pago: row.tipo_pago,
                num_documento: row.num_documento,
                proveedor: row.proveedor,
                peso: row.peso,
                metros_cubicos: row.metros_cubicos,
                tipo_bulto: row.tipo_bulto,
                cantidad_bultos: row.cantidad_bultos
            }));

            res.json({ clienteData, envioData, mercancia });
        }
    });
});


export default router;