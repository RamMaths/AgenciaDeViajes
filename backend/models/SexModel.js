const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class SexModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const sexo = new SexModel('sexos', 'id_sexo', pool);
module.exports = sexo;
