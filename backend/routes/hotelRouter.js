const express = require('express');
const hotelRouter = express.Router();
const authController = require('../controllers/authController');
const hotelController = require('../controllers/hotelController');

hotelRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(2),
    hotelController.getAllHotels
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    hotelController.createHotel
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    hotelController.deleteHotel
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    hotelController.patchHotel
  );

module.exports = hotelRouter;
