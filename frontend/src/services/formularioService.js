
import Axios from 'axios';

export const add = async (clienteData, envioData) => {
    // Combina ambos objetos en uno solo
    try{
        const datos = {...clienteData, envioData};
        console.log("Datos enviados al backend:", datos);

        const response = await Axios.post("http://localhost:3001/api/createCliente", datos);
        alert("Cliente y envío registrados");

        return response.data.id_envios; 
    }catch(error){
        console.error("Error al registrar el cliente y envío:", error);
        throw error;
    }
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


export const agregar = async (mercanciasData) =>{
    try {
        await Axios.post("http://localhost:3001/api/agregarMercancias", mercanciasData);
        alert("Mercancías registradas");
      } catch (error) {
        console.error("Error al registrar mercancías:", error);
        throw error; // Lanza el error para que lo capture `ingresar`
      }
    };


    export const cancelarEnvio = (id_envio) => {
        return Axios.delete(`http://localhost:3001/api/eliminarEnvio/${id_envio}`)
            .then(() => {
                alert("El envío fue eliminado correctamente.");
            })
            .catch((error) => {
                console.error("Error al eliminar el envío:", error);
            });
    };