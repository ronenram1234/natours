const express=require('express')
 const tourControler=require('./../controllers/tourController')
//  const {getAllTours,postTour,getTour,deleteTour,patchTour}= require('./../controllers/tourController.js')


const router=express.Router()

router
.route('/top-5-cheap')
.get(tourControler.aliasTopTours , tourControler.getAllTours)

router.route('/tour-stats').get(tourControler.getToursStates);
router.route('/monthly-plan/:year').get(tourControler.getMonthlyPlan);


router.route('/').get(tourControler.getAllTours).post(tourControler.createTour);

router.route('/:id').get(tourControler.getTourById).delete(tourControler.deleteTour).patch(tourControler.updateTour);

router.route('/name').get(tourControler.getTourByName);

module.exports=router