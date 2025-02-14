import React, { useEffect, useState } from "react";
import { getHistorialEmbarques, fetchMercancias } from "../../services/historialEmbarqueService";


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
        <div className=" justify-content-center w-100 ">

<nav className="navbar bg-primary navbar-expand-lg" data-bs-theme="dark">
                <div className="container-fluid">
                {/* Botón Volver a la izquierda */}
                <button className="navbar-brand btn btn-primary-subtle" onClick={() => window.history.back()}>
                    <i className="bi bi-arrow-bar-left" style={{ color: "white", marginRight: "7px" }}></i>
                    Volver
                </button>

                {/* Botón de colapsar para pantallas pequeñas */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenedor de navegación */}
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav w-100 d-flex justify-content-between">
                    {/* Embarques alineado a la izquierda */}
                    <li className="nav-item">
                        
                    </li>

                    {/* Home centrado */}
                    <li className="nav-item ">
                    <button className="navbar-brand btn btn-primary" onClick={()=> window.location.href = '/'}>
                        <i className="bi bi-house-door" style={{ color: "white", marginRight: "7px" }}></i>
                        Home
                    </button>
                    </li>

                    {/* Historial de órdenes alineado a la derecha */}
                    <li className="nav-item">

                    </li>
                    </ul>
                </div>
                </div>
            </nav>
            
            <h2 className="text-center mb-2 mt-4 mb-4">Historial de Embarques</h2>

            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                width: "100%" 
            }}>
            
            <table className="table table-striped" style={{
                width: "95%",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
                border: "2px solid #ccc", 
                borderRadius: "8px",
                overflow: "hidden",
            }}>
                
                <thead style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #ccc" }}>
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
                <tbody style={{ borderCollapse: 'collapse' }}>
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
                                                <th>Tipo de Documento</th>
                                                <th>Folio Doc.</th>
                                                <th>Descripción</th>
                                                <th>Proveedor</th>
                                                <th>Rut Proveedor</th>
                                                <th>Numero de Bultos</th>
                                                <th>Kilos un.</th>
                                                <th>Kilos Total</th>
                                                <th>Metros Cúbicos(m³)</th>
                                                <th>Precio Neto</th>
                                                <th>Precio %IVA</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mercancias[embarque.id_embarque]?.map((mercancia, index) => (
                                                    <tr key={index}>
                                                        <td>{mercancia.tipo_pago}</td>
                                                        <td>{mercancia.num_documento}</td>
                                                        <td>{mercancia.descripcion}</td>
                                                        <td>{mercancia.proveedor}</td>
                                                        <td>{mercancia.rut_proveedor}</td>
                                                        <td>{mercancia.cantidad_bultos}</td>
                                                        <td>{mercancia.peso_unidad}</td>
                                                        <td>{mercancia.peso_total}</td>
                                                        <td>{mercancia.metros_cubicos}</td>
                                                        <td>{Number(mercancia.precio_unitario).toLocaleString()}</td>
                                                        <td>{Number(mercancia.precio_iva).toLocaleString()}</td>
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
        </div>
    );
};

export default HistorialEmbarques;