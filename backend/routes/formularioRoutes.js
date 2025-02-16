//const express = require('express');
import express from "express";
const router = express.Router();

import { db } from "../config/db.js";
//const db = require("../config/db");



// Ruta para crear cliente
router.post('/formulario/createCliente', (req, res) => {
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
    const { condicion, fecha, origen, destino, recogida, entrega } = envioData;

    db.query(
        'INSERT INTO envios(id_cliente, condicion_pago, fecha, ciudad_origen, ciudad_destino, lugar_recogida, lugar_entrega) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_cliente, condicion, fecha, origen, destino, recogida, entrega],
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
router.get("/formulario/getCliente/:rut", (req, res) => {
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


router.post("/formulario/agregarMercancias", (req, res) => {
    const mercancias = req.body; // Recibimos un array de objetos de mercancías

    if (!Array.isArray(mercancias) || mercancias.length === 0) {
        return res.status(400).send("No se enviaron mercancías");
    }

    // Construir la consulta para insertar múltiples mercancías
    const values = mercancias.map(({ descripcion, tipo_pago, num_documento, proveedor, rutProveedor, precio, peso, metros_cubicos, tipo_bulto, cantidad_bultos, id_envio }) => [
        descripcion,
        tipo_pago,
        num_documento,
        proveedor,
        rutProveedor,
        precio,
        peso,
        metros_cubicos,
        tipo_bulto,
        cantidad_bultos,
        id_envio
    ]);

    const sql = `
        INSERT INTO mercancia(descripcion, tipo_pago, num_documento, proveedor, rut_proveedor, precio_unitario, peso, metros_cubicos, tipo_bulto, cantidad_bultos, id_envio) 
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


router.delete("/formulario/eliminarEnvio/:id_envio", (req, res) => {
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

router.post("/formulario/crearNumero", (req, res) => {
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


router.get("/formulario/envio/:numero_orden", (req, res) => {
    const { numero_orden } = req.params;

    const sql = `
        SELECT 
            c.rut, c.nombre, c.direccion, c.actividad_economica, c.comuna, c.ciudad, c.region, c.telefono,
            e.condicion_pago, e.fecha, e.ciudad_origen, e.ciudad_destino, e.lugar_recogida, e.lugar_entrega,
            m.descripcion, m.tipo_pago, m.num_documento, m.proveedor, m.rut_proveedor, m.monto_documento, m.peso, m.metros_cubicos, m.tipo_bulto, m.cantidad_bultos
        FROM ordenes o
        JOIN envios e ON o.id_envio = e.id_envio
        JOIN clientes c ON e.id_cliente = c.id_cliente
        LEFT JOIN mercancia m ON e.id_envio = m.id_envio
        WHERE o.numero_orden = ?;
    `;

    db.query(sql, [numero_orden], (err, result) => {
        if (err) {
            console.error("Error al obtener los datos del envío:", err);
            return res.status(500).send("Error al obtener los datos del envío");
        }

        if (result.length === 0) {
            return res.status(404).send("Envío no encontrado");
        }

        // Organizar los datos
        const cliente = {
            rut: result[0].rut,
            nombre: result[0].nombre,
            direccion: result[0].direccion,
            actividad_economica: result[0].actividad_economica,
            comuna: result[0].comuna,
            ciudad: result[0].ciudad,
            region: result[0].region,
            telefono: result[0].telefono,
        };

        const envio = {
            condicion_pago: result[0].condicion_pago,
            fecha: result[0].fecha,
            ciudad_origen: result[0].ciudad_origen,
            ciudad_destino: result[0].ciudad_destino,
            lugar_recogida: result[0].lugar_recogida,
            lugar_entrega: result[0].lugar_entrega,
        };

        const mercancias = result.map(row => ({
            descripcion: row.descripcion,
            tipoDocumento: row.tipo_pago,
            numeroDocumento: row.num_documento,
            proveedor: row.proveedor,
            rutProveedor: row.rut_proveedor,
            monto: row.monto_documento,
            peso: row.peso,
            metrosCubicos: row.metros_cubicos,
            tipo_bulto: row.tipo_bulto,
            cantidad_bultos: row.cantidad_bultos,
        }));

        res.json({ cliente, envio, mercancias });
    });
});

router.put("/envio/:numero_orden", (req, res) => {
    const { numero_orden } = req.params;
    const { cliente, envio } = req.body;

    // Actualizar cliente
    db.query(
        `UPDATE clientes 
            SET 
                rut = ?, 
                nombre = ?, 
                direccion = ?, 
                actividad_economica = ?, 
                comuna = ?, 
                ciudad = ?, 
                region = ?, 
                telefono = ?
            WHERE id_cliente = (
                SELECT e.id_cliente 
                FROM envios e
                JOIN ordenes o ON e.id_envio = o.id_envio
                WHERE o.numero_orden = ?
            )`,
        [cliente.rut, cliente.nombre, cliente.direccion, cliente.actividad, cliente.comuna, cliente.ciudad, cliente.region, cliente.telefono, numero_orden],
        (err, result) => {
            if (err) {
                console.error("Error al actualizar el cliente:", err);
                return res.status(500).send("Error al actualizar el cliente");
            }

            // Actualizar envío
            db.query(
                `UPDATE envios 
                    SET 
                        condicion_pago = ?, 
                        fecha = ?, 
                        ciudad_origen = ?, 
                        ciudad_destino = ?, 
                        lugar_recogida = ?, 
                        lugar_entrega = ?
                        WHERE id_envio = (
                            SELECT o.id_envio 
                            FROM ordenes o
                            WHERE o.numero_orden = ?
                        )`,
                [envio.condicion, envio.fecha, envio.origen, envio.destino, envio.recogida, envio.entrega, numero_orden],
                (err, result) => {
                    if (err) {
                        console.error("Error al actualizar el envío:", err);
                        return res.status(500).send("Error al actualizar el envío");
                    }

                    res.json({ message: "Envío actualizado correctamente" });
                }
            );
        }
    );
});

router.put("/actualizarMercancias/:numero_orden", async (req, res) => {
    const { numero_orden } = req.params;
    const mercancias = req.body; // Array con las mercancías a actualizar

    if (!Array.isArray(mercancias) || mercancias.length === 0) {
        return res.status(400).send("No se enviaron mercancías");
    }

    try {
        // 🔹 1️⃣ Obtener el id_envio correspondiente al numero_orden
        const idEnvioQuery = `SELECT id_envio FROM ordenes WHERE numero_orden = ?`;
        const [idEnvioResult] = await db.promise().query(idEnvioQuery, [numero_orden]);

        if (idEnvioResult.length === 0) {
            return res.status(404).send("No se encontró un id_envio para el número de orden proporcionado");
        }

        const id_envio = idEnvioResult[0].id_envio;

        // 🔹 2️⃣ Eliminar todas las mercancías actuales para este id_envio
        const deleteQuery = `DELETE FROM mercancia WHERE id_envio = ?`;
        await db.promise().query(deleteQuery, [id_envio]);

        // 🔹 3️⃣ Insertar todas las nuevas mercancías
        const values = mercancias.map(({ 
            descripcion, 
            tipoDocumento,  
            numeroDocumento,  
            proveedor, 
            rutProveedor, 
            monto, 
            peso, 
            metrosCubicos,  
            tipo_bulto, 
            cantidad_bultos 
        }) => [
            descripcion,
            tipoDocumento,  
            numeroDocumento,
            proveedor,
            rutProveedor,
            monto,
            peso,
            metrosCubicos,
            tipo_bulto,
            cantidad_bultos,
            id_envio
        ]);

        const insertQuery = `
            INSERT INTO mercancia (descripcion, tipo_pago, num_documento, proveedor, rut_proveedor, monto_documento, peso, metros_cubicos, tipo_bulto, cantidad_bultos, id_envio) 
            VALUES ?
        `;

        await db.promise().query(insertQuery, [values]);

        res.send("Mercancías reemplazadas correctamente.");

    } catch (error) {
        console.error("Error al actualizar mercancías:", error);
        res.status(500).send("Error al actualizar las mercancías.");
    }
});



export default router;
//module.exports = router;