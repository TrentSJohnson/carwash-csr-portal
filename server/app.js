import 'dotenv/config';

import createError from 'http-errors';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import membersRouter from './routes/members.js';
import plansRouter from './routes/plans.js';
import vehiclesRouter from './routes/vehicles.js';
import subscriptionsRouter from './routes/subscriptions.js';
import transactionsRouter from './routes/transactions.js';
import activitiesRouter from './routes/activities.js';

mongoose.connect(process.env.MONGO_API_CONNECTION_STRING)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/ping', function(req, res) {
  res.json({ message: 'pong' });
});

app.use('/api/members', membersRouter);
app.use('/api/plans', plansRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/activities', activitiesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    ...(req.app.get('env') === 'development' && { stack: err.stack }),
  });
});

export default app;
