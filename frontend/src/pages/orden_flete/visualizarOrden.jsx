
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { generarBoleta, generarTicket, generarPDF } from './boletas';

import { getOrdenByNumero } from '../../services/visualizarService';

import html2canvas from 'html2canvas';
import 'jspdf-autotable';

const VisualizarOrden = () => {

   const navigate = useNavigate();
  const { numero_orden } = useParams(); 

  const [clienteData, setClienteData] = useState({});
  const [envioData, setEnvioData] = useState({});
  const [mercancia, setMercancia] = useState([]);




  useEffect(() => {
    const fetchOrden = async () => {
        const data = await getOrdenByNumero(numero_orden);
        if (data) {
            console.log("Datazo: ",data);
            setClienteData(data.clienteData);
            setEnvioData(data.envioData);
            setMercancia(data.mercancia);
        }
        
    };

    fetchOrden();

    
}, [numero_orden]);

console.log("cliente:", clienteData);
        console.log("envio:", envioData);
        console.log("mercancia:", mercancia);
// ------------------AJUSTAR FECHA-------------------
const fechaReal = new Date(envioData.fecha).toLocaleDateString("es-CL", {year: "numeric",month: "2-digit",day: "2-digit",});

  return (
    <div className="justify-content-center " id="contenido-pdf">

        <nav className="navbar bg-primary-subtle navbar-expand-lg" data-bs-theme="dark">
            <div className="container-fluid">
            {/* Botón Volver a la izquierda */}
            <button className="navbar-brand btn btn-primary-subtle" onClick={() => navigate(`/formulario`)}>
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
                <button className="navbar-brand btn " onClick={()=> window.location.href = '/'}>
                    <i className="bi bi-house-door" style={{ color: "white", marginRight: "7px" }}></i>
                    Home
                </button>
                </li>

                {/* Historial de órdenes alineado a la derecha */}
                <li className="nav-item">
                    <button className="navbar-brand btn " onClick={()=> window.location.href = '/embarque'}>
                    
                    Crear Embarque
                    </button>
                </li>
                </ul>
            </div>
            </div>
        </nav>

    <h3 className="text-center mt-3" style={{fontWeight: 'bold' }}>Orden Confirmada</h3> 

    
    <div className="row mt-4 ">
        {/* Columna para Datos del Cliente */}
            <div className='row justify-content-center'>
                <div className="col-md-5">
                    <h4 style={{fontStyle: 'italic' }}>Datos del Cliente</h4>

                    <div className="list-group">
                        <li className="list-group-item"><strong>RUT:</strong> {clienteData.rut}</li>
                        <li className="list-group-item"><strong>Nombre:</strong> {clienteData.nombre}</li>
                        <li className="list-group-item"><strong>Dirección:</strong> {clienteData.direccion}</li>
                        <li className="list-group-item"><strong>Actividad Económica:</strong> {clienteData.actividad}</li>
                        <li className="list-group-item"><strong>Comuna:</strong> {clienteData.comuna}</li>
                        <li className="list-group-item"><strong>Ciudad:</strong> {clienteData.ciudad}</li>
                        <li className="list-group-item"><strong>Región:</strong> {clienteData.region}</li>
                        <li className="list-group-item"><strong>Teléfono:</strong> {clienteData.telefono}</li>
                    </div>
                </div>

                {/* Columna para Detalles del Envío */}
                <div className="col-md-5">
                    <h4 style={{fontStyle: 'italic' }}>Detalles del Envío</h4>
                    
                    <div className="list-group">
                        <li className="list-group-item"><strong>Condicion pago:</strong> {envioData.condicion}</li>
                        <li className="list-group-item"><strong>Fecha:</strong> {fechaReal}</li>
                        <li className="list-group-item"><strong>Origen:</strong> {envioData.origen}</li>
                        <li className="list-group-item"><strong>Destino:</strong> {envioData.destino}</li>
                        <li className="list-group-item"><strong>Lugar de Recogida:</strong> {envioData.recogida}</li>
                        <li className="list-group-item"><strong>Lugar de Entrega:</strong> {envioData.entrega}</li>
                    </div>
                </div>

            </div>

        <div className="d-flex justify-content-between align-items-center">
                {/* Botón "Generar Boleta" al centro */}
                <div className="flex-grow-1 d-flex justify-content-end excluir-pdf">
                    <button className="btn btn-primary mt-3 excluir-pdf" onClick={() => generarBoleta(envioData, clienteData, mercancia)}>
                        Generar Boleta
                    </button>
                </div>

                {/* Botón "a" al extremo derecho */}
                <div className="flex-grow-1 d-flex justify-content-end excluir-pdf">
                    <button className="btn btn-secondary btn-block mt-3 excluir-pdf" onClick={() => generarPDF(clienteData, envioData, fechaReal, mercancia)}>
                        <i className="bi bi-printer"></i> Imprimir
                    </button>
                </div>
        </div>

    </div>

    
    {/* Tabla de Mercancía */}
    <h4 className="mt-4 p-1 ">Mercancía</h4>
        <table className="table mt-2">
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
                    <th>Forma de pago</th>
                    <th>Nombre Cliente</th>
                    <th>Rut Cliente</th>

     
                    <th> <button className="btn btn-primary excluir-pdf" onClick={() => generarTicket(envioData,clienteData,mercancia)}>
                        Generar tickets
            </button> </th>
                </tr>
            </thead>
            <tbody>
                {mercancia.map((item, index) => (
                    <tr key={index}>
                        <td>{item.tipo_pago}</td>
                        <td>{item.num_documento}</td>
                        <td>{item.descripcion}</td>
                        <td>{item.proveedor}</td>
                        <td>{item.rut_proveedor}</td>
                        <td>{item.cantidad_bultos}</td>
                        <td>{item.peso_unidad}</td>
                        <td>{item.peso_total}</td>
                        <td>{item.metros_cubicos}</td>
                        <td>{Number(item.precio_unitario).toLocaleString()}</td>
                        <td>{Number(item.precio_iva).toLocaleString()}</td>
                        <td>{envioData.condicion}</td>
                        <td>{clienteData.nombre}</td>
                        <td>{clienteData.rut}</td>

                        
                    </tr>
                ))}
            </tbody>
        </table>

    {/* Botón para nuevo formulario */}
    <div className="text-center mb-5 excluir-pdf">
        <Link to="/formulario" className="btn btn-success">
            Nuevo formulario
        </Link>
    </div>
</div>
  );
};

export default VisualizarOrden;