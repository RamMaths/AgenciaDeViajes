const express = require('express');
const locationRouter = express.Router();
const authController = require('../controllers/authController');
const locationController = require('../controllers/locationController');

locationRouter
  .route('/cities')
  .get(
    authController.protect,
    authController.restrictTo(2),
    locationController.getAllCities
  )
  .post();

locationRouter
  .route('/states')
  .get(
    authController.protect,
    authController.restrictTo(2),
    locationController.getAllStates
  );

locationRouter
  .route('/countries')
  .get(
    authController.protect,
    authController.restrictTo(2),
    locationController.getAllCountries
  );

module.exports = locationRouter;
