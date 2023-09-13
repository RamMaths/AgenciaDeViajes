//modules
const express = require('express');
const cors = require('cors');
//utils
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//routers
const usuarioRouter = require('./routes/usuarioRouter');

const app = express();
app.use(express.json());
app.use(cors());

//mounting routes
app.use('/api/clientes/', usuarioRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar la ruta`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
