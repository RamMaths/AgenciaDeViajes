const AppError = require('../utils/appError');

const handleRepetition = () => new AppError('Ya tenemos una cuenta registrada con ese email', 400);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

const sendErrorProd = (err, res) => {
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // 1) Log error
    console.log('Error 💥 ----------------------------')
    console.log(err);

    // 2) Send a generic message
    res.status(500).json({
      status: 'error',
      message: `Something went very wrong: Internal server error`
    });
  }
};

module.exports = (err, req, res, next) => {
  //Setting up status code and error just in case it does not exist by default
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'internal error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if(process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if(error.constraint === 'usuarios_email_key') error = handleRepetition();
    sendErrorProd(error, res);
  }
  
};
