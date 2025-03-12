import React, { useEffect, useState } from "react";


// ---------------------TABLA QUE SALE DEBAJO DE CREAR EMBARQUE----------------

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
                        <th>Numero de Orden</th>
                        <th>Nombre cliente</th>
                        <th>Rut Cliente</th>
                        <th>Total pedidos</th>
                        <th>Total Peso (kg)</th>
                        <th>Total Metros Cúbicos</th>
                        <th>Total Bultos</th>
                        <th>Ciudad origen</th>
                        <th>Ciudad destino</th>
                    </tr>
                </thead>
                <tbody>
                    {datosArray.length > 0 ? (
                        datosArray.map((item) => (
                            <tr key={item.id_envio}>
                                <td className="table-striped table-success"style={{textAlign:'center'} }>
                                    <input
                                        class="form-check-input " 
                                        type="checkbox" 
                                        style={{height:'20px' , width: '20px'}}
                                        checked={seleccionados.includes(item.id_envio)}
                                        onChange={() => toggleSeleccion(item.id_envio)}
                                    />
                                </td>
                                <td>{item.numero_orden}</td>
                                <td>{item.nombre}</td>
                                <td>{item.rut}</td>
                                <td>{item.total_envios}</td>
                                <td>{parseFloat(item.total_peso).toFixed(2)} kg</td>
                                <td>{parseFloat(item.total_metros_cubicos).toFixed(2)} m³</td>
                                <td>{item.total_cantidad_bultos}</td>
                                <td>{item.ciudad_origen}</td>
                                <td>{item.ciudad_destino}</td>
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