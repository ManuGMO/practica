
import Axios from 'axios';

export const add = (clienteData, envioData) => {
    // Combina ambos objetos en uno solo
    const data = {
        ...clienteData,
        envioData 
    };
    console.log("Datos enviados al backend:", data);    
    return Axios.post("http://localhost:3001/createCliente", data)
        .then(() => {
            alert("Cliente y envío registrados");
        })
        .catch((error) => {
            console.error("Error al registrar el cliente y envío:", error);
        });
};



export const buscarCliente = async (rut) => {
    try {
        const response = await Axios.get(`http://localhost:3001/getCliente/${rut}`);
        console.log(response.data); // Aquí deberías ver los datos si todo funciona.
        return response.data; // Devuelve el dato para ser usado en el frontend.
    } catch (error) {
        console.error("Error en buscarCliente:", error);
        throw error; // Lanza el error para que el frontend pueda manejarlo.
    }
};