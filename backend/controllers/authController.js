//modules
const pool = require('../utils/dbConnection.js');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {

  const wht = await pool.query(`INSERT INTO cliente VALUES (
    'MAHR021030HCLTRBA3',
    'Roberto Ramses',
    'Mata',
    'Hernandez',
    'ramses.hdz30@gmail.com',
    '1'
  )`);

  console.log(wht);

  res.status(200).json({
    status: "okay"
  });
});
