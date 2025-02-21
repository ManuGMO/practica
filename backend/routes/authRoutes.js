import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const [users] = await db.promise().query("SELECT rut, nombre, role FROM usuarios");
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
});


router.delete("/users/:rut", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    const { rut } = req.params;

    if (!rut) {
        return res.status(400).json({ message: "El RUT es obligatorio" });
    }

    try {
        // Verificar si el usuario existe
        const [user] = await db.promise().query("SELECT * FROM usuarios WHERE rut = ?", [rut]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Eliminar usuario
        await db.promise().query("DELETE FROM usuarios WHERE rut = ?", [rut]);

        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
});


// Registrar usuario
router.post("/register", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    const { rut, nombre, password, role } = req.body;

    if (!rut || !nombre || !password || !role) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await db.promise().query("SELECT * FROM usuarios WHERE rut = ?", [rut]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar en la base de datos
        await db.promise().query("INSERT INTO usuarios (rut, nombre, password, role) VALUES (?, ?, ?, ?)", [rut, nombre, hashedPassword, role]);

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// 🔐 Ruta para iniciar sesión
router.post("/login", async (req, res) => {
    const { rut, password } = req.body;

    if (!rut || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        console.log("Solicitud recibida:", req.body);

        const [user] = await db.promise().query("SELECT * FROM usuarios WHERE rut = ?", [rut]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        console.log("Usuario encontrado:", user[0]);

        // Comparar contraseña encriptada
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Crear token con `rut` y `role`
        const token = jwt.sign(
            { rut: user[0].rut, role: user[0].role, name:user[0].nombre }, 
            "secreto", 
            { expiresIn: "2h" }
        );

        res.cookie("token", token, {
            httpOnly: true,  
            secure: false,    
            sameSite: "Strict"
        });

        res.json({ rut: user[0].rut, role: user[0].role, name:user[0].name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


router.get("/validate", (req, res) => {

    console.log("Cookies recibidas:", req.cookies); 
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No autorizado" });
    }

    try {
        const decoded = jwt.verify(token, "secreto");
        console.log("Decoded: ", decoded);
        res.json({ user: decoded });
    } catch (error) {
        res.status(403).json({ message: "Token inválido" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token"); // Elimina la cookie del token
    res.json({ message: "Logout exitoso" });
});



export default router;