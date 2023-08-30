const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
// const { pushToLogDiscord } = require('../middlewares/pushToLogger');
const {
  registerUser,
  loginUser,
  requestRefreshToken,
  logoutUser,
} = require('./user.controller');

// write log into discord server
// router.use(pushToLogDiscord);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh').post(requestRefreshToken);
router.route('/logout').post(authMiddleware, logoutUser);

module.exports = router;
