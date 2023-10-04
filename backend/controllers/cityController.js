const AppError = require('../utils/appError');
const pool = require('../utils/dbConnection');
const catchAsync = require('../utils/catchAsync');
const CityModel = require('../models/CityModel');

exports.getAllCities = catchAsync( async(req, res, next) => {
  const client = await pool.connect();
  const qRes = await client.query(CityModel.find())
  const cities = qRes.rows;
  client.release();

  res.status(200).json({
    status: 'success',
    data: cities
  })
});
