const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class ItineraryModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const hotelModel = new ItineraryModel('itinerarios', 'id_itinerario', pool);
module.exports = hotelModel;
