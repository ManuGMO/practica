import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VisualizarOrden from './visualizarOrden'; // Importa el componente
import Formulario from './formulario'; // Suponiendo que el formulario está en este componente

const App = () => {
  
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <Formulario/>
            }
          />
          <Route
            path="/orden"
            element={
              <VisualizarOrden/>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;