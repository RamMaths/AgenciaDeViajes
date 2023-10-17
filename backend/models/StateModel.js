const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class StateModel extends Model {
  constructor(table, pool) {
    super(table, pool);
  }

  async find(fields = null, filters = null) {
    let query = '';

    if(!fields && !filters) {
      query = `
      SELECT id_estado, e.nombre, e.id_pais, p.nombre as _país
      FROM estados e
      JOIN paises p ON e.id_pais = p.id_pais;
    `;
    } else if(!filters) {
      query = {
        text: `
        SELECT ${Object.keys(fields).join(', ')}
        FROM ${this.table}
        `,
        values: Object.values(fields)
      };
    } else {
      const conditions = [];

      for(const [key, value] of Object.entries(filters)) {
        conditions.push(`${key}=${value}`);
      }

      query = {
        text: `
        SELECT ${Object.keys(fields).join(', ')}
        FROM ${this.table}
        WHERE ${conditions.join(' AND ')}
      `,
      values: Object.values(fields)
      };
    }

    return await this._execute(query);
  }

}

const state = new StateModel('estados', pool);
module.exports = state;
