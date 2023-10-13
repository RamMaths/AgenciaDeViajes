//modules
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const cookie = require('cookie');

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

  //creating the user
  const usuario = await UserModel.create({
    nombre: req.body.nombre,
    paterno: req.body.paterno,
    materno: req.body.materno,
    fecha_nac: req.body.fecha_nac,
    email: req.body.email,
    contrasena: req.body.contrasena,
    telefono: req.body.telefono,
    id_sexo: req.body.id_sexo
  });

  const token = signToken(usuario.id_usuario);
  //sending the token to the client
  sendToken(token, 200, res, usuario);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, contrasena: reqContra } = req.body;

  //if there's anything in the request we throw an error
  if(!email || !reqContra) return next(new AppError('Debes proporcionar un usuario y una contraseña', 400));

  //We look for the user on the database
  let usuario = await UserModel.findOne({
    email
  }, [
    '*'
  ]);
  usuario = usuario[0];

  //If we didn't find the user we throw an error
  if(!usuario?.id_usuario) return next(new AppError('El correo o la contraseña son incorrectos'), 401);

  //Validating (comparing) the password
  if(! await UserModel.comparePasswd(reqContra, usuario.contrasena)) return next(new AppError('El correo o la contraseña son incorrectos', 401));

  //sending the token after each validation step
  const token = signToken(usuario.id_usuario);
  delete usuario.contrasena;
  sendToken(token, 200, res, usuario);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;

  //validating if the request has the token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token) return next(new AppError('No has iniciado sesión', 401));

  //Here we verify the token
  //In order to prevent the thread to be blocked I promosify this method
  const tokenDecodificado = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //we look for the user on the database
  let usuario = await UserModel.findOne({
    id_usuario: tokenDecodificado.id
  }, [
    '*'
  ]);
  usuario = usuario[0];
  delete usuario.contrasena;

  //validating if the user exists
  if(!usuario.id_usuario) return next(new AppError('El usuario ya no existe'), 401);

  //validating the creation date of the token
  if(UserModel.isPasswordChanged(usuario.fecha_cambio_contra, tokenDecodificado.iat)) return next(new AppError('El usuario cambió la contraseña recientemente. Por favor inicia sesión nuevamente'));

  //we return the user if they passed the filters
  req.user = usuario;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.id_rol)) return next(new AppError('No estás autorizado para usar esta funcionalidad', 403));
    next();
  };
};

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

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendToken = (token, statusCode, res, usuario) => {
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    maxAge: 3600
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  const myCookie = cookie.serialize('jwt', token, cookieOptions);

  res.setHeader('Set-Cookie', myCookie);

  res.status(statusCode).json({
    status: 'success',
    data: usuario,
    token
  });
}
