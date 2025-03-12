import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';



export const Envio = sequelize.define('Envio', {
    id_envio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_embarque: {
        type: DataTypes.INTEGER,
    },
    condicion_pago: DataTypes.STRING(55),
    fecha: DataTypes.DATEONLY,
    ciudad_origen: DataTypes.STRING(20),
    ciudad_destino: DataTypes.STRING(20),
    lugar_recogida: DataTypes.STRING(100),
    lugar_entrega: DataTypes.STRING(100),
    numero_orden: DataTypes.INTEGER  
}, {
    tableName: 'envios',
    timestamps: false
});

