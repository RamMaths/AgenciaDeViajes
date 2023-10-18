const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class StateModel extends Model {
  constructor(table, pool) {
    super(table, pool);
  }
}

const state = new StateModel('estados', pool);
module.exports = state;
