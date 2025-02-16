import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log("token: ", token);

    if (!token) {
        console.log("Usuario no autenticado en authMiddleware");
        return res.status(401).json({ message: "No autorizado" });
    }

    try {
        const decoded = jwt.verify(token, "secreto"); // Decodifica el token
        console.log("Usuario decodificado:", decoded);
        req.user = decoded; // Guarda el usuario en req.user
        next();
    } catch (error) {
        console.error("Error al verificar el token:");
        res.status(403).json({ message: "Token inválido" });
    }
};

export default authMiddleware;