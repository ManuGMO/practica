import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import '../App.css';

import { ciudades } from '../functions/ciudades';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import VisualizarOrden from './visualizarOrden';
import '../styles/formulario.css';
import { add, buscarCliente, agregar, cancelarEnvio, crearNumeroOrden } from '../services/formularioService';


const Formulario = () => {

  const [bloquearInputs, setBloquearInputs] = useState(false);
  const [mostrarOrden, setMostrarOrden] = useState(false);

  // -----------------PARAMETROS CLIENTES-------------------
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [actividad, setActividad] = useState("");
  const [comuna, setComuna] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [region, setRegion] = useState("");
  const [telefono, setTelefono] = useState("");


  // ------------------PARAMETROS ENVIO----------------------
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [recogida, setRecoger] = useState("");
  const [entrega, setEntregar] = useState("");

  // ------------------PARAMETROS MERCANCIA-------------------
  const [descripcion, setDescripcion] = useState('');
  const [peso, setPeso] = useState('');
  const [metrosCubicos, setMetrosCubicos] = useState('');
  //const [items, setItems] = useState([]);
  const [tipobulto, setTipoBulto] = useState("");
  const [cantidadbultos, setCantidadBulto] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [proveedor, setProveedor] = useState("");

// ------------MOSTRAR MERCANCIA AGREGADA--------------
  const [mercancia, setMercancia] = useState([]);

  // ----------------Agregar clientes y envios a base de datos--------------
  const clienteData = {rut,nombre,direccion,actividad,comuna,ciudad,region,telefono};
  const envioData = {lugar, fecha, origen, destino, recogida, entrega};
  let navigate = useNavigate();
  const [idEnvio, setIdEnvio] = useState("");
  const ingresar = async () => {
    let id_envio;
    try{
     id_envio = await add(clienteData,envioData);

     if (!id_envio) {
      throw new Error("No se pudo obtener el ID del envío.");
    }
     setIdEnvio(id_envio);
     console.log("Deberia ser la id del envio: ",id_envio);

     const mercanciasData = mercancia.map(item => ({
      descripcion: item.descripcion,
      tipo_pago: item.tipoDocumento,
      num_documento: item.numeroDocumento,
      proveedor: item.proveedor,
      peso: item.peso,
      metros_cubicos: item.metrosCubicos,
      tipo_bulto: item.tipo_bulto,
      cantidad_bultos: item.cantidad_bultos,
      id_envio 
  }));
    await agregar(mercanciasData);
    
    //Aqui deberia de haber una condicion que al recibir un error de cualquier funcion, 
    //    se salga de esta funcion 'ingresar' y alerte por el error

    let numero_orden = await crearNumeroOrden(id_envio)
    // Redirigir a la ruta /orden
    navigate(`/formulario/orden/${numero_orden}`);

  } catch(error){

    if (id_envio) {
      console.log ("ID: ", id_envio);
      await cancelarEnvio(id_envio);
  }
    console.error("Error en el proceso de ingreso:", error);
    alert("Ocurrió un error y no se completó la operación.");

    
  }

  };

  // -------------buscar clientes segun rut--------------
  const buscar = async () => {
    try {
        const clienteEncontrado = await buscarCliente(rut);
        console.log(clienteEncontrado);
        if (clienteEncontrado) {
            setNombre(clienteEncontrado.nombre);
            setDireccion(clienteEncontrado.direccion);
            setActividad(clienteEncontrado.actividad_economica);
            setComuna(clienteEncontrado.comuna);
            setCiudad(clienteEncontrado.ciudad);
            setRegion(clienteEncontrado.region);
            setTelefono(clienteEncontrado.telefono);
        } else {
            alert("Cliente no encontrado");
        }
    } catch (error) {
        console.error("Error al buscar el cliente:", error);
        alert("Ocurrió un error al buscar el cliente.");
    }
};

  // -----------AGREGAR MERCANCIA---------------
  const agregarMercancia = () => {
    const nuevaMercancia = {
        id: mercancia.length + 1, // Generar un ID temporal
        descripcion,
        tipoDocumento,
        numeroDocumento,
        proveedor,
        peso,
        metrosCubicos,
        tipo_bulto: tipobulto,
        cantidad_bultos: cantidadbultos
    };
    // Agregar la nueva mercancía al estado
    setMercancia([...mercancia, nuevaMercancia]);
    // Limpiar los campos de entrada
    setDescripcion('');
    setTipoDocumento('');
    setNumeroDocumento('')
    setProveedor('');
    setPeso('');
    setMetrosCubicos('');
    setTipoBulto('');
    setCantidadBulto('');
};

//-----------ELIMINAR MERCANCIAS-------------
const [borrar,setborrar] = useState(null);
const remove = (index) => {
  const nuevasMercancias = mercancia.filter((_, i) => i !== index);
  setMercancia(nuevasMercancias);
};



  const handleKeyDown = (event) => {
    const focusableElements = document.querySelectorAll('.datos input');
    const totalElements = focusableElements.length;
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

    if ((event.key === 'ArrowDown') || (event.key==='Enter')) {
      const nextIndex = (currentIndex + 1) % totalElements;

      focusableElements[nextIndex].focus();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      const prevIndex = (currentIndex - 1 + totalElements) % totalElements;
      focusableElements[prevIndex].focus();
      event.preventDefault();
    }
  };


  return (
    <div className="container">
      <h3 className="text-center mt-2">Crear orden de flete</h3>
    {!mostrarOrden ? (
      <div className="formula" >       

        <div className='form-container'>
        <div className='container_button'>
                    <a href="/" type="button" className="volver_embarque btn btn-outline-success">
                        <i class="bi bi-arrow-left-square-fill"></i>
                        Atras
                    </a>
                </div>

          <div className="col-md-6 datos" onKeyDown={handleKeyDown}>
              <h3>Formulario de Cliente</h3>

            <div className="input-group input-group-sm mb-1">
              <span class="input-group-text" id="basic-addon1">RUT: </span>
              <input onChange={(event)=>{setRut(event.target.value);}} class= "form-control" 
              type="text" id="rut" name="rut" placeholder="Ingrese el RUT" aria-label="Recipient's username" aria-describedby="button-addon2" disabled={bloquearInputs}/>

              <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={buscar}>Buscar</button>
            </div>

            <div className="input-group input-group-sm mb-1">
              <span class="input-group-text" id="basic-addon1">Nombre: </span>
              <input value={nombre} onChange={(event)=>{setNombre(event.target.value);}}  class= "form-control" 
              type="text" id="nombre" name="nombre" placeholder="Ingrese el nombre" aria-label="Recipient's username" aria-describedby="button-addon2" disabled={bloquearInputs}/>
            </div>
            
            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon3">Dirección:</span>
                <input value={direccion} onChange={(event) => { setDireccion(event.target.value); }} class= "form-control" 
                      type="text" id="direccion" name="direccion" placeholder="Ingrese la dirección" aria-label="Dirección" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon4">Actividad Económica:</span>
                <input value={actividad} onChange={(event) => { setActividad(event.target.value); }} class= "form-control" 
                      type="text" id="actividad" name="actividad" placeholder="Ingrese la actividad económica" aria-label="Actividad Económica" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1 ">
                <span class="input-group-text" id="basic-addon5">Comuna:</span>
                <input value={comuna} onChange={(event) => { setComuna(event.target.value); }} class= "form-control" 
                      type="text" id="comuna" name="comuna" placeholder="Ingrese la comuna" aria-label="Comuna" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon6">Ciudad:</span>
                <input value={ciudad} onChange={(event) => { setCiudad(event.target.value); }} class= "form-control" 
                      type="text" id="ciudad" name="ciudad" placeholder="Ingrese la ciudad" aria-label="Ciudad" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon7">Región:</span>
                <input value={region} onChange={(event) => { setRegion(event.target.value); }} class= "form-control" 
                      type="text" id="region" name="region" placeholder="Ingrese la región" aria-label="Región" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon8">Teléfono:</span>
                <input value={telefono} onChange={(event) => { setTelefono(event.target.value); }} class= "form-control" 
                      type="tel" id="telefono" name="telefono" placeholder="Ingrese el teléfono" aria-label="Teléfono" disabled={bloquearInputs}/>
            </div>
          </div>
            



        <div className='col-md-6 datos_envio'>
          <h3>Detalles del envio</h3>

          <div className="input-group mb-2">
                <label className="input-group-text" htmlFor="origenSelect">Origen:</label>
                <select className="form-select" id="origenSelect" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                    <option value="">Seleccione una ciudad...</option>
                    {ciudades.map((ciudad) => (
                        <option key={ciudad.codigo} value={ciudad.codigo}>
                            {ciudad.nombre} ({ciudad.codigo})
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group mb-2">
                <label className="input-group-text" htmlFor="destinoSelect">Destino:</label>
                <select 
                    className="form-select" 
                    id="destinoSelect" 
                    value={destino} 
                    onChange={(e) => setDestino(e.target.value)}
                >
                    <option value="">Seleccione una ciudad...</option>
                    {ciudades.map((ciudad) => (
                        <option key={ciudad.codigo} value={ciudad.codigo}>
                            {ciudad.nombre} ({ciudad.codigo})
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon9">Lugar de envio:</span>
                <input 
                    onChange={(event) => setLugar(event.target.value)} 
                    type="text" id="lugar" name="lugar" placeholder="Ingrese el lugar" 
                    class="form-control" aria-label="Lugar" aria-describedby="basic-addon9" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon10">Fecha:</span>
                <input 
                    onChange={(event) => setFecha(event.target.value)} 
                    type="date" id="fecha" name="fecha" 
                    class="form-control" aria-label="Fecha" aria-describedby="basic-addon10" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon13">Lugar de Recogida:</span>
                <input 
                    onChange={(event) => setRecoger(event.target.value)} 
                    type="text" id="recoger" name="recoger" placeholder="Ingrese el lugar de recogida"
                    class="form-control" aria-label="Lugar de Recogida" aria-describedby="basic-addon13" disabled={bloquearInputs}/>
            </div>

            <div className="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon14">Lugar de Entrega:</span>
                <input 
                    onChange={(event) => setEntregar(event.target.value)} 
                    type="text" id="entregar" name="entregar" placeholder="Ingrese el lugar de entrega"
                    class="form-control" aria-label="Lugar de Entrega" aria-describedby="basic-addon14" disabled={bloquearInputs}/>
            </div>
      </div>       
    </div>


          <div className="mercancia_container" >
            <h3>Agregar Mercancía</h3>
            <div className="input-group input-group-sm mb-1">

              <input value={descripcion} type="text" class="form-control" placeholder="Descripción de la mercancía" 
                onChange={(e) => setDescripcion(e.target.value)} disabled={bloquearInputs}/>

              <select value={tipoDocumento} className="form-select" id='tipoDoc' onChange={(e) => setTipoDocumento(e.target.value)} disabled={bloquearInputs}>
                <option value="">Tipo de pago</option>
                <option value="Boleta">Boleta</option>
                <option value="Factura">Factura</option>
                <option value="Guia de despacho">Guía de despacho</option>
              </select>

              <input value={numeroDocumento} type="text" class="form-control" placeholder="Numero de documento" 
                onChange={(e) => setNumeroDocumento(e.target.value)} disabled={bloquearInputs}/>
              <input value={proveedor} type="text" class="form-control" placeholder="Nombre Proveedor" 
                onChange={(e) => setProveedor(e.target.value)} disabled={bloquearInputs}/>
              <input value={peso} type="number" class="form-control" placeholder="Peso estimado" 
                onChange={(e) => setPeso(e.target.value)} disabled={bloquearInputs}/>
              <input value={metrosCubicos} type="number" class="form-control" placeholder="Metros cúbicos" 
                onChange={(e) => setMetrosCubicos(e.target.value)} disabled={bloquearInputs}/>
              <input value={tipobulto} type="text" class="form-control" placeholder="Tipo de bulto" 
                onChange={(e) => setTipoBulto(e.target.value)} disabled={bloquearInputs}/>
              <input value={cantidadbultos} type="number" class="form-control" placeholder="Cantidad de Bultos" 
                onChange={(e) => setCantidadBulto(e.target.value)} disabled={bloquearInputs} />

              {/* BOTON PARA AGREGAR MERCANCIA */}
              <button type="button" class="btn btn-primary btn-sm" onClick={agregarMercancia}>Agregar</button>
            </div>

            {/* Tabla para mostrar los items agregados */}
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Descripción</th>
                  <th scope="col">Tipo de pago</th>
                  <th scope="col">Num. documento</th>
                  <th scope="col">Proveedor</th>
                  <th scope="col">Peso(kg)</th>
                  <th scope="col">Metros³</th>
                  <th scope="col">Tipo de Bulto</th>
                  <th scope="col">Cantidad de Bultos</th>
                </tr>
              </thead>
              <tbody>
                {mercancia.map((val,key) => (
                  <tr key={key}>
                    <td>{val.descripcion}</td>
                    <td>{val.tipoDocumento}</td>
                    <td>{val.numeroDocumento}</td>
                    <td>{val.proveedor}</td>
                    <td>{val.peso}</td>
                    <td>{val.metrosCubicos}</td>
                    <td>{val.tipo_bulto}</td>
                    <td>{val.cantidad_bultos}</td>

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
                          {/* BOTON PARA INGRESAR DATOS DE CLIENTES, ENVIO y MERCANCIA   */}
            <button type="button" class="boton-ing btn btn-success mt-0 m-3" data-bs-toggle="modal" data-bs-target="#confirmarOrdenModal">Crear Orden</button>

            <div class="modal fade" id="confirmarOrdenModal" tabindex="-1" aria-labelledby="confirmarOrdenModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="confirmarOrdenModalLabel">Confirmar orden</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    ¿Estás seguro de que deseas crear esta orden?
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary btn-success" onClick={() => { ingresar(); }} data-bs-dismiss="modal">Confirmar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <VisualizarOrden
            clienteData={clienteData}
            envioData={envioData}
            mercancia={mercancia}
          />
        )}

    </div>

  );


};

export default Formulario;