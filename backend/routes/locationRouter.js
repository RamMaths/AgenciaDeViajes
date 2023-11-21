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
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    locationController.deleteState
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    locationController.patchState
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
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    locationController.deleteCountry
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    locationController.patchCountry
  );

locationRouter
  .route('/countries/datatypes')
  .get(
    authController.protect,
    authController.restrictTo(2),
    locationController.getCountriesDataTypes
  );

module.exports = locationRouter;
