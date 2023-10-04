const express = require('express');
const cityRouter = express.Router();
const authController = require('../controllers/authController');
const cityController = require('../controllers/cityController');

cityRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(2),
    cityController.getAllCities
  );

module.exports = cityRouter;
