require('dotenv').config();
require('dotenv').config();
const { PORT } = process.env || 8080;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { incr } = require('./api/V1/models/limiter');
const app = express();
const logEvents = require('./api/V1/helpers/logEvents');
app.use(morgan('short'));
app.use(helmet());

//  ToDo:  SETUP CORS
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

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
// app.use(express.json);
// app.use(
//   express.urlencoded({
//     extend: true,
//   })
// );

// router

app.get('/api', async (req, res, next) => {
  try {
    // get IP
    const getIpUser = '127.0.0.1';
    console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    // const numberRequest = await incr(getIpUser);

    res.json({
      status: 'success',
      // numberRequest: numberRequest,
      elements: [
        { id: 1, name: 'locit' },
        { id: 1, name: 'nguyen' },
      ],
    });
  } catch (err) {
    // throw new Error(err);
    console.log(err);
  }
});
// Error handling middleware called
app.use((req, res, next) => {
  console.log(morgan('short'));
  // logEvents(morgan('short'));
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
