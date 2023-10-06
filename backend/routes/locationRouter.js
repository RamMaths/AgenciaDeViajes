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
  .post(
    authController.protect,
    authController.restrictTo(2),
    locationController.createCity
  );

locationRouter
  .route('/states')
  .get(
    authController.protect,
    authController.restrictTo(2),
    locationController.getAllStates
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    locationController.createState
  );

locationRouter
  .route('/countries')
  .get(
    authController.protect,
    authController.restrictTo(2),
    locationController.getAllCountries
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    locationController.createCountry
  );

module.exports = locationRouter;
