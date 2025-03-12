import Axios from "axios";

export const api = Axios.create({
    baseURL: process.env.API_URL || "http://localhost:3001/api", // Usar una variable de entorno para la URL
    headers: {
        'Content-Type': 'application/json',
    },
});