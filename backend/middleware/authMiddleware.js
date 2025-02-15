import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token; // Obtiene la cookie con el token

        if (!token) {
            return res.status(401).json({ message: "No autorizado. Token no encontrado." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto'); // Decodifica el token
        req.user = decoded; // Guarda los datos en la request
        next(); // Continúa al siguiente middleware o controlador
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};

export default authMiddleware;