const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class CountryModel extends Model {
  constructor(table, primary_key,  pool) {
    super(table, primary_key, pool);
  }
}

const country = new CountryModel('paises', 'id_pais', pool);
module.exports = country;
