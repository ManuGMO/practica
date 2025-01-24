import axios from "axios";

export const getOrdenByNumero = async (numero_orden) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/visualizar/${numero_orden}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo la orden:", error);
        return null;
    }
};