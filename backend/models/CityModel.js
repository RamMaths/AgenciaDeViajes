const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class CityModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const city = new CityModel('ciudades', 'id_ciudad', pool);
module.exports = city;
