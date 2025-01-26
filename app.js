const express = require('express');
const AppError = require('./utils/appError');

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

app.all('*', (req, res, next) => {
  // option 1
  // res.status(404).json({
    //   status: 'fail',
    
    //   message: `Can't find ${req.originalUrl} on this server`
    
    // option 2
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    // option 3

    
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

// @ts-ignore
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
