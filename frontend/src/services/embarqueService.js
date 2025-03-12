import axios from "axios";


export const getEnvios = async () => {
    try {
        const response = await axios.get("http://localhost:3001/api/embarque/getEnvios");
        console.log("Los datos que llegaron del back: ", response.data );
        return response.data;
    } catch (error){
        console.error("Error al crear al obtener Envio", error);
        alert("Hubo un error al crear al obtener Envio.");
    }
};


export const crearEmbarque = async (datos_embarque) => {
    try {
        // 1. Crear el embarque (POST request)
        const response = await axios.post("http://localhost:3001/api/embarque/crearEmbarque", {
            chofer: datos_embarque.chofer,
            num_embarque: datos_embarque.numEmbarque,
            patente_camion: datos_embarque.patenteCamion,
            patente_remolque: datos_embarque.patenteRemolque,
            fecha_salida: datos_embarque.fecha,
            id_envios : datos_embarque.seleccionados
        });

        alert("Embarque creado con éxito y envíos actualizados.");
    } catch (error) {
        console.error("Error al crear el embarque:", error);
        alert("Hubo un error al procesar el embarque.");
    }
};