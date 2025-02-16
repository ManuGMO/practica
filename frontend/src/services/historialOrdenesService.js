import axios from "axios";
axios.defaults.withCredentials = true; 

export const getHistorialOrdenes = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/api/historialOrdenes`);
        console.log('miau', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo historial de ordenes:', error);
        return [];
    }
};


export const fetchMercancias = async (id_envio) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/historialOrdenes/mercanciasOrden/${id_envio}`);
        console.log("Datos:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("Error al obtener mercancías:", error);
    }
};