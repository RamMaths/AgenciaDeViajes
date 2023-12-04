const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const CompanyModel = require('../models/CompanyModel');

exports.getAllCompanies = catchAsync(async (req, res, next) => {
  let empty = undefined;
  let result = await CompanyModel.find({});

  if(result.length === 0) {
    result = await CompanyModel.getColumns();
    empty = true;
  }

  res.status(200).json({
    status: 'success',
    data: result,
    empty
  });
});

exports.createCompany = catchAsync(async (req, res, next) => {
  if(
    !req.body.nombre ||
    !req.body.rfc
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  if (
    req.body.rfc.length < 13 ||
    req.body.rfc.length > 13
  ) return next(new AppError('El rfc debe tener 13 caracteres', 400));

  if (
    req.body.nombre > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  const result = await CompanyModel.create({
    nombre: req.body.nombre,
    rfc: req.body.rfc
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteCompany = catchAsync(async (req, res, next) => {
  const result = await CompanyModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchCompany = catchAsync(async (req, res, next) => {
  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  if (
    req.body.field === 'rfc' && (
      req.body.value.length < 13 ||
      req.body.value.length > 13
    )
  ) return next(new AppError('El rfc debe tener 13 caracteres', 400));

  const result = await CompanyModel.updateAField({
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

exports.getCompanyDataTypes = catchAsync(async(req, res, next) => {
  const result = await CompanyModel.dataTypes();

  res.status(200).json({
    status: 'success',
    data: result
  })
});
