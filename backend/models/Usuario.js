import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: DataTypes.STRING(40),
    rut: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'jefe', 'ayudante'),
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});