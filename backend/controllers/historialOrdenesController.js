import { sequelize } from "../config/db.js";
import { Cliente } from "../models/Cliente.js";
import { Embarque } from "../models/Embarque.js";
import { Envio} from "../models/Envio.js";
import { Mercancia } from "../models/Mercancia.js";


export const obtenerEnvios = async (req, res) => {
    try {
        // Realizar la consulta con Sequelize
        const envios = await Envio.findAll({
            attributes: [
                'id_envio',
                'condicion_pago',
                'fecha',
                'ciudad_origen',
                'ciudad_destino',
                'id_embarque',
                'numero_orden' 
            ],
            include: [
                {
                    model: Cliente,
                    attributes: ['nombre', 'rut', 'ciudad'] 
                },
                {
                    model: Embarque,
                    attributes: ['num_embarque'], 
                    required: false // LEFT JOIN
                }
            ],
            group: ['Envio.id_envio', 'Cliente.nombre' , 'Cliente.rut', 'Cliente.ciudad', 'Envio.condicion_pago', 'Envio.fecha', 'Envio.ciudad_origen', 'Envio.ciudad_destino', 'Envio.id_embarque', 'Embarque.num_embarque'],
            raw: true,
            nest:true
        });
        console.log("Envios: ", envios)
       
        res.json(envios);
    } catch (error) {
        console.error("Error obteniendo la lista de envíos:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};


export const obtenerMercanciasPorEnvio = async (req, res) => {
    const { id_envio } = req.params;

    try {
        // Realizar la consulta con Sequelize
        const mercancias = await Mercancia.findAll({
            attributes: [
                'descripcion',
                'tipo_pago',
                'num_documento',
                'proveedor',
                'rut_proveedor',
                'precio_unitario',
                'peso_unidad',
                'metros_cubicos',
                'tipo_bulto',
                'cantidad_bultos',
                'peso_total',
                'precio_iva',
                'monto_documento'
            ],
            where: { id_envio }, // Filtrar por id_envio
            include: [
                {
                    model: Envio,
                    attributes: [] // No necesitamos otros atributos de Envio
                }
            ]
        });

        // Enviar la respuesta
        res.json(mercancias);
    } catch (error) {
        console.error("Error obteniendo las mercancías:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};


export const EliminarEnvio = async (req,res) => {
    const { id_envio } = req.params;

    const transaction = await sequelize.transaction(); // Iniciamos una transacción

    try {
        console.log("ID del envío a eliminar:", id_envio); // LOG PARA DEPURAR

        
        const deletedMercancias = await Mercancia.destroy({
            where: { id_envio },
            transaction
        });

        console.log(`Mercancías eliminadas: ${deletedMercancias}`);

        // Ahora eliminamos el envío
        const deletedEnvio = await Envio.destroy({
            where: { id_envio },
            transaction
        });

        if (deletedEnvio === 0) {
            // Si no se eliminó ningún envío, hacemos rollback por seguridad
            await transaction.rollback();
            return res.status(404).json({ error: "No se encontró el envío para eliminar." });
        }

        // Si todo salió bien, confirmamos la transacción
        await transaction.commit();

        res.json({ message: "Envío y mercancías asociadas eliminadas correctamente" });

    } catch (error) {
        console.error("Error al eliminar el envío y sus mercancías:", error); // LOG PARA DEPURAR ERRORES
        await transaction.rollback(); // Revertimos los cambios en caso de error
        res.status(500).json({ error: "Error al eliminar el envío", details: error });
    }
};
