const express = require('express');
const companyRouter = express.Router();

const authController = require('../controllers/authController');
const companyController = require('../controllers/companyController');

companyRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(2),
    companyController.getAllCompanies
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    companyController.createCompany
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    companyController.deleteCompany
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    companyController.patchCompany
  );

companyRouter
  .route('/datatypes')
  .get(
    authController.protect,
    authController.restrictTo(2),
    companyController.getCompanyDataTypes
  );

module.exports = companyRouter;
