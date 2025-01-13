import React from 'react';

const VisualizarOrden = ({ clienteData, envioData, mercancia }) => {
  return (
    <div className="orden-confirmada">
      <h3>Orden Confirmada</h3>
      <h4>Datos del Cliente</h4>
      <p><strong>RUT:</strong> {clienteData.rut}</p>
      <p><strong>Nombre:</strong> {clienteData.nombre}</p>
      <p><strong>Dirección:</strong> {clienteData.direccion}</p>
      <p><strong>Actividad Económica:</strong> {clienteData.actividad}</p>
      <p><strong>Comuna:</strong> {clienteData.comuna}</p>
      <p><strong>Ciudad:</strong> {clienteData.ciudad}</p>
      <p><strong>Región:</strong> {clienteData.region}</p>
      <p><strong>Teléfono:</strong> {clienteData.telefono}</p>

      <h4>Detalles del Envío</h4>
      <p><strong>Lugar:</strong> {envioData.lugar}</p>
      <p><strong>Fecha:</strong> {envioData.fecha}</p>
      <p><strong>Origen:</strong> {envioData.origen}</p>
      <p><strong>Destino:</strong> {envioData.destino}</p>
      <p><strong>Lugar de Recogida:</strong> {envioData.recoger}</p>
      <p><strong>Lugar de Entrega:</strong> {envioData.entregar}</p>

      <h4>Mercancía</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Peso</th>
            <th>Metros Cúbicos</th>
            <th>Tipo de Bulto</th>
            <th>Cantidad de Bultos</th>
          </tr>
        </thead>
        <tbody>
          {mercancia.map((item, index) => (
            <tr key={index}>
              <td>{item.descripcion}</td>
              <td>{item.peso}</td>
              <td>{item.metrosCubicos}</td>
              <td>{item.tipo_bulto}</td>
              <td>{item.cantidad_bultos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisualizarOrden;