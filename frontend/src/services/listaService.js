import axios from "axios";

export const obtenerListaEmbarques = async () => {
    return await axios.get("http://localhost:3001/api/listaEmbarques");
};
