require('dotenv').config();
require('dotenv').config();
const { PORT } = process.env || 5000;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const logEvents = require('./api/V1/helpers/logEvents');
app.use(morgan('short'));
app.use(helmet());

//  ToDo:  SETUP CORS
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// add  body-parser
app.use(express.json);
app.use(
  express.urlencoded({
    extend: true,
  })
);

// router

app.use('/', (req, res, next) => {
  res.send('This is home page');
});

// Error handling middleware called
app.use((req, res, next) => {
  console.log(morgan('short'));
  logEvents(morgan('short'));
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
});
