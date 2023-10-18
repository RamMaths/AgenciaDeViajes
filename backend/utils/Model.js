class Model {
  constructor(table, pool) {
    this.table = table;
    this.pool = pool;
  }

  async dataTypes() {
    const query = `
      SELECT column_name, data_type FROM information_schema.columns
      WHERE table_name='${this.table}';
    `;

    return await this._execute(query);
  }

  async find({fields, filters, join}) {
    let query = '';

    if(!fields && !filters) {
      query = `
        SELECT * 
        FROM ${this.table}
      `;
    } else if(fields && !filters) {
      query = {
        text: `
        SELECT ${fields.join(', ')}
        FROM ${this.table} ${this.table.charAt(0)}
        ${join}
        `
      };
    } else {
      const conditions = [];

      for(const [key, value] of Object.entries(filters)) {
        conditions.push(`${key}=${value}`);
      }

      query = {
        text: `
        SELECT ${Object.keys(fields).join(', ')}
        FROM ${this.table} ${this.table.charAt(0)}
        WHERE ${conditions.join(' AND ')}
        ${join}
      `,
      values: Object.values(fields)
      };
    }

    return await this._execute(query);
  }

  async findOne(identifier, data) {
    const query = {
      text: `
        SELECT ${data.join(', ')} 
        FROM ${this.table}
        WHERE ${Object.keys(identifier)[0]}=$1
      `,
      values: [Object.values(identifier)[0]]
    };
    
    return await this._execute(query);
  }

  async create(obj) {
    const query = {
      text: `
        INSERT INTO ${this.table} (
          ${Object.keys(obj).join(', ')}
        ) 
        VALUES (${Object.keys(obj).map((_, i) => `$${i + 1}`)})
        RETURNING *
      `,
      values: Object.values(obj)
    }

    return await this._execute(query);
  };

  async update(identifier, data) {
    let lastItemPosition = 0;

    const values = Object.keys(data).map(
      (propName, i) => {
        lastItemPosition = i + 2
        return `${propName}=$${i+1}`
      }
    );

    const query = {
      text: `
        UPDATE ${this.table} 
        SET ${values.join(', ')} 
        WHERE ${Object.keys(identifier)[0]}=$${lastItemPosition}
      `,
      values: [...Object.values(data), Object.values(identifier)[0]]
    }

    return await this._execute(query);
  }

  async getColumns() {
    const query = `
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_name='${this.table}';
    `;

    return await this._execute(query);
  }

  //private methods

  async _execute(query) {
    let results;
    let client;
    client = await this.pool.connect();
    const qRes = await client.query(query)
    client.on('error', (err) => {
      client.release();
      throw err;
    });
    results = qRes.rows;
    client.release();

    return results;
  }
}

module.exports = Model;
