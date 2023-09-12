const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//routers
const clienteRouter = require('./routes/clienteRouter.js');

const app = express();
app.use(express.json());

//mounting routes
app.use('/api/clientes/', clienteRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar la ruta`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
