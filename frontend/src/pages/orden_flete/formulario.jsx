import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import '../../App.css';
import Select from 'react-select';

import { ciudades } from './ciudades';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import VisualizarOrden from './visualizarOrden';
import '../../styles/formulario.css';
import { add, buscarCliente, agregar, cancelarEnvio, crearNumeroOrden } from '../../services/formularioService';
import TablaMercancia from './tablaMercancia';


const Formulario = () => {

  const [bloquearInputs, setBloquearInputs] = useState(false);
 

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
  const [condicion, setCondicion] = useState("");
  const [fecha, setFecha] = useState("");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [recogida, setRecoger] = useState("");
  const [entrega, setEntregar] = useState("");

  // ------------------ERROR

  const [errorModal, setErrorModal] = useState(null);
  
// ------------MOSTRAR MERCANCIA AGREGADA--------------
  const [mercancia, setMercancia] = useState([]);

  // ----------------Agregar clientes y envios a base de datos--------------
  const clienteData = {rut,nombre,direccion,actividad,comuna,ciudad,region,telefono};
  const envioData = {condicion, fecha, origen, destino, recogida, entrega};
  let navigate = useNavigate();
  const [idEnvio, setIdEnvio] = useState("");
  const ingresar = async () => {
    // 1️⃣ Verificar si algún campo está vacío
    const camposVacios = [
        ...Object.entries(clienteData).filter(([_, value]) => !value),
        ...Object.entries(envioData).filter(([_, value]) => !value),
    ];

    if (camposVacios.length > 0) {
        const mensajeError = `⚠️ Los siguientes campos están vacíos:\n ${camposVacios.map(([key]) => `• ${key}`).join("\n")}`;
        setErrorModal(mensajeError); // Mostrar modal de error

        // ⏳ Ocultar el modal después de 1 segundo
        setTimeout(() => setErrorModal(null), 3000);
        return; // 🚨 Se cancela la ejecución de la función
    }

    let id_envio;
    try {
        id_envio = await add(clienteData, envioData);

        if (!id_envio) {
            throw new Error("No se pudo obtener el ID del envío.");
        }

        setIdEnvio(id_envio);
        console.log("Debería ser la ID del envío:", id_envio);

        const mercanciasData = mercancia.map(item => ({
            descripcion: item.descripcion,
            tipo_pago: item.tipoDocumento,
            num_documento: item.numeroDocumento,
            proveedor: item.proveedor,
            rutProveedor: item.rutProveedor,
            precio: parseInt(item.precio.replace(/\./g, ""), 10),
            peso: item.peso,
            metros_cubicos: item.metrosCubicos,
            tipo_bulto: item.tipo_bulto,
            cantidad_bultos: item.cantidad_bultos,
            id_envio
        }));


        await agregar(mercanciasData);

        let numero_orden = await crearNumeroOrden(id_envio);
        navigate(`/formulario/orden/${numero_orden}`);

    } catch (error) {
        if (id_envio) {
            console.log("ID:", id_envio);
            await cancelarEnvio(id_envio);
        }
        console.error("Error en el proceso de ingreso:", error);
        alert("Ocurrió un error y no se completó la operación.");

        setTimeout(() => setErrorModal(null), 1000);
    }
};


  const datosPredeterminados = {
    rut: "96.994.750-1",
    nombre: "Superfrut S.A",
    direccion: "Manuel Bulnes 832",
    actividad: "Comercio",
    comuna: "Natales",
    ciudad: "Puerto Natales",
    region: "Magallanes y Antartica chilena",
    telefono: "(61) 241 0249",
};

const handleCheckboxChange = (event) => {
  if (event.target.checked) {
      // Autocompletar con datos predeterminados
      setRut(datosPredeterminados.rut);
      setNombre(datosPredeterminados.nombre);
      setDireccion(datosPredeterminados.direccion);
      setActividad(datosPredeterminados.actividad);
      setComuna(datosPredeterminados.comuna);
      setCiudad(datosPredeterminados.ciudad);
      setRegion(datosPredeterminados.region);
      setTelefono(datosPredeterminados.telefono);
      setBloquearInputs(true);
  } else {
      // Vaciar los campos
      setRut("");
      setNombre("");
      setDireccion("");
      setActividad("");
      setComuna("");
      setCiudad("");
      setRegion("");
      setTelefono("");
      setBloquearInputs(false);
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
  

//-----------ELIMINAR MERCANCIAS-------------

  const opciones = ciudades.map(ciudad => ({
    value: ciudad.codigo,
    label: `${ciudad.nombre} (${ciudad.codigo})`,
  }));

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

  const formatRut = (value) => {
    value = value.replace(/\./g, "").replace(/-/g, ""); // Quita puntos y guiones
    if (value.length > 1) {
        let body = value.slice(0, -1);
        let dv = value.slice(-1).toUpperCase();
        return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
    }
    return value;
};

// Validar entrada del usuario (solo números y 'k')
const rutCliente = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9kK]/g, ""); // Solo permite números y k/K
    setRut(formatRut(value));
};




  return (

    <div className=" w-100  justify-content-center">
      
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
                <a className="nav-link" href="/embarque">Crear Embarque</a>
              </li>

              {/* Home centrado */}
              <li className="nav-item ">
              <button className="navbar-brand btn btn-primary " onClick={()=>navigate("/")}>
                <i className="bi bi-house-door" style={{ color: "white", marginRight: "7px" }}></i>
                Home
              </button>
              </li>

              {/* Historial de órdenes alineado a la derecha */}
              <li className="nav-item">
                <a className="nav-link" href="/formulario/historial">Historial Ordenes</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

        {errorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <h3 className="text-lg font-bold text-red-600" style={{ color: 'red' }}>Error</h3>
                  <p className="text-gray-800" style={{ whiteSpace: 'pre-line' }}>{errorModal}</p>
              </div>
          </div>
      )}
      
        
      <h3 className="text-center mt-3">Crear orden de flete</h3>


      <div className="formula" >       

        <div className='form-container'>
        <div className="container md-5 d-flex flex-column align-items-center p-20">
            <div className="row w-100 d-flex justify-content-center">

              <div className="col-md-5 datos" onKeyDown={handleKeyDown}>
                  <h3>Formulario de Cliente</h3>
              
                <div className="form-check mb-2 d-flex">
                    <input
                        className="form-check-input shadow-sm"
                        type="checkbox"
                        id="autocompletar"
                        onChange={handleCheckboxChange}
                        
                    />
                    <label className="form-check-label card p-1  shadow-sm " style={{marginLeft:'10px'}} htmlFor="autocompletar">
                        Superfrut
                    </label>
                </div>


                <div className="row w-100 d-flex justify-content-center">

                <div className="input-group input-group-sm mb-1">
                    <span className="input-group-text" id="basic-addon1">RUT: </span>
                    <input 
                        value={rut} 
                        onChange={rutCliente} 
                        className="form-control" 
                        type="text" 
                        id="rut" 
                        name="rut" 
                        placeholder="Ingrese el RUT" 
                        aria-label="Recipient's username" 
                        aria-describedby="button-addon2" 
                        disabled={bloquearInputs}
                    />
                    <button className="btn btn-outline-secondary" onClick={() => { buscar(); }} type="button" id="button-addon2">
                        Buscar
                    </button>
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
              </div>



              <div className='col-md-5 datos_envio'>
                <h3>Detalles del envio</h3>


                  <div className="input-group mb-2">
                    <label className="input-group-text" htmlFor="origenSelect" >Origen:</label>
                    <Select
                      id="origenSelect"
                      value={opciones.find(option => option.value === origen)}
                      onChange={(selectedOption) => setOrigen(selectedOption.value)}
                      options={opciones}
                      placeholder="Seleccione una ciudad..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minWidth: '250px', // Asegura que el select tenga un tamaño mínimo
                        }),
                      }}
                    />
                  </div>

                  <div className="input-group mb-2">
                    <label className="input-group-text" htmlFor="origenSelect">Destino:</label>
                    <Select
                      id="destinoSelect"
                      value={opciones.find(option => option.value === destino)}
                      onChange={(selectedOption) => setDestino(selectedOption.value)}
                      options={opciones}
                      placeholder="Seleccione una ciudad..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minWidth: '250px', // Asegura que el select tenga un tamaño mínimo
                        }),
                      }}
                    />
                  </div>

                    <div className="input-group input-group-sm mb-1">
                        <span class="input-group-text" id="basic-addon9">Condicion de pago:</span>
                        <select onChange={(event) => setCondicion(event.target.value)}
                            type="text" id="condicion" name="condicion" placeholder="Ingrese el lugar" 
                            className="form-select">
                              <option value="">Condicion pago</option>
                              <option value="Credito 15 dias">Credito 15 dias</option>
                              <option value="Credito 30 dias">Credito 30 dias</option>
                              <option value="Cheque dia">Cheque dia</option>
                              <option value="Transferencia">Transferencia</option>
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span class="input-group-text" id="basic-addon10">Fecha:</span>
                        <input 
                            onChange={(event) => setFecha(event.target.value)} 
                            type="date" id="fecha" name="fecha" 
                            class="form-control" aria-label="Fecha" aria-describedby="basic-addon10" />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span class="input-group-text" id="basic-addon13">Lugar de Recogida:</span>
                        <input 
                            onChange={(event) => setRecoger(event.target.value)} 
                            type="text" id="recoger" name="recoger" placeholder="Ingrese el lugar de recogida"
                            class="form-control" aria-label="Lugar de Recogida" aria-describedby="basic-addon13" />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span class="input-group-text" id="basic-addon14">Lugar de Entrega:</span>
                        <input 
                            onChange={(event) => setEntregar(event.target.value)} 
                            type="text" id="entregar" name="entregar" placeholder="Ingrese el lugar de entrega"
                            class="form-control" aria-label="Lugar de Entrega" aria-describedby="basic-addon14" />
                    </div>
              </div>       
            </div>
    </div>
    </div>

        <TablaMercancia mercancia={mercancia} setMercancia={setMercancia} />

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

    </div>

  );


};

export default Formulario;