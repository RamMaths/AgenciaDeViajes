const pool = require('../utils/dbConnection.js');

exports.signUp = (req, res, next) => {
  console.log(pool);

  res.status(200).json({
    status: "okay"
  });
};
