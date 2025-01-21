import React, { useEffect, useState } from "react";

const TablaEnvios = ({ datos, onSeleccionar }) => {
    const [seleccionados, setSeleccionados] = useState([]);

    const datosArray = Array.isArray(datos) ? datos : [datos];

    // Manejo de selección de checkboxes
    const toggleSeleccion = (id_envio) => {
        setSeleccionados((prev) => {
            const newSeleccionados = prev.includes(id_envio)
                ? prev.filter((id) => id !== id_envio) // Deseleccionar
                : [...prev, id_envio]; // Seleccionar

            // Llama a la función onSeleccionar para pasar los IDs seleccionados al componente padre
           
            return newSeleccionados;
        });
    };

    useEffect(() => {
        onSeleccionar(seleccionados);
    }, [seleccionados, onSeleccionar]);

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-3">Lista de Mercancías</h3>
            <table className="table table-striped table-bordered">
                <thead className="table-success">
                    <tr>
                        <th></th>
                        <th>ID Envío</th>
                        <th>Total Mercancías</th>
                        <th>Total Peso (kg)</th>
                        <th>Total Metros Cúbicos</th>
                        <th>Total Cantidad Bultos</th>
                    </tr>
                </thead>
                <tbody>
                    {datosArray.length > 0 ? (
                        datosArray.map((item) => (
                            <tr key={item.id_envio}>
                                <td className="table-striped table-success"style={{textAlign:'center'} }>
                                    <input
                                        class="form-check-input " type="checkbox" style={{height:'20px' , width: '20px'} }
                                        checked={seleccionados.includes(item.id_envio)}
                                        onChange={() => toggleSeleccion(item.id_envio)}
                                    />
                                </td>
                                <td>{item.id_envio}</td>
                                <td>{item.total_mercancias}</td>
                                <td>{parseFloat(item.total_peso).toFixed(2)} kg</td>
                                <td>{parseFloat(item.total_metros_cubicos).toFixed(2)} m³</td>
                                <td>{item.total_cantidad_bultos}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaEnvios;