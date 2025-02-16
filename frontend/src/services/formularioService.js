
import Axios from 'axios';

export const add = async (clienteData, envioData) => {
    // Combina ambos objetos en uno solo
    try{
        const datos = {...clienteData, envioData};
        console.log("Datos enviados al backend:", datos);

        const response = await Axios.post("http://localhost:3001/api/formulario/createCliente", datos);

        return response.data.id_envios; 
    }catch(error){
        console.error("Error al registrar el cliente y envío:", error);
        throw error;
    }
};

export const buscarCliente = async (rut) => {
    try {
        console.log("Holaaaaa");
        const response = await Axios.get(`http://localhost:3001/api/formulario/getCliente/${rut}`,{ withCredentials: true });
        console.log(response.data); // Aquí deberías ver los datos si todo funciona.
        return response.data; // Devuelve el dato para ser usado en el frontend.
    } catch (error) {
        console.error("Error en buscarCliente:", error);
        throw error; // Lanza el error para que el frontend pueda manejarlo.
    }
};

export const agregar = async (mercanciasData) =>{
    try {
        await Axios.post("http://localhost:3001/api/formulario/agregarMercancias", mercanciasData);
        alert("Mercancías registradas");
      } catch (error) {
        console.error("Error al registrar mercancías:", error);
        throw error; // Lanza el error para que lo capture `ingresar`
      }
    };

export const cancelarEnvio = (id_envio) => {
    return Axios.delete(`http://localhost:3001/api/formulario/eliminarEnvio/${id_envio}`)
        .then(() => {
            alert("El envío fue eliminado correctamente.");
        })
        .catch((error) => {
            console.error("Error al eliminar el envío:", error);
        });
};

export const crearNumeroOrden = async (id_envio) => {
    try {
        const numero_orden = generarNumeroOrden(id_envio);

        const response = await Axios.post('http://localhost:3001/api/formulario/crearNumero', {
            id_envio,
            numero_orden
        });

        console.log("Orden creada exitosamente:", response.data);
        return numero_orden;
    } catch (error) {
        console.error("Error al crear la orden:", error);
        return null;
    }
};


function generarNumeroOrden(seed) {
    let x = Math.sin(seed) * 10000;
    const randomValue = x - Math.floor(x);
    const randomNumber = Math.floor(randomValue * 1e9); 

 
    return String(randomNumber).padEnd(9, '0'); 
}


export const actualizarEnvio = async (numero_orden, clienteData, envioData) => {
    try {

        const response = await Axios.put(`http://localhost:3001/api/formulario/envio/${numero_orden}`, {
            cliente: clienteData,
            envio: envioData
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el envío:", error);
        throw error;
    }
};

export const actualizarMercancias = async (numero_orden, mercancias) => {
    try {
        const response = await Axios.put(`http://localhost:3001/api/formulario/actualizarMercancias/${numero_orden}`, mercancias);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar mercancías:", error);
        throw error;
    }
};