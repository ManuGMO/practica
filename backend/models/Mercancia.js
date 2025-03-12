import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';



export const Mercancia = sequelize.define('Mercancia', {
    id_mercancia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_envio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: DataTypes.STRING(200),
    peso_unidad: DataTypes.DECIMAL(10,2),
    metros_cubicos: DataTypes.DECIMAL(10,2),
    tipo_bulto: DataTypes.STRING(100),
    cantidad_bultos: DataTypes.INTEGER,
    tipo_pago: DataTypes.STRING(50),
    num_documento: DataTypes.STRING(50),
    proveedor: DataTypes.STRING(100),
    rut_proveedor: DataTypes.STRING(12),
    precio_unitario: DataTypes.INTEGER,
    peso_total: DataTypes.DECIMAL(10,2),
    precio_iva: DataTypes.INTEGER,
    monto_documento: DataTypes.INTEGER
}, {
    tableName: 'mercancia',
    timestamps: false,
    
});