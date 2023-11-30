const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const CityModel = require('../models/CityModel');
const StateModel = require('../models/StateModel');
const CountryModel = require('../models/CountryModel');

// cities
exports.getAllCities = catchAsync(async(req, res, next) => {
  let filters = {};

  if(req.query.id_estado) {
    filters.id_estado = req.query.id_estado
  } else {
    filters = undefined;
    return next(new AppError('No has seleccionado un estado'), 404);
  }

  let result = await CityModel.find({
    fields: ['c.id_ciudad', 'c.nombre', 'e.nombre as estado'],
    join: 'JOIN estados e ON c.id_estado = e.id_estado',
    filters
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.createCity = catchAsync(async(req, res, next) => {
  if(
    !req.body.id_estado,
    !req.body.nombre
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const result = await CityModel.create({
    id_estado: req.body.id_estado,
    nombre: req.body.nombre
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteCity = catchAsync(async (req, res, next) => {
  const result = await CityModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchCity = catchAsync(async (req, res, next) => {
  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await CityModel.updateAField({
    field: req.body.field,
    value: req.body.value,
    id: req.body.id,
    type: req.body.type
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

//states
exports.getAllStates = catchAsync(async(req, res, next) => {

  let filters = {};

  if(req.query.id_pais) {
    filters.id_pais = req.query.id_pais
  } else {
    filters = undefined;
    return next(new AppError('No has seleccionado un país'), 404);
  }

  let result = await StateModel.find({
    fields: ['e.id_estado', 'e.nombre', 'p.nombre as Pais'],
    join: 'JOIN paises p ON e.id_pais = p.id_pais',
    filters
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
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

exports.deleteState = catchAsync(async (req, res, next) => {
  const result = await StateModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchState = catchAsync(async (req, res, next) => {
  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await StateModel.updateAField({
    field: req.body.field,
    value: req.body.value,
    id: req.body.id,
    type: req.body.type
  });

  res.status(200).json({
      status: 'success',
      data: result
  });
});

//countries
exports.getAllCountries = catchAsync(async (req, res, next) => {
  let empty = undefined;

  let result = await CountryModel.find({
    fields: req.query.fields ? req.query.fields.split(',') : undefined
  });

  if(result.length === 0) {
    result = await CountryModel.getColumns();
    empty = true;
  }

  res.status(200).json({
    status: 'success',
    data: result,
    empty
  });
});

exports.createCountry = catchAsync(async (req, res, next) => {
  if(
    !req.body.nombre
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  if (
    req.body.nombre.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await CountryModel.create({
    nombre: req.body.nombre,
    zoom: req.body.zoom
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteCountry = catchAsync(async (req, res, next) => {
  const result = await CountryModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchCountry = catchAsync(async (req, res, next) => {
  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await CountryModel.updateAField({
    field: req.body.field,
    value: req.body.value,
    id: req.body.id,
    type: req.body.type
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
  let result = await Model.find({});

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
