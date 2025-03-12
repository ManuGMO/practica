import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';



export const Cliente = sequelize.define('Cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    direccion: DataTypes.STRING(200),
    actividad_economica: DataTypes.STRING(100),
    comuna: DataTypes.STRING(100),
    ciudad: DataTypes.STRING(100),
    region: DataTypes.STRING(100),
    telefono: DataTypes.STRING(20)
}, {
    tableName: 'clientes',
    timestamps: false
});

