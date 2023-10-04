//modules
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

//utils
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//express
const app = express();
app.use(express.json());
app.use(cors());

//rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Ups! han ocurrido muchas peticiones desde esta IP intenta de nuevo en una hora'
});
app.use('/api', limiter)

//routers
const userRouter = require('./routes/userRouter');
const cityRouter = require('./routes/cityRouter');

//mounting routes
app.use('/api/clientes', userRouter);
app.use('/api/ciudades', cityRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar la ruta`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
