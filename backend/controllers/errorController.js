const sendErrorDevelopment = (err, res) => {
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
      message: 'Something went very wrong!',
      error: err
    });
  }
};

module.exports = (err, req, res, next) => {
  //Setting up status code and error just in case it does not exist by default
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'internal error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else if(process.env.NODE_ENV === 'production') {

  }
};
