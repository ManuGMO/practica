import { sequelize } from "../config/db.js";
import { Cliente } from "../models/Cliente.js";
import { Envio} from "../models/Envio.js";
import { Mercancia } from "../models/Mercancia.js";



export const obtenerDatosEnvio = async (req, res) => {
    const { numero_orden } = req.params;

    try {
        // Buscar el envío por número de orden e incluir las relaciones con Cliente y Mercancia
        const envio = await Envio.findOne({
            where: { numero_orden }, // Buscar por número de orden
            include: [
                {
                    model: Cliente, // Incluir datos del cliente
                    attributes: ['rut', 'nombre', 'direccion', 'actividad_economica', 'comuna', 'ciudad', 'region', 'telefono']
                },
                {
                    model: Mercancia, // Incluir datos de las mercancías
                    attributes: ['descripcion', 'tipo_pago', 'num_documento', 'proveedor', 'rut_proveedor', 'precio_unitario', 'peso_unidad', 'metros_cubicos', 'tipo_bulto', 'cantidad_bultos']
                }
            ]
        });

        // Si no se encuentra el envío, devolver un error 404
        if (!envio) {
            return res.status(404).json({ message: "Envío no encontrado" });
        }

        // Organizar los datos

        const envioData = {
            id_envio: envio.id_envio,
            condicion_pago: envio.condicion_pago,
            fecha: envio.fecha,
            ciudad_origen: envio.ciudad_origen,
            ciudad_destino: envio.ciudad_destino,
            lugar_recogida: envio.lugar_recogida,
            lugar_entrega: envio.lugar_entrega,
        };

        const clienteData = envio.Cliente ? envio.Cliente.toJSON() : null

        

        const mercancias = envio.Mercancia.map(m => m.toJSON());

        // Devolver los datos organizados
        res.json({ clienteData, envioData, mercancias });
    } catch (error) {
        console.error("Error al obtener los datos del envío:", error);
        res.status(500).json({ message: "Error al obtener los datos del envío" });
    }
};




export const actualizarOrden = async (req, res) => {
    const { numero_orden } = req.params;
    const { cliente, envio, mercancias } = req.body;

    // Iniciar transacción atómica
    const transaction = await sequelize.transaction();

    try {
        // Buscar el envío por número de orden
        const envioData = await Envio.findOne({
            where: { numero_orden },
            include: [Cliente, Mercancia], // Incluir datos del cliente
            transaction
        });

        if (!envioData) {
            await transaction.rollback();
            return res.status(404).json({ message: "Envío no encontrado" });
        }

        // Verifica el cliente asociado al envío
        if (envioData.Cliente.rut !== cliente.rut) {
            // Crear un nuevo cliente
            const nuevoCliente = await Cliente.create(
                {
                    rut: cliente.rut,
                    nombre: cliente.nombre,
                    direccion: cliente.direccion,
                    actividad_economica: cliente.actividad,
                    comuna: cliente.comuna,
                    ciudad: cliente.ciudad,
                    region: cliente.region,
                    telefono: cliente.telefono
                },
                { transaction }
            );
    
            // Asociar el nuevo cliente al envío
            await envioData.update(
                { id_cliente: nuevoCliente.id_cliente }, 
                { transaction }
            );
    
        } else {
            // 🔹 4️⃣ Si el RUT no cambió, actualizar el cliente existente
            await envioData.Cliente.update(
                {
                    nombre: cliente.nombre,
                    direccion: cliente.direccion,
                    actividad_economica: cliente.actividad,
                    comuna: cliente.comuna,
                    ciudad: cliente.ciudad,
                    region: cliente.region,
                    telefono: cliente.telefono
                },
                { transaction }
            );
        }

        // Actualizar el envío
        await envioData.update(
            {
                condicion_pago: envio.condicion,
                fecha: envio.fecha,
                ciudad_origen: envio.origen,
                ciudad_destino: envio.destino,
                lugar_recogida: envio.recogida,
                lugar_entrega: envio.entrega
            },
            {
                transaction
            }
        );

        // Eliminar todas las mercancías actuales asociadas al envío
        await Mercancia.destroy({
            where: { id_envio: envioData.id_envio },
            transaction
        });

        // Insertar las nuevas mercancías
        const nuevasMercancias = mercancias.map(mercancia =>{
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
                id_envio: envioData.id_envio
            }; 
        });
    
        await Mercancia.bulkCreate(nuevasMercancias, { transaction });

        // Confirmar la transacción
        await transaction.commit();

        // Respuesta exitosa
        res.json({ message: "Envío y mercancías actualizados correctamente" });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error("Error al actualizar el envío y las mercancías:", error);
        res.status(500).json({ message: "Error al actualizar el envío y las mercancías" });
    }
};