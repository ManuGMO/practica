import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const Login = () => {
    const [rut, setRut] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/api/auth/login", { rut, password });
            login(res.data);  // Guarda el usuario en AuthContext
            navigate("/");  // Redirige al usuario
        } catch (error) {
            alert(error.response.data.message || "Error al iniciar sesión");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="rut" className="form-label">RUT</label>
                        <input
                            type="text"
                            id="rut"
                            className="form-control"
                            placeholder="Ingrese su RUT"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;