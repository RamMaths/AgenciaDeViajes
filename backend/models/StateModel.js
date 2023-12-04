const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class StateModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const state = new StateModel('estados', 'id_estado', pool);
module.exports = state;
