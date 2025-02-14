import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    try {
        const decoded = jwt.verify(token, 'secreto');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

export default authMiddleware;
