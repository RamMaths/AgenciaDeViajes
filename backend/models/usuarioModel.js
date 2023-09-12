const bcrypt = require('bcrypt');

const Usuario = {};

Usuario.encriptaContra = async (passwd) => {
  return await bcrypt.hash(passwd, 12);
};

Usuario.comparaContra = async (input, passwd) => {
  return await bcrypt.compare(input, passwd);
};

Usuario.crear = async (usuario) => {

  const passwd = await Usuario.encriptaContra(usuario.contrasena);

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
