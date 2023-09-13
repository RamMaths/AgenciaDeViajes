//modules
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const pool = require('../utils/dbConnection.js');
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

  //validando que la petición contenga el token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token) next(new AppError('No has iniciado sesión', 401));

  //verificamos el token
  //para no bloquear el hilo de ejcución lo hacemos promesa
  const tokenDecodificado = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //buscamos el usuario en la base de datos
  const client = await pool.connect();
  const qRes = await pool.query(Usuario.buscar(tokenDecodificado.id, [
    '*'
  ]));
  const usuario = qRes.rows[0];
  client.release();

  //validando si el usuario existe
  if(!usuario.id_usuario) return next(new AppError('El usuario ya no existe'), 401);

  //validando las fecha de creación del token y la de ahora
  if(!Usuario.seCambioContrasena(usuario.fecha_cambio_contra, tokenDecodificado.iat)) return next(new AppError('El usuario cambió la contraseña recientemente. Por favor inicia sesión nuevamente'));

  //damos acceso
  req.usuario = usuario;
});

exports.signUp = catchAsync(async (req, res, next) => {

  if(
    !req.body.nombre ||
    !req.body.paterno ||
    !req.body.materno ||
    !req.body.fecha_nac ||
    !req.body.email ||
    !req.body.contrasena ||
    !req.body.telefono
  ) return next(new AppError('Debes ingresar todos los campos mencionados', 400));

  //creamos al usuario en la base de datos
  const query = await Usuario.crear({
    nombre: req.body.nombre,
    paterno: req.body.paterno,
    materno: req.body.materno,
    fecha_nac: req.body.fecha_nac,
    email: req.body.email,
    contrasena: req.body.contrasena,
    telefono: req.body.telefono
  });

  const client = await pool.connect();
  const qRes = await pool.query(query);
  const id = qRes.rows[0].id_usuario;
  const token = signToken(id);
  client.release();

  sendToken(token, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, contrasena: reqContra } = req.body;

  //si no hay nada en la petición mandamos un error
  if(!email || !reqContra) return next(new AppError('Debes proporcionar un usuario y una contraseña', 400));

  //buscamos el usuario en la base de datos
  const query = Usuario.buscar({
    email
  }, [
    'id_usuario',
    'contrasena',
  ]);
  const client = await pool.connect();
  const qRes = await pool.query(query);
  const usuario = qRes.rows[0];
  client.release();

  //si no encontramos el usuario en la base de datos mandamos un error
  if(!usuario.id_usuario) return next(new AppError('El usuario o la contraseña son incorrectos'), 401);

  //validamos la contraseña
  if(! await Usuario.comparaContrasena(reqContra, usuario.contrasena)) return next(new AppError('El usuario o la contraseña son incorrectos', 401));

  //si pasó los filtros enviamos el token de inicio de sesión
  const token = signToken(usuario.id_usuario);
  sendToken(token, 200, res);
});
