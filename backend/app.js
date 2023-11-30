//modules
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

//utils
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//express
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Ups! han ocurrido muchas peticiones desde esta IP intenta de nuevo en una hora'
});
app.use('/api', limiter)

//routers
const userRouter = require('./routes/userRouter');
const locationRouter = require('./routes/locationRouter');
const companyRouter = require('./routes/companyRouter');
const meanTransportRouter = require('./routes/meanTransportRouter');
const hotelRouter = require('./routes/hotelRouter');
const travelRouter = require('./routes/travelRouter');

//mounting routes
app.use('/api/users', userRouter);
app.use('/api/locations', locationRouter);
app.use('/api/companies', companyRouter);
app.use('/api/meantransports', meanTransportRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/travels', travelRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar la ruta`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
