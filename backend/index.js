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



app.post("/createCliente", (req, res) => {
    const { rut, nombre, direccion, actividad, comuna, ciudad, region, telefono, envioData } = req.body;

    db.query('SELECT id_cliente FROM clientes WHERE rut = ?', [rut], (err, result) => {
        if (err) {
            console.error("Error al verificar el RUT:", err);
            return res.status(500).send("Error al verificar el RUT");
        }
        if (result.length > 0) {
            // Cliente ya existe, usar su id_cliente para insertar el envío
            const id_cliente = result[0].id_cliente;
            registrarEnvio(id_cliente, envioData, res);

        }else {
            db.query(
                'INSERT INTO clientes(rut, nombre, direccion, actividad_economica, comuna, ciudad, region, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [rut, nombre, direccion, actividad, comuna, ciudad, region, telefono],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Error al registrar el cliente");}
                    else{
                        const id_cliente = result.insertId; // Obtener el id del cliente recién registrado
                        registrarEnvio(id_cliente, envioData, res);
                    }
                });
       
        }
    });
});


function registrarEnvio(id_cliente, envioData, res) {
    const { lugar, fecha, origen, destino, recogida, entrega } = envioData;

    db.query(
        'INSERT INTO envios(id_cliente, lugar, fecha, ciudad_origen, ciudad_destino, lugar_recogida, lugar_entrega) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_cliente, lugar, fecha, origen, destino, recogida, entrega],
        (err, result) => {
            if (err) {
                console.error("Error al registrar el envío:", err);
                res.status(500).send("Error al registrar el envío");
            } else {
                const id_envios = result.insertId;
                res.json({ message: "Cliente y envío registrados correctamente", id_envios });
            }
        }
    );
}


app.post("/agregarMercancias", (req, res) => {
    const mercancias = req.body; // Recibimos un array de objetos de mercancías

    if (!Array.isArray(mercancias) || mercancias.length === 0) {
        return res.status(400).send("No se enviaron mercancías");
    }

    // Construir la consulta para insertar múltiples mercancías
    const values = mercancias.map(({ descripcion, peso, metros_cubicos, tipo_bulto, cantidad_bultos, id_envio }) => [
        descripcion,
        peso,
        metros_cubicos,
        tipo_bulto,
        cantidad_bultos,
        id_envio
    ]);

    const sql = `
        INSERT INTO mercancia(descripcion, peso, metros_cubicos, tipo_bulto, cantidad_bultos, id_envio) 
        VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error al registrar las mercancías:", err);
            res.status(500).send("Error al registrar las mercancías");
        } else {
            res.send("Mercancías registradas correctamente");
        }
    });
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