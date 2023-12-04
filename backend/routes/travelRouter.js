const express = require('express');
const travelRouter = express.Router();
const authController = require('../controllers/authController');
const travelController = require('../controllers/travelController');

travelRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(2),
    travelController.getAllTravels
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    travelController.createTravel
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    travelController.deleteTravel
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    travelController.patchHotel
  );

module.exports = travelRouter;
