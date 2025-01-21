import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <body style={{ backgroundColor: "#dcdcdc" }}>
      <div className="container text-center" style={{backgroundColor: "#f0f0f0"}}>
        <h1 className="display-4 font-weight-bold mt-5">Programa logístico de transporte</h1>
        <div className="d-flex justify-content-center mt-5 ">
          <Link to="/formulario" className="btn btn-secondary btn-lg mx-2">Generar orden</Link>
          <Link to="/embarque" className="btn btn-secondary btn-lg mx-2">Generar Embarque</Link>
        </div>
      </div>
    </body>
  );
};

export default Home;