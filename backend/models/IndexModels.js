import { Cliente } from "./Cliente.js";
import { Embarque } from "./Embarque.js";
import { Envio } from "./Envio.js";
import { Mercancia } from "./Mercancia.js";

//Relacion Cliente - Envio
Cliente.hasMany(Envio, { foreignKey: 'id_cliente' });

// Relación Embarque - Envio
Embarque.hasMany(Envio, { foreignKey: 'id_embarque' });

// Relaciones Envio
Envio.hasMany(Mercancia, { foreignKey: 'id_envio' });
Envio.belongsTo(Embarque, { foreignKey: 'id_embarque' });
Envio.belongsTo(Cliente, { foreignKey: 'id_cliente' });


//Relaccion Mercancia Envio
Mercancia.belongsTo(Envio, { foreignKey: 'id_envio' });

