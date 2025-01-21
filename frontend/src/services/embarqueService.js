import axios from "axios";

export const crearEmbarque = async (datos_embarque) => {
    try {
        // 1. Crear el embarque (POST request)
        const response = await axios.post("http://localhost:3001/api/crearEmbarque", {
            chofer: datos_embarque.chofer,
            num_embarque: datos_embarque.numEmbarque,
            patente_camion: datos_embarque.patenteCamion,
            patente_remolque: datos_embarque.patenteRemolque,
            fecha_salida: datos_embarque.fecha
        });

        // Extraer el ID del embarque creado
        const id_embarque = response.data.id_embarque;

        // 2. Verificar que haya envíos seleccionados y actualizar `envios` (PUT request)
        if (datos_embarque.seleccionados.length > 0) {
            await axios.put("http://localhost:3001/api/asignarEnvios", {
                id_embarque: id_embarque,
                id_envios: datos_embarque.seleccionados
            });
        }
        alert("Embarque creado con éxito y envíos actualizados.");
    } catch (error) {
        console.error("Error al crear el embarque:", error);
        alert("Hubo un error al procesar el embarque.");
    }
};