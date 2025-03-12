import { sequelize } from "../config/db.js";
import { Cliente } from "../models/Cliente.js";
import { Embarque } from "../models/Embarque.js";
import { Envio} from "../models/Envio.js";
import { Mercancia } from "../models/Mercancia.js";


export const obtenerLista = async (req, res) => {
    try {
        // Realizar la consulta con Sequelize
        const embarques = await Embarque.findAll({
            attributes: [
                'id_embarque',
                'chofer',
                'num_embarque',
                'patente_camion',
                'patente_remolque',
                'fecha_salida',
                [sequelize.fn(
                    'GROUP_CONCAT',
                    sequelize.fn('DISTINCT', sequelize.col('Envios->Cliente.rut'))
                ), 'ruts'],
                [sequelize.fn(
                    'GROUP_CONCAT',
                    sequelize.fn('DISTINCT', sequelize.col('Envios.numero_orden'))
                ), 'numeros_ordenes']
            ],
            include: [
                {
                    model: Envio,
                    attributes: [], // No necesitamos otros atributos de Envio
                    include: [
                        {
                            model: Cliente,
                            attributes: [] // No necesitamos otros atributos de Cliente
                        }
                    ]
                }
            ],
            group: ['Embarque.id_embarque', 'Embarque.chofer', 'Embarque.num_embarque', 'Embarque.patente_camion', 'Embarque.patente_remolque', 'Embarque.fecha_salida'],
            raw: true // Para obtener un objeto plano en lugar de instancias de Sequelize
        });

        // Enviar la respuesta
        res.json(embarques);
    } catch (error) {
        console.error("Error obteniendo la lista de embarques:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};


export const obtenerMercancias = async (req, res) => {
    const { id_embarque } = req.params;

    try {
        // Realizar la consulta con Sequelize
        const embarque = await Embarque.findOne({
            where: { id_embarque },
            include: [
                {
                    model: Envio,
                    include: [
                        {
                            model: Cliente,
                            attributes: ['rut', 'nombre'] // Seleccionar solo los atributos necesarios
                        },
                        {
                            model: Mercancia,
                            attributes: ['descripcion', 'tipo_pago', 'num_documento', 'proveedor', 'rut_proveedor', 'precio_unitario', 'peso_unidad', 'metros_cubicos', 'tipo_bulto', 'cantidad_bultos', 'peso_total', 'precio_iva', 'monto_documento']
                        }
                    ],
                    attributes: ['fecha', 'condicion_pago', 'numero_orden'] // Seleccionar solo los atributos necesarios
                }
            ]
        });

        // Si no se encuentra el embarque, devolver un error 404
        if (!embarque) {
            return res.status(404).json({ error: "Embarque no encontrado" });
        }

        // Verificar si hay envíos asociados al embarque
        if (!embarque.Envios || embarque.Envios.length === 0) {
            return res.status(404).json({ error: "No hay envíos asociados a este embarque" });
        }

        console.log("Embarques:", embarque.Envios);
        // Formatear la respuesta
        const mercancias = embarque.Envios.flatMap(envio => {
            // Acceder a las mercancías a través de dataValues
            const mercanciasEnvio = envio.dataValues.Mercancia || [];

            // Verificar si hay mercancías asociadas al envío
            if (mercanciasEnvio.length === 0) {
                return []; // Si no hay mercancías, devolver un array vacío
            }

            return mercanciasEnvio.map(mercancia => ({
                fecha: envio.dataValues.fecha,
                descripcion: mercancia.descripcion,
                tipo_pago: mercancia.tipo_pago,
                num_documento: mercancia.num_documento,
                proveedor: mercancia.proveedor,
                rut_proveedor: mercancia.rut_proveedor,
                precio_unitario: mercancia.precio_unitario,
                peso_unidad: mercancia.peso_unidad,
                metros_cubicos: mercancia.metros_cubicos,
                tipo_bulto: mercancia.tipo_bulto,
                cantidad_bultos: mercancia.cantidad_bultos,
                peso_total: mercancia.peso_total,
                precio_iva: mercancia.precio_iva,
                monto_documento: mercancia.monto_documento,
                numero_orden: envio.dataValues.numero_orden,
                rut: envio.dataValues.Cliente.rut,
                nombre: envio.dataValues.Cliente.nombre,
                condicion_pago: envio.dataValues.condicion_pago
            }));
        });

        // Enviar la respuesta
        res.json(mercancias);
    } catch (error) {
        console.error("Error obteniendo las mercancías:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};