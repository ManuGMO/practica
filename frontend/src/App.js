import React, { useState } from 'react';
import { useContext } from "react";
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
import AdminPanel from './pages/autenticacion/administracion';
import axios from "axios";


import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/autenticacion/login';

const PrivateRoute = ({ element }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <p></p>; // ⏳ Muestra un mensaje mientras se valida la sesión
  return user ? element : <Navigate to="/login" />;
};


const RoleRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <p>Cargando...</p>;
  return user && allowedRoles.includes(user.role) ? element : <Navigate to="/" />;
};


const App = () => {
  return (
    <AuthProvider>
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 

            {/*Rutas protegidas */}
            <Route path="/" element={<PrivateRoute element={<Home />} />} />

            {/*Accesible para admin, jefe y ayudante */}
            <Route path="/formulario" element={<RoleRoute element={<Formulario />} allowedRoles={["admin", "jefe", "ayudante"]} />} />
            <Route path="/formulario/orden/:numero_orden" element={<RoleRoute element={<VisualizarOrden />} allowedRoles={["admin", "jefe", "ayudante"]} />} />
            <Route path="/formulario/historial" element={<RoleRoute element={<HistorialOrdenes />} allowedRoles={["admin", "jefe", "ayudante"]} />} />
            <Route path="/formulario/:numero_orden" element={<RoleRoute element={<FormularioEdicion />} allowedRoles={["admin", "jefe", "ayudante"]} />} />

            {/*Accesible solo para admin y jefe */}
            <Route path="/embarque" element={<RoleRoute element={<Embarque />} allowedRoles={["admin", "jefe"]} />} />
            <Route path="/embarque/historial" element={<RoleRoute element={<HistorialEmbarques />} allowedRoles={["admin", "jefe"]} />} />

            {/*Solo admins pueden acceder a /lista y /admin */}
            <Route path="/lista" element={<RoleRoute element={<Lista />} allowedRoles={["admin"]} />} />
           <Route path="/admin" element={<RoleRoute element={<AdminPanel />} allowedRoles={["admin"]} />} /> 
        </Routes>
    </Router>
</AuthProvider>
);
};

export default App;