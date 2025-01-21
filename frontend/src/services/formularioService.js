
import Axios from 'axios';

export const add = (clienteData, envioData) => {
    // Combina ambos objetos en uno solo
    const datos = {
        ...clienteData,
        envioData 
    };
    console.log("Datos enviados al backend:", datos);

    return Axios.post("http://localhost:3001/api/createCliente", datos)
        .then((response) => {
            alert("Cliente y envío registrados");
            const id_envio = response.data.id_envios;
            console.log(id_envio);
            return id_envio;
        })
        .catch((error) => {
            console.error("Error al registrar el cliente y envío:", error);
        });
};



export const buscarCliente = async (rut) => {
    try {
        console.log("Holaaaaa");
        const response = await Axios.get(`http://localhost:3001/api/getCliente/${rut}`);
        console.log(response.data); // Aquí deberías ver los datos si todo funciona.
        return response.data; // Devuelve el dato para ser usado en el frontend.
    } catch (error) {
        console.error("Error en buscarCliente:", error);
        throw error; // Lanza el error para que el frontend pueda manejarlo.
    }
};


export const agregar = (mercanciasData) =>
    Axios.post("http://localhost:3001/api/agregarMercancias", mercanciasData)
        .then(() => {
            alert("Mercancías registradas");
            // Limpiar el estado después de enviar
            
        })
        .catch((error) => {
            console.error("Error al registrar mercancías:", error);
        });
