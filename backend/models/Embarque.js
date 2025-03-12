import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';


export const Embarque = sequelize.define('Embarque', {
    id_embarque: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chofer: DataTypes.STRING(40),
    num_embarque: DataTypes.STRING(15),
    patente_camion: DataTypes.STRING(10),
    patente_remolque: DataTypes.STRING(10),
    fecha_salida: DataTypes.DATEONLY
}, {
    tableName: 'embarques',
    timestamps: false
});

