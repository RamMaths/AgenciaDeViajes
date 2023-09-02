const express = require('express');

//routers
const clienteRouter = require('./routes/clienteRouter.js');

const app = express();
app.use(express.json());

//mounting routes
app.use('/api/clientes/', clienteRouter);

module.exports = app;
