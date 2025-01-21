import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VisualizarOrden from './functions/visualizarOrden'; // Importa el componente
import Formulario from './pages/formulario'; // Suponiendo que el formulario está en este componente
import Home from './pages/Home';
import Embarque from './pages/embarque';

const App = () => {
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/formulario" element={<Formulario/>}/>
          <Route path="/orden" element={<VisualizarOrden/>}/>
          <Route path="/embarque" element={<Embarque/>}/>
        </Routes>
    </Router>
  );
};

export default App;