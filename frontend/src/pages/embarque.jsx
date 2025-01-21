import React, { useEffect,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TablaEnvios from '../functions/tablaEnvios';
import Axios from 'axios';
import { crearEmbarque } from '../services/embarqueService';


const Embarque = () => {
    const [chofer, setChofer] = useState("");
    const [numEmbarque, setNumEmbarque] = useState("");
    const [patenteCamion, setPatenteCamion] = useState("");
    const [patenteRemolque, setPatenteRemolque] = useState("");
    const [fecha, setFecha] = useState("");

    const [datosEnvios, setDatosEnvios] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    const datos_embarque = {chofer, numEmbarque, patenteCamion, patenteRemolque, fecha, seleccionados}


    const confirmar = ()=> {
        if (seleccionados.length != 0){
            crearEmbarque(datos_embarque)
        }
        else{alert("Debe seleccionar los envios a remolcar!"); }

    }



    useEffect(() => {
        const fetchEnvios = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/api/getEnvios");
                const data = response.data; // Obtiene los datos directamente
                console.log("Datos recibidos:", data); // Verifica los datos
                setDatosEnvios(data);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
    
        fetchEnvios();
    }, []); 
    
    const handleSeleccionar = (ids) => {
        
        setSeleccionados(ids);
        console.log("aca: ", seleccionados);
    };

    
    return(

    <div className='container'>
        <h3 className="text-center mt-3 mb-5">Crear orden de embarque</h3>
            <div className='form-container'>
            <div className="container md-5 d-flex flex-column align-items-center p-20">
                <div className="row w-100 d-flex justify-content-center">
                
                    {/* Primer grupo: Chofer y Numero de embarque */}
                    <div className="col-md-5" >
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Chofer:</span>
                            <input style={{ width: "68%" }} value={chofer} type="text" name="chofer" onChange={(event) => { setChofer(event.target.value); }}
                            className=" px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese nombre de chofer..." />
                        </div>

                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Numero de remolque:</span>
                            <input style={{ width: "50%" }} value={numEmbarque} type="text" name="numero" onChange={(event) => { setNumEmbarque(event.target.value); }}
                            className=" px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Ingrese numero de embarque..." />
                        </div>
                    </div>

                    {/* Segundo grupo: Patente Camion y Patente Remolque */}
                    <div className="col-md-5">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Patente Camion:</span>
                            <input style={{ width: "50%" }} value={patenteCamion} onChange={(event) => { setPatenteCamion(event.target.value); }} className="px-2 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" 
                                type="text" id="patente1" name="patente1" placeholder="Ingrese la patente" aria-label="Dirección"/>
                        </div>

                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Patente Remolque:</span>
                            <input style={{ width: "47.2%" }} value={patenteRemolque} onChange={(event) => { setPatenteRemolque(event.target.value); }} className="px-2 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" 
                                type="text" id="patente2" name="patente2" placeholder="Ingrese la patente" aria-label="Actividad Económica"/>
                        </div>
                    </div>         
                    </div>
                </div>    
                    {/* Tercer grupo: Fecha Salida centrada */}    
            </div>
        <div className="d-flex justify-content-center mt-4">
            <div className="input-group input-group-sm" style={{ width: "25.2%" }}>
                <span className="input-group-text">Fecha Salida:</span>
                <input   value={fecha} onChange={(event) => setFecha(event.target.value)} 
                    className="form-control px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" 
                    type="date" id="fecha" name="fecha" placeholder="Ingrese fecha" />
            </div>
        </div>

        {/* Tabla de Mercancías (Debajo del Formulario) */}
        <TablaEnvios datos={datosEnvios} onSeleccionar={handleSeleccionar} />

        {/* BOTON GENERAR */}
        <div class="d-flex justify-content-center mt-4 ">
            <button type="button" class="boton-ing btn btn-success mt-0 m-4" data-bs-toggle="modal" data-bs-target="#confirmarEmbarque">
                Generar Embarque
            </button>
        </div>

        <div class="modal fade" id="confirmarEmbarque" tabindex="-1" aria-labelledby="confirmarEmbarqueLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal-title">Confirmar Embarque</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas generar el embarque?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" onClick={() => {confirmar()}}>Generar</button>
                    </div>
                </div>
            </div>
        </div>


    </div>

);};


export default Embarque;