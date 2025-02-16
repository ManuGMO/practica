import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
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
            const res = await axios.post("http://localhost:3001/api/auth/login", { rut, password },{ withCredentials: true });
            console.log("ACaaaa");
            login(res.data);  // Guarda el usuario en AuthContext
            console.log("Holaaaaaaaaaaaaaaaa");
            navigate("/");  // Redirige al usuario
        } catch (error) {
            alert(error.response.data.message || "Error al iniciar sesión");
        }
    };

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
                            onChange={rutCliente}
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