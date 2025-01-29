import React, { useEffect, useState } from "react";
import { getHistorialEmbarques, fetchMercancias } from "../services/historialEmbarqueService";


const HistorialEmbarques = () => {
    const [embarques, setEmbarques] = useState([]);
    const [expandedEmbarque, setExpandedEmbarque] = useState(null);
    const [mercancias, setMercancias] = useState({});
    
    const [filters, setFilters] = useState({
        chofer: "",
        num_embarque: "",
        patente_camion: "",
        patente_remolque: "",
        fecha_salida: "",
        numero_ordenes: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHistorialEmbarques();
                console.log(data);
                setEmbarques(data);
            } catch (error) {
                console.error("Error al obtener el historial de embarques:", error);
            }
        };

        fetchData();
    }, []);

    const toggleExpand = async (id_embarque) => {
        if (expandedEmbarque === id_embarque) {
            setExpandedEmbarque(null);
        } else {
            setExpandedEmbarque(id_embarque);
            if (!mercancias[id_embarque]) {
                try {
                    const data = await fetchMercancias(id_embarque);  // 🔥 Espera los datos reales
                    setMercancias(prev => ({ ...prev, [id_embarque]: data })); // 🔥 Guarda los datos, no la promesa
                } catch (error) {
                    console.error("Error al obtener las mercancías:", error);
                }
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredEmbarques = embarques.filter(embarque =>
        (embarque.chofer || "").toLowerCase().includes(filters.chofer.toLowerCase()) &&
        (embarque.num_embarque || "").toString().includes(filters.num_embarque) &&
        (embarque.patente_camion || "").toLowerCase().includes(filters.patente_camion.toLowerCase()) &&
        (embarque.patente_remolque || "").toLowerCase().includes(filters.patente_remolque.toLowerCase()) &&
        (embarque.fecha_salida || "").includes(filters.fecha_salida) &&
        (embarque.numero_ordenes || "").toString().includes(filters.numero_ordenes)
    );

    return (
        <div className="container mt-4">
            <div>
                <button onClick={() => window.history.back()} className="btn btn-outline-success">
                    <i className="bi bi-arrow-left-square-fill"></i>
                    <span style={{ marginLeft: "8px" }}>Atrás</span>
                </button>
            </div>
            <h2 className="text-center">Historial de Embarques</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Chofer</th>
                        <th>N° Embarque</th>
                        <th>Patente Camión</th>
                        <th>Patente Remolque</th>
                        <th>Fecha Salida</th>
                        <th>Órdenes</th>
                        <th>Acción</th>
                    </tr>
                    <tr>
                        {Object.keys(filters).map((key) => (
                            <th key={key}>
                                <input
                                    type="text"
                                    name={key}
                                    value={filters[key]}
                                    onChange={handleFilterChange}
                                    placeholder={`Filtrar por ${key.replace("_", " ")}`}
                                    className="form-control"
                                />
                            </th>
                        ))}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmbarques.map((embarque) => (
                        <React.Fragment key={embarque.num_embarque}>
                            <tr>
                                <td>{embarque.chofer}</td>
                                <td>{embarque.num_embarque}</td>
                                <td>{embarque.patente_camion}</td>
                                <td>{embarque.patente_remolque}</td>
                                <td>{new Date(embarque.fecha_salida).toLocaleDateString()}</td>
                                <td>
                                    {embarque.numeros_ordenes.split(", ").map((num, index) => (
                                        <React.Fragment key={index}>
                                            <a href={`/formulario/orden/${num}`} className="text-primary">
                                                {num}
                                            </a>
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => toggleExpand(embarque.id_embarque)}>
                                        {expandedEmbarque === embarque.id_embarque ? (
                                            <i className="bi bi-arrow-up-circle-fill"></i> // Icono de "Ocultar"
                                        ) : (
                                            <i className="bi bi-arrow-down-circle-fill"></i> // Icono de "Ver Mercancías"
                                        )}
                                    </button>
                                </td>
                            </tr>
                            {expandedEmbarque === embarque.id_embarque && (
                                <tr>
                                    <td colSpan="7">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Descripción</th>
                                                    <th>Tipo de Pago</th>
                                                    <th>Número Documento</th>
                                                    <th>Proveedor</th>
                                                    <th>Peso</th>
                                                    <th>Metros Cúbicos</th>
                                                    <th>Tipo Bulto</th>
                                                    <th>Bultos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mercancias[embarque.id_embarque]?.map((mercancia, index) => (
                                                    <tr key={index}> 
                                                        <td>{mercancia.descripcion}</td>
                                                        <td>{mercancia.tipo_pago}</td>
                                                        <td>{mercancia.num_documento}</td>
                                                        <td>{mercancia.proveedor}</td>
                                                        <td>{mercancia.peso}</td>
                                                        <td>{mercancia.metros_cubicos}</td>
                                                        <td>{mercancia.tipo_bulto}</td>
                                                        <td>{mercancia.cantidad_bultos}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialEmbarques;