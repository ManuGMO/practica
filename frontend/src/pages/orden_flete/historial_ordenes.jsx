import React, { useEffect, useState } from "react";
import { getHistorialOrdenes,fetchMercancias } from "../../services/historialOrdenesService";
import { useParams, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";


const HistorialOrdenes = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [envios, setEnvios] = useState([]); // Cambiamos embarques por envios
    const [expandedEnvio, setExpandedEnvio] = useState(null); // Cambiamos expandedEmbarque por expandedEnvio
    const [mercancias, setMercancias] = useState({}); // Mantenemos mercancias para almacenar los detalles

    const [filters, setFilters] = useState({
        nombre: "",
        rut: "",
        ciudad: "",
        condicion_pago: "",
        fecha: "",
        ciudad_origen: "",
        ciudad_destino: "",
        numero_orden: ""
    });
    const navigate = useNavigate();
    // Cargar los datos de los envíos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHistorialOrdenes(); // Usamos getHistorialOrdenes
                setEnvios(data);
                console.log("Datos: ", data);
            } catch (error) {
                console.error("Error al obtener el historial de envíos:", error);
            }
        };

        fetchData();
    }, []);

    const handleEditar = (id_envio, id_embarque, num_embarque, numero_orden) => {
        if (id_embarque !== null) {
            setModalMessage(`El envío no puede ser editado porque ya está en el embarque<br/>N° ${num_embarque}`);
            setShowModal(true);

            // Cierra el modal automáticamente después de 3 segundos
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        } else {
            navigate(`/formulario/${numero_orden}`, { state: { autorizado: true } });
        }
    };
    
    const handleEliminar = (id_envio) => {
        console.log("Eliminar embarque:", id_envio);
        // Lógica para eliminar el embarque
    };

    // Función para expandir/colapsar la fila de mercancías
    const toggleExpand = async (id_envio) => {
        if (expandedEnvio === id_envio) {
            setExpandedEnvio(null); // Colapsar si ya está expandido
        } else {
            setExpandedEnvio(id_envio); // Expandir la fila
            if (!mercancias[id_envio]) {
                try {
                    const data = await fetchMercancias(id_envio); // Obtener las mercancías
                    setMercancias(prev => ({ ...prev, [id_envio]: data })); // Guardar las mercancías en el estado
                } catch (error) {
                    console.error("Error al obtener las mercancías:", error);
                }
            }
        }
    };

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Filtrar los envíos según los valores de los filtros
    const filteredEnvios = envios.filter(envio =>
        (envio.nombre || "").toLowerCase().includes(filters.nombre.toLowerCase()) &&
        (envio.rut || "").toString().includes(filters.rut) &&
        (envio.ciudad || "").toLowerCase().includes(filters.ciudad.toLowerCase()) &&
        (envio.condicion_pago || "").toLowerCase().includes(filters.condicion_pago.toLowerCase()) &&
        (envio.fecha || "").includes(filters.fecha) &&
        (envio.ciudad_origen || "").toLowerCase().includes(filters.ciudad_origen.toLowerCase()) &&
        (envio.ciudad_destino || "").toLowerCase().includes(filters.ciudad_destino.toLowerCase()) &&
        (envio.numero_orden || "").toString().includes(filters.numero_orden)
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

            <h2 className="text-center mt-4 mb-4">Historial de Envíos</h2>

            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                width: "100%" 
            }}>
            <table className="table table-striped" style={{
                width: "97%",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
                border: "2px solid #ccc", 
                borderRadius: "8px",
                overflow: "hidden",
            }}>
                <thead style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #ccc" }}>
                    <tr>
                        <th>Nombre</th>
                        <th>RUT</th>
                        <th>Ciudad</th>
                        <th>Condición de Pago</th>
                        <th>Fecha</th>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>N° Orden</th>
                        <th></th>
                        <th>Opciones</th>
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
                        style={{
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc"
                        }}
                    />
                            </th>
                        ))}
                        <th></th>
                    </tr>
                </thead>
                <tbody style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    {filteredEnvios.map((envio) => (
                        <React.Fragment key={envio.id_envio}>
                            <tr style={{
                                marginBottom: "10px", // Margen inferior
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra ligera
                                borderRadius: "8px", // Bordes redondeados
                                backgroundColor: "#fff", // Fondo blanco
                            }}>
                                <td>{envio.nombre}</td>
                                <td>{envio.rut}</td>
                                <td>{envio.ciudad}</td>
                                <td>{envio.condicion_pago}</td>
                                <td>{new Date(envio.fecha).toLocaleDateString()}</td>
                                <td>{envio.ciudad_origen}</td>
                                <td>{envio.ciudad_destino}</td>
                                <td>
                                <a href={`/formulario/orden/${envio.numero_orden}`}>
                                    {envio.numero_orden}
                                </a>
                                {envio.num_embarque && (
                                    <div style={{ color: "red", fontWeight: "bold", fontSize: "0.9em" }}>
                                        Embarque: {envio.num_embarque}
                                    </div>
                                )}
                                </td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => toggleExpand(envio.id_envio)}>
                                        {expandedEnvio === envio.id_envio ? (
                                            <i className="bi bi-arrow-up-circle-fill"></i> // Icono de "Ocultar"
                                        ) : (
                                            <i className="bi bi-arrow-down-circle-fill"></i> // Icono de "Ver Mercancías"
                                        )}
                                    </button>
                                </td>
                                <td>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <button
                                        className="btn btn-warning btn-opciones"
                                        onClick={() => handleEditar(envio.id_envio, envio.id_embarque, envio.num_embarque, envio.numero_orden)}
                                    >
                                        Editar
                                    </button>
                                            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop={false} centered>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>⚠️ Aviso</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <p dangerouslySetInnerHTML={{ __html: modalMessage }} />
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                        Cerrar
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                        <button
                                            className="btn btn-danger"
                                            style={{ width: "100px", height: "40px" }} // Botón más ancho que alto
                                            onClick={() => handleEliminar(envio.id_envio)} // Función para eliminar
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {expandedEnvio === envio.id_envio && (
                               <tr style={{
                                marginBottom: "10px", // Margen inferior
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra ligera
                                borderRadius: "8px", // Bordes redondeados
                                backgroundColor: "#fff", // Fondo blanco
                            }}>
                                    <td colSpan="9">
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
                                                {mercancias[envio.id_envio]?.map((mercancia, index) => (
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

export default HistorialOrdenes;