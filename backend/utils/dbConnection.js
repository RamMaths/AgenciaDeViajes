const Client = require('pg').Client;

const client = new Client({
  host: 'localhost',
  user: 'ram',
  database: 'agencia',
  password: "1",
  port: 5432
});

module.exports = client;
