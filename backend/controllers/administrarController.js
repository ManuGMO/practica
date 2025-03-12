import { Usuario } from '../models/Usuario.js';

import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 


export const getUsers = async (req, res) => {
    try{
        const usuarios = await Usuario.findAll({
            attributes: ['rut','nombre','role']
        })

        res.json(usuarios);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }

}

export const deleteUser = async (req, res) => {
    const { rut } = req.params;

    // Validar que se haya proporcionado el RUT
    if (!rut) {
        return res.status(400).json({ message: "El RUT es obligatorio" });
    }

    try {
        // Buscar el usuario por RUT
        const usuario = await Usuario.findOne({
            where: { rut }
        });

        // Si no se encuentra el usuario, devolver un error 404
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Eliminar el usuario
        await usuario.destroy();

        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};


export const registrarUsuario = async (req, res) => {
    const { rut, nombre, password, role } = req.body;

    // Validar que se hayan proporcionado todos los campos
    if (!rut || !nombre || !password || !role) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        //erificar si el usuario ya existe
        const existingUser = await Usuario.findOne({
            where: { rut }
        });

        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el nuevo usuario
        await Usuario.create({
            rut,
            nombre,
            password: hashedPassword,
            role
        });

        // Enviar respuesta exitosa
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};