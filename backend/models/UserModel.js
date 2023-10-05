const pool = require('../utils/dbConnection');
const bcrypt = require('bcrypt');
const Model = require('../utils/Model');

class UserModel extends Model {
  constructor(table, pool) {
    super(table, pool);
  }

  async create(user) {
    const passwd = await this.encryptPasswd(user.contrasena);

    const query = {
      text:`INSERT INTO Usuarios (
        nombre,
        paterno, 
        materno, 
        fecha_nac, 
        email, 
        contrasena, 
        telefono,
        id_sexo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      values: [
        user.nombre,
        user.paterno,
        user.materno,
        user.fecha_nac,
        user.email,
        passwd,
        user.telefono,
        user.id_sexo
      ]
    };

    return await this._execute(query);
  }

  //utils 
  async encryptPasswd (passwd) {
    return await bcrypt.hash(passwd, 12);
  };

  async comparePasswd (input, passwd) {
    return await bcrypt.compare(input, passwd);
  };

  isPasswordChanged (changed_pass_date, jwtTimestamp) {
    if(changed_pass_date) {
      const changedTimestamp = parseInt(
        changed_pass_date / 1000,
        10
      );

      return jwtTimestamp < changedTimestamp;
    }

    return false;
  };

}

const user = new UserModel('Usuarios', pool);

module.exports = user;
