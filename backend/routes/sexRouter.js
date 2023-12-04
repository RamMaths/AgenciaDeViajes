const express = require('express');
const sexRouter = express.Router();
const authController = require('../controllers/authController');
const sexController = require('../controllers/sexController');

sexRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(2),
    sexController.getAllSexs
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    sexController.createSex
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    sexController.deleteSex
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    sexController.patchSex
  );

module.exports = sexRouter;
