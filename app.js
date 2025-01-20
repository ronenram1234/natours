const express = require('express');

const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Middleware

// app.use(morgan('dev'))
app.use(morgan('common'));
// app.use(morgan('combined'))
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from midelware👌');
  next();
});

const timeZone = 'Asia/Jerusalem';
app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString('en-US', { timeZone });
  // req.requestTime=new Date().toISOString()
  // req.requestTime=new Date().toDateString()
  next();
});

// ------------------------------------------
// routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;


