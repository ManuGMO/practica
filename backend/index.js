const express = require("express");
const app = express();
const mysql = require('mysql2')
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "flete"
})

app.post("/create",(req,res)=>{
    const rut = req.body.rut;
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const actividad = req.body.actividad;
    const comuna = req.body.comuna;
    const ciudad = req.body.ciudad;
    const region = req.body.region;
    const telefono = req.body.telefono;

    db.query('INSERT INTO clientes(RUT,Nombre,Direccion,ActividadEconomica,Comuna,Ciudad,Region,Telefono) VALUES (?,?,?,?,?,?,?,?)',[rut,nombre,direccion,actividad,comuna,ciudad,region,telefono],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Cliente registrado");
            }
        }
    );

});

app.listen(3001,()=>{
    console.log("Me corro en el puerto 3001")
})