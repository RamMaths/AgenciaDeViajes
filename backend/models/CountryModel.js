const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class CountryModel extends Model {
  constructor(table, pool) {
    super(table, pool);
  }
}

const country = new CountryModel('Paises', pool);
module.exports = country;
