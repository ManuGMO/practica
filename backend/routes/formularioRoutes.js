//const express = require('express');
import express from "express";
const router = express.Router();

import { db } from "../config/db.js";
//const db = require("../config/db");



// Ruta para crear cliente
router.post('/createCliente', (req, res) => {
    const { rut, nombre, direccion, actividad, comuna, ciudad, region, telefono, envioData } = req.body;

    db.query('SELECT id_cliente FROM clientes WHERE rut = ?', [rut], (err, result) => {
        if (err) {
            console.error("Error al verificar el RUT:", err);
            return res.status(500).send("Error al verificar el RUT");
        }
        if (result.length > 0) {
            // Cliente ya existe, usar su id_cliente para insertar el envío
            const id_cliente = result[0].id_cliente;
            registrarEnvio(id_cliente, envioData, res);
        } else {
            db.query(
                'INSERT INTO clientes(rut, nombre, direccion, actividad_economica, comuna, ciudad, region, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [rut, nombre, direccion, actividad, comuna, ciudad, region, telefono],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Error al registrar el cliente");
                    } else {
                        const id_cliente = result.insertId; // Obtener el id del cliente recién registrado
                        registrarEnvio(id_cliente, envioData, res);
                    }
                }
            );
        }
    });
});

function registrarEnvio(id_cliente, envioData, res) {
    const { lugar, fecha, origen, destino, recogida, entrega } = envioData;

    db.query(
        'INSERT INTO envios(id_cliente, lugar, fecha, ciudad_origen, ciudad_destino, lugar_recogida, lugar_entrega) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_cliente, lugar, fecha, origen, destino, recogida, entrega],
        (err, result) => {
            if (err) {
                console.error("Error al registrar el envío:", err);
                res.status(500).send("Error al registrar el envío");
            } else {
                const id_envios = result.insertId;
                res.json({ message: "Cliente y envío registrados correctamente", id_envios });
            }
        }
    );
}


// Aquí puedes agregar más rutas relacionadas con el formulario
router.get("/getCliente/:rut", (req, res) => {
    const rut = req.params.rut;
    console.log("📌 db:", db);
    db.query('SELECT * FROM clientes WHERE rut = ?', [rut], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al buscar el cliente");
        } else {
            if (result.length > 0) {
                res.json(result[0]); // Enviar el primer resultado como JSON
            } else {
                res.status(404).send("Cliente no encontrado");
            }
        }
    });
});


router.post("/agregarMercancias", (req, res) => {
    const mercancias = req.body; // Recibimos un array de objetos de mercancías

    if (!Array.isArray(mercancias) || mercancias.length === 0) {
        return res.status(400).send("No se enviaron mercancías");
    }

    // Construir la consulta para insertar múltiples mercancías
    const values = mercancias.map(({ descripcion, tipo_pago, num_documento, proveedor, peso, metros_cubicos, tipo_bulto, cantidad_bultos, id_envio }) => [
        descripcion,
        tipo_pago,
        num_documento,
        proveedor,
        peso,
        metros_cubicos,
        tipo_bulto,
        cantidad_bultos,
        id_envio
    ]);

    const sql = `
        INSERT INTO mercancia(descripcion, tipo_pago, num_documento, proveedor, peso, metros_cubicos, tipo_bulto, cantidad_bultos, id_envio) 
        VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error al registrar las mercancías:", err);
            res.status(500).send("Error al registrar las mercancías");
        } else {
            res.send("Mercancías registradas correctamente");
        }
    });
});


router.delete("/eliminarEnvio/:id_envio", (req, res) => {
    const { id_envio } = req.params;

    console.log("ID del envío a eliminar:", id_envio); // LOG PARA DEPURAR

    const sql = "DELETE FROM envios WHERE id_envio = ?";

    db.query(sql, [id_envio], (err, result) => {
        if (err) {
            console.error("Error SQL al eliminar el envío:", err); // LOG PARA VER ERROR SQL
            return res.status(500).json({ error: "Error al eliminar el envío", details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró el envío para eliminar." });
        }

        res.json({ message: "Envío eliminado correctamente" });
    });
});

router.post("/crearNumero", (req, res) => {
    const { id_envio, numero_orden } = req.body;

    db.query(
        `INSERT INTO ordenes (id_envio, numero_orden) VALUES (?, ?)`,
        [id_envio, numero_orden],
        (err, result) => {
            if (err) {
                console.error("Error al insertar la orden:", err);
                res.status(500).json({ error: "Error al insertar la orden" });
            } else {
                res.json({ success: true, message: "Orden creada correctamente" });
            }
        }
    );
});

export default router;
//module.exports = router;