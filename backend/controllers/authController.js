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

const sendToken = (token, statusCode, res, usuario) => {
  const cookieOptions = {
    expires: new Date(Date.now + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token);

  res.status(statusCode).json({
    status: 'success',
    data: usuario,
    token
  });
}

const validateSignupFields = (fields) => {
  if(
    !fields.nombre ||
    !fields.paterno ||
    !fields.fecha_nac ||
    !fields.email ||
    !fields.contrasena ||
    !fields.telefono
  ) return new AppError('Debes ingresar todos los campos mencionados', 400);

  if (fields.nombre.length > 50) return new AppError('El nombre debe contener menos de 50 caracteres', 400);
  if (fields.paterno.length > 50) return new AppError('El apellido paterno debe contener menos de 50 caracteres', 400);
  if (fields.materno.length > 50) return new AppError('El apellido materno debe contener menos de 50 caracteres', 400);
  if (fields.contrasena.length > 100) return new AppError('La contaseña debe contener menos de 100 caracteres', 400);
  if (fields.telefono.length > 10) return new AppError('El telefono no debe exceder los 10 dígitos', 400);
};

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
  //This function validates the fields
  const error = validateSignupFields({
    nombre: req.body.nombre,
    paterno: req.body.paterno,
    materno: req.body.materno,
    fecha_nac: req.body.fecha_nac,
    email: req.body.email,
    contrasena: req.body.contrasena,
    telefono: req.body.telefono,
  });

  if(error) return next(error);

  //retreiving the query from the user model
  const query = await Usuario.crear({
    nombre: req.body.nombre,
    paterno: req.body.paterno,
    materno: req.body.materno,
    fecha_nac: req.body.fecha_nac,
    email: req.body.email,
    contrasena: req.body.contrasena,
    telefono: req.body.telefono,
    id_sexo: req.body.id_sexo
  });

  //executing the query on the database
  const client = await pool.connect();
  const qRes = await pool.query(query);
  const usuario = { ...qRes.rows[0] };
  delete usuario.contrasena;
  const id = usuario.id_usuario;
  const token = signToken(id);
  client.release();

  //sending the token to the client
  sendToken(token, 200, res, usuario);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, contrasena: reqContra } = req.body;

  //if there's anything in the request we throw an error
  if(!email || !reqContra) return next(new AppError('Debes proporcionar un usuario y una contraseña', 400));

  //We look for the user on the database
  const query = Usuario.buscar({
    email
  }, [
    '*'
  ]);
  const client = await pool.connect();
  const qRes = await pool.query(query);
  const usuario = qRes.rows[0];
  client.release();

  //If we didn't find the user we throw an error
  if(!usuario?.id_usuario) return next(new AppError('El correo o la contraseña son incorrectos'), 401);

  //Validating (comparing) the password
  if(! await Usuario.comparaContrasena(reqContra, usuario.contrasena)) return next(new AppError('El correo o la contraseña son incorrectos', 401));

  //sending the token after each validation step
  const token = signToken(usuario.id_usuario);
  delete usuario.contrasena;
  sendToken(token, 200, res, usuario);
});
