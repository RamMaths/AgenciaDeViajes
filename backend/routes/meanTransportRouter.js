const express = require('express');
const meanTransportRouter = express.Router();

const authController = require('../controllers/authController');
const meanTransportController = require('../controllers/meanTransportController');

meanTransportRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(2),
    meanTransportController.getAllMeanTransports
  )
  .post(
    authController.protect,
    authController.restrictTo(2),
    meanTransportController.createMeanTransport
  )
  .delete(
    authController.protect,
    authController.restrictTo(2),
    meanTransportController.deleteMeanTransport
  )
  .patch(
    authController.protect,
    authController.restrictTo(2),
    meanTransportController.patchMeanTransport
  );

meanTransportRouter
  .route('/datatypes')
  .get(
    authController.protect,
    authController.restrictTo(2),
    meanTransportController.getMeanTransportDataTypes
  );

module.exports = meanTransportRouter;
