const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class MeanTransportModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const meanTransport = new MeanTransportModel('mediostransporte', 'id_medio_transporte', pool);
module.exports = meanTransport;
