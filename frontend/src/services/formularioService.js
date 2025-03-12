
import { api } from '../config/api';
import Axios from 'axios';


//----------- METODOS PARA CREAR UNA NUEVA ORDEN

export const add = async (clienteData, envioData, mercanciasData) => {
    // Combina ambos objetos en uno solo
    try{
        const datos = {...clienteData, ...envioData, mercanciasData};

        console.log("Pedido: ", datos);
        const response = await api.post("/formulario/createOrder", datos,{ withCredentials: true });

        console.log("Numero de orden: ", response.data.numero_orden);

        return response; 
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



// -----------METODOS PARA ACTUALIZAR UNA ORDEN DE ENVIO (segun numero de orden)--------------------

export const obtenerDatosEnvio = async(numero_orden) => {
    try{
        const response = await Axios.get(`http://localhost:3001/api/formulario/envio/${numero_orden}`);
        return response.data;
    } catch(error){
        throw error;
    }
};


export const actualizarEnvio = async (numero_orden, clienteData, envioData, mercanciaData) => {
    try {

        const response = await Axios.put(`http://localhost:3001/api/formulario/envio/${numero_orden}`, {
            cliente: clienteData,
            envio: envioData,
            mercancias: mercanciaData
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el envío:", error);
        throw error;
    }
};





