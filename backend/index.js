import express from 'express';
const app = express();

import cors from 'cors';

const PORT = 3001;
app.use(cors());
app.use(express.json());

app.listen(PORT,()=>{
    console.log("Me corro en el puerto 3001")
})



import formularioRoutes from './routes/formularioRoutes.js';
import visualizarRoutes from './routes/visualizarRoutes.js'
import embarqueRoutes from './routes/embarqueRoutes.js';
import listaRoutes from './routes/listaRoutes.js'
import historialEmbarques from './routes/historialEmbarqueRoutes.js'
import historialOrdenes from './routes/historialOrdenesRoutes.js'

import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';


app.use('/api/auth', authRoutes);

app.get('/api/protegido', authMiddleware, (req, res) => {
    res.json({ message: "Accediste a una ruta protegida", user: req.user });
});

app.use('/api', formularioRoutes);
app.use('/api',  embarqueRoutes);
app.use('/api',  listaRoutes);
app.use('/api',  visualizarRoutes);
app.use('/api',  historialEmbarques);
app.use('/api', historialOrdenes);




