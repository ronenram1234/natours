const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
exports.aliasTopTours = (req, res, next) => {
  console.log('start');
  req.query.limit = '5';
  console.log('end');
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // send response
    res.status(200).json({
      staus: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
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

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'sucess',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `failure ----------------->  ${err}`
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'sucess',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `failure ----------------->  ${err}`
    });
  }
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

exports.getToursStates = async (req, res) => {
  try {
    const states = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avrgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice:-1 }
      },
      {
        $match:{ _id:{$ne:'EASY'}}
      }
    ]);

    console.log(
      '----------------------getToursStates-----------------',
      states
    );
    res.status(201).json({
      staus: 'sucess',
      data: {
        states
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `failure ----------------->  ${err}`
    });
  }
};


