import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Registrar usuario
router.post("/register", async (req, res) => {
    const { rut, password } = req.body;

    if (!rut || !password) {
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
        await db.promise().query("INSERT INTO usuarios (rut, password) VALUES (?, ?)", [rut, hashedPassword]);

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
        const [user] = await db.promise().query("SELECT * FROM usuarios WHERE rut = ?", [rut]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseña encriptada
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Crear token JWT
        const token = jwt.sign({ rut: user[0].rut }, "secreto", { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

export default router;