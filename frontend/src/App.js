import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import VisualizarOrden from './pages/orden_flete/visualizarOrden'; // Importa el componente
import Formulario from './pages/orden_flete/formulario'; // Suponiendo que el formulario está en este componente
import Home from './pages/Home';
import Embarque from './pages/embarque/embarque';
import Lista from './pages/lista/listaEmbarques';
import HistorialEmbarques from './pages/embarque/historial_embarques';
import HistorialOrdenes from './pages/orden_flete/historial_ordenes';
import FormularioEdicion from './pages/orden_flete/formularioEdicion';
import Register from './pages/autenticacion/register';

import { AuthProvider, AuthContext } from './AuthContext';
import Login from './pages/autenticacion/login';

const PrivateRoute = ({ element }) => {
  const { user } = React.useContext(AuthContext);
  const isAuthenticated = user || JSON.parse(localStorage.getItem("user"));

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> 

                {/* 🔒 Rutas protegidas */}
                <Route path="/" element={<PrivateRoute element={<Home />} />} />
                <Route path="/formulario" element={<PrivateRoute element={<Formulario />} />} />
                <Route path="/formulario/orden/:numero_orden" element={<PrivateRoute element={<VisualizarOrden />} />} />
                <Route path="/formulario/historial" element={<PrivateRoute element={<HistorialOrdenes />} />} />
                <Route path="/formulario/:numero_orden" element={<PrivateRoute element={<FormularioEdicion />} />} />
                <Route path="/embarque" element={<PrivateRoute element={<Embarque />} />} />
                <Route path="/embarque/historial" element={<PrivateRoute element={<HistorialEmbarques />} />} />
                <Route path="/lista" element={<PrivateRoute element={<Lista />} />} />
            </Routes>
        </Router>
    </AuthProvider>
);
};

export default App;