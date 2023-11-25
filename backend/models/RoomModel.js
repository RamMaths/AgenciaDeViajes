const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class RoomModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }

  async find({fields, filters, join}) {
    let query = '';

    if(!fields && !filters) {
      query = `
        SELECT * 
        FROM ${this.table}
      `;
    } else if(!fields && filters) {
      for(const [key, value] of Object.entries(filters)) {
        conditions.push(`${key}=${value}`);
      }

      query = {
        text: `
        SELECT ${Object.keys(fields).join(', ')}
        FROM ${this.table} ha
        WHERE ${conditions.join(' AND ')}
        ${join ? join : ''}
      `

      };
    } else if(fields && !filters) {
      query = {
        text: `
        SELECT ${fields.join(', ')}
        FROM ${this.table} ha
        ${join ? join : ''}
        `
      };
    } else {
      const conditions = [];

      for(const [key, value] of Object.entries(filters)) {
        conditions.push(`${key}=${value}`);
      }

      query = {
        text: `
        SELECT ${fields.join(', ')}
        FROM ${this.table} ha
        ${join ? join : ''}
        WHERE ha.${conditions.join(' AND ')}
      `,
      };
    }

    return await this._execute(query);
  }
}

const roomModel = new RoomModel('habitaciones', 'id_habitacion', pool);
module.exports = roomModel;
