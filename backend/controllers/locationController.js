const AppError = require('../utils/appError');
const pool = require('../utils/dbConnection');
const catchAsync = require('../utils/catchAsync');
const CityModel = require('../models/CityModel');
const StateModel = require('../models/StateModel');
const CountryModel = require('../models/CountryModel');

// cities
exports.getAllCities = catchAsync(async(req, res, next) => {
  const cities = await CityModel.find();

  res.status(200).json({
    status: 'success',
    data: cities
  });
});

//states
exports.getAllStates = catchAsync(async(req, res, next) => {
});

//countries
exports.getAllCountries = catchAsync(async(req, res, next) => {
});

exports.createCountry = catchAsync(async(req, res, next) => {
  if(
    !req.body.nombre ||
    !req.body.latitud ||
    !req.body.longitud
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const client = await pool.connect();
  const qRes = await client.query(Model.create({
    nombre: req.body.nombre,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
    zoom: req.body.zoom
  }));
  const results = qRes.rows;
  client.release();
});

