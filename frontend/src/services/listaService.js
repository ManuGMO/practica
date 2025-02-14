import axios from "axios";

export const obtenerListaEmbarques = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/api/listaEmbarques`);
        console.log('wof', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo historial de embarques:', error);
        return [];
    }
};

export const fetchMercancias = async (id_embarque) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/listaMercancias/${id_embarque}`);
        console.log("Datos:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("Error al obtener mercancías:", error);
    }
};
