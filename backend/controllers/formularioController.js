import { sequelize } from "../config/db.js";
import { Cliente } from "../models/Cliente.js";
import { Envio} from "../models/Envio.js";
import { Mercancia } from "../models/Mercancia.js";



export const crearEnvio = async (req, res) => {
    const { rut, nombre, direccion, actividad, comuna, ciudad, region, telefono, 
            condicion, fecha, origen, destino, recogida, entrega,
            mercanciasData} = req.body;

    //iniciar transaccion atomica
    const transaction = await sequelize.transaction();

    try {
        // Verificar si el cliente ya existe
        let cliente = await Cliente.findOne({ where: { rut } });

        if (!cliente) {
            // Crear nuevo cliente
            cliente = await Cliente.create({
                rut,
                nombre,
                direccion,
                actividad_economica: actividad,
                comuna,
                ciudad,
                region,
                telefono,
            }, {transaction});
        }

        // Crear envío asociado al cliente
        const envio = await Envio.create({
            id_cliente: cliente.id_cliente,
            condicion_pago: condicion,
            fecha: fecha,
            ciudad_origen: origen,
            ciudad_destino: destino,
            lugar_recogida: recogida,
            lugar_entrega: entrega,
        }, {transaction});

        //Ingresar mercancias aca
        if (Array.isArray(mercanciasData)) {
            const mercanciasParaInsertar = mercanciasData.map(mercancia =>{
                const precioIva = Math.round(mercancia.precio_unitario * 1.19);
                return{
                    descripcion: mercancia.descripcion,
                    tipo_pago: mercancia.tipo_pago,
                    num_documento: mercancia.num_documento,
                    proveedor: mercancia.proveedor,
                    rut_proveedor: mercancia.rutProveedor,
                    precio_unitario: mercancia.precio_unitario,
                    peso_unidad: mercancia.peso_unidad,
                    metros_cubicos: mercancia.metros_cubicos,
                    tipo_bulto: mercancia.tipo_bulto,
                    cantidad_bultos: mercancia.cantidad_bultos,
                    peso_total: mercancia.peso_unidad * mercancia.cantidad_bultos,
                    precio_iva : precioIva,
                    monto_documento : precioIva * mercancia.cantidad_bultos,
                    id_envio: envio.id_envio
                }; 
            });

            await Mercancia.bulkCreate(mercanciasParaInsertar, { transaction });
        };


        const numero_orden = generarNumeroOrden(envio.id_envio);

        await Envio.update(
            { numero_orden },
            { where: { id_envio: envio.id_envio }, transaction }
        );

        await transaction.commit();

        res.json({ message: "Cliente y envío registrados correctamente", numero_orden });
    } catch (error) {
        //Revertir transaccion por si una falla 
        await transaction.rollback();
        console.error("Error al registrar cliente y envío:", error);
        res.status(500).send("Error al registrar cliente y envío");
    }

};

function generarNumeroOrden(seed) {
    let x = Math.sin(seed) * 10000;
    const randomValue = x - Math.floor(x);
    const randomNumber = Math.floor(randomValue * 1e9); 

 
    return String(randomNumber).padEnd(9, '0'); 
}



export const getCliente = async(req,res) => {
    try {
        const { rut } = req.params;
        const cliente = await Cliente.findOne({ where: { rut } });

        if (!cliente) {
            return res.status(404).send("Cliente no encontrado");
        }

        res.json(cliente);
    } catch (error) {
        console.error("Error en getCliente:", error);
        res.status(500).send("Error al buscar el cliente");
    }
};

