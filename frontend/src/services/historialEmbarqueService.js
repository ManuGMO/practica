import axios from 'axios';


export const getHistorialEmbarques = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/api/historialEmbarques`);
        console.log('miau', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo historial de embarques:', error);
        return [];
    }
};

export const fetchMercancias = async (id_embarque) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/historialEmbarques/mercanciasEmbarque/${id_embarque}`);
        console.log("Datos:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("Error al obtener mercancías:", error);
    }
};