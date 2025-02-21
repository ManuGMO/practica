import express from 'express';
const app = express();
import cookieParser from "cookie-parser";

import cors from 'cors';

const PORT = 3001;

app.use(cookieParser());  // Middleware para manejar cookies

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true   // Permitir cookies en el frontend
}));

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
import roleMiddleware from "./middleware/roleMiddleware.js";




app.use('/api/auth', authRoutes);


app.use('/api/formulario', authMiddleware, roleMiddleware(["admin", "jefe", "ayudante"]), formularioRoutes);
app.use('/api/embarque', authMiddleware, roleMiddleware(["admin", "jefe"]), embarqueRoutes);
app.use('/api/listaEmbarques', authMiddleware, roleMiddleware(["admin"]), listaRoutes);
app.use('/api/visualizar', authMiddleware, roleMiddleware(["admin", "jefe", "ayudante"]), visualizarRoutes);
app.use('/api/historialEmbarques', authMiddleware, roleMiddleware(["admin", "jefe"]), historialEmbarques);
app.use('/api/historialOrdenes', authMiddleware, roleMiddleware(["admin", "jefe", "ayudante"]), historialOrdenes);




