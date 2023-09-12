//modules
const express = require('express');

//router
const usuarioRouter = express.Router();

//controllers
const authController = require('../controllers/authController');

//routes
usuarioRouter.post('/signup', authController.signUp);
usuarioRouter.post('/login', authController.login);

module.exports = usuarioRouter;
