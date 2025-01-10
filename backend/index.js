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


app.post("/agregar",(req,res)=>{
    const descripcion = req.body.descripcion;
    const peso = req.body.peso;
    const metrosCubicos = req.body.metrosCubicos;
    const tipobulto = req.body.tipobulto;
    const cantidadbultos = req.body.cantidadbultos;

    db.query('INSERT INTO mercancia(descripcion, peso, metros_cub, tipo_bulto, cantidad_bultos) VALUES (?,?,?,?,?)',[descripcion,peso,metrosCubicos,tipobulto,cantidadbultos],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Cliente registrado");
            }
        }
    );

});

app.get("/mercancia",(req,res)=>{
    db.query('SELECT * FROM mercancia',
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send("Error al obtener los datos");
            }else{
                res.send(result);
            }
        }
    );

});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id; // Obtiene el ID del cliente a eliminar

    db.query('DELETE FROM mercancia WHERE idmercancia = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar el cliente");
        } else {
            res.send("Cliente eliminado");
        }
    });
});







app.listen(3001,()=>{
    console.log("Me corro en el puerto 3001")
})