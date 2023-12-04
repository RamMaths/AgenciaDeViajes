const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class HotelModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const hotelModel = new HotelModel('hoteles', 'id_hotel', pool);
module.exports = hotelModel;
