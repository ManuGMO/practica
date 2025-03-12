import { Sequelize } from 'sequelize';

// Configuración de la conexión a la base de datos
export const sequelize = new Sequelize('flete', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
});



