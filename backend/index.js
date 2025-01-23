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
import embarqueRoutes from './routes/embarqueRoutes.js';
import listaRoutes from './routes/listaRoutes.js'



app.use('/api', formularioRoutes);
app.use('/api',embarqueRoutes)
app.use('/api', listaRoutes)







