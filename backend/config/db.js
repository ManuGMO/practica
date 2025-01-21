//const mysql = require('mysql2')
import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "flete"
})

db.connect((err) => {
    if (err) {
        console.error("❌ Error conectando a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});
