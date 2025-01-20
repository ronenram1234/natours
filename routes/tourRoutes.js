const express=require('express')
 const tourControler=require('./../controllers/tourController')
//  const {getAllTours,postTour,getTour,deleteTour,patchTour}= require('./../controllers/tourController.js')


const router=express.Router()
// router.param('id',tourControler.checkId)

// router.route('/').get(getAllTours).post(postTour);
// router.route('/:id').get(getTour).delete(deleteTour).patch(patchTour);
router.route('/').get(tourControler.getAllTours).post(tourControler.createTour);
router.route('/:id').get(tourControler.getTourById).delete(tourControler.deleteTour).patch(tourControler.patchTour);
router.route('/name').get(tourControler.getTourByName);

module.exports=router