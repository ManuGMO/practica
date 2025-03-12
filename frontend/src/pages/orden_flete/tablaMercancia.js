import React, { useEffect, useState } from "react";


const TablaMercancia = ({ mercancia, setMercancia }) =>{

    const [descripcion, setDescripcion] = useState('');
    const [peso_unidad, setPesoUnidad] = useState('');
    const [metros_cubicos, setMetrosCubicos] = useState('');
    const [tipo_bulto, setTipoBulto] = useState("");
    const [cantidad_bultos, setCantidadBulto] = useState("");
    const [tipo_pago, setTipoPago] = useState("");
    const [num_documento, setNumeroDocumento] = useState("");
    const [proveedor, setProveedor] = useState("");
    const [rut_proveedor, setRutProveedor] = useState("");
    const [precio_unitario, setPrecio] = useState("");
    
    

    const agregarMercancia = () => {
        
        const nuevaMercancia = {
            id: mercancia.length + 1, // Generar un ID temporal
            descripcion,
            tipo_pago,
            num_documento,
            proveedor,
            rut_proveedor,
            precio_unitario,
            peso_unidad,
            metros_cubicos,
            tipo_bulto,
            cantidad_bultos
        };

        

        // Agregar la nueva mercancía al estado
        setMercancia([...mercancia, nuevaMercancia]);
        // Limpiar los campos de entrada
        setDescripcion('');
        setTipoPago('');
        setNumeroDocumento('')
        setProveedor('');
        setRutProveedor('');
        setPrecio('');
        setPesoUnidad('');
        setMetrosCubicos('');
        setTipoBulto('');
        setCantidadBulto('');
    };

    const [borrar,setborrar] = useState(null);
    const remove = (index) => {
    const nuevasMercancias = mercancia.filter((_, i) => i !== index);
    setMercancia(nuevasMercancias);
    };

    const handleMontoChange = (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Elimina cualquier carácter que no sea número
      let formattedValue = Number(value).toLocaleString("es-CL"); //Agrega los puntos cada 3 dígitos
      
      setPrecio(formattedValue);
    };

    const handleSubmit = () => {
      const montoSinPuntos = parseInt(precio_unitario.replace(/\./g, ""), 10);
      console.log("Enviando a la base de datos:", montoSinPuntos);
      // Aquí envías `montoSinPuntos` a la API o base de datos
  };



    const formatRut = (value) => {
      value = value.replace(/\./g, "").replace(/-/g, ""); // Quita puntos y guiones
      if (value.length > 1) {
          let body = value.slice(0, -1);
          let dv = value.slice(-1).toUpperCase();
          return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
      }
      return value;
  };

    const rutProv = (event) => {
      let value = event.target.value;
      value = value.replace(/[^0-9kK]/g, ""); // Solo permite números y k/K
      setRutProveedor(formatRut(value));
    };



    return(
        <div className="mercancia_container" >
            <h3>Agregar Mercancía</h3>
            <div className="input-group input-group-sm mb-1">

              <input value={descripcion} type="text" class="form-control" placeholder="Descripción de la mercancía" 
                onChange={(e) => setDescripcion(e.target.value)}/>
              <select value={tipo_pago} className="form-select" id='tipoDoc' onChange={(e) => setTipoPago(e.target.value)}>
                <option value="">Tipo de pago</option>
                <option value="Boleta">Boleta</option>
                <option value="Factura">Factura</option>
                <option value="Guia de despacho">Guía de despacho</option>
              </select>
              <input value={num_documento} type="text" class="form-control" placeholder="Numero de folio" 
                onChange={(e) => setNumeroDocumento(e.target.value)}/>
              <input value={proveedor} type="text" class="form-control" placeholder="Nombre Proveedor" 
                onChange={(e) => setProveedor(e.target.value)}/>
              <input 
                        value={rut_proveedor} 
                        onChange={rutProv} 
                        className="form-control" 
                        type="text" 
                        id="rut" 
                        name="rut" 
                        placeholder="Ingrese el RUT" 
                        aria-label="Recipient's username" 
                        aria-describedby="button-addon2" 
                    />
              
              <input value={peso_unidad} type="number" class="form-control" placeholder="Peso unidad (kg)" 
                onChange={(e) => setPesoUnidad(e.target.value)}/>
              <input value={metros_cubicos} type="number" class="form-control" placeholder="Metros cúbicos" 
                onChange={(e) => setMetrosCubicos(e.target.value)}/>
              <input value={tipo_bulto} type="text" class="form-control" placeholder="Tipo de bulto" 
                onChange={(e) => setTipoBulto(e.target.value)}/>
              <input value={cantidad_bultos} type="number" class="form-control" placeholder="Cantidad de Bultos" 
                onChange={(e) => setCantidadBulto(e.target.value)} />
              <input value={precio_unitario} type="text" className="form-control" placeholder="$ Precio Neto UN." 
                onChange={handleMontoChange}/>

              {/* BOTON PARA AGREGAR MERCANCIA */}
              <button type="button" class="btn btn-primary btn-sm" onClick={agregarMercancia}>Agregar</button>
            </div>

            {/* Tabla para mostrar los items agregados */}
            <table class="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th scope="col">Descripción</th>
                  <th scope="col">Tipo documento</th>
                  <th scope="col">Num. folio</th>
                  <th scope="col">Proveedor</th>
                  <th scope="col">Rut proveedor</th>
                  <th scope="col">Peso Unidad(kg)</th>
                  <th scope="col">Metros³</th>
                  <th scope="col">Tipo de Bulto</th>
                  <th scope="col">Cantidad de Bultos</th>
                  <th scope="col">Precio Neto Un.</th>
                </tr>
              </thead>
              <tbody>
                {mercancia.map((val,key) => (
                  <tr key={key}>
                    <td>{val.descripcion}</td>
                    <td>{val.tipo_pago}</td>
                    <td>{val.num_documento}</td>
                    <td>{val.proveedor}</td>
                    <td>{val.rut_proveedor}</td>
                    <td>{val.peso_unidad}</td>
                    <td>{val.metros_cubicos}</td>
                    <td>{val.tipo_bulto}</td>
                    <td>{val.cantidad_bultos}</td>
                    <td>{val.precio_unitario}</td>

                    <td>
                    <button type="button" class="btn btn-primary btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>setborrar(key)}><i className="bi bi-trash"></i></button>

                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Confirmar eliminación</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            ¿Seguro que desea eliminar este producto?
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary btn-danger" onClick={() => {remove(borrar); setborrar(null);}} data-bs-dismiss="modal" >Eliminar</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    </td>                      
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

    )

}

export default TablaMercancia;