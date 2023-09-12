const bcrypt = require('bcrypt');

const Usuario = {};

Usuario.encriptaContrasena = async (passwd) => {
  return await bcrypt.hash(passwd, 12);
};

Usuario.comparaContrasena = async (input, passwd) => {
  return await bcrypt.compare(input, passwd);
};

Usuario.seCambioContrasena = (fecha_cambio, fecha_token) => {
  if(fecha_cambio) {
    const fecha = new Date(fecha_cambio);
  }

  return false;
};

Usuario.actualizar = (id, datos) => {

  const valores = Object.keys(datos).map(
    (nombreProp, i) => `${nombreProp}=$${i+1}`
  );

  const query = {
    text: `UPDATE Usuarios SET ${valores.join(', ')} WHERE id_usuario=${id} RETURNING *`,
    values: Object.values(datos)
  }

  return query;
};

Usuario.buscar = (identificador, datos) => {
  const query = {
    text: `
    SELECT ${datos.join(', ')} 
    FROM Usuarios 
    WHERE ${Object.keys(identificador)[0]}=$1
    `,
    values: [Object.values(identificador)[0]]
  };

  return query;
}

Usuario.crear = async (usuario) => {

  const passwd = await Usuario.encriptaContrasena(usuario.contrasena);

  const query = {
    text:`INSERT INTO Usuarios (
        nombre,
        paterno, 
        materno, 
        fecha_nac, 
        email, 
        contrasena, 
        telefono
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    values: [
      usuario.nombre,
      usuario.paterno,
      usuario.materno,
      usuario.fecha_nac,
      usuario.email,
      passwd,
      usuario.telefono
    ]
  };

  return query;
};

module.exports = Usuario;
