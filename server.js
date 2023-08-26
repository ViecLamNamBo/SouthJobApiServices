require('dotenv').config();
const { PORT } = process.env || 8080;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { incr } = require('./api/V1/models/limiter');
const app = express();

app.use(morgan('short'));
app.use(helmet());

//  ToDo:  SETUP CORS
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH'
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use the router in your main application
app.get('/api', async (req, res, next) => {
  try {
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
