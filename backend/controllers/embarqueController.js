import { sequelize } from "../config/db.js";
import { Cliente } from "../models/Cliente.js";
import { Embarque } from "../models/Embarque.js";
import { Envio} from "../models/Envio.js";
import { Mercancia } from "../models/Mercancia.js";


export const getEnvios = async (req, res) => {
    try {
        // Realizar la consulta con Sequelize
        const envios = await Mercancia.findAll({
            attributes: [
                [sequelize.col('Envio.id_envio'), 'id_envio'], // Usar el id_envio de Envio
                [sequelize.fn('COUNT', sequelize.col('Mercancia.id_mercancia')), 'total_mercancias'],
                [sequelize.col('Envio.numero_orden'), 'numero_orden'],
                [sequelize.col('Envio.Cliente.nombre'), 'nombre'], // Acceder a Cliente a través de Envio
                [sequelize.col('Envio.Cliente.rut'), 'rut'], // Acceder a Cliente a través de Envio
                [sequelize.fn('SUM', sequelize.col('Mercancia.peso_unidad')), 'total_peso'],
                [sequelize.fn('SUM', sequelize.col('Mercancia.metros_cubicos')), 'total_metros_cubicos'],
                [sequelize.fn('SUM', sequelize.col('Mercancia.cantidad_bultos')), 'total_cantidad_bultos'],
                [sequelize.col('Envio.ciudad_origen'), 'ciudad_origen'],
                [sequelize.col('Envio.ciudad_destino'), 'ciudad_destino']
            ],
            include: [
                {
                    model: Envio,
                    attributes: [], // No necesitamos otros atributos de Envio
                    where: { id_embarque: null }, // Filtrar por id_embarque IS NULL
                    include: [
                        {
                            model: Cliente,
                            attributes: [] // No necesitamos otros atributos de Cliente
                        }
                    ]
                }
            ],
            group: ['Envio.id_envio'], // Agrupar por id_envio
            order: [[sequelize.literal('Envio.id_envio'), 'ASC']] // Ordenar por id_envio ASC
        });

        // Formatear la respuesta
        const result = envios.map(envio => ({
            id_envio: envio.get('id_envio'),
            total_envios: envio.get('total_mercancias'), // total_envios es igual a total_mercancias
            numero_orden: envio.get('numero_orden'),
            nombre: envio.get('nombre'),
            rut: envio.get('rut'),
            total_peso: envio.get('total_peso'),
            total_metros_cubicos: envio.get('total_metros_cubicos'),
            total_cantidad_bultos: envio.get('total_cantidad_bultos'),
            ciudad_origen: envio.get('ciudad_origen'),
            ciudad_destino: envio.get('ciudad_destino')
        }));

        // Enviar la respuesta
        res.json(result);
    } catch (error) {
        console.error("Error obteniendo datos de mercancía:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};


export const crearEmbarque = async (req, res) => {
    const { chofer, num_embarque, patente_camion, patente_remolque, fecha_salida, id_envios } = req.body;

    // Validar que se hayan enviado envíos para asignar
    if (!id_envios || id_envios.length === 0) {
        return res.status(400).json({ error: "Debe seleccionar al menos un envío" });
    }

    // Iniciar transacción atómica
    const transaction = await sequelize.transaction();

    try {
        // 🔹 1️⃣ Crear el embarque
        const embarque = await Embarque.create(
            {
                chofer,
                num_embarque,
                patente_camion,
                patente_remolque,
                fecha_salida
            },
            { transaction }
        );

        // 🔹 2️⃣ Asignar los envíos al embarque recién creado
        await Envio.update(
            { id_embarque: embarque.id_embarque }, // Asignar el id_embarque
            {
                where: { id_envio: id_envios }, // Filtrar por los id_envios seleccionados
                transaction
            }
        );

        // Confirmar la transacción
        await transaction.commit();

        // Respuesta exitosa
        res.json({ id_embarque: embarque.id_embarque, message: "Embarque creado y envíos asignados correctamente" });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error("Error al crear el embarque y asignar envíos:", error);
        res.status(500).json({ error: "Error al crear el embarque y asignar envíos" });
    }
};