const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class CityModel extends Model {
  constructor(table, pool) {
    super(table, pool);
  }
}

const city = new CityModel('Ciudades', pool);
module.exports = city;
