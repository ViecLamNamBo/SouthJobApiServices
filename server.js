require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const app = express();
const { PORT } = process.env || 8000;
const userRoute = require('./api/v1/User/user.router');
app.use(
  session({
    secret: 'secretidhere',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('short'));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up url to call api
app.use('/api/v1/candidate/', userRoute);
// config body bodyParser
app.use(
  bodyParser.urlencoded({
    limit: '1000kb',
    parameterLimit: 1000000,
    extended: true,
  })
);
// Error handling middleware called
app.use((req, res, next) => {
  const err = new Error('This route dose not exit');
  err.status = 500;
  next(err);
});

// error handler middleware
app.use((error, req, res, next) => {
  console.log('🚀 ~ file: server.js:48 ~ app.use ~ error:', error);

  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});
app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
});
