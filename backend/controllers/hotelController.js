const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const HotelModel = require('../models/HotelModel');
const RoomModel = require('../models/RoomModel');

// hotels
exports.getAllHotels = catchAsync(async(req, res, next) => {
  let filters = {};

  if(req.query.id_ciudad) {
    filters.id_ciudad = req.query.id_ciudad
  } else {
    filters = undefined;
    return next(new AppError('No has seleccionado una ciudad'), 404);
  }

  let result = await HotelModel.find({
    fields: ['h.id_hotel', 'h.nombre', 'h.direccion','c.nombre as ciudad'],
    join: 'JOIN ciudades c ON c.id_ciudad = h.id_ciudad',
    filters
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.createHotel = catchAsync(async(req, res, next) => {
  if(
    !req.body.nombre,
    !req.body.direccion,
    !req.body.id_ciudad
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  if(
    req.body.nombre.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  if(
    req.body.direccion.length > 50
  ) return next(new AppError('La dirección que proporcionaste es demasiado larga. Usa solo 100 caracteres', 400));

  const result = await HotelModel.create({
    id_ciudad: req.body.id_ciudad,
    nombre: req.body.nombre,
    direccion: req.body.direccion
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteHotel = catchAsync(async (req, res, next) => {
  const result = await HotelModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchHotel = catchAsync(async (req, res, next) => {
  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  if(
    req.body.field === 'direccion' &&
    req.body.value.length > 100
  ) return next(new AppError('La dirección que proporcionaste es demasiado larga. Usa solo 100 caracteres', 400));
  
  // console.log(req.body.field, req.body.value, req.body.id, req.body.type);

  const result = await HotelModel.updateAField({
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

// rooms
exports.getAllRooms = catchAsync(async(req, res, next) => {
  let filters = {};

  if(req.query.id_hotel) {
    filters.id_hotel = req.query.id_hotel
  } else {
    filters = undefined;
    return next(new AppError('No has seleccionado un hotel'), 404);
  }

  let result = await RoomModel.find({
    fields: ['ha.id_habitacion', 'ha.numero', 'ha.capacidad', 'h.nombre as hotel'],
    join: 'JOIN hoteles h ON ha.id_hotel = h.id_hotel',
    filters
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.createRoom = catchAsync(async(req, res, next) => {
  if(
    !req.body.capacidad,
    !req.body.numero,
    !req.body.id_hotel
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const result = await RoomModel.create({
    id_hotel: req.body.id_hotel,
    numero: req.body.numero,
    capacidad: req.body.capacidad
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  if(req.body.arr.length < 1) return next(new AppError('No has seleccionado ningún registro'), 400);

  const result = await RoomModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchRoom = catchAsync(async (req, res, next) => {
  // console.log(req.body.field, req.body.value, req.body.id, req.body.type);

  const result = await RoomModel.updateAField({
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

