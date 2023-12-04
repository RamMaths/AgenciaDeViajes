const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class CompanyModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const company = new CompanyModel('empresas', 'id_empresa', pool);
module.exports = company;
