import axios from "axios";
axios.defaults.withCredentials = true; 

export const getHistorialOrdenes = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/api/historialOrdenes`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo historial de ordenes:', error);
        return [];
    }
};


export const fetchMercancias = async (id_envio) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/historialOrdenes/mercanciasOrden/${id_envio}`);
        return response.data;
        
    } catch (error) {
        console.error("Error al obtener mercancías:", error);
    }
};

//Eliminar orden: 
export const EliminarOrden = async (id_envio) => {
    try{
        console.log("Llegamos aca")
        const response = axios.delete(`http://localhost:3001/api/historialOrdenes/eliminarEnvio/${id_envio}`);
        alert("El envío fue eliminado correctamente.");
        return (await response).data;
    }catch(error){
        console.error("Error al eliminar el envío:", error);
    }

};