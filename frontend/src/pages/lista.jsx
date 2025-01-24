import React, { useEffect, useState } from "react";
import { obtenerListaEmbarques } from "../services/listaService"; // Importa la función del servicio

const Lista = () => {
    const [embarques, setEmbarques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await obtenerListaEmbarques(); // Llama al servicio para obtener los datos
                setEmbarques(response.data); // Guarda los datos en el estado
            } catch (err) {
                console.error("Error al obtener los embarques:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    

    return (
        <div className='container'>
            <h2 className="text-center mt-3 mb-5">Lista de embarques</h2>
            {loading ? (
                <p>Cargando datos...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <table className="table table-success table-striped-columns">
                    <thead>
                        <tr>
                            <th>Fecha salida</th>
                            <th>ID Envío</th>
                            <th>Cliente</th>
                            <th>Tipo pago</th>
                            <th>Nro Documento</th>
                            <th>Peso</th>
                            <th>Metros cúbicos</th>
                            <th>Tipo bulto</th>
                            <th>Patente camión</th>
                            <th>Patente remolque</th>
                        </tr>
                    </thead>
                    <tbody>
                        {embarques.map((item) => (
                            <tr key={item.id_mercancia}>
                                <td>{new Date(item.fecha_salida).toLocaleDateString("es-CL", {year: "numeric",month: "2-digit",day: "2-digit",})}</td>
                                <td>{item.id_envio}</td>
                                <td>{item.nombre}</td>
                                <td>{item.tipo_pago}</td>
                                <td>{item.num_documento}</td>
                                <td>{item.peso}</td>
                                <td>{item.metros_cubicos}</td>
                                <td>{item.tipo_bulto}</td>
                                <td>{item.patente_camion}</td>
                                <td>{item.patente_remolque}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Lista;
