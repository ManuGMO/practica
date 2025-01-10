import './App.css';
import {useEffect,useState} from "react"
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';



function App() {

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
  const [items, setItems] = useState([]);
  const [tipobulto, setTipoBulto] = useState("");
  const [cantidadbultos, setCantidadBulto] = useState("");

// ------------MOSTRAR MERCANCIA AGREGADA--------------
  const [mercancia, setMercancia] = useState([]);

  // -----------AGREGAR CLIENTES A BASE DE DATOS---------------
  const add = () => {
    Axios.post("http://localhost:3001/create",{
      rut:rut,
      nombre:nombre,
      direccion:direccion,
      actividad:actividad, 
      comuna:comuna,
      ciudad:ciudad,
      region:region,
      telefono:telefono
    }).then(()=>{
      alert("Cliente registrado");
    })
  }
  // -----------AGREGAR MERCANCIA A BASE DE DATOS---------------
  const agregar = () => {
    Axios.post("http://localhost:3001/agregar",{
      descripcion:descripcion,
      peso:peso,
      metrosCubicos:metrosCubicos, 
      tipobulto:tipobulto,
      cantidadbultos:cantidadbultos
    }).then(()=>{
      mostrar();
    })
  }


  // MOSTRAR MERCANCIA DE BASE DE DATOS
  const mostrar = () => {
    Axios.get("http://localhost:3001/mercancia")
      .then((response) => {
        setMercancia(response.data)
        console.log(response.data); 
      })
      .catch((error) => {
        console.error("Error al obtener la mercancía:", error);
      });
  };

  useEffect(() => {
    mostrar(); // Llama a la función al cargar el componente
}, []); // El array vacío asegura que se ejecute solo una vez al montar
  


  const remove = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`)
        .then(() => {
            
            mostrar(); 
        })
        .catch((error) => {
            console.error("Error al eliminar el cliente:", error);
        });
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
    <div class="container">

      <div className="App" >       


        <div className='form-container'>

          <div class="col-md-6 datos" onKeyDown={handleKeyDown}>
              <h3>Formulario de Cliente</h3>

            <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="basic-addon1">RUT: </span>
              <input onChange={(event)=>{setRut(event.target.value);}} class= "form-control" 
              type="text" id="rut" name="rut" placeholder="Ingrese el RUT" aria-label="Recipient's username" aria-describedby="button-addon2"/>
              <button className="btn btn-outline-secondary" type="button" id="button-addon2">Buscar</button>
            </div>

            <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="basic-addon1">Nombre: </span>
              <input onChange={(event)=>{setNombre(event.target.value);}}  class= "form-control" 
              type="text" id="nombre" name="nombre" placeholder="Ingrese el nombre" aria-label="Recipient's username" aria-describedby="button-addon2"/>
            </div>
            
            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon3">Dirección:</span>
                <input onChange={(event) => { setDireccion(event.target.value); }} class= "form-control" 
                      type="text" id="direccion" name="direccion" placeholder="Ingrese la dirección" aria-label="Dirección"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon4">Actividad Económica:</span>
                <input onChange={(event) => { setActividad(event.target.value); }} class= "form-control" 
                      type="text" id="actividad" name="actividad" placeholder="Ingrese la actividad económica" aria-label="Actividad Económica"/>
            </div>

            <div class="input-group input-group-sm mb-1 ">
                <span class="input-group-text" id="basic-addon5">Comuna:</span>
                <input onChange={(event) => { setComuna(event.target.value); }} class= "form-control" 
                      type="text" id="comuna" name="comuna" placeholder="Ingrese la comuna" aria-label="Comuna"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon6">Ciudad:</span>
                <input onChange={(event) => { setCiudad(event.target.value); }} class= "form-control" 
                      type="text" id="ciudad" name="ciudad" placeholder="Ingrese la ciudad" aria-label="Ciudad"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon7">Región:</span>
                <input onChange={(event) => { setRegion(event.target.value); }} class= "form-control" 
                      type="text" id="region" name="region" placeholder="Ingrese la región" aria-label="Región"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon8">Teléfono:</span>
                <input onChange={(event) => { setTelefono(event.target.value); }} class= "form-control" 
                      type="tel" id="telefono" name="telefono" placeholder="Ingrese el teléfono" aria-label="Teléfono"/>
            </div>

            

          </div>
            
          

        <div className='col-md-6 datos_envio'>
          <h3>Detalles del envio</h3>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon9">Lugar:</span>
                <input 
                    onChange={(event) => setLugar(event.target.value)} 
                    type="text" id="lugar" name="lugar" placeholder="Ingrese el lugar" 
                    class="form-control" aria-label="Lugar" aria-describedby="basic-addon9"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon10">Fecha:</span>
                <input 
                    onChange={(event) => setFecha(event.target.value)} 
                    type="date" id="fecha" name="fecha" 
                    class="form-control" aria-label="Fecha" aria-describedby="basic-addon10"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon11">Origen:</span>
                <input 
                    onChange={(event) => setOrigen(event.target.value)} 
                    type="text" id="origen" name="origen" placeholder="Ingrese el origen"
                    class="form-control" aria-label="Origen" aria-describedby="basic-addon11"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon12">Destino:</span>
                <input 
                    onChange={(event) => setDestino(event.target.value)} 
                    type="text" id="destino" name="destino" placeholder="Ingrese el destino"
                    class="form-control" aria-label="Destino" aria-describedby="basic-addon12"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon13">Lugar de Recogida:</span>
                <input 
                    onChange={(event) => setRecoger(event.target.value)} 
                    type="text" id="recoger" name="recoger" placeholder="Ingrese el lugar de recogida"
                    class="form-control" aria-label="Lugar de Recogida" aria-describedby="basic-addon13"/>
            </div>

            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text" id="basic-addon14">Lugar de Entrega:</span>
                <input 
                    onChange={(event) => setEntregar(event.target.value)} 
                    type="text" id="entregar" name="entregar" placeholder="Ingrese el lugar de entrega"
                    class="form-control" aria-label="Lugar de Entrega" aria-describedby="basic-addon14"/>
            </div>

      </div>  
      
    </div>
        
          {/* BOTON PARA INGRESAR DATOS DE CLIENTES Y ENVIO   */}
          <button onClick={add} type="button" class="boton-ing btn btn-success btn-sm mt-0 m-3 ">Ingresar</button>


          <div className="mercancia_container" >
            <h3>Agregar Mercancía</h3>
            <div className="input-group input-group-sm mb-1">

              <input type="text" class="form-control" placeholder="Descripción de la mercancía" 
                onChange={(e) => setDescripcion(e.target.value)} />
              <input type="number" class="form-control" placeholder="Peso estimado" 
                onChange={(e) => setPeso(e.target.value)} />
              <input type="number" class="form-control" placeholder="Metros cúbicos" 
                onChange={(e) => setMetrosCubicos(e.target.value)} />
              <input type="text" class="form-control" placeholder="Tipo de bulto" 
                onChange={(e) => setTipoBulto(e.target.value)}/>
              <input type="number" class="form-control" placeholder="Cantidad de Bultos" 
                onChange={(e) => setCantidadBulto(e.target.value)} />

              {/* BOTON PARA AGREGAR MERCANCIA */}
              <button type="button" class="btn btn-primary btn-sm" onClick={agregar}>Agregar</button>
            </div>

            {/* Tabla para mostrar los items agregados */}
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Descripción</th>
                  <th scope="col">Peso Estimado</th>
                  <th scope="col">Metros Cúbicos</th>
                  <th scope="col">Tipo de Bulto</th>
                  <th scope="col">Cantidad de Bultos</th>
                </tr>
              </thead>
              <tbody>
                {mercancia.map((val,key) => (
                  <tr key={val.idmercancia}>
                    <td>{val.descripcion}</td>
                    <td>{val.peso}</td>
                    <td>{val.metros_cub}</td>
                    <td>{val.tipo_bulto}</td>
                    <td>{val.cantidad_bultos}</td>

                    <td><button type="button" class="btn btn-danger btn-sm" onClick={() => remove(val.idmercancia)}><i className="bi bi-trash"></i></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

        </div>
      </div>

  );
}

export default App;
