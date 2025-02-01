const express = require('express');
const tourController = require('./../controllers/tourController');
const authControllers = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authControllers.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authControllers.protect, tourController.deleteTour);
  // .delete(authControllers.protect,authControllers.restrictTo('admin'), tourController.deleteTour);

module.exports = router;
