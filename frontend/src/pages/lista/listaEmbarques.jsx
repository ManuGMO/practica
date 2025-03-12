import React, { useEffect, useState } from "react";
import { obtenerListaEmbarques } from "../../services/listaService"; // Importa la función del servicio
import { fetchMercancias } from "../../services/listaService";
import '../../styles/lista_embarque.css';
import { generarPDF , InformePDF} from "./imprimir";

// --------------------------   LISTA DE LA PAGINA 'LISTA'---------------------------

const Lista = () =>  {

    const [embarques, setEmbarques] = useState([]);
    const [expandedEmbarque, setExpandedEmbarque] = useState(null);
    const [mercancias, setMercancias] = useState({});

    const [filters, setFilters] = useState({ numero_embarque: '' }); // Estado para el filtro
    const [filteredEmbarques, setFilteredEmbarques] = useState(embarques); // Estado para los embarques filtrados
    const [filterNombreCliente, setFilterNombreCliente] = useState(""); // Nuevo estado para filtrar por nombre de cliente
    const [filterNombreProveedor, setFilterNombreProveedor] = useState("");

    const handleFilterNombreCliente = (event) => {
        setFilterNombreCliente(event.target.value);
    };

    const handleFilterNombreProveedor = (event) => {
        setFilterNombreProveedor(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await obtenerListaEmbarques(); // Llama al servicio para obtener los datos
                setEmbarques(response); // Guarda los datos en el estado `embarques`
                setFilteredEmbarques(response); // Inicializa `filteredEmbarques` con todos los embarques
            } catch (err) {
                console.error("Error al obtener los embarques:", err);
            }
        };
    
        fetchData();
    }, []);


    
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    
        // Filtrar por número de embarque en tiempo real
        let filtered = embarques.filter(embarque =>
            embarque.num_embarque.toString().includes(value)
        );
    
        // Aplicar el filtro por RUT si está activo
        if (filters.filterByRut) {
            filtered = filtered.filter(embarque => embarque.rut === "96.994.750-1");
        }
    
        setFilteredEmbarques(filtered);
    };


    
    const toggleRutFilter = () => {
        setFilters(prev => ({ ...prev, filterByRut: !prev.filterByRut }));
    
        let filtered = embarques;
    
        if (!filters.filterByRut) {
            filtered = embarques.filter(embarque => embarque.ruts.includes("96.994.750-1"));
        }
    
        setFilteredEmbarques(filtered);
    };


    const toggleExpand = async (id_embarque) => {
        setFilterNombreCliente("");
            if (expandedEmbarque === id_embarque) {
                setExpandedEmbarque(null);
                
            } else {
                setExpandedEmbarque(id_embarque);
                if (!mercancias[id_embarque]) {
                    try {
                        const data = await fetchMercancias(id_embarque);  // Espera los datos reales
                        setMercancias(prev => ({ ...prev, [id_embarque]: data })); //Guarda los datos, no la promesa
                    } catch (error) {
                        console.error("Error al obtener las mercancías:", error);
                    }
                }
            }
    };
    
    const handleUpdate = () => {
        const value = filters.numero_embarque;
    
        if (value === '') {
            // Si el input está vacío, mostrar todos los embarques
            setFilteredEmbarques(embarques);
        } else {
            // Buscar el valor exacto
            const exactMatch = embarques.filter(embarque =>
                embarque.num_embarque.toString() === value
            );
            setFilteredEmbarques(exactMatch);
        }
    };

    return (
        <div className="justify-content-center w-100">

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

            <h2 className="text-center mt-3 mb-5">Lista de embarques</h2>



            <table className="  mi-tabla">
                
            <thead>
                <tr>
                    <th>
                        <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', width:'40%'}}>
                            {/* Label menos ancho */}
                            <label htmlFor="numero_embarque" style={{ width: '100px', fontWeight: 'bold' }}>
                            <span style={{ color: '#666', fontStyle: 'italic' }}>
                                Ingrese número de embarque:
                            </span>
                            </label>

                            {/* Input para filtrar */}
                            <input
                                type="text"
                                id="numero_embarque"
                                name="numero_embarque"
                                value={filters.numero_embarque || ''}
                                onChange={handleFilterChange}
                                placeholder="Filtrar por número de embarque"
                                className="form-control"
                                style={{  width:'100px', flex: 1 }}
                            />
                            

                            {/* Botón para actualizar */}
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdate}
                                style={{ marginLeft: '10px' }}
                            >
                                Buscar
                            </button>

                             {/* Checkbox para filtrar por RUT */}
                        <div style={{ marginLeft: '15px' }}>
                            <input
                                type="checkbox"
                                id="filterByRut"
                                checked={filters.filterByRut}
                                onChange={toggleRutFilter}
                            />
                            <label htmlFor="filterByRut" style={{ marginLeft: '5px' }}>
                                Superfrut
                            </label>
                        </div>
                        </div>
                    </th>
                </tr>
            </thead>

                <tbody className=" w-100">
                    {filteredEmbarques.map((embarque,index) => (
                        <React.Fragment key={embarque.id_embarque}>
                            {/* Primera fila con 3 columnas */}
                            
                            <div className="mt-4" style={{ 
                                width: '95%', 
                                margin: '0 auto', 
                                display: 'flex', 
                                alignItems: 'center',
                                border: '2px solid #ccc',
                                borderRadius: '3px', // bordes redondeados
                                padding: '10px', //  espacio interno
                                backgroundColor: '#f9f9f9' // mejor contraste
                            }}>
                                {/* Nuevo div para el número de embarque */}
                                <div style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '1.2em' }}>
                                    {index+1}. {/* Número que enumera los embarques */}
                                </div>

                                {/* Contenido de la fila */}
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <table style={{ width: 'calc(100% - 50px)' }}>
                                        <tbody>
                                            {/* Primera fila con 3 columnas */}
                                            <tr>
                                                <td><strong>Número Embarque:</strong> {embarque.num_embarque}</td>
                                                <td><strong>Patente Remolque:</strong> {embarque.patente_remolque}</td>
                                                <td><strong>Fecha Embarque:</strong> {new Date(embarque.fecha_salida).toLocaleDateString()}</td>
                                            </tr>
                                            {/* Segunda fila con 2 columnas */}
                                            <tr>
                                                
                                                <td><strong>Chofer:</strong> {embarque.chofer}</td>
                                                <td><strong>Patente Camión:</strong> {embarque.patente_camion}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Botón al lado derecho */}
                                    <div style={{ marginLeft: '10px' }}>
                                        <button className="btn btn-primary" onClick={() => toggleExpand(embarque.id_embarque)}>
                                            {expandedEmbarque === embarque.id_embarque ? (
                                                <i className="bi bi-arrow-up-circle-fill"></i> // Icono de "Ocultar"
                                            ) : (
                                                <i className="bi bi-arrow-down-circle-fill"></i> // Icono de "Ver Mercancías"
                                            )}
                                        </button>
                                    </div>
                                    <button className="btn btn-danger" style={{ marginLeft: '10px' }} onClick={() => generarPDF(embarque, mercancias)}>
                                        <i className="bi bi-file-earmark-pdf-fill"></i>
                                    </button>
                                </div>
                            </div>


                            {/* Mostrar mercancías si está expandido */}
                            {expandedEmbarque === embarque.id_embarque && (
                                <tr className="contenido">
                                    <td colSpan="4">
                                        <table className="table table-bordered w-100">
                                            <thead>
                                                <tr>
                                                    <th colSpan="17">
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                            <label htmlFor="filter-nombre-cliente" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                                                Filtrar por Nombre Cliente:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="filter-nombre-cliente"
                                                                value={filterNombreCliente}
                                                                onChange={handleFilterNombreCliente}
                                                                placeholder="Ingrese nombre cliente"
                                                                className="form-control"
                                                                style={{ width: '200px' }}
                                                            />
                                                            <label htmlFor="filter-nombre-proveedor" style={{ marginRight: '10px',marginLeft:"50px", fontWeight: 'bold' }}>
                                                                Filtrar por Nombre Proveedor:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="filter-nombre-proveedor"
                                                                value={filterNombreProveedor}
                                                                onChange={handleFilterNombreProveedor}
                                                                placeholder="Ingrese nombre proveedor"
                                                                className="form-control"
                                                                style={{ width: '200px' }}
                                                            />
                                                                <button className="btn btn-danger" style={{ marginLeft: '10px' }} onClick={() => InformePDF(mercancias[embarque.id_embarque])}>
                                                                    <i class="bi bi-table"></i>
                                                                </button>
                                                        </div>
                                                        
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>Fecha recepcion</th>
                                                    <th>Nro. Orden</th>
                                                    <th>Tipo de documento</th>
                                                    <th>Folio</th>
                                                    <th>Rut proveedor</th>
                                                    <th>Proveedor</th>
                                                    <th>$ Monto Dcto.</th>
                                                    <th>Forma de pago</th>
                                                    <th>Descripcion</th>
                                                    <th>Rut Cliente</th>
                                                    <th>Nombre Cliente</th>
                                                    <th>Numero Bultos</th>
                                                    <th>Kilos UN.</th>
                                                    <th>Kilos Total</th>
                                                    <th>Metros³</th>
                                                    <th>$ Precio Neto</th>
                                                    <th>$ Precio IVA</th>
                                              
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(() => {
                                                    // Aplicamos el filtro para obtener solo las mercancías visibles
                                                    const filteredMercancias = mercancias[embarque.id_embarque]?.filter((mercancia) =>
                                                        mercancia.nombre.toLowerCase().includes(filterNombreCliente.toLowerCase()) &&
                                                        mercancia.proveedor.toLowerCase().includes(filterNombreProveedor.toLowerCase())
                                                    ) || [];
                                                    

                                                    // Calculamos los totales basados en las mercancías filtradas
                                                    const totalMontoDcto = filteredMercancias.reduce((sum, m) => sum + Number(m.monto_documento), 0);
                                                    const totalKilosTotal = filteredMercancias.reduce((sum, m) => sum + Number(m.peso_total), 0);
                                                    const totalMetros3 = filteredMercancias.reduce((sum, m) => sum + Number(m.metros_cubicos), 0);

                                                    return (
                                                        <>
                                                            {/* Renderizar las filas de mercancías filtradas */}
                                                            {filteredMercancias.map((mercancia, index) => (
                                                                <tr key={index}>
                                                                    <td>{new Date(mercancia.fecha).toLocaleDateString()}</td>
                                                                    <td>{mercancia.numero_orden}</td>
                                                                    <td>{mercancia.tipo_pago}</td>
                                                                    <td>{mercancia.num_documento}</td>  
                                                                    <td>{mercancia.rut_proveedor}</td>
                                                                    <td>{mercancia.proveedor}</td>
                                                                    <td>${Number(mercancia.monto_documento).toLocaleString()}</td>
                                                                    <td>{mercancia.condicion_pago}</td>
                                                                    <td>{mercancia.descripcion}</td>
                                                                    <td>{mercancia.rut}</td>
                                                                    <td>{mercancia.nombre}</td>
                                                                    <td>{mercancia.cantidad_bultos}</td>
                                                                    <td>{mercancia.peso_unidad}</td>
                                                                    <td>{mercancia.peso_total}</td>
                                                                    <td>{mercancia.metros_cubicos}</td>                                                       
                                                                    <td>${Number(mercancia.precio_unitario).toLocaleString()}</td>                                                       
                                                                    <td>${Number(mercancia.precio_iva).toLocaleString()}</td>                                                       
                                                                </tr>
                                                            ))}

                                                            {/* Fila de totales (solo si hay mercancías filtradas) */}
                                                            {filteredMercancias.length > 0 && (
                                                                <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                                    <td colSpan="6" style={{ textAlign: 'right' }}>Total Monto:</td>
                                                                    <td>${totalMontoDcto.toLocaleString()}</td>
                                                                    <td colSpan="6" style={{ textAlign: 'right' }}>Total Kilos y Metros³:  </td> {/* Espacio vacío */}
                                                                    <td>{totalKilosTotal.toLocaleString()} Kg</td>
                                                                    <td>{totalMetros3.toLocaleString()} M³</td>
                                                                    <td colSpan="2"></td> {/* Espacio vacío */}
                                                                </tr>
                                                            )}
                                                        </>
                                                    );
                                                })()}
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

export default Lista;
