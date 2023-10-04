//modules
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const pool = require('../utils/dbConnection.js');
const UserModel = require('../models/UserModel');

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

  //validating if the request has the token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token) next(new AppError('No has iniciado sesión', 401));

  //Here we verify the token
  //In order to prevent the thread to be blocked I promosify this method
  const tokenDecodificado = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //we look for the user on the database
  const client = await pool.connect();
  const qRes = await client.query(UserModel.findOne({id_usuario: tokenDecodificado.id}, [
    '*'
  ]));
  const usuario = qRes.rows[0];
  client.release();
  delete usuario.contrasena;

  //validating if the user exists
  if(!usuario.id_usuario) return next(new AppError('El usuario ya no existe'), 401);

  //validating the creation date of the token
  if(UserModel.isPasswordChanged(usuario.fecha_cambio_contra, tokenDecodificado.iat)) return next(new AppError('El usuario cambió la contraseña recientemente. Por favor inicia sesión nuevamente'));

  //we return the user if they passed the filters
  console.log('berfore sending the user');
  req.user = usuario;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if(!roles.includes(req.user.id_rol)) return next(new AppError('No estás autorizado para usar esta funcionalidad', 403));
    next();
  };
};

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
  const query = await UserModel.create({
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
  const qRes = await client.query(query);
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
  const query = UserModel.findOne({
    email
  }, [
    '*'
  ]);
  const client = await pool.connect();
  const qRes = await client.query(query);
  const usuario = qRes.rows[0];
  client.release();

  //If we didn't find the user we throw an error
  if(!usuario?.id_usuario) return next(new AppError('El correo o la contraseña son incorrectos'), 401);

  //Validating (comparing) the password
  if(! await UserModel.comparePasswd(reqContra, usuario.contrasena)) return next(new AppError('El correo o la contraseña son incorrectos', 401));

  //sending the token after each validation step
  const token = signToken(usuario.id_usuario);
  delete usuario.contrasena;
  sendToken(token, 200, res, usuario);
});
