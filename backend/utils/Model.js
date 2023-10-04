class Model {
  constructor(table) {
    this.table = table;
  }

  find(fields = null, filters = null) {
    if(!fields && !filters) {
      return `
      SELECT * 
      FROM ${this.table}
    `;
    }

    if(!filters) {
      const query = {
        text: `
        SELECT ${Object.keys(fields).join(', ')}
        FROM ${this.table}
        `,
        values: Object.values(fields)
      };

      return query;
    }

    const conditions = [];

    for(const [key, value] of Object.entries(filters)) {
      conditions.push(`${key}=${value}`);
    }

    const query = {
      text: `
        SELECT ${Object.keys(fields).join(', ')}
        FROM ${this.table}
        WHERE ${conditions.join(' AND ')}
      `,
      values: Object.values(fields)
    };

    return query;
  }

  findOne(identifier, data) {
    const query = {
      text: `
        SELECT ${data.join(', ')} 
        FROM ${this.table}
        WHERE ${Object.keys(identifier)[0]}=$1
      `,
      values: [Object.values(identifier)[0]]
    };

    return query;
  }

  create(obj) {
    const query = {
      text: `
        INSERT INTO ${this.table} (
          ${Object.keys(obj).join(', ')}
        ) VALUES (${Object.keys(obj).map((_, i) => `$${i + 1}`)})
      `,
      values: Object.values(obj)
    }

    return query;
  };

  update(identifier, data) {
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

    return query;
  }
}

module.exports = Model;
