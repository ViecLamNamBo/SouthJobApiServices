const express = require('express');
const passport = require('passport');
const authMiddleware = require('../middlewares/authMiddleware');
const client = require('../helpers/connection_redis');

const router = express.Router();
const {
  generateRefreshToken,
  generateAccessToken,
} = require('../helpers/authHelper');
// const { pushToLogDiscord } = require('../middlewares/pushToLogger');
const {
  registerUser,
  loginUser,
  requestRefreshToken,
  logoutUser,
} = require('./user.controller');
require('../middlewares/passportMiddleware');

// write log into discord server
// router.use(pushToLogDiscord);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh').post(requestRefreshToken);
router.route('/logout').post(authMiddleware, logoutUser);
router.route('/login/google').get(
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
);
router.route('/login/google/callback').get(
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/failed',
  }),
  (req, res) => {
    const userInfo = req.user;
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);
    client.set(userInfo.email, refreshToken, 'ex', 365 * 24 * 60 * 60);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
    res.redirect('http://localhost:8080');
  }
);

module.exports = router;
