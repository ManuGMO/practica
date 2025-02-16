const roleMiddleware = (allowedRoles) => (req, res, next) => {
    if (!req.user) {
        console.log("Error 1");
        return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Acceso denegado" });
    }
    
    console.log("Llegue hasta aqui");
    next();
};

export default roleMiddleware;