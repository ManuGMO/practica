import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/auth/register', { rut, password });
            alert("Usuario registrado exitosamente");
            navigate('/login'); // Redirige al login después de registrarse
        } catch (error) {
            alert(error.response.data.message || "Error en el registro");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Registrar Usuario</h2>
                <form onSubmit={handleRegister}>
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
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            placeholder="Confirme su contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
