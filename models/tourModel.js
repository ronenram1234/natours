const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  // name: String,
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
// tourSchema.index({ name: 1 });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
