import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import '../../App.css';
import Select from 'react-select';
import { ciudades } from './ciudades';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/formulario.css';
import { buscarCliente,actualizarEnvio, obtenerDatosEnvio } from '../../services/formularioService';

import TablaMercancia from './tablaMercancia';


const FormularioEdicion = () => {
    const { numero_orden } = useParams(); // Obtener el número de orden de la URL
    const navigate = useNavigate();
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
    const clienteData = { rut, nombre, direccion, actividad, comuna, ciudad, region, telefono };
    const envioData = { condicion, fecha, origen, destino, recogida, entrega };

    const location = useLocation();

    const opciones = ciudades.map(ciudad => ({
        value: ciudad.codigo,
        label: `${ciudad.nombre} (${ciudad.codigo})`,
      }));

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
    // Obtener los datos del envío y las mercancías al cargar el formulario
    useEffect(() => {
        if (!location.state || !location.state.autorizado) {
            navigate("/"); // Redirige a la página principal u otra ruta segura
        }
        const fetchData = async () => {
            try {
                const data = await obtenerDatosEnvio(numero_orden);
                console.log("sip", data);
                if (data.clienteData && data.envioData && data.mercancias) {
                    // Precargar datos del clienteData
                    setRut(data.clienteData.rut);
                    setNombre(data.clienteData.nombre);
                    setDireccion(data.clienteData.direccion);
                    setActividad(data.clienteData.actividad_economica);
                    setComuna(data.clienteData.comuna);
                    setCiudad(data.clienteData.ciudad);
                    setRegion(data.clienteData.region);
                    setTelefono(data.clienteData.telefono);

                    // Precargar datos del envío
                    setCondicion(data.envioData.condicion_pago);
                    setFecha(new Date(data.envioData.fecha).toISOString().split('T')[0]);
                    setOrigen(data.envioData.ciudad_origen);
                    setDestino(data.envioData.ciudad_destino);
                    setRecoger(data.envioData.lugar_recogida);
                    setEntregar(data.envioData.lugar_entrega);

                    const mercancias = data.mercancias.map(item => ({
                        descripcion: item.descripcion,
                        tipo_pago: item.tipo_pago,
                        num_documento: item.num_documento,
                        proveedor: item.proveedor,
                        rut_proveedor: item.rut_proveedor,
                        precio_unitario: Number(item.precio_unitario).toLocaleString("es-CL"),
                        peso_unidad: item.peso_unidad,
                        metros_cubicos: item.metros_cubicos,
                        tipo_bulto: item.tipo_bulto,
                        cantidad_bultos: item.cantidad_bultos,
                    }));

                    // Precargar mercancías
                    setMercancia(mercancias);
                }
            } catch (error) {
                console.error("Error al obtener los datos del envío:", error);
                setErrorModal("Error al cargar los datos del envío.");
            }
        };

        fetchData();
    }, [numero_orden]);

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


      const buscar = async () => {
          try {
              const clienteEncontrado = await buscarCliente(rut);
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

    // Función para guardar los cambios
    const guardarCambios = async () => {
        try {
            // Actualizar cliente y envío
            const mercanciaData = mercancia.map(item => ({
                descripcion: item.descripcion,
                tipo_pago: item.tipo_pago,
                num_documento: item.num_documento,
                proveedor: item.proveedor,
                rutProveedor: item.rut_proveedor,
                precio_unitario: parseInt(item.precio_unitario.replace(/\./g, ""), 10),
                peso_unidad: item.peso_unidad,
                metros_cubicos: item.metros_cubicos,
                tipo_bulto: item.tipo_bulto,
                cantidad_bultos: item.cantidad_bultos,
            }));

            console.log("Mercancias: ", mercanciaData);

            await actualizarEnvio(numero_orden, clienteData, envioData, mercanciaData);
            console.log("Hola 1");
            // Eliminar las mercancías existentes y agregar las nuevas
            

            alert("Cambios guardados correctamente");
            navigate(`/formulario/orden/${numero_orden}`);
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            setErrorModal("Error al guardar los cambios.");
            setTimeout(() => setErrorModal(null), 3000);
        }
    };

    // Función para manejar la edición
    const handleEditar = () => {
        guardarCambios();
    };

    return (
        <div className="w-100 justify-content-center">
            {errorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h3 className="text-lg font-bold text-red-600">Error</h3>
                        <p className="text-gray-800">{errorModal}</p>
                    </div>
                </div>
            )}
            <div className="d-flex justify-content-between align-items-start mt-3 mb-1">
            <button onClick={() => window.history.back()} className="btn btn-outline-success">
                    <i className="bi bi-arrow-left-square-fill"></i>
                    <span style={{ marginLeft: "8px" }}>Atrás</span>
                </button>
                <div>
                    <a href="/formulario/historial" type="button" className="btn btn-outline-primary">
                        Historial de envios
                    </a>
                </div>
            </div>
            <h3 className="text-center mt-2">Editar orden de flete</h3>

            {/* Formulario de edición */}
            <div className="formula">
                <div className="form-container">
                    <div className="container md-5 d-flex flex-column align-items-center p-20">
                        <div className="row w-100 d-flex justify-content-center">
                            {/* Campos del cliente */}
                            <div className="col-md-5 datos">
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

                            {/* Campos del envío */}
                            <div className="col-md-5 datos_envio">
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
                            type="text" id="condicion" value={condicion} name="condicion" placeholder="Ingrese el lugar" 
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
                            type="date" id="fecha" name="fecha"  value={fecha}
                            class="form-control" aria-label="Fecha" aria-describedby="basic-addon10" />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span class="input-group-text" id="basic-addon13">Lugar de Recogida:</span>
                        <input 
                            onChange={(event) => setRecoger(event.target.value)} 
                            type="text" value={recogida} id="recoger" name="recoger" placeholder="Ingrese el lugar de recogida"
                            class="form-control" aria-label="Lugar de Recogida" aria-describedby="basic-addon13" />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span class="input-group-text" id="basic-addon14">Lugar de Entrega:</span>
                        <input 
                            onChange={(event) => setEntregar(event.target.value)} 
                            type="text" value={entrega} id="entregar" name="entregar" placeholder="Ingrese el lugar de entrega"
                            class="form-control" aria-label="Lugar de Entrega" aria-describedby="basic-addon14" />
                    </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de mercancías */}
                <TablaMercancia mercancia={mercancia} setMercancia={setMercancia} />

                {/* Botón para guardar cambios */}
                <button type="button" className="boton-ing btn btn-success mt-0 m-3" onClick={handleEditar}>
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default FormularioEdicion;