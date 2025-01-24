import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VisualizarOrden from './pages/visualizarOrden'; // Importa el componente
import Formulario from './pages/formulario'; // Suponiendo que el formulario está en este componente
import Home from './pages/Home';
import Embarque from './pages/embarque';
import Lista from './pages/lista';

const App = () => {
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/formulario" element={<Formulario/>}/>
          <Route path="/formulario/orden/:numero_orden" element={<VisualizarOrden/>}/>
          <Route path="/embarque" element={<Embarque/>}/>
          <Route path="/lista" element={<Lista/>}/>
        </Routes>
    </Router>
  );
};

export default App;