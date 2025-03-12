import express from 'express';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

import { login, validateToken } from '../controllers/authController.js';
import { deleteUser, getUsers, registrarUsuario } from '../controllers/administrarController.js';


const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware(["admin"]),getUsers);


router.delete("/users/:rut", authMiddleware, roleMiddleware(["admin"]), deleteUser);


// Registrar usuario
router.post("/register", authMiddleware, roleMiddleware(["admin"]), registrarUsuario);



// Ruta para INICIAR Y CERRAR sesión
router.post("/login", login);

router.get("/validate", validateToken);

router.post("/logout", (req, res) => { res.clearCookie("token");  res.json({ message: "Logout exitoso" }); });



export default router;