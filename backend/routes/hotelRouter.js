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

hotelRouter
  .route('/rooms')
  .get(
    authController.protect,
    authController.restrictTo(2),
    hotelController.getAllRooms
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    hotelController.createRoom
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    hotelController.deleteRoom
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    hotelController.patchRoom
  );

module.exports = hotelRouter;
