const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class StateModel extends Model {
  constructor(table, pool) {
    super(table, pool);
  }
}

const state = new StateModel('Estados', pool);
module.exports = state;
