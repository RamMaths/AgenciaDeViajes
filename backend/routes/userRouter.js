//modules
const express = require('express');

//router
const userRouter = express.Router();

//controllers
const authController = require('../controllers/authController');

//routes
userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);

module.exports = userRouter;
