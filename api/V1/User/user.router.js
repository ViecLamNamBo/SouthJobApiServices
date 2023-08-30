const express = require('express');

const router = express.Router();
// const { pushToLogDiscord } = require('../middlewares/pushToLogger');
const {
  registerUser,
  loginUser,
  requestRefreshToken,
} = require('./user.controller');

// write log into discord server
// router.use(pushToLogDiscord);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh').post(requestRefreshToken);

module.exports = router;
