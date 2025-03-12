import { sequelize } from "../config/db.js";
import { Cliente } from "../models/Cliente.js";
import { Envio} from "../models/Envio.js";
import { Mercancia } from "../models/Mercancia.js";

export const obtenerOrdenPorNumero = async (req, res) => {
    const { numero_orden } = req.params;

    try {
        const orden = await Envio.findOne({
            attributes: [
                'id_envio', 
                'numero_orden',
                'condicion_pago', 
                'fecha', 
                'ciudad_origen', 
                'ciudad_destino', 
                'lugar_recogida', 
                'lugar_entrega'
            ],
            include: [
                {
                    model: Cliente,
                    attributes: [
                        'rut', 
                        'nombre', 
                        'direccion', 
                        'actividad_economica', 
                        'comuna', 
                        'ciudad', 
                        'region', 
                        'telefono'
                    ]
                },
                {
                    model: Mercancia,
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
                    ]
                }
            ],
            where: { numero_orden }
        });

        if (!orden) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }

        console.log("orden", orden.Cliente)

        // Transformar los datos en un formato JSON limpio
        const envioData = {
            id_envio: orden.id_envio,
            numero_orden: orden.numero_orden,
            condicion: orden.condicion_pago,
            fecha: orden.fecha,
            origen: orden.ciudad_origen,
            destino: orden.ciudad_destino,
            recogida: orden.lugar_recogida,
            entrega: orden.lugar_entrega
        };


        const clienteData = orden.Cliente ? orden.Cliente.toJSON() : null;

        const mercancia = orden.Mercancia.map(m => m.toJSON());

        res.json({ clienteData, envioData, mercancia });
    } catch (error) {
        console.error("Error obteniendo la orden:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};