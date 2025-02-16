import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [rut, setRut] = useState("");
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Administrador");
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        // Obtener la lista de usuarios cuando se carga la página
        const fetchUsuarios = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/auth/users", { withCredentials: true });
                setUsuarios(res.data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/api/auth/register", { rut, nombre, password, role }, { withCredentials: true });
            alert(res.data.message);
            setRut("");
            setNombre("");
            setPassword("");
            setRole("Administrador");
            // Actualizar la lista de usuarios
            const updatedUsuarios = await axios.get("http://localhost:3001/api/auth/users", { withCredentials: true });
            setUsuarios(updatedUsuarios.data);
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "Error en el registro");
        }
    };

    const handleDelete = async (rutToDelete) => {
        if (rutToDelete === user.rut) {
            alert("No puedes eliminar tu propio usuario.");
            return;
        }
        try {
            const res = await axios.delete(`http://localhost:3001/api/auth/users/${rutToDelete}`, { withCredentials: true });
            alert(res.data.message);
            // Actualizar la lista de usuarios después de eliminar
            const updatedUsuarios = await axios.get("http://localhost:3001/api/auth/users", { withCredentials: true });
            setUsuarios(updatedUsuarios.data);
        } catch (error) {
            alert(error.response?.data?.message || "Error al eliminar el usuario");
        }
    };

    if (!user || user.role !== "admin") {
        return <h2>Acceso denegado</h2>;
    }

    const formatRut = (value) => {
        value = value.replace(/\./g, "").replace(/-/g, ""); // Quita puntos y guiones
        if (value.length > 1) {
            let body = value.slice(0, -1);
            let dv = value.slice(-1).toUpperCase();
            return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
        }
        return value;
    };

    const rutCliente = (event) => {
        let value = event.target.value;
        value = value.replace(/[^0-9kK]/g, ""); // Solo permite números y k/K
        setRut(formatRut(value));
    };

    const roleMap = {
        admin: "Administrador",
        jefe: "Jefe de bodega",
        ayudante: "Ayudante de bodega"
    };
    

    return (
        <div className="d-flex">
            {/* Panel izquierdo - Formulario de registro */}
            <div className="p-4 border-end" style={{ width: "30%" }}>
                <h2>Registrar Usuario</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="rut" className="form-label">RUT</label>
                        <input type="text" id="rut" className="form-control" value={rut} onChange={rutCliente} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" id="nombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="text" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Rol</label>
                        <select id="role" className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="admin">Administrador</option>
                            <option value="jefe">Jefe de bodega</option>
                            <option value="ayudante">Ayudante de bodega</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrar</button>
                </form>
            </div>

            {/* Panel derecho - Tabla de usuarios */}
            <div className="p-4" style={{ width: "70%" }}>
                <h2>Usuarios Registrados</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>RUT</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.rut}>
                                <td>{usuario.nombre || ""}</td>
                                <td>{usuario.rut}</td>
                                <td>{roleMap[usuario.role]}</td>
                                <td>
                                    {usuario.rut !== user.rut && (
                                        <button className="btn btn-danger" onClick={() => handleDelete(usuario.rut)}>Eliminar</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;