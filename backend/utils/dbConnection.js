const Pool = require('pg').Pool;

const pool = new Pool({
  host: 'localhost',
  user: 'ram',
  database: 'agencia',
  password: '1',
  port: 5432
});

module.exports = pool;
