const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const CityModel = require('../models/CityModel');
const StateModel = require('../models/StateModel');
const CountryModel = require('../models/CountryModel');

// cities
exports.getAllCities = catchAsync(async(req, res, next) => {
  getAll(CityModel, res);
});

//states
exports.getAllStates = catchAsync(async(req, res, next) => {
  getAll(StateModel, res);
});

exports.createState = catchAsync(async(req, res, next) => {
  if(
    !req.body.id_pais,
    !req.body.nombre
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const result = await StateModel.create({
    id_pais: req.body.id_pais,
    nombre: req.body.nombre
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getStatesDataTypes = catchAsync(async(req, res, next) => {
  const result = await StateModel.dataTypes();

  res.status(200).json({
    status: 'success',
    data: result
  })
});


//countries
exports.getAllCountries = catchAsync(async(req, res, next) => {
  getAll(CountryModel, res);
});

exports.createCountry = catchAsync(async(req, res, next) => {
  if(
    !req.body.nombre ||
    !req.body.latitud ||
    !req.body.longitud
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const result = await CountryModel.create({
    nombre: req.body.nombre,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
    zoom: req.body.zoom
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getCountriesDataTypes = catchAsync(async(req, res, next) => {
  const result = await CountryModel.dataTypes();

  res.status(200).json({
    status: 'success',
    data: result
  })
});

//general
const getAll = async (Model, res) => {
  let empty = undefined;
  let result = await Model.find();

  if(result.length === 0) {
    result = await Model.getColumns();
    empty = true;
  }

  res.status(200).json({
    status: 'success',
    data: result,
    empty
  });
}
