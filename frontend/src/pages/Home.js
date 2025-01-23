import { Link } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/template-home.css';

const Home = () => {
  return (
    <div className="principal">
        <header className="tm-site-header">
            <h1 className="tm-mt-0 tm-mb-15"><span className="tm-color-primary">Programa logistico de transporte</span></h1>
        </header>



        <div className="tm-container">
            <nav className="tm-main-nav">
                <ul id="inline-popups">
                    <li className="tm-nav-item">
                        <a href="/formulario" data-effect="mfp-move-from-top" className="tm-nav-link">
                            Crear orden
                            <i class="bi bi-list-columns-reverse"></i>
                        </a>               
                    </li>
                    <li className="tm-nav-item">
                        <a href="/embarque" data-effect="mfp-move-from-top" className="tm-nav-link" id="tm-gallery-link">
                            Crear embarque
                            <i class="bi bi-truck"></i>
                        </a>
                    </li>
                    <li className="tm-nav-item">
                        <a href="/lista" data-effect="mfp-move-from-top" className="tm-nav-link">
                            Lista embarques
                            <i class="bi bi-table"></i>
                        </a>
                    </li>

                </ul>
                <ul id="inline-popups">
                    <li className="tm-nav-item">
                        <a  data-effect="mfp-move-from-top" className="tm-nav-link">
                            Gastos
                            <i class="bi bi-currency-dollar"></i>
                        </a>
                    </li>

                </ul>
            </nav>
        </div>

    </div>
  );
};

export default Home;