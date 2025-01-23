
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { generarBoleta } from './boletas';
import { generarTicket } from './boletas';

const VisualizarOrden = () => {
  const [clienteData, setClienteData] = useState({});
  const [envioData, setEnvioData] = useState({});
  const [mercancia, setMercancia] = useState([]);


  useEffect(() => {
    // Recuperar datos desde localStorages
    const cliente = JSON.parse(localStorage.getItem('clienteData'));
    const envio = JSON.parse(localStorage.getItem('envioData'));
    const mercanciaList = JSON.parse(localStorage.getItem('mercancia'));

    setClienteData(cliente || {});
    setEnvioData(envio || {});
    setMercancia(mercanciaList || []);
  }, []);


  // -------------GENERAR TICKETS---------------------


  return (
    <div className="orden-confirmada container mt-5">
    <h3 className="text-center">Orden Confirmada</h3>
    <div className="row mt-4">
        {/* Columna para Datos del Cliente */}
        <div className="col-md-6">
            <h4>Datos del Cliente</h4>
            <div className="list-group">
                <p className="list-group-item"><strong>RUT:</strong> {clienteData.rut}</p>
                <p className="list-group-item"><strong>Nombre:</strong> {clienteData.nombre}</p>
                <p className="list-group-item"><strong>Dirección:</strong> {clienteData.direccion}</p>
                <p className="list-group-item"><strong>Actividad Económica:</strong> {clienteData.actividad}</p>
                <p className="list-group-item"><strong>Comuna:</strong> {clienteData.comuna}</p>
                <p className="list-group-item"><strong>Ciudad:</strong> {clienteData.ciudad}</p>
                <p className="list-group-item"><strong>Región:</strong> {clienteData.region}</p>
                <p className="list-group-item"><strong>Teléfono:</strong> {clienteData.telefono}</p>
            </div>
        </div>

        {/* Columna para Detalles del Envío */}
        <div className="col-md-6">
            <h4>Detalles del Envío</h4>
            <div className="list-group">
                <p className="list-group-item"><strong>Lugar:</strong> {envioData.lugar}</p>
                <p className="list-group-item"><strong>Fecha:</strong> {envioData.fecha}</p>
                <p className="list-group-item"><strong>Origen:</strong> {envioData.origen}</p>
                <p className="list-group-item"><strong>Destino:</strong> {envioData.destino}</p>
                <p className="list-group-item"><strong>Lugar de Recogida:</strong> {envioData.recogida}</p>
                <p className="list-group-item"><strong>Lugar de Entrega:</strong> {envioData.entrega}</p>
            </div>
        </div>

        <button className="btn btn-secondary mt-3" onClick={() =>generarBoleta(envioData, clienteData, mercancia)} > Generar Boleta
          </button>
    </div>

    {/* Tabla de Mercancía */}
    <h4 className="mt-4">Mercancía</h4>
    <table className="table table-striped mt-2">
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Tipo de pago</th>
                <th>Numero Doc.</th>
                <th>Proveedor</th>
                <th>Peso(kg)</th>
                <th>Metros Cúbicos(m³)</th>
                <th>Tipo de Bulto</th>
                <th>Cantidad de Bultos</th>
                <th>  </th>
            </tr>
        </thead>
        <tbody>
            {mercancia.map((item, index) => (
                <tr key={index}>
                    <td>{item.descripcion}</td>
                    <td>{item.tipo_pago}</td>
                    <td>{item.num_documento}</td>
                    <td>{item.proveedor}</td>
                    <td>{item.peso}</td>
                    <td>{item.metros_cubicos}</td>
                    <td>{item.tipo_bulto}</td>
                    <td>{item.cantidad_bultos}</td>
                    <td>
          <button className="btn btn-primary" onClick={() => generarTicket(envioData,clienteData,item)}>
                    Generar ticket
          </button> </td>
                </tr>
            ))}
        </tbody>
    </table>

    {/* Botón para nuevo formulario */}
    <div className="text-center mb-5">
        <Link to="/" className="btn btn-success">
            Nuevo formulario
        </Link>
    </div>
</div>
  );
};

export default VisualizarOrden;