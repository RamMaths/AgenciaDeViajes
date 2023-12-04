const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class PersonModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const personModel = new PersonModel('personas', 'id_persona', pool);
module.exports = personModel;
