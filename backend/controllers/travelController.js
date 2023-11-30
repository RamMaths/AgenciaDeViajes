const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const TravelModel = require('../models/TravelModel');
const ItineraryModel = require('../models/ItineraryModel');
const PersonModel = require('../models/PersonModel');
const pool = require('../utils/dbConnection');

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

exports.createTravel = catchAsync(async(req, res, next) => {
  if(
    !req.body.id_usuario
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const client = await pool.connect()
  let itineray = null;

  try {
    await client.query('BEGIN');
    if(
      !req.body.id_usuario ||
      !req.body.travel ||
      !req.body.people
    ) return next(new AppError('Debes proporcionar los datos mencionados'), 404);

    itineray = await ItineraryModel.create({
      id_usuario: req.body.id_usuario
    }, client);

    itineray = itineray[0];

    const travel = await TravelModel.create({
      fecha_salida: req.body.travel.fecha_salida,
      id_origen: req.body.travel.id_origen,
      id_destino: req.body.travel.id_destino,
      id_itinerario: itineray.id_itinerario,
      id_medio_transporte: req.body.travel.id_medio_transporte
    }, client);

    for(const person of req.body.people) {
      await PersonModel.create({
        nombre: person.nombre,
        paterno: person.paterno,
        materno: person.materno,
        fecha_nac: person.fecha_nac,
        id_sexo: person.id_sexo,
        id_itinerario: itineray.id_itinerario
      }, client);
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    return next(e);
  }

  client.release();

  res.status(200).json({
    status: 'success',
    data: itineray
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

