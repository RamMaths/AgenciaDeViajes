const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class ReservationModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const reservationModel = new ReservationModel('reservaciones', 'id_reservacion', pool);
module.exports = reservationModel;
