//modules
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const client = require('../utils/dbConnection.js');
const Usuario = require('../models/usuarioModel');

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendToken = (token, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(Date.now + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token);

  res.status(statusCode).json({
    status: 'success',
    token
  });
}

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;

  //verificando que la petición contenga el token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token) next(new AppError('No has iniciado sesión', 401));

  //para no bloquear el hilo de ejcución lo hacemos promesa
  const tokenDecodificado = await promisify(jwt.verify)(token, process.env.JWT_SECRET);


});

exports.signUp = catchAsync(async (req, res, next) => {

  const query = await Usuario.crear({
    nombre: req.body.nombre,
    paterno: req.body.paterno,
    materno: req.body.materno,
    fecha_nac: req.body.fecha_nac,
    email: req.body.email,
    contrasena: req.body.contrasena,
    telefono: req.body.telefono
  });

  await client.connect();
  const qRes = await client.query(query);
  const id = qRes.rows[0].id_usuario;
  const token = signToken(id);
  await client.end();

  sendToken(token, 200, res);
});
