const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      staus: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `failure ----------------->  ${err}`
    });
  }
};

exports.getTourByName = async (req, res) => {
  try {
    console.log(req.body.name);

    const tour = await Tour.find({ name: req.body.name });
    console.log(tour);
    if (tour.length < 1) throw 'error no record found';
    res.status(200).json({
      staus: 'success',
      //     results: tours.length,
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `failure ----------------->  ${err}`
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour || tour.length < 1) throw 'error no record found';
    res.status(200).json({
      staus: 'success',

      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `failure ----------------->  ${err}`
    });
  }
};

exports.deleteTour = (req, res) => {
  return res.status(204).json({
    status: 'sucess',
    data: null
  });
};

exports.patchTour = (req, res) => {
  return res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<updated tour here...>'
    }
  });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    console.log('--------------------');
    console.log(req.body);
    console.log('--------------------');

    res.status(201).json({
      staus: 'sucess',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `failure ----------------->  ${err}`
    });
  }
};
