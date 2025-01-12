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

app.post("/createEnvio",(req,res)=>{
    const { rut, nombre, direccion, actividad, comuna, ciudad, region, telefono, envioData } = req.body;
    db.query('INSERT INTO clientes(rut,nombre,direccion,actividad_economica,comuna,ciudad,region,telefono) VALUES (?,?,?,?,?,?,?,?)',[rut,nombre,direccion,actividad,comuna,ciudad,region,telefono],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Cliente registrado");
            }
        }
    );

});

app.post("/createCliente", (req, res) => {
    const { rut, nombre, direccion, actividad, comuna, ciudad, region, telefono, envioData } = req.body;

    // Insertar cliente en la tabla "clientes"
    db.query(
        'INSERT INTO clientes(rut, nombre, direccion, actividad_economica, comuna, ciudad, region, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [rut, nombre, direccion, actividad, comuna, ciudad, region, telefono],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar el cliente");
            } else {
                const id_cliente = result.insertId; // Obtener el id del cliente recién registrado

                // Ahora registrar el envío usando id_cliente
                const { lugar, fecha, origen, destino, recogida, entrega } = envioData;

                db.query(
                    'INSERT INTO envios(id_cliente, lugar, fecha, ciudad_origen, ciudad_destino, lugar_recogida, lugar_entrega) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [id_cliente, lugar, fecha, origen, destino, recogida, entrega],
                    (err2, result2) => {
                        if (err2) {
                            console.log(err2);
                            res.status(500).send("Error al registrar el envío");
                        } else {
                            res.send("Cliente y envío registrados correctamente");
                        }
                    }
                );
            }
        }
    );
});


app.get("/getCliente/:rut", (req, res) => {
    const rut = req.params.rut;

    db.query('SELECT * FROM clientes WHERE rut = ?', [rut], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al buscar el cliente");
        } else {
            if (result.length > 0) {
                res.json(result[0]); // Enviar el primer resultado como JSON
            } else {
                res.status(404).send("Cliente no encontrado");
            }
        }
    });
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