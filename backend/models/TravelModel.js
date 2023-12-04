const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class TravelModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const travelModel = new TravelModel('viajes', 'id_viaje', pool);
module.exports = travelModel;
