import { Usuario } from '../models/Usuario.js';

import bcrypt from 'bcrypt'; // Para comparar contraseñas encriptadas
import jwt from 'jsonwebtoken'; // Para generar el token JWT


export const login = async (req, res) => {
    const { rut, password } = req.body;

    // Validar que se hayan enviado todos los campos
    if (!rut || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        console.log("Solicitud recibida:", req.body);

        //Buscar el usuario por RUT
        const user = await Usuario.findOne({
            where: { rut }
        });
        if (!user) {return res.status(400).json({ message: "Usuario no encontrado" });}

        console.log("Usuario encontrado:", user);

        //Comparar la contraseña encriptada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        //Crear token JWT con `rut`, `role` y `nombre`
        const token = jwt.sign(
            { rut: user.rut, role: user.role, name: user.nombre }, // Payload del token
            "secreto", // Clave secreta para firmar el token
            { expiresIn: "2h" } // Tiempo de expiración del token
        );

        //Enviar el token en una cookie
        res.cookie("token", token, {
            httpOnly: true, // La cookie solo es accesible desde el servidor
            secure: false, // Cambiar a `true` (requiere HTTPS)
            sameSite: "Strict"
        });

        //Enviar respuesta exitosa
        res.json({ rut: user.rut, role: user.role, name: user.nombre });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};



export const validateToken = async (req, res) => {
    console.log("Cookies recibidas:", req.cookies);

    // Obtener el token de las cookies
    const token = req.cookies.token;

    // Si no hay token, devolver un error 401
    if (!token) {
        return res.status(401).json({ message: "No autorizado" });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, "secreto");
        console.log("Decoded: ", decoded);

        //Devolver la información del usuario decodificada
        res.json({ user: decoded });
    } catch (error) {
        // Si el token es inválido o ha expirado, devolver un error 403
        console.error("Error al verificar el token:", error);
        res.status(403).json({ message: "Token inválido" });
    }
};