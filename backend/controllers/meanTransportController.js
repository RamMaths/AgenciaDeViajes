const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const MeanTransportModel = require('../models/MeanTransportModel');

exports.getAllMeanTransports = catchAsync(async (req, res, next) => {
  let empty = undefined;
  let result = await MeanTransportModel.find({});

  if(result.length === 0) {
    result = await MeanTransportModel.getColumns();
    empty = true;
  }

  res.status(200).json({
    status: 'success',
    data: result,
    empty
  });
});

exports.createMeanTransport = catchAsync(async (req, res, next) => {
  if(
    !req.body.nombre ||
    !req.body.capacidad
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  if(
    req.body.nombre.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await MeanTransportModel.create({
    nombre: req.body.nombre,
    capacidad: req.body.capacidad
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteMeanTransport = catchAsync(async (req, res, next) => {
  const result = await MeanTransportModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchMeanTransport = catchAsync(async (req, res, next) => {
  console.log(req.body.field, req.body.value);

  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await MeanTransportModel.updateAField({
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

exports.getMeanTransportDataTypes = catchAsync(async(req, res, next) => {
  const result = await MeanTransportModel.dataTypes();

  res.status(200).json({
    status: 'success',
    data: result
  })
});
