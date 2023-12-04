const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const SexModel = require('../models/SexModel');

// hotels
exports.getAllSexs = catchAsync(async(req, res, next) => {
  let result = await SexModel.find({});

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.createSex = catchAsync(async(req, res, next) => {
  if(
    !req.body.nombre
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  if(
    req.body.nombre.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await SexModel.create({
    nombre: req.body.nombre
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteSex = catchAsync(async (req, res, next) => {
  const result = await SexModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchSex = catchAsync(async (req, res, next) => {
  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await SexModel.updateAField({
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
