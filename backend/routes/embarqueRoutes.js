import express from "express";
const router = express.Router();

import { db } from "../config/db.js";

router.get("/getEnvios",  (req, res) => {

    const sql= `SELECT
                    e.id_envio, COUNT(*) AS total_envios,
                    o.numero_orden, COUNT(*) AS total_mercancias,
                    c.nombre,
                    SUM(m.peso) AS total_peso,
                    SUM(m.metros_cubicos) AS total_metros_cubicos,
                    SUM(m.cantidad_bultos) AS total_cantidad_bultos 
                FROM mercancia m 
                JOIN envios e ON m.id_envio = e.id_envio
                JOIN ordenes o ON e.id_envio = o.id_envio
                JOIN clientes c ON e.id_cliente = c.id_cliente
                WHERE e.id_embarque IS NULL GROUP BY m.id_envio ORDER BY m.id_envio ASC `;

    db.query(sql,(err,result) => {
                if(err){
                    console.error("Error obteniendo datos de mercancía:", err);
                    res.status(500).json({ error: "Error al obtener los datos" });
                }
                else{
                    res.json(result);
                }
            }
    );
});


router.post("/crearEmbarque", (req, res) => {
    const { chofer, num_embarque, patente_camion, patente_remolque, fecha_salida } = req.body;
    
    db.query("INSERT INTO embarques (chofer, num_embarque, patente_camion, patente_remolque, fecha_salida) VALUES (?, ?, ?, ?, ?)",
         [chofer, num_embarque, patente_camion, patente_remolque, fecha_salida], (err, result) => {
        if (err) {
            console.error("Error al insertar embarque:", err);
            return res.status(500).json({ error: "Error al insertar embarque" });
        }
        res.json({ id_embarque: result.insertId });
    });
});


router.put("/asignarEnvios", (req, res) => {
    const { id_embarque, id_envios } = req.body;

    if (!id_embarque || id_envios.length === 0) {
        return res.status(400).json({ error: "Datos inválidos" });
    }
    
    db.query("UPDATE envios SET id_embarque = ? WHERE id_envio IN (?)", [id_embarque, id_envios], (err, result) => {
        if (err) {
            console.error("Error al actualizar envíos:", err);
            return res.status(500).json({ error: "Error al actualizar envíos" });
        }
        res.json({ message: "Envíos asignados correctamente" });
    });
});



export default router;