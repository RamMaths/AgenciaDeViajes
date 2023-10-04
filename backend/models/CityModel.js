const Model = require('../utils/Model');

class CityModel extends Model {
  constructor(table) {
    super(table);
  }
}

const city = new CityModel('Ciudades');
module.exports = city;
