//modules
const express = require('express');

//router
const clienteRouter = express.Router();

//controllers
const authController = require('../controllers/authController');

//routes
clienteRouter.post('/signUp', authController.signUp);


module.exports = clienteRouter;
