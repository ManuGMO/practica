import { sequelize } from "../config/db.js";
import { Cliente } from "../models/Cliente.js";
import { Embarque } from "../models/Embarque.js";
import { Envio} from "../models/Envio.js";
import { Mercancia } from "../models/Mercancia.js";


export const obtenerEmbarques= async (req, res) => {
    try{
        const embarques = await Embarque.findAll({
            attributes: [
                'id_embarque',
                'chofer',
                'num_embarque',
                'patente_camion',
                'patente_remolque',
                'fecha_salida',
                [
                    sequelize.literal(`
                        GROUP_CONCAT(DISTINCT Envios.numero_orden ORDER BY Envios.numero_orden SEPARATOR ", ")
                    `),
                    'numeros_ordenes'
                ]
            ],
            include: [
                {
                    model: Envio,
                    attributes: []
                }
            ],
            group: [
                'Embarque.id_embarque',
                'Embarque.chofer',
                'Embarque.num_embarque',
                'Embarque.patente_camion',
                'Embarque.patente_remolque',
                'Embarque.fecha_salida'
            ],
            raw: true // Para devolver un objeto plano
        });
        
        res.json(embarques);

    }catch (error){
        console.error("Error obteniendo los embarques:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};



export const obtenerMercancias = async (req, res) => {
    const { id_embarque } = req.params;

    try {
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
            include: [
                {
                    model: Envio,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: Embarque,
                            attributes: [], // No necesitamos datos extra de Embarque
                            where: { id_embarque },
                            required: true 
                        }
                    ]
                }
            ],
            raw: true // Para devolver un objeto plano
        });

        res.json(mercancias);
    } catch (error) {
        console.error("Error obteniendo las mercancías:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};